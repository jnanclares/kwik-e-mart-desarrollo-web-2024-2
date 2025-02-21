import React, { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { fetchProducts } from '../services/products'; // Importa la función de Firebase
import { Product } from '../models';
import { Clock } from 'lucide-react';

export const DailyDeals = () => {
  const [dailyDeals, setDailyDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDailyDeals = async () => {
      setLoading(true);
      try {
        const products = await fetchProducts();
        // Filtrar los productos que tienen la propiedad `onSale: true`
        const deals = products.filter(product => product.onSale);
        setDailyDeals(deals);
      } catch (error) {
        console.error('Error al obtener ofertas diarias:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDailyDeals();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Clock className="h-6 w-6 text-[#CC0000]" />
          <h2 className="text-3xl font-bold text-center">Ofertas del Día</h2>
        </div>
        <p className="text-center text-gray-600 mb-8">
          "¡Estos precios están locos! ¡Compra algo, lo que sea!" - Apu
        </p>

        {/* Mostrar mensaje de carga mientras se obtienen los datos */}
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
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
