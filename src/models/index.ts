export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'beverages' | 'snacks' | 'essentials';
  image: string;
  rating: number;
  reviews: {
    userId: string;
    username: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  description: string;
  featured?: boolean;
  onSale?: boolean;
  salePrice?: number;
  dailyDeal?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  securityPhrase?: string;
  purchaseHistory: {
    date: string;
    items: CartItem[];
    total: number;
  }[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Sale {
  id: string;
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  date: Date;
}

export interface Offer {
  id: string;
  productId: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
}