'use client';

import OffersReport from "@/components/Administration/OffersReport";

export default function Offers() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-green-400 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-8 border-4 border-yellow-400">
        {/* Header con logo y título */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-red-500 rounded-lg p-4 text-white border-b-4 border-yellow-400">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mr-4 shadow-md">
              <span className="text-3xl font-bold text-red-600">K-E</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Ofertas
              <span className="block text-lg font-normal italic">
                Gracias, vuelva pronto!
              </span>
            </h1>
          </div>
          <div className="bg-yellow-400 py-2 px-6 rounded-lg text-red-600 font-bold shadow-md transform rotate-3 hover:rotate-0 transition-transform">
            Admin Panel
          </div>
        </div>
        
        {/* Contenedor principal */}
        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 shadow-inner">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-purple-900">
              Panel de Administración de Ofertas
            </h2>
            <div className="bg-green-500 text-white text-sm py-1 px-3 rounded-full animate-pulse">
              Buenos días, hasta otro robo
            </div>
          </div>
          
          {/* Componente principal */}
          <div className="bg-white rounded-lg shadow-md p-4 border-2 border-yellow-300">
            <OffersReport />
          </div>
          
          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600 pt-4 border-t border-dashed border-blue-300">
            <p>"Los precios tan bajos que te harán decir ¡Ay, caramba!" - Kwik-E-Mart</p>
          </div>
        </div>
      </div>
    </div>
  );
}