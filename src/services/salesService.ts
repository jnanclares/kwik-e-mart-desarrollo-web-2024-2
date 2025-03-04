// src/services/salesService.ts
import { 
    collection, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    Timestamp, 
    addDoc,
  } from 'firebase/firestore';
  import { db } from '@/config/firebaseConfig';
import { SalesSummary, SaleTransaction } from '@/models/sale';

  
  // Función para obtener todas las transacciones
  export const getAllTransactions = async (): Promise<SaleTransaction[]> => {
    try {
      const q = query(
        collection(db, 'transactions'),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SaleTransaction[];
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      throw error;
    }
  };
  
  // Función para obtener transacciones dentro de un rango de fechas
  export const getTransactionsByDateRange = async (
    startDate: Date,
    endDate: Date
  ): Promise<SaleTransaction[]> => {
    try {
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);
      
      const q = query(
        collection(db, 'transactions'),
        where('timestamp', '>=', startTimestamp),
        where('timestamp', '<=', endTimestamp),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SaleTransaction[];
    } catch (error) {
      console.error('Error al obtener transacciones por rango de fechas:', error);
      throw error;
    }
  };
  
  // Función para crear una nueva transacción
  export const createTransaction = async (transaction: Omit<SaleTransaction, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'transactions'), transaction);
      return docRef.id;
    } catch (error) {
      console.error('Error al crear transacción:', error);
      throw error;
    }
  };
  
  // Función para generar un resumen de ventas
  export const generateSalesSummary = async (
    transactions: SaleTransaction[],
    daysToInclude = 7
  ): Promise<SalesSummary> => {
    // Inicializamos la estructura del resumen
    const summary: SalesSummary = {
      totalSales: transactions.length,
      totalRevenue: 0,
      averageOrderValue: 0,
      recentTransactions: [],
      dailySales: [],
      topProducts: [],
      salesByPaymentMethod: []
    };
  
    // Si no hay transacciones, devolvemos el resumen vacío
    if (transactions.length === 0) {
      return summary;
    }
  
    // Calculamos el total de ingresos
    summary.totalRevenue = transactions.reduce((total, transaction) => {
      return total + transaction.totalAmount;
    }, 0);
  
    // Calculamos el valor promedio de pedido
    summary.averageOrderValue = summary.totalRevenue / summary.totalSales;
  
    // Obtenemos las transacciones más recientes (máximo 5)
    summary.recentTransactions = transactions.slice(0, 5);
  
    // Preparamos datos para ventas diarias
    const dailySalesMap = new Map<string, { sales: number; revenue: number }>();
    
    // Definimos el rango de fechas para incluir en el gráfico
    const today = new Date();
    const dates = Array.from({ length: daysToInclude }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (daysToInclude - 1 - i));
      return date;
    });
    
    // Inicializamos el mapa con todas las fechas en el rango
    dates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      dailySalesMap.set(dateStr, { sales: 0, revenue: 0 });
    });
    
    // Agregamos los datos de transacciones
    transactions.forEach(transaction => {
      const date = transaction.timestamp.toDate();
      const dateStr = date.toISOString().split('T')[0];
      
      if (dailySalesMap.has(dateStr)) {
        const currentData = dailySalesMap.get(dateStr)!;
        dailySalesMap.set(dateStr, {
          sales: currentData.sales + 1,
          revenue: currentData.revenue + transaction.totalAmount
        });
      }
    });
    
    // Convertimos el mapa en un array para la respuesta
    summary.dailySales = Array.from(dailySalesMap.entries()).map(([date, data]) => ({
      date,
      sales: data.sales,
      revenue: data.revenue
    }));
    
    // Ordenamos por fecha
    summary.dailySales.sort((a, b) => a.date.localeCompare(b.date));
  
    // Calculamos los productos más vendidos
    const productsMap = new Map<string, { 
      productName: string; 
      quantity: number; 
      revenue: number 
    }>();
    
    transactions.forEach(transaction => {
      transaction.productsList.forEach(product => {
        const productTotal = product.price * product.quantity;
        
        if (productsMap.has(product.productId)) {
          const currentData = productsMap.get(product.productId)!;
          productsMap.set(product.productId, {
            productName: product.productName,
            quantity: currentData.quantity + product.quantity,
            revenue: currentData.revenue + productTotal
          });
        } else {
          productsMap.set(product.productId, {
            productName: product.productName,
            quantity: product.quantity,
            revenue: productTotal
          });
        }
      });
    });
    
    summary.topProducts = Array.from(productsMap.entries())
      .map(([productId, data]) => ({
        productId,
        productName: data.productName,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  
    // Calculamos las ventas por método de pago
    const paymentMethodsMap = new Map<string, { count: number; revenue: number }>();
    
    transactions.forEach(transaction => {
      const method = transaction.paymentMethod;
      
      if (paymentMethodsMap.has(method)) {
        const currentData = paymentMethodsMap.get(method)!;
        paymentMethodsMap.set(method, {
          count: currentData.count + 1,
          revenue: currentData.revenue + transaction.totalAmount
        });
      } else {
        paymentMethodsMap.set(method, {
          count: 1,
          revenue: transaction.totalAmount
        });
      }
    });
    
    summary.salesByPaymentMethod = Array.from(paymentMethodsMap.entries())
      .map(([method, data]) => ({
        method,
        count: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue);
  
    return summary;
  };
  
  // Función para generar datos de prueba (para desarrollo)
  export const generateMockTransactions = (count: number = 50): SaleTransaction[] => {
    const paymentMethods = ["Efectivo", "Tarjeta de crédito", "Tarjeta de débito", "Transferencia"];
    const productNames = [
      "Dona Rosada", "Squishee de Cereza", "Cerveza Duff", 
      "Chicles Radioactivos", "Revistas Itchy & Scratchy",
      "Hot Dogs", "Cereales Krusty-O's", "Buzz Cola",
      "Leche Vencida", "Chocolates KitKat"
    ];
    
    const mockTransactions: SaleTransaction[] = [];
    
    // Crear transacciones para los últimos 14 días
    for (let i = 0; i < count; i++) {
      const productCount = Math.floor(Math.random() * 5) + 1;
      const productsList = [];
      let totalAmount = 0;
      
      // Generar productos para esta transacción
      for (let j = 0; j < productCount; j++) {
        const productIndex = Math.floor(Math.random() * productNames.length);
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = Math.floor(Math.random() * 50) + 10;
        
        productsList.push({
          productId: `prod-${productIndex}`,
          productName: productNames[productIndex],
          price: price,
          quantity: quantity
        });
        
        totalAmount += price * quantity;
      }
      
      // Generar fecha aleatoria en los últimos 14 días
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 14));
      
      mockTransactions.push({
        userId: `user-${Math.floor(Math.random() * 10)}`,
        userName: ["Homer Simpson", "Marge Simpson", "Apu Nahasapeemapetilon", "Moe Szyslak"][Math.floor(Math.random() * 4)],
        userEmail: `user${i}@springfield.com`,
        productsList: productsList,
        totalAmount: totalAmount,
        timestamp: Timestamp.fromDate(date),
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        status: "completed"
      });
    }
    
    // Ordenar por fecha, más reciente primero
    mockTransactions.sort((a, b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime());
    
    return mockTransactions;
  };