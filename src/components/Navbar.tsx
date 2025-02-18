import React from 'react';
import { ShoppingCart, User, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onAuthClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { state: authState } = useAuth();
  const itemCount = cartState.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-[#2D7337] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Store className="h-8 w-8 text-[#FED41D]" />
            <span className="ml-2 text-xl font-bold">E-Kwik-E-Mart</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="hover:text-[#FED41D] transition-colors flex items-center gap-2"
              onClick={onAuthClick}
            >
              <User className="h-6 w-6" />
              {authState.isAuthenticated && (
                <span className="hidden md:inline">{authState.user?.name}</span>
              )}
            </button>
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