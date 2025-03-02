import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { UserData } from '../models/user';
import { AuthResponse, UserDataResponse } from '../models/auth';

// Available roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Google provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user already exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // New user, save information with default role
      await saveUserInfo(user.uid, {
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        role: ROLES.USER,  // Default role for Google users
        createdAt: new Date()
      });
    }
    
    return { user };
  } catch (error) {
    return { error: error as Error };
  }
};

// Sign out
export const signOutUser = async (): Promise<{ success?: boolean; error?: Error }> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error: error as Error };
  }
};

// Get current user
export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Save user information in Firestore
export const saveUserInfo = async (
  userId: string, 
  userData: UserData
): Promise<{ success?: boolean; error?: Error }> => {
  try {
    await setDoc(doc(db, 'users', userId), userData, { merge: true });
    return { success: true };
  } catch (error) {
    return { error: error as Error };
  }
};

// Get user data from Firestore
export const getUserData = async (userId: string): Promise<UserDataResponse> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { userData: docSnap.data() as UserData };
    } else {
      return { userData: undefined };
    }
  } catch (error) {
    return { error: error as Error };
  }
};