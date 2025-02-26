'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  BarChart2, 
  Activity, 
  Users, 
  Package, 
  Tag,
  Store,
  ArrowLeft
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: BarChart2, label: 'Sales Reports', path: '/admin/sales' },
  { icon: Activity, label: 'Activity Monitor', path: '/admin/activity' },
  { icon: Users, label: 'User Management', path: '/admin/users' },
  { icon: Package, label: 'Inventory', path: '/admin/inventory' },
  { icon: Tag, label: 'Offers', path: '/admin/offers' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-yellow-500 text-white w-64 min-h-screen p-4 flex flex-col">
      {/* Store Header with Link to Homepage */}
      <Link href="/" className="flex items-center gap-2 mb-8 hover:text-white/80 transition-colors">
        <Store className="w-8 h-8" />
        <span className="text-xl font-bold">Kwik-E-Mart</span>
      </Link>
      
      {/* Navigation Menu */}
      <nav className="flex-grow">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2 p-3 rounded-lg mb-2 transition-colors ${
                isActive 
                  ? 'bg-yellow-600' 
                  : 'hover:bg-yellow-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Back to Store Link at Bottom */}
      <div className="mt-auto pt-4 border-t border-yellow-400">
        <Link 
          href="/" 
          className="flex items-center gap-2 p-3 rounded-lg transition-colors hover:bg-yellow-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Store</span>
        </Link>
      </div>
    </div>
  );
}