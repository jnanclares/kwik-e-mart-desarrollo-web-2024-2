import React, { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { fetchProducts } from "../services/products";
import { ProductModal } from "./ProductModal";
import { Product } from "../models";
import { Clock } from "lucide-react";
import { useCart } from "../context/CartContext";

// 🔹 Prevent Hydration Error by checking window object
const getTimeUntilMidnight = () => {
  if (typeof window === "undefined") return null; // Return null on SSR
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(23, 59, 59, 999);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
};

export const DailyDeals = () => {
  const [dailyDeals, setDailyDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { dispatch } = useCart();
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // 🔹 Default is null

  useEffect(() => {
    setTimeLeft(getTimeUntilMidnight()); // 🔹 Set only on client

    const loadDailyDeals = async () => {
      setLoading(true);
      try {
        const products = await fetchProducts();
        const deals = products.filter((product) => product.onSale);
        setDailyDeals(deals);
      } catch (error) {
        console.error("Error fetching daily deals:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDailyDeals();
  }, []);

  useEffect(() => {
    if (timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "Loading...";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Clock className="h-6 w-6 text-[#CC0000]" />
          <h2 className="text-3xl font-bold text-center">Ofertas del Día</h2>
        </div>
        <p className="text-center text-gray-600 mb-4">
          "¡Estos precios están locos! ¡Compra algo, lo que sea!" - Apu
        </p>

        {/* 🔹 Only render countdown on the client */}
        {timeLeft !== null && (
          <div className="text-center text-red-500 font-bold text-lg mb-6">
            ⏳ ¡Oferta termina en {formatTime(timeLeft)}!
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Cargando ofertas...</p>
          </div>
        ) : dailyDeals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay ofertas disponibles hoy. ¡Vuelve pronto!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {dailyDeals.map((product) => (
              <div
              key={product.id}
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest(".add-to-cart-button")) {
                  setSelectedProduct(product);
                }
              }}
              className="cursor-pointer"
            >
              <ProductCard product={product} dispatch={dispatch} />
            </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Modal de Producto */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
};
