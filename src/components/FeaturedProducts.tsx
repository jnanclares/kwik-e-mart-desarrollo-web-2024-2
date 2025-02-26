import React, { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { fetchProducts } from "../services/products";
import { ProductModal } from "./ProductModal";
import { Product } from "../models";
import { useCart } from "../context/CartContext"; // 🛒 Importamos el carrito

export const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { dispatch } = useCart(); // 🛒 Obtenemos dispatch del carrito

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true);
      try {
        const products = await fetchProducts();
        const featured = products.filter((product) => product.featured);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error("Error al obtener productos destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Cargando productos destacados...</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay productos destacados en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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

      {/* Modal de Producto */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
};
