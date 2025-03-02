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
    items: any[];       // Detalles de los productos comprados
    shipping: number;
    tax: number;
    total: number;
    pay_method: string;
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
  purchaseHistory: {
    date: Date;
    items: CartItem[];
    shipping: number;
    tax: number;
    total: number;
    pay_method: string;
  }[];
}

// Define interface for user data with ID from Firestore
export interface UserWithId extends UserData {
  id: string;
  createdAt: Date;
}