import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (getApps().length === 0) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Variables d'environnement Firebase Admin incomplètes sur Vercel !");
    }

    // Remplacement propre des sauts de ligne textuels
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    initializeApp({
      credential: cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });
    
    console.log("🔥 Firebase Admin initialisé sans JSON.parse !");
  } catch (error) {
    console.error("❌ Erreur critique Firebase Admin:", error.message);
    throw error;
  }
}

export const adminDb = getFirestore();