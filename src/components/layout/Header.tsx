import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Store } from 'lucide-react';
import { useAuthStore } from '../../store/auth-store';
import { useCartStore } from '../../store/cart-store';

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const { items } = useCartStore();
  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-yellow-400 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">Kwik-E-Mart</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/products" className="text-blue-600 hover:text-blue-800">
              Products
            </Link>
            <Link to="/offers" className="text-blue-600 hover:text-blue-800">
              Offers
            </Link>
            <Link to="/about" className="text-blue-600 hover:text-blue-800">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center space-x-2">
                <User className="h-6 w-6 text-blue-600" />
                <span className="text-blue-600">{user?.name}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}