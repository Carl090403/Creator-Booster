
import { GoogleGenAI, Type } from "@google/genai";
import { ToolType, Platform } from "../types";
import { 
  collection, 
  addDoc, 
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { db, auth } from './firebase';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  generateContent: async (tool: ToolType, params: any) => {
    const { niche, platform, topic, tone, message, goal, duration, angles, intensity } = params;

    let systemInstruction = "";
    let prompt = "";
    let responseSchema: any = null;

    switch (tool) {
      case 'hooks':
        systemInstruction = `Tu es un expert senior en marketing de contenu viral pour TikTok et Facebook, spécialisé en Afrique francophone (Bénin, Sénégal, Côte d'Ivoire, Cameroun, RDC, Mali). Tu connais parfaitement les codes culturels, les expressions, les références et les préoccupations des jeunes africains francophones. Tu sais exactement ce qui fait scroller, ce qui crée de l'émotion et ce qui pousse à partager.`;
        prompt = `Génère 10 hooks d'accroche percutants et immédiatement utilisables en français pour un créateur de contenu.
Niche : ${niche}
Plateforme(s) : ${platform}
Sujet spécifique : ${topic || 'Général'}
Ton souhaité : ${tone || 'Motivationnel'}

CONTRAINTES ABSOLUES :
- Chaque hook doit être COMPLET et AUTONOME (pas de "[insérer X]", pas de placeholders)
- Longueur : 1 à 3 phrases maximum, percutantes, comme si tu parlais directement à quelqu'un
- Langue : français naturel et vivant, pas académique, proche du parler africain francophone
- Si plateforme TikTok : hooks pensés pour être dits à voix haute en vidéo, dynamiques, rythmés
- Si plateforme Facebook : hooks pensés pour un post texte, peuvent être légèrement plus longs, créent de l'arrêt du scroll
- Si les deux : propose un mix équilibré
- Chaque hook doit utiliser un framework différent parmi : Curiosity Gap, Contrarian, Secret Reveal, Personal Confession, Mistake Warning, Numbered Insight, Myth Busting, Shock Statement
- Les hooks doivent être ancrés dans la réalité africaine francophone (ne pas calquer l'occident)

Pour chaque hook, donne une note de viralité de 1 à 10 avec une justification d'une phrase sur POURQUOI ce hook fonctionne.`;
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            hooks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  framework: { type: Type.STRING },
                  platform: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  justification: { type: Type.STRING },
                },
                required: ["hook", "framework", "platform", "score", "justification"],
              },
            },
          },
          required: ["hooks"],
        };
        break;

      case 'script':
        systemInstruction = `Tu es un scénariste expert en contenu court pour TikTok et Facebook, spécialisé pour l'Afrique francophone. Tu écris des scripts qui capturent l'attention, créent de l'émotion authentique, et incitent à l'action.`;
        prompt = `Écris un script de contenu complet et professionnel.
Niche : ${niche}
Plateforme : ${platform}
Hook de départ : ${params.hook || 'Générer un hook'}
Message principal à transmettre : ${message}
Objectif : ${goal}
${platform === 'tiktok' ? `Durée cible : ${duration}` : ''}

CONTRAINTES :
- Le contenu doit être RICHE, DÉVELOPPÉ, et IMMÉDIATEMENT UTILISABLE sans modification
- Chaque section doit être complète, pas des titres vides avec 1 phrase creuse
- Langage oral et naturel si TikTok, langage écrit engageant si Facebook
- Ancré culturellement dans le contexte africain francophone
- Le twist ou la révélation doit être RÉEL, pas générique
- Le CTA doit être précis et contextuel (pas juste "abonne-toi")`;
        
        if (platform === 'tiktok') {
          responseSchema = {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING },
              duration_estimate: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    content: { type: Type.STRING },
                    visual_note: { type: Type.STRING },
                  },
                  required: ["id", "label", "content"],
                },
              },
            },
            required: ["platform", "sections"],
          };
        } else {
          responseSchema = {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING },
              reading_time: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    content: { type: Type.STRING },
                  },
                  required: ["id", "label", "content"],
                },
              },
            },
            required: ["platform", "sections"],
          };
        }
        break;

      case 'ideas':
        systemInstruction = `Tu es un stratège de contenu expert pour créateurs africains francophones sur TikTok et Facebook. Tu génères des idées de vidéos et posts qui collent à la réalité culturelle, économique et sociale de l'Afrique francophone.`;
        prompt = `Génère 20 idées de contenus pour un créateur.
Niche : ${niche}
Plateforme : ${platform}
Angles préférés : ${angles?.join(', ') || 'Variés'}

CONTRAINTES :
- Chaque idée doit avoir un titre COMPLET et ACCROCHEUR
- Chaque idée doit avoir une description de 2-3 phrases expliquant : le contenu précis, l'angle, et pourquoi l'audience africaine va accrocher
- Les idées doivent être VARIÉES en format et en angle
- Adaptées à la réalité africaine
- Mix entre idées evergreen et idées tendance`;
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  format: { type: Type.STRING },
                  platform: { type: Type.STRING },
                },
                required: ["title", "description", "format", "platform"],
              },
            },
          },
          required: ["ideas"],
        };
        break;

      case 'calendar':
        systemInstruction = `Tu es un directeur de contenu digital spécialisé pour les créateurs africains francophones. Tu construis des calendriers de contenu professionnels, stratégiques, avec une vraie progression narrative sur 30 jours.`;
        prompt = `Crée un calendrier de contenu complet sur 30 jours.
Niche : ${niche}
Plateforme : ${platform}
Intensité : ${intensity || '1 contenu/jour'}

CONTRAINTES :
- Chaque idée de contenu doit être SPÉCIFIQUE et COMPLÈTE
- Chaque hook doit être UNE PHRASE COMPLÈTE, percutante, prête à utiliser
- La progression sur 30 jours doit être STRATÉGIQUE (Semaine 1: Confiance, Semaine 2: Expertise, Semaine 3: Connexion, Semaine 4: Conversion)
- Alterner les formats
- Contenu ancré dans la réalité africaine francophone`;
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            calendar: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  week: { type: Type.NUMBER },
                  idea: { type: Type.STRING },
                  hook: { type: Type.STRING },
                  format: { type: Type.STRING },
                  platform: { type: Type.STRING },
                },
                required: ["day", "week", "idea", "hook", "format", "platform"],
              },
            },
          },
          required: ["calendar"],
        };
        break;
    }

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const data = JSON.parse(response.text || "{}");

    // Save to Firestore if user is logged in
    if (auth.currentUser) {
      try {
        await addDoc(collection(db, 'generations'), {
          user_id: auth.currentUser.uid,
          tool,
          niche,
          platform,
          input_data: params,
          output_data: data,
          created_at: new Date().toISOString()
        });
      } catch (e) {
        console.error("Error saving generation:", e);
      }
    }

    return data;
  },

  getHistory: async (limitCount: number = 5) => {
    if (!auth.currentUser) return [];
    
    try {
      const q = query(
        collection(db, 'generations'),
        where('user_id', '==', auth.currentUser.uid),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Error fetching history:", e);
      return [];
    }
  }
};
