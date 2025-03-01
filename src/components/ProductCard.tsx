import React, { useState } from "react";
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../models/products';
import { useCart, CartAction } from '../context/CartContext';
import { ReviewModal } from "./ReviewModal"; // Import Review Modal


interface ProductCardProps {
  product: Product;
  dispatch: React.Dispatch<CartAction>;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();
  const [selectedProductForReviews, setSelectedProductForReviews] = useState<Product | null>(null);

  // 🔹 Ensure salePrice is a number before calculations
  const salePrice = product.salePrice ?? product.price; // Use original price if salePrice is undefined

  // 🔹 Calculate the discount percentage safely
  const discountPercentage =
    product.onSale && product.salePrice !== undefined
      ? Math.round(((product.price - salePrice) / product.price) * 100)
      : 0;

    const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      : 0;
  

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />

          {/* 🔹 Sale Badge with Discount Percentage */}
          {product.onSale && (
            <div className="absolute top-2 right-2 bg-[#CC0000] text-white px-2 py-1 rounded-full text-sm font-bold animate-pulse">
              -{discountPercentage}%
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
                  className={`h-4 w-4 ${i < Math.round(averageRating) ? 'text-[#FED41D] fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span 
              className="text-sm text-gray-600 ml-2 cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation(); // Prevent opening the product modal
                setSelectedProductForReviews(product);
              }}
            >
              ({product.reviews.length} {product.reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {product.onSale ? (
                <div className="flex items-center gap-2">
                  <span className="text-[#38a169] font-bold">${salePrice.toFixed(2)}</span>
                  <span className="text-gray-500 line-through text-sm">${product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="font-bold">${Number(product.price).toFixed(2)}</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                dispatch({ type: "ADD_ITEM", payload: product });
              }}
              className="add-to-cart-button bg-[#2D7337] text-white px-3 py-2 rounded-full flex items-center gap-2 hover:bg-[#236129] transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Ensure Review Modal is rendered */}
      {selectedProductForReviews && (
        <ReviewModal 
          product={selectedProductForReviews} 
          onClose={() => setSelectedProductForReviews(null)} 
        />
      )}
    </>
  );
};
