'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Package, 
  Tag,
  Store,
  MessageSquare,
  ArrowLeft,
  BarChart2 // Añadido para el icono de análisis de ventas
} from 'lucide-react';

const menuItems = [
  { icon: Package, label: 'Inventario', path: '/admin' },
  { icon: Users, label: 'Usuarios', path: '/admin/users' },
  { icon: BarChart2, label: 'Análisis de Ventas', path: '/admin/sales' }, // Nuevo ítem para análisis de ventas
  { icon: Tag, label: 'Ofertas', path: '/admin/offers' },
  { icon: MessageSquare, label: 'Moderación de Reseñas', path: '/admin/reviews-moderation' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-gradient-to-b from-yellow-500 to-yellow-600 text-white w-64 min-h-screen p-4 flex flex-col relative overflow-hidden">
      {/* Donut Pattern Background - Improved with more visible donuts */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        {/* Pink donut with sprinkles */}
        <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-pink-400 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
          <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-blue-500"></div>
          <div className="absolute top-3 right-4 w-2 h-2 rounded-full bg-green-500"></div>
          <div className="absolute bottom-3 left-4 w-2 h-2 rounded-full bg-purple-500"></div>
        </div>
        
        {/* Chocolate donut */}
        <div className="absolute top-60 right-5 w-12 h-12 rounded-full bg-yellow-800 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
        </div>
        
        {/* Glazed donut */}
        <div className="absolute bottom-40 left-3 w-20 h-20 rounded-full bg-yellow-200 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-yellow-500"></div>
          <div className="absolute top-4 w-16 h-2 rounded-full bg-white opacity-50"></div>
        </div>
        
        {/* Sprinkled donut */}
        <div className="absolute bottom-32 right-8 w-14 h-14 rounded-full bg-blue-300 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
          <div className="absolute top-2 left-6 w-1 h-2 rounded-full bg-red-500 rotate-45"></div>
          <div className="absolute top-6 right-3 w-1 h-2 rounded-full bg-green-500 -rotate-20"></div>
          <div className="absolute bottom-2 left-2 w-1 h-2 rounded-full bg-yellow-400 rotate-75"></div>
        </div>
      </div>
      
      {/* Squishee Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-40 left-30 w-10 h-16 bg-red-400 rounded-b-xl rounded-t-lg"></div>
        <div className="absolute bottom-60 right-10 w-10 h-16 bg-blue-400 rounded-b-xl rounded-t-lg"></div>
      </div>
      
      {/* Store Header with Link to Homepage */}
      <Link href="/" className="flex flex-col items-center gap-1 mb-8 hover:text-white/80 transition-colors relative z-10">
        <div className="bg-red-600 rounded-full p-3 shadow-lg mb-2">
          <Store className="w-8 h-8" />
        </div>
        <span className="text-xl font-bold text-center">Kwik-E-Mart</span>
        <span className="text-xs italic text-green-300">¡Gracias, vuelva pronto!</span>
      </Link>
      
      {/* Navigation Menu */}
      <nav className="flex-grow relative z-10">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg mb-3 transition-all ${
                isActive 
                  ? 'bg-green-600 shadow-md font-bold translate-x-1' 
                  : 'hover:bg-yellow-600/70 hover:translate-x-1'
              }`}
            >
              <div className={`p-2 rounded-md ${isActive ? 'bg-green-700' : 'bg-yellow-700'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Apu Quote */}
      <div className="relative z-10 my-4 bg-yellow-700/50 p-3 rounded-lg border-l-4 border-green-500">
        <p className="text-xs italic">"¿Quién necesita al Badulaque cuando tienes el Kwik-E-Mart?"</p>
      </div>
      
      {/* Back to Store Link at Bottom */}
      <div className="relative z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 p-3 rounded-lg transition-colors hover:bg-blue-600 bg-blue-700 text-white shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Volver a la Tienda</span>
        </Link>
      </div>
      
      {/* Footer Store Hours */}
      <div className="mt-4 text-center text-xs opacity-80 relative z-10">
        <p className="font-bold">HORARIO</p>
        <p>Abierto 24/7/365</p>
        <p className="mt-2 italic">"Si algo cuesta más, ¡debe ser mejor!"</p>
      </div>
    </div>
  );
}