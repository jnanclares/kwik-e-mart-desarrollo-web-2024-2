/**
 * Represents a completed sale transaction
 */
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