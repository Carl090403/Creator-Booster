import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 💡 CORRECTION : Utilisation de getApps() à la place de admin.apps.length
if (getApps().length === 0) {
  try {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountVar) {
      throw new Error("La variable d'environnement FIREBASE_SERVICE_ACCOUNT est manquante !");
    }

    // Nettoyage des retours à la ligne brisés pour Vercel
    const cleanedServiceAccount = serviceAccountVar.replace(/\\n/g, '\n');
    
    // Parsing du JSON
    const serviceAccount = JSON.parse(cleanedServiceAccount);

    initializeApp({
      credential: cert(serviceAccount),
    });
    
    console.log("🔥 Firebase Admin initialisé avec succès (Format Modulaire ESM).");
  } catch (error) {
    console.error("❌ Erreur critique lors de l'initialisation de Firebase Admin:", error.message);
    throw error;
  }
}

// Exportation propre de la base de données de la même manière qu'avant
export const adminDb = getFirestore();