'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InventoryStats from '@/components/Administration/InventoryStats';
import ProductsTable from '@/components/Administration/ProductsTable';
import CategoryDistribution from '@/components/Administration/CategoryDistribution';
import { Package, ChevronRight } from 'lucide-react';

const AdminPage: React.FC = () => {
  const router = useRouter();
  
  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-blue-500 to-green-400 min-h-screen relative">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-8 border-4 border-yellow-400">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-5 z-0">
          {/* Donut pattern */}
          <div className="absolute top-10 right-20 w-24 h-24 rounded-full bg-pink-400 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-yellow-500"></div>
          </div>
          <div className="absolute bottom-40 left-20 w-16 h-16 rounded-full bg-blue-300 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
          </div>
          <div className="absolute top-60 left-40 w-20 h-20 rounded-full bg-yellow-600 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-yellow-500"></div>
          </div>
          
          {/* Squishee cups */}
          <div className="absolute top-40 right-60 w-12 h-16 bg-blue-400 rounded-b-xl rounded-t-lg"></div>
          <div className="absolute bottom-20 right-20 w-10 h-14 bg-red-400 rounded-b-xl rounded-t-lg"></div>
        </div>

        {/* Header con logo y título */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-3 bg-red-500 rounded-lg p-4 text-white border-b-4 border-yellow-400">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mr-4 shadow-md">
              <span className="text-3xl font-bold text-red-600">K-E</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Control de Inventario
              <span className="block text-lg font-normal italic">
              ¡Los precios más altos permitidos por la ley!
              </span>
            </h1>
          </div>
          <div className="bg-yellow-400 py-2 px-6 rounded-lg text-red-600 font-bold shadow-md transform rotate-3 hover:rotate-0 transition-transform">
          Productos Frescos*
          <div className="text-xs opacity-70 italic">*Por definición de Apu</div>
          </div>
        </div>
        
        {/* Stats Overview with Kwik-E-Mart styling */}
        <div className="relative z-10 mb-3">
          <div className="bg-gradient-to-r from-blue-100 to-green-100 p-1 rounded-lg shadow-md">
            <InventoryStats />
          </div>
        </div>
        
        {/* Apu Quote */}
        <div className="relative z-10 bg-yellow-100 p-3 mb-3 rounded-lg border-l-4 border-yellow-500 shadow-sm">
          <p className="text-sm italic text-yellow-800">
            "Gracias por revisar el inventario. Recuerde: si está caducado, ¡rebaje el precio a la mitad y póngalo en primera fila!"
          </p>
        </div>
    
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Product Distribution */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md border-t-4 border-green-500 overflow-hidden">
            <div className="bg-green-500 px-4 py-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <ChevronRight className="w-5 h-5" />
                Distribución por Categoría
              </h2>
            </div>
            <div className="p-4">
              <CategoryDistribution />
            </div>
          </div>
    
          {/* Products Table */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md border-t-4 border-blue-500 overflow-hidden">
            <div className="bg-blue-500 px-4 py-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <ChevronRight className="w-5 h-5" />
                Productos en Inventario
              </h2>
            </div>
            <ProductsTable />
          </div>
        </div>
        
        {/* Footer Note */}
        <div className="relative z-10 mt-6 text-center text-xs text-gray-500 bg-white p-3 rounded-lg">
          <p>Sistema de Gestión Kwik-E-Mart © 2025 | Desarrollado con orgullo en Springfield</p>
          <p className="mt-1 italic">"Nuestros precios pueden ser absurdos, ¡pero nuestro servicio es peor!"</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;