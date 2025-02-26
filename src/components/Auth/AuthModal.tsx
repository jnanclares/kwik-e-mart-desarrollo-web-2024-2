import React from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useAuth();
  const { user, isAuthenticated } = state;

  const handleSignOut = async () => {
    await signOutUser();
    dispatch({ type: 'LOGOUT' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg max-w-md w-full">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="p-6">
            {isAuthenticated && user ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[#2D7337]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#2D7337] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2 text-[#2D7337]">Welcome back!</h2>
                <p className="text-xl text-gray-700 mb-6">{user.name}</p>
                
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <p className="text-sm text-gray-500 mb-4">
                    {user.role === 'admin' ? 'You have administrator privileges.' : 'You\'re signed in with your account.'}
                  </p>
                  
                  <div className="flex flex-col space-y-3">
                    <button 
                      onClick={onClose}
                      className="px-6 py-2 bg-[#2D7337] text-white rounded-md hover:bg-[#236129] transition-colors"
                    >
                      Continue Shopping
                    </button>
                    
                    <button 
                      onClick={handleSignOut}
                      className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center text-[#2D7337]">Sign in to Kwik-E-Mart</h2>
                <LoginForm onClose={onClose} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};