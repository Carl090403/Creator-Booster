import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Recommence à utiliser getFirestore

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialisation de l'application
const app = initializeApp(firebaseConfig);

// 💡 CORRECTION : On passe l'ID de la base de données directement en 2e argument !
const dbId = import.meta.env.VITE_FIREBASE_DATABASE_ID;

export const db = dbId 
  ? getFirestore(app, dbId) 
  : getFirestore(app);