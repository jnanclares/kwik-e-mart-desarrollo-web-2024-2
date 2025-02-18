'use client'

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { DailyDeals } from '../components/DailyDeals';
import { ProductCatalog } from '../components/ProductCatalog';
import { Cart } from '../components/Cart';
import { AuthModal } from '../components/Auth/AuthModal';
import { UserProfile } from '../components/UserProfile';
import { CheckoutPage } from '../components/Checkout/CheckoutPage';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'checkout'>('home');

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />
          <main>
            {currentPage === 'home' ? (
              <>
                <Hero />
                <FeaturedProducts />
                <DailyDeals />
                <ProductCatalog />
              </>
            ) : (
              <CheckoutPage />
            )}
          </main>
          <Cart />
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;