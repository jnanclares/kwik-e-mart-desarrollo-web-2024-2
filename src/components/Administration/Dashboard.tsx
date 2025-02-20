import React from 'react';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import DashboardCard from './DashboardCard';


const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Sales"
          value="$12,345"
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Orders"
          value="156"
          icon={ShoppingCart}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Active Users"
          value="1,245"
          icon={Users}
          trend={{ value: 3, isPositive: true }}
        />
        <DashboardCard
          title="Low Stock Items"
          value="12"
          icon={Package}
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
          {/* Add sales chart here */}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Popular Products</h2>
          {/* Add products list here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;