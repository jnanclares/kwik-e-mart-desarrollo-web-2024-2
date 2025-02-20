import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  BarChart2, 
  Activity, 
  Users, 
  Package, 
  Tag,
  Store
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
  const location = useLocation();

  return (
    <div className="bg-yellow-500 text-white w-64 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <Store className="w-8 h-8" />
        <span className="text-xl font-bold">Kwik-E-Mart</span>
      </div>
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
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
    </div>
  );
}