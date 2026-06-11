import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminDb } from './_firebaseAdmin.js'; 
import { FieldValue } from 'firebase-admin/firestore';

const TOOL_COSTS: Record<string, number> = {
  hooks: 1,
  script: 1,
  ideas: 1,
  calendar: 2,
};

const buildPrompt = (tool: string, params: Record<string, any>) => {
  const { niche, platform, topic, tone, hook, message, goal, duration } = params;
  const context = `Niche: ${niche || 'générique'}\nPlateforme: ${platform || 'both'}\n`; 

  if (tool === 'hooks') {
    return `${context}Tu es un expert en marketing viral dans l'espace francophone. Génère 10 hooks d'accroche très impactants pour du contenu court. Réponds uniquement par un objet JSON valide:
{
  "hooks": [
    {"hook": "...", "framework": "...", "platform": "...", "score": 0, "justification": "..."}
  ]
}

Sujet: ${topic || 'général'}\nTon: ${tone || 'Motivationnel'}`;
  }

  if (tool === 'script') {
    return `${context}Tu es un expert en création de scripts pour vidéos courtes. Génère un script complet structuré dans un format JSON valide:
{
  "platform": "...",
  "sections": [
    {"id": "...", "label": "...", "content": "...", "visual_note": "..."}
  ]
}

Objectif: ${goal || 'Inspirer et motiver'}\nHook: ${hook || 'Accroche forte'}\nMessage: ${message || 'Message principal'}\nDurée: ${duration || '60 sec'}`;
  }

  if (tool === 'ideas') {
    return `${context}Tu es un stratège de contenus créatifs. Propose 20 idées originales sous la forme d'un JSON valide:
{
  "ideas": [
    {"title": "...", "description": "...", "format": "...", "platform": "..."}
  ]
}

Objectif: ${goal || "Créer de l'engagement"}\nTon: ${tone || 'Inspirant'}`;
  }

  if (tool === 'calendar') {
    return `${context}Crée un calendrier éditorial de 30 jours pour un compte créateur. Réponds uniquement par un JSON valide:
{
  "calendar": [
    {"day": 1, "week": 1, "idea": "...", "hook": "...", "format": "...", "platform": "..."}
  ]
}

Objectif: ${goal || 'Planifier le contenu du mois'}\nDurée: ${duration || '30 jours'}`;
  }

  return `${context}Réponds uniquement par un JSON valide contenant le résultat attendu.`;
};

const extractJson = (text: string) => {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('Unable to parse JSON response from Gemini');
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, tool, params } = req.body;

    console.log(`[BACKEND DEBUG] Requête reçue pour l'outil: "${tool}". ID Utilisateur fourni: "${userId}"`);

    if (!userId || !tool || String(userId).trim() === '' || userId === 'undefined') {
      return res.status(400).json({ error: 'Missing or invalid userId or tool' });
    }

    const requiredCost = TOOL_COSTS[tool];
    if (requiredCost === undefined) {
      return res.status(400).json({ error: 'Invalid tool type' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY environment variable on Vercel' });
    }

    // 💡 MODIFICATION ICI : On appelle getAdminDb() à l'intérieur du handler
    const db = getAdminDb();
    const userRef = db.doc(`users/${userId}`);
    let userSnapshot;

    try {
      userSnapshot = await userRef.get();
    } catch (firestoreError: any) {
      console.error(`[FIRESTORE CRASH] Échec lors de userRef.get() pour le chemin "users/${userId}".`);
      return res.status(500).json({ error: 'DATABASE_FETCH_FAILED', details: firestoreError.message });
    }

    if (!userSnapshot.exists) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    const userData = userSnapshot.data() as any;
    const currentCredits = userData.credits ?? 0;

    if (currentCredits < requiredCost) {
      return res.status(402).json({ error: 'INSUFFICIENT_CREDITS' });
    }

    const prompt = buildPrompt(tool, params || {});
    
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2500,
          responseMimeType: "application/json" 
        }
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json().catch(() => ({}));
      return res.status(502).json({ error: 'Gemini API error', details: errorData?.error?.message });
    }

    const aiData = await aiResponse.json();
    const aiText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let parsedResult = extractJson(aiText);

    // 💡 MODIFICATION ICI : On utilise aussi "db" pour la transaction
    await db.runTransaction(async (transaction) => {
      const freshUserSnapshot = await transaction.get(userRef);
      const freshCredits = freshUserSnapshot.data()?.credits ?? 0;

      if (freshCredits < requiredCost) {
        throw new Error('INSUFFICIENT_CREDITS');
      }

      transaction.update(userRef, {
        credits: FieldValue.increment(-requiredCost),
        totalCreditsUsed: FieldValue.increment(requiredCost),
      });

      const generationRef = db.collection('generations').doc();
      transaction.set(generationRef, {
        user_id: userId,
        tool,
        niche: params?.niche || '',
        platform: params?.platform || '',
        input_data: params || {},
        output_data: parsedResult,
        created_at: new Date().toISOString(),
      });
    });

    return res.status(200).json({ result: parsedResult });

  } catch (error: any) {
    console.error('Generate function error:', error);
    if (error.message === 'INSUFFICIENT_CREDITS') {
      return res.status(402).json({ error: 'INSUFFICIENT_CREDITS' });
    }
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}