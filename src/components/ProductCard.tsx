import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../models';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.onSale && (
          <div className="absolute top-2 right-2 bg-[#CC0000] text-white px-2 py-1 rounded-full text-sm font-bold">
            Sale!
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < product.rating
                    ? 'text-[#FED41D] fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {product.onSale ? (
              <div className="flex items-center gap-2">
                <span className="text-[#CC0000] font-bold">
                  ${product.salePrice?.toFixed(2)}
                </span>
                <span className="text-gray-500 line-through text-sm">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
            className="bg-[#2D7337] text-white px-3 py-2 rounded-full flex items-center gap-2 hover:bg-[#236129] transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};