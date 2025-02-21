import React, { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { fetchProducts } from '../services/products'; // Importa la función que obtiene los productos de Firebase
import { Product } from '../models';

export const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true);
      try {
        const products = await fetchProducts();
        // Filtrar productos que tienen la propiedad `featured: true`
        const featured = products.filter(product => product.featured);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error al obtener productos destacados:', error);
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

        {/* Mostrar mensaje de carga mientras se obtienen los datos */}
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
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
