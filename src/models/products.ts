/**
 * Represents a product in the store
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