import { Product } from './products';

/**
 * Represents an item in the shopping cart
 */
export interface CartItem extends Product {
  quantity: number;
}