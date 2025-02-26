import { User as FirebaseUser } from 'firebase/auth';
import { User, UserData } from './user';

/**
 * Represents the authentication state in the application
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Response from authentication operations
 */
export interface AuthResponse {
  user?: FirebaseUser;
  error?: Error;
}

/**
 * Response when retrieving user data
 */
export interface UserDataResponse {
  userData?: UserData;
  error?: Error;
}

/**
 * Available roles in the system
 */
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

