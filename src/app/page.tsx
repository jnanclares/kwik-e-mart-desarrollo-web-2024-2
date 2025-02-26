'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname} from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { DailyDeals } from '../components/DailyDeals';
import { ProductCatalog } from '../components/ProductCatalog';
import { Cart } from '../components/Cart';
import { AuthModal } from '../components/Auth/AuthModal';
import { CheckoutPage } from '../components/Checkout/CheckoutPage';
import { resetProducts } from '../services/updateProducts'; 
import { applyDailyDeals } from '../services/updateDailyDeals';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from '../components/Administration/Dashboard';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'checkout'>('home');

  // 🔹 Function to migrate reviews from number to array
  useEffect(() => {
    const migrateReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));

        for (const productDoc of querySnapshot.docs) {
          const productData = productDoc.data();

          // 🔹 Skip if reviews is already an array
          if (Array.isArray(productData.reviews)) continue;

          // 🔹 Convert reviews number to an array of objects
          const reviewsArray = [];
          if (typeof productData.reviews === "number" && productData.reviews > 0) {
            reviewsArray.push({
              userId: "admin",
              username: "Auto Migration",
              rating: 5,
              comment: `This product previously had ${productData.reviews} reviews.`,
              date: new Date().toISOString(),
            });
          }

          // 🔹 Update the product in Firebase
          await updateDoc(doc(db, "products", productDoc.id), {
            reviews: reviewsArray, // Now an array
          });

          console.log(`✅ Migrated reviews for product: ${productDoc.id}`);
        }

        console.log("🎉 Review migration completed successfully!");
      } catch (error) {
        console.error("⚠️ Error migrating reviews:", error);
      }
    };

    migrateReviews();
  }, []);

  // 🔹 Function to update product discounts
  useEffect(() => {
    const updateProductsAndDeals = async () => {
      try {
        console.log("🔄 Applying discounts...");
        await applyDailyDeals();
        console.log("✅ Discounts applied based on the day of the week.");
      } catch (error) {
        console.error("⚠️ Error updating products or discounts:", error);
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
