import React from 'react';
import { Store } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative bg-[#2D7337] text-white">
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <Store className="h-16 w-16 text-[#FED41D] mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Welcome to E-Kwik-E-Mart</h1>
          <p className="text-xl mb-8">Thank you, come again! Shop our wide selection of convenience items.</p>
          <div className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#2D7337] bg-[#FED41D] hover:bg-[#e5bd1a] transition-colors">
            Shop Now
          </div>
        </div>
      </div>
    </div>
  );
};