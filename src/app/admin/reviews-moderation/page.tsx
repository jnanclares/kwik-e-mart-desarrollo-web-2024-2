'use client';

import React from 'react';
import ReviewsModeration from '@/components/Administration/ReviewsModeration';
import Image from 'next/image';

const ReviewsModerationPage: React.FC = () => {
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
              ¡Administración de Reseñas!
              <span className="block text-lg font-normal italic">
                Gracias, vuelva con dinero pronto!
              </span>
            </h1>
          </div>
          <div className="bg-yellow-400 py-2 px-6 rounded-lg text-red-600 font-bold shadow-md transform rotate-3 hover:rotate-0 transition-transform">
            Moderación de reseñas
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="bg-white rounded-lg shadow-lg p-5 border-2 border-[#3CB64C]">
          <div className="flex items-center mb-6 pb-3 border-b-2 border-dashed border-[#FDBB30]">
            <div className="w-8 h-8 bg-[#3CB64C] rounded-full flex items-center justify-center text-white font-bold mr-3">
              <span>🔍</span>
            </div>
            <h2 className="text-xl font-bold text-[#3CB64C]">Moderar Reseñas de Clientes</h2>
          </div>
          
          {/* Componente original de moderación */}
          <div className="relative">
            <ReviewsModeration />
            
            {/* Decoración esquinas */}
            <div className="absolute top-0 right-0 opacity-20 pointer-events-none">
              <span className="text-5xl">🥤</span>
            </div>
            <div className="absolute bottom-0 left-0 opacity-20 pointer-events-none">
              <span className="text-5xl">🍩</span>
            </div>
          </div>
        </div>
        
        {/* Footer estilo Kwik-E-Mart */}
        <div className="mt-6 text-center text-sm text-gray-500 font-['Comic_Sans_MS']">
          Panel de Administración Kwik-E-Mart © Springfield
        </div>
      </div>
    </div>
  );
};

export default ReviewsModerationPage;