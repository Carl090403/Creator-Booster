import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

// Réutilisation de la fonction d'authentification JWT REST
async function getGoogleAuthToken(clientEmail: string, privateKey: string): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const base64UrlEncode = (str: string) => 
    Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${encodedHeader}.${encodedPayload}`);
  const signature = base64UrlEncode(sign.sign(privateKey.replace(/\\n/g, '\n')));

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodedHeader}.${encodedPayload}.${signature}`,
  });

  const data = await response.json();
  return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const dbId = process.env.FIREBASE_DATABASE_ID || process.env.VITE_FIREBASE_DATABASE_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !dbId || !clientEmail || !privateKey) {
      return res.status(500).json({ error: 'Missing environment variables' });
    }

    const authToken = await getGoogleAuthToken(clientEmail, privateKey);

    // Endpoint REST de requêtage structuré (StructuredQuery) pour filtrer par user_id
    const firestoreQueryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents:runQuery`;

    const queryBody = {
      structuredQuery: {
        from: [{ collectionId: 'generations' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'user_id' },
            op: 'EQUAL',
            value: { stringValue: String(userId) }
          }
        },
        orderBys: [
          {
            field: { fieldPath: 'created_at' },
            direction: 'DESCENDING'
          }
        ]
      }
    };

    const response = await fetch(firestoreQueryUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(queryBody)
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch history', details: await response.text() });
    }

    const rawResults = await response.json();
    
    // Formatage propre des résultats REST pour ton Frontend
    const history = rawResults
      .filter((item: any) => item.document)
      .map((item: any) => {
        const doc = item.document;
        const fields = doc.fields;
        
        let outputData = null;
        if (fields.output_data_string?.stringValue) {
          try {
            outputData = JSON.parse(fields.output_data_string.stringValue);
          } catch {
            outputData = fields.output_data_string.stringValue;
          }
        }

        return {
          id: doc.name.split('/').pop(),
          tool: fields.tool?.stringValue || '',
          niche: fields.niche?.stringValue || '',
          platform: fields.platform?.stringValue || '',
          createdAt: fields.created_at?.stringValue || '',
          outputData: outputData
        };
      });

    return res.status(200).json({ history });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}