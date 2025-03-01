'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InventoryStats from '@/components/Administration/InventoryStats';
import ProductsTable from '@/components/Administration/ProductsTable';
import CategoryDistribution from '@/components/Administration/CategoryDistribution';

const AdminPage: React.FC = () => {
  const router = useRouter();
  
  return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Control de Inventario</h1>
        </div>
        
        {/* Stats Overview */}
        <InventoryStats />
  
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Distribution */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Distribución por Categoría</h2>
            <CategoryDistribution />
          </div>
  
          {/* Products Table */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <ProductsTable />
          </div>
        </div>
      </div>
    );
};

export default AdminPage;