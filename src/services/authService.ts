
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from '../types';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const buildUserProfile = async (firebaseUser: any, name: string): Promise<UserProfile> => {
  const userDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }

  const newUser: UserProfile = {
    id: firebaseUser.uid,
    name,
    email: firebaseUser.email || '',
    platform: 'both',
    onboarding_completed: false,
    created_at: new Date().toISOString(),
  };

  await setDoc(doc(db, 'profiles', firebaseUser.uid), newUser);
  return newUser;
};

export const authService = {
  loginWithGoogle: async (): Promise<UserProfile> => {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    return buildUserProfile(firebaseUser, firebaseUser.displayName || 'Créateur');
  },

  loginWithEmailPassword: async (email: string, password: string): Promise<UserProfile> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;
    return buildUserProfile(firebaseUser, firebaseUser.displayName || email);
  },

  registerWithEmailPassword: async (name: string, email: string, password: string): Promise<UserProfile> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;
    return buildUserProfile(firebaseUser, name);
  },

  sendPasswordResetEmail: async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  },

  logout: async () => {
    await signOut(auth);
  },
  
  updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    if (!auth.currentUser) throw new Error("Non authentifié");
    const userRef = doc(db, 'profiles', auth.currentUser.uid);
    await updateDoc(userRef, updates);
    const updatedDoc = await getDoc(userRef);
    return updatedDoc.data() as UserProfile;
  },

  onAuthChange: (callback: (user: UserProfile | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));
        if (userDoc.exists()) {
          callback(userDoc.data() as UserProfile);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
};
