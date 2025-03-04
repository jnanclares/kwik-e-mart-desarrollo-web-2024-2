'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname} from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { DailyDeals } from '../components/DailyDeals';
import { ProductCatalog } from '../components/ProductCatalog';
import { Cart } from '../components/Cart';
import { AuthModal } from '../components/auth/AuthModal';
import { CheckoutPage } from '../components/checkout/CheckoutPage';
import { applyDailyDeals } from '../services/updateDailyDeals';
import Dashboard from '../components/Administration/Dashboard';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'checkout'>('home');

  // Function to update product discounts
  useEffect(() => {
    const updateProductsAndDeals = async () => {
      try {
        console.log("🔄 Aplicando descuentos...");
        await applyDailyDeals();
        console.log("✅ Descuentos aplicados.");
      } catch (error) {
        console.error("⚠️ Error al aplicar descuentos:", error);
      }
    };

    updateProductsAndDeals();
  }, []);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAuthClick={() => setIsAuthModalOpen(true)}/>
      <main>
          {pathname === '/admin' ? (
              <Dashboard />
        ) : currentPage === 'home' ? (
          <>
            <Hero />
            <DailyDeals />
            <FeaturedProducts />
            <ProductCatalog />
          </>
        ) : (
          <CheckoutPage />
        )}
      </main>
      <Cart />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default App;
