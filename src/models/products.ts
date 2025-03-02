/**
 * Represents a product in the Kwik-E-Mart store
 */
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
  // Solo el campo de stock
  stock: number;
}

/**
* Represents an offer or promotion for a product
*/
export interface Offer {
  id: string;
  productId: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
}

/**
* Interface for cart items that extends Product and includes quantity
*/
export interface CartItem extends Product {
  quantity: number;
}