import { CartItem } from './cart';

/**
 * Represents a user in the system
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;  // 'admin' | 'user'
  photoURL?: string; // Added for Google authentication profile picture
  securityPhrase?: string;
  purchaseHistory: {
    date: string;
    items: CartItem[];
    total: number;
  }[];
}

/**
 * User data stored in Firestore
 */
export interface UserData {
  displayName: string;
  email: string;
  photoURL?: string;
  role: string;
  createdAt: Date;
  securityPhrase?: string;
}

// Define interface for user data with ID from Firestore
export interface UserWithId extends UserData {
  id: string;
  createdAt: Date;
}