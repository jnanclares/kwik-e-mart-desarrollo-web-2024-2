'use client'

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { DailyDeals } from '../components/DailyDeals';
import { ProductCatalog } from '../components/ProductCatalog';
import { Cart } from '../components/Cart';
import { AuthModal } from '../components/Auth/AuthModal';
import { CheckoutPage } from '../components/Checkout/CheckoutPage';
import { resetProducts } from '../services/updateProducts'; // Opcional, si lo vuelves a necesitar
import { applyDailyDeals } from '../services/updateDailyDeals';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'checkout'>('home');

  // Ejecutar la actualización de productos y descuentos al cargar la página
  useEffect(() => {
    const updateProductsAndDeals = async () => {
      try {
        // Puedes descomentar si deseas reiniciar productos:
        // await resetProducts();
        console.log("🔄 Aplicando descuentos...");
        await applyDailyDeals();
        console.log("✅ Descuentos aplicados según el día de la semana.");
      } catch (error) {
        console.error("⚠️ Error al actualizar productos o descuentos:", error);
      }
    };

    updateProductsAndDeals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />
      <main>
        {currentPage === 'home' ? (
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
