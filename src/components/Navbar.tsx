import React from 'react';
import { ShoppingCart, User, Store, LayoutDashboard, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { signOutUser } from '../services/authService';

interface NavbarProps {
  onAuthClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { state: authState, dispatch: authDispatch } = useAuth();
  const itemCount = cartState.items.reduce((acc, item) => acc + item.quantity, 0);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutUser();
    authDispatch({ type: 'LOGOUT' });
  };

  // Check if the user has admin role
  const isAdmin = authState.isAuthenticated && authState.user?.role === 'admin';

  return (
    <nav className="bg-[#2D7337] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Store className="h-8 w-8 text-[#FED41D]" />
            <span className="ml-2 text-xl font-bold">E-Kwik-E-Mart</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Admin button - only show if user is admin */}
            {isAdmin && (
              <button
                className="hover:text-[#FED41D] transition-colors flex items-center gap-2"
                onClick={() => router.push('/admin')}
                >
                  <LayoutDashboard className="h-6 w-6" />
                  <span className="hidden md:inline">Admin</span>
              </button>
            )}

            {/* User profile/login button */}
            <div className="relative group">
              <button 
                className="hover:text-[#FED41D] transition-colors flex items-center gap-2"
                onClick={onAuthClick}
              >
                {authState.isAuthenticated && authState.user?.photoURL ? (
                  <img 
                    src={authState.user.photoURL} 
                    alt={authState.user.name}
                    className="w-8 h-8 rounded-full border-2 border-[#FED41D]"
                  />
                ) : (
                  <User className="h-6 w-6" />
                )}
                {authState.isAuthenticated && (
                  <span className="hidden md:inline">{authState.user?.name}</span>
                )}
              </button>
              
              {/* Dropdown menu - only show for authenticated users */}
              {authState.isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Cart button */}
            <button 
              className="relative hover:text-[#FED41D] transition-colors"
              onClick={() => cartDispatch({ type: 'TOGGLE_CART' })}
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#CC0000] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};