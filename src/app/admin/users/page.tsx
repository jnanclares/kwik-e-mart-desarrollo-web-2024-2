'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { getUserData, ROLES } from '@/services/authService';
import { UserWithId } from '@/models/user';
import { Users, RefreshCw, ChevronRight, UserCheck, UserMinus } from 'lucide-react';

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
      setUpdateStatus({ userId, success: null, message: 'Actualizando...' });
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      
      // Update the local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      setUpdateStatus({ userId, success: true, message: '¡Rol actualizado!' });
      
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
    <div className="p-6 space-y-6 bg-gradient-to-b from-blue-500 to-green-400 min-h-screen relative">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-8 border-4 border-yellow-400">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-5 z-0">
          {/* Donut pattern */}
          <div className="absolute top-20 right-40 w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-yellow-600"></div>
          </div>
          <div className="absolute bottom-60 left-30 w-16 h-16 rounded-full bg-pink-400 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-pink-600"></div>
          </div>
          <div className="absolute top-80 left-20 w-20 h-20 rounded-full bg-blue-300 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-500"></div>
          </div>
          
          {/* Squishee cups */}
          <div className="absolute top-60 right-20 w-12 h-16 bg-red-400 rounded-b-xl rounded-t-lg"></div>
          <div className="absolute bottom-40 left-60 w-10 h-14 bg-blue-400 rounded-b-xl rounded-t-lg"></div>
        </div>

        {/* Header con logo y título */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-3 bg-red-500 rounded-lg p-4 text-white border-b-4 border-yellow-400">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mr-4 shadow-md">
              <span className="text-3xl font-bold text-red-600">K-E</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Gestión de Usuarios
              <span className="block text-lg font-normal italic">
                ¡Cada cliente es importante, hasta que sale por la puerta!
              </span>
            </h1>
          </div>
            <button 
              onClick={fetchUsers} 
              className="bg-yellow-400 py-2 px-6 rounded-lg text-red-600 font-bold shadow-md transform rotate-3 hover:rotate-0 transition-transform"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar Usuarios
            </button>
        </div>
        
        {/* Apu Quote */}
        <div className="relative z-10 bg-purple-100 p-3 mb-3 rounded-lg border-l-4 border-purple-500 shadow-sm">
          <p className="text-sm italic text-purple-800">
            "En Kwik-E-Mart valoramos a nuestros clientes. Los administradores deben tener presente que 'El cliente siempre tiene la razón, excepto cuando está equivocado, que es casi siempre'."
          </p>
        </div>
        
        {/* Users Table */}
        <div className="relative z-10 bg-white rounded-lg mb-3 shadow-md border-t-4 border-purple-500 overflow-hidden">
          <div className="bg-purple-500 px-4 py-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ChevronRight className="w-5 h-5" />
              Lista de Usuarios
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
                  <p className="ml-4 text-yellow-600 italic">Cargando usuarios...</p>
                </div>
              ) : (
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-yellow-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider w-4/12">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider w-3/12">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider w-2/12">
                      Rol Actual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider w-3/12">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron usuarios
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-yellow-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.photoURL ? (
                              <img 
                                className="h-10 w-10 rounded-full mr-3 border-2 border-yellow-400" 
                                src={user.photoURL} 
                                alt={user.displayName || user.email}
                                onError={(e) => {
                                  // When image fails to load, replace with fallback
                                  e.currentTarget.onerror = null; // Prevent infinite error loop
                                  e.currentTarget.style.display = 'none'; // Hide the img element
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="h-10 w-10 rounded-full bg-yellow-400 mr-3 flex items-center justify-center border-2 border-yellow-500">
                                        <span class="text-yellow-800 font-bold">
                                          ${(user.displayName || user.email || "?").charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-yellow-400 mr-3 flex items-center justify-center border-2 border-yellow-500">
                                <span className="text-yellow-800 font-bold">
                                  {(user.displayName || user.email || "?").charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.displayName || "Sin Nombre"}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user.id.substring(0, 6)}...
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
                              ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                              : 'bg-green-100 text-green-800 border border-green-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            {user.role === ROLES.USER && (
                              <button
                                onClick={() => updateUserRole(user.id, ROLES.ADMIN)}
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition font-medium flex items-center gap-1"
                              >
                                <UserCheck className="w-4 h-4" />
                                Promover a Admin
                              </button>
                            )}
                            {user.role === ROLES.ADMIN && (
                              <button
                                onClick={() => updateUserRole(user.id, ROLES.USER)}
                                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition font-medium flex items-center gap-1"
                              >
                                <UserMinus className="w-4 h-4" />
                                Degradar a Usuario
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
        <div className="relative z-10 bg-white rounded-lg shadow-md border-t-4 border-blue-500 p-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-600 flex items-center gap-2">
            <ChevronRight className="w-5 h-5" />
            Información de Roles
          </h2>
          <div className="space-y-4 divide-y divide-yellow-100">
            <div className="flex items-start pt-2">
              <div className="flex-shrink-0 mr-4">
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                  admin
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                  Los administradores (como Apu Nahasapeemapetilon) tienen acceso completo para gestionar usuarios, productos y otras tareas administrativas de la tienda.
                </p>
              </div>
            </div>
            <div className="flex items-start pt-4">
              <div className="flex-shrink-0 mr-4">
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                  user
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                  Los usuarios regulares (como Homer Simpson) tienen acceso limitado al sistema basado en los permisos asignados. Pueden comprar, pero no alterar precios ni administrar la tienda.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Note */}
        <div className="relative z-10 mt-6 text-center text-xs text-gray-500 bg-white p-3 rounded-lg">
          <p>Sistema de Gestión Kwik-E-Mart © 2025 | "Donde los precios exprimen tu billetera"</p>
        </div>
      </div>
    </div>
  );
}