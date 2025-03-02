// src/context/AuthContext.tsx

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState } from '../models/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { getUserData } from '../services/authService';
import { User } from '@/models/user';

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication state on load
  useEffect(() => {
    // Only execute on the client
    if (typeof window !== 'undefined') {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // User is authenticated, get additional data
          const { userData } = await getUserData(firebaseUser.uid);
          
          if (userData) {
            // Update state with user information
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                id: firebaseUser.uid,
                name: userData.displayName || firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                role: userData.role || 'user',
                purchaseHistory: [],
              }
            });
          }
        } else {
          // User is not authenticated
          dispatch({ type: 'LOGOUT' });
        }
      });

      // Clean up subscription on unmount
      return () => unsubscribe();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};