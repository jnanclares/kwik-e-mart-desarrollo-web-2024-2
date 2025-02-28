'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { getUserData, ROLES } from '@/services/authService';
import { UserWithId } from '@/models/user';


export default function UserManagement() {
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState<{
    userId: string | null;
    success: boolean | null;
    message: string;
  }>({ userId: null, success: null, message: '' });
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserWithId[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      // You could add error handling UI here if needed
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setUpdateStatus({ userId, success: null, message: 'Updating...' });
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      
      // Update the local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      setUpdateStatus({ userId, success: true, message: 'Role updated successfully!' });
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setUpdateStatus({ userId: null, success: null, message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating user role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setUpdateStatus({ userId, success: false, message: `Error: ${errorMessage}` });
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button 
          onClick={fetchUsers} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Refresh Users
        </button>
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : (
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                    Current Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.photoURL ? (
                            <img 
                              className="h-10 w-10 rounded-full mr-3" 
                              src={user.photoURL} 
                              alt={user.displayName || user.email}
                              onError={(e) => {
                                // When image fails to load, replace with fallback
                                e.currentTarget.onerror = null; // Prevent infinite error loop
                                e.currentTarget.style.display = 'none'; // Hide the img element
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                                      <span class="text-gray-500 font-medium">
                                        ${(user.displayName || user.email || "?").charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                              <span className="text-gray-500 font-medium">
                                {(user.displayName || user.email || "?").charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.displayName || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              User ID: {user.id.substring(0, 6)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === ROLES.ADMIN 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          {user.role === ROLES.USER && (
                            <button
                              onClick={() => updateUserRole(user.id, ROLES.ADMIN)}
                              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition font-medium"
                            >
                              Promote to Admin
                            </button>
                          )}
                          {user.role === ROLES.ADMIN && (
                            <button
                              onClick={() => updateUserRole(user.id, ROLES.USER)}
                              className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition font-medium"
                            >
                              Demote to User
                            </button>
                          )}
                          {updateStatus.userId === user.id && (
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                updateStatus.success === true
                                  ? 'bg-green-100 text-green-800'
                                  : updateStatus.success === false
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {updateStatus.message}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
                      )}
          </div>
        </div>
      </div>
      
      {/* Role Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Role Information</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 mr-2">
              admin
            </span>
            <p className="text-sm text-gray-600">
              Administrators have full access to manage users, products, and other administrative tasks.
            </p>
          </div>
          <div className="flex items-start">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 mr-2">
              user
            </span>
            <p className="text-sm text-gray-600">
              Regular users have limited access to the system based on their assigned permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}