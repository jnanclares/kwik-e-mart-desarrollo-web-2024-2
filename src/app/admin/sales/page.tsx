'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  DollarSign, 
  ShoppingCart, 
  Calendar, 
  RefreshCw, 
  Package, 
  CreditCard, 
  Zap, 
  ChevronRight, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { 
  getTransactionsByDateRange, 
  generateSalesSummary,
} from '@/services/salesService';
import { Timestamp } from 'firebase/firestore';
import { SalesSummary, SaleTransaction } from '@/models/sale';

// Colores temáticos de Kwik-E-Mart y Los Simpson
const COLORS = ['#FCD34D', '#4ADE80', '#FB923C', '#60A5FA', '#F472B6', '#A78BFA'];

export default function SalesAnalysis() {
  const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days'>('7days');
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<SalesSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSalesData();
  }, [dateRange]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Siempre obtenemos datos reales de Firebase
      const endDate = new Date();
      let startDate = new Date();
      
      if (dateRange === '7days') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (dateRange === '30days') {
        startDate.setDate(endDate.getDate() - 30);
      } else if (dateRange === '90days') {
        startDate.setDate(endDate.getDate() - 90);
      }
      
      try {
        const transactions = await getTransactionsByDateRange(startDate, endDate);
        console.log('Datos obtenidos de Firebase:', transactions.length, 'transacciones');
        
        if (transactions.length === 0) {
          setError('No se encontraron transacciones en el período seleccionado. Verifica que existan datos en Firebase.');
          setSalesData({
            totalSales: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            recentTransactions: [],
            dailySales: [],
            topProducts: [],
            salesByPaymentMethod: []
          });
        } else {
          // Procesamos los datos para el resumen
          const daysToShow = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
          const summary = await generateSalesSummary(transactions, daysToShow);
          setSalesData(summary);
        }
      } catch (firebaseError) {
        console.error('Error al obtener datos de Firebase:', firebaseError);
        setError('Error al obtener datos de Firebase. Verifica la conexión, permisos, o si la colección "transactions" existe.');
        setSalesData({
          totalSales: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          recentTransactions: [],
          dailySales: [],
          topProducts: [],
          salesByPaymentMethod: []
        });
      }
    } catch (error) {
      console.error('Error al obtener datos de ventas:', error);
      setError('Error al procesar los datos de ventas. Intenta nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Formatear número a precio en pesos
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
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
              Análisis de Ventas
              <span className="block text-lg font-normal italic">
                ¡Donde los números son tan dulces como nuestras donas!
              </span>
            </h1>
          </div>
          <button 
            onClick={fetchSalesData} 
            className="bg-yellow-400 py-2 px-6 rounded-lg text-red-600 font-bold shadow-md transform rotate-3 hover:rotate-0 transition-transform flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar Datos
          </button>
        </div>
        
        {/* Apu Quote */}
        <div className="relative z-10 bg-purple-100 p-3 mb-3 rounded-lg border-l-4 border-purple-500 shadow-sm">
          <p className="text-sm italic text-purple-800">
            "En Kwik-E-Mart sabemos que lo que no se mide, no se puede cobrar más caro. Analiza tus ventas y encuentra los productos que puedes sobrevalorar, ¡digo, valorar adecuadamente!"
          </p>
        </div>
        
        {/* Selectores de período */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setDateRange('7days')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              dateRange === '7days' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Últimos 7 días
          </button>
          <button
            onClick={() => setDateRange('30days')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              dateRange === '30days' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Últimos 30 días
          </button>
          <button
            onClick={() => setDateRange('90days')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              dateRange === '90days' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Últimos 90 días
          </button>
        </div>
        
        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center p-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
            <p className="ml-4 text-yellow-600 italic">Cargando datos... ¡Tan rápido como una dona recién hecha!</p>
          </div>
        ) : (
          <>
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-500 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-green-700 text-sm font-medium">Ventas Totales</p>
                    <h3 className="text-3xl font-bold text-green-800">{salesData?.totalSales || 0}</h3>
                  </div>
                  <div className="bg-green-500 p-3 rounded-full text-white">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-green-600 text-xs mt-2">Transacciones completadas</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-500 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Ingresos Totales</p>
                    <h3 className="text-3xl font-bold text-blue-800">{formatCurrency(salesData?.totalRevenue || 0)}</h3>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-full text-white">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-blue-600 text-xs mt-2">Valor total de ventas</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border-l-4 border-yellow-500 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-yellow-700 text-sm font-medium">Ticket Promedio</p>
                    <h3 className="text-3xl font-bold text-yellow-800">{formatCurrency(salesData?.averageOrderValue || 0)}</h3>
                  </div>
                  <div className="bg-yellow-500 p-3 rounded-full text-white">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-yellow-600 text-xs mt-2">Valor promedio por transacción</p>
              </div>
            </div>
            
            {/* Gráficos - Primera fila */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Gráfico de ventas diarias */}
              <div className="bg-white rounded-lg shadow-md border-t-4 border-blue-500 p-4">
                <h2 className="text-lg font-semibold mb-4 text-blue-600 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  Ventas Diarias
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData?.dailySales || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        yAxisId="left" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}`}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'sales') return [`${value} ventas`, 'Cantidad'];
                          if (name === 'revenue') return [formatCurrency(value as number), 'Ingresos'];
                          return [value, name];
                        }}
                        labelFormatter={label => `Fecha: ${formatDate(label as string)}`}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="sales" 
                        name="Cantidad" 
                        stroke="#4F46E5" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="revenue" 
                        name="Ingresos" 
                        stroke="#F59E0B" 
                        activeDot={{ r: 6 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Gráfico de productos top */}
              <div className="bg-white rounded-lg shadow-md border-t-4 border-green-500 p-4">
                <h2 className="text-lg font-semibold mb-4 text-green-600 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  Productos Más Vendidos
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData?.topProducts || []}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="productName" 
                        tick={{ fontSize: 12 }}
                        width={150}
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === 'quantity') return [`${value} unidades`, 'Cantidad'];
                          if (name === 'revenue') return [formatCurrency(value as number), 'Ingresos'];
                          return [value, name];
                        }}
                        labelFormatter={label => `Producto: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="quantity" 
                        name="Cantidad" 
                        fill="#60A5FA" 
                        barSize={20}
                      />
                      <Bar 
                        dataKey="revenue" 
                        name="Ingresos" 
                        fill="#34D399" 
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Gráficos - Segunda fila */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Gráfico de métodos de pago */}
              <div className="bg-white rounded-lg shadow-md border-t-4 border-purple-500 p-4">
                <h2 className="text-lg font-semibold mb-4 text-purple-600 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  Ventas por Método de Pago
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesData?.salesByPaymentMethod || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                        nameKey="method"
                      >
                        {salesData?.salesByPaymentMethod.map((entry:any, index:number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => {
                          return [formatCurrency(value as number), props.payload.method];
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Transacciones recientes */}
              <div className="bg-white rounded-lg shadow-md border-t-4 border-orange-500 p-4 lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4 text-orange-600 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  Transacciones Recientes
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-orange-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Fecha</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Cliente</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Productos</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Método</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {salesData?.recentTransactions && salesData.recentTransactions.length > 0 ? (
                        salesData.recentTransactions.map((transaction: SaleTransaction, index: number) => (
                          <tr key={transaction.id || index} className="hover:bg-orange-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                              {transaction.timestamp.toDate().toLocaleDateString('es-AR')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{transaction.userName}</div>
                              <div className="text-xs text-gray-500">{transaction.userEmail}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {transaction.productsList.length} productos
                              <span className="text-xs text-gray-500 block">
                                {transaction.productsList.slice(0, 2).map((p: { productName: any; }) => p.productName).join(', ')}
                                {transaction.productsList.length > 2 ? ', ...' : ''}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                                {transaction.paymentMethod}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                              {formatCurrency(transaction.totalAmount)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                            No hay transacciones recientes
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Nota informativa sobre el origen de los datos - sin banners persistentes */}
            {!loading && salesData && salesData.totalSales === 0 && (
              <div className="text-xs text-gray-500 italic text-center mb-4">
                No se encontraron transacciones en Firebase para el período seleccionado.
              </div>
            )}
          </>
        )}
        
        {/* Footer Note */}
        <div className="relative z-10 mt-6 text-center text-xs text-gray-500 bg-white p-3 rounded-lg">
          <p>Sistema de Gestión Kwik-E-Mart © 2025 | "Nuestros precios le harán decir ¡Ay, caramba!"</p>
        </div>
      </div>
    </div>
  );
}