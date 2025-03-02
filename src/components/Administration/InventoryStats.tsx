'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { Product } from '@/models/products';
import { Package, AlertTriangle, DollarSign, ShoppingBag } from 'lucide-react';
import { notificationService } from '@/services/notificationService';

const InventoryStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0,
    categories: {
      beverages: 0,
      snacks: 0,
      essentials: 0
    }
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // Calcular estadísticas
      const totalProducts = products.length;
      
      let totalValue = 0;
      let lowStockItems = 0;
      const categories = { beverages: 0, snacks: 0, essentials: 0 };

      for (const product of products) {
        // Sumar el valor total de inventario (precio x stock)
        totalValue += (product.price * product.stock);
        
        // Contar productos con bajo stock
        if (product.stock <= 5) {
          lowStockItems++;
        }
        
        // Contar productos por categoría
        if (product.category in categories) {
          categories[product.category as keyof typeof categories]++;
        }
      }

      setStats({
        totalProducts,
        totalValue,
        lowStockItems,
        categories
      });
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      notificationService.notify(`Error al cargar estadísticas: ${error instanceof Error ? error.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
        <p className="ml-4 text-sm text-yellow-600 italic">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      {/* Total Products */}
      <div className="bg-blue-500 text-white rounded-lg p-4 shadow-md flex items-center">
        <div className="mr-4 bg-blue-600 p-3 rounded-full">
          <Package className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold opacity-80">Total Productos</p>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
      </div>
      
      {/* Low Stock Items */}
      <div className="bg-red-500 text-white rounded-lg p-4 shadow-md flex items-center">
        <div className="mr-4 bg-red-600 p-3 rounded-full">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold opacity-80">Bajo Stock</p>
          <p className="text-2xl font-bold">{stats.lowStockItems}</p>
        </div>
      </div>
      
      {/* Inventory Value */}
      <div className="bg-green-500 text-white rounded-lg p-4 shadow-md flex items-center">
        <div className="mr-4 bg-green-600 p-3 rounded-full">
          <DollarSign className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold opacity-80">Valor Total</p>
          <p className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Category Counter */}
      <div className="bg-yellow-500 text-white rounded-lg p-4 shadow-md flex items-center">
        <div className="mr-4 bg-yellow-600 p-3 rounded-full">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold opacity-80">Por Categoría</p>
          <div className="text-sm">
            <span className="inline-block mr-2 px-1 py-0.5 bg-blue-600 rounded-md">
              Bebidas: {stats.categories.beverages}
            </span>
            <span className="inline-block mr-2 px-1 py-0.5 bg-red-600 rounded-md">
              Snacks: {stats.categories.snacks}
            </span>
            <span className="inline-block px-1 py-0.5 bg-green-600 rounded-md">
              Esenciales: {stats.categories.essentials}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStats;