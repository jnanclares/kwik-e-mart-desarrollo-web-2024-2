export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'beverages' | 'snacks' | 'essentials';
  image: string;
  rating: number;
  reviews: number;
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