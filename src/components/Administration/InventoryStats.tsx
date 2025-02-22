import React, { useState, useEffect } from 'react';
import { 
    getAllProducts,
    Product
  } from '../../services/offers';
import { 
  ShoppingBagIcon, 
  TagIcon, 
  StarIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
}

const StatsCard = ({ title, value, icon, change }: StatsCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {change && (
          <p className="text-sm text-green-600 mt-1">{change}</p>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);

export default function InventoryStats() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadData();
      }, []);
    
      const loadData = async () => {
        try {
          const [productsData] = await Promise.all([
            getAllProducts()
          ]);
          setProducts(productsData);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      };
  const totalProducts = products.length;
  const featuredProducts = products.filter(p => p.featured).length;
  const averageRating = (
    products.reduce((acc, p) => acc + p.rating, 0) / products.length
  ).toFixed(1);
  const onSaleProducts = products.filter(p => p.onSale).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Productos"
        value={totalProducts}
        icon={<ShoppingBagIcon className="h-6 w-6 text-blue-600" />}
      />
      <StatsCard
        title="Productos Destacados"
        value={featuredProducts}
        icon={<StarIcon className="h-6 w-6 text-yellow-600" />}
      />
      <StatsCard
        title="Calificación Promedio"
        value={`${averageRating} ⭐`}
        icon={<StarIcon className="h-6 w-6 text-orange-600" />}
      />
      <StatsCard
        title="Productos en Oferta"
        value={onSaleProducts}
        icon={<TagIcon className="h-6 w-6 text-green-600" />}
      />
    </div>
  );
}