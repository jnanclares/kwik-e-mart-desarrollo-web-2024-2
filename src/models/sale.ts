import { Timestamp } from 'firebase/firestore';

export interface SaleTransaction {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  productsList: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  timestamp: Timestamp;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface SalesSummary {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  recentTransactions: SaleTransaction[];
  dailySales: {
    date: string;
    sales: number;
    revenue: number;
  }[];
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
  salesByPaymentMethod: {
    method: string;
    count: number;
    revenue: number;
  }[];
}