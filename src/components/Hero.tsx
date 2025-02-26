import React from 'react';
import { Store } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative bg-[#2D7337] text-white">
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <Store className="h-16 w-16 text-[#FED41D] mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Bienvenido al E-Kwik-E-Mart de Apu</h1>
          <p className="text-xl mb-8">¡Gracias, vuelva pronto! Explore nuestra amplia selección de artículos de conveniencia, siempre frescos y a precios razonables. ¡Que tenga un excelente día!</p>
        </div>
      </div>
    </div>
  );
};