'use client'

import React, { useState, useEffect } from 'react';
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
import { resetProducts } from '../services/updateProducts'; // 🔹 Reinicia productos
import { applyDailyDeals } from '../services/updateDailyDeals'; // 🔹 Aplica descuentos

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'checkout'>('home');

  // 🔹 Ejecutar la actualización de productos y descuentos al cargar la página
  useEffect(() => {
    const updateProductsAndDeals = async () => {
      try {
        // console.log("🔄 Reseteando productos...");
        // await resetProducts(); // 
        // console.log("✅ Productos reseteados.");

        console.log("🔄 Aplicando descuentos...");
        await applyDailyDeals(); // 
        console.log("✅ Descuentos aplicados según el día de la semana.");
      } catch (error) {
        console.error("⚠️ Error al actualizar productos o descuentos:", error);
      }
    };

    updateProductsAndDeals();
  }, []); // 🔹 Se ejecuta solo una vez al cargar la página

  return (
    <AuthProvider>
      <CartProvider>
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
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
