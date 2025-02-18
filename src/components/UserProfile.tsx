import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, LogOut, User as UserIcon } from 'lucide-react';

export const UserProfile = () => {
  const { state, dispatch } = useAuth();
  const { user } = state;

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-[#2D7337] rounded-full p-3">
          <UserIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Purchase History</h3>
        {user.purchaseHistory.length === 0 ? (
          <p className="text-gray-500">
            No purchases yet. Thank you, come again!
          </p>
        ) : (
          <div className="space-y-4">
            {user.purchaseHistory.map((purchase, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#2D7337]" />
                    <span className="font-medium">
                      {new Date(purchase.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="font-bold">${purchase.total.toFixed(2)}</span>
                </div>
                <div className="space-y-2">
                  {purchase.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm text-gray-600"
                    >
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => dispatch({ type: 'LOGOUT' })}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};