'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '../../components/Administration/Dashboard';

const AdminPage: React.FC = () => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <Dashboard />
    </div>
  );
};

export default AdminPage;