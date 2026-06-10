import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountVar) {
      throw new Error("La variable d'environnement FIREBASE_SERVICE_ACCOUNT est manquante !");
    }

    // 💡 SÉCURITÉ : Nettoyage des retours à la ligne brisés qui font planter Vercel
    const cleanedServiceAccount = serviceAccountVar.replace(/\\n/g, '\n');
    
    // Essai de parsing du JSON
    const serviceAccount = JSON.parse(cleanedServiceAccount);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log("🔥 Firebase Admin initialisé avec succès en production.");
  } catch (error) {
    console.error("❌ Erreur critique lors de l'initialisation de Firebase Admin:", error.message);
    throw error;
  }
}

export const adminDb = admin.firestore();