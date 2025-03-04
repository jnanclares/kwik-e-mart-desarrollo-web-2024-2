import React, { useState, useRef, useEffect } from "react";
import { Star, ShoppingCart, AlertTriangle } from 'lucide-react';
import { Product } from '../models/products';
import { useCart, CartAction } from '../context/CartContext';
import { ReviewModal } from "./ReviewModal";
import { STORE_CONFIG, hasLowStock } from '../config/storeConfig';
import { notificationService } from "@/services/notificationService";

interface ProductCardProps {
  product: Product;
  dispatch: React.Dispatch<CartAction>;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch, state } = useCart();
  const [selectedProductForReviews, setSelectedProductForReviews] = useState<Product | null>(null);
  
  // Referencia para rastrear cuando se hace clic en el botón
  const addToCartClicked = useRef(false);
  // Referencia para rastrear cantidad previa en el carrito
  const prevQuantityRef = useRef(0);
  
  // Obtener cantidad actual en carrito
  const itemInCart = state.items.find(item => item.id === product.id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;
  
  // Efecto para mostrar notificaciones cuando se añade al carrito
  useEffect(() => {
    // Verificar si prevQuantity está inicializado
    if (prevQuantityRef.current !== undefined) {
      // Si la cantidad en el carrito aumentó Y se hizo clic en el botón
      if (quantityInCart > prevQuantityRef.current && addToCartClicked.current) {
        notificationService.notify(`¡${product.name} añadido al carrito!`, "success", 2500);
        // Resetear la bandera de clic
        addToCartClicked.current = false;
      }
    }
    
    // Actualizar la cantidad previa
    prevQuantityRef.current = quantityInCart;
  }, [quantityInCart, product.name, notificationService.notify]);
  
  // Ensure salePrice is a number before calculations
  const salePrice = product.salePrice ?? product.price;

  // Calculate the discount percentage safely
  const discountPercentage =
    product.onSale && product.salePrice !== undefined
      ? Math.round(((product.price - salePrice) / product.price) * 100)
      : 0;

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      : 0;
  
  // Usar la configuración global para verificar el stock
  const isOutOfStock = product.stock <= 0;
  const isLowStock = hasLowStock(product.stock);
  
  // Verificar si se excedería el límite máximo de compra usando la configuración global
  const reachedPurchaseLimit = quantityInCart >= STORE_CONFIG.maxPurchaseLimit;
  
  // Verificar si hay disponibilidad para añadir más al carrito
  const canAddToCart = !isOutOfStock && (product.stock > quantityInCart) && !reachedPurchaseLimit;

  // Función para añadir al carrito
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (canAddToCart) {
      // Marcar que se hizo clic en el botón
      addToCartClicked.current = true;
      dispatch({ type: "ADD_ITEM", payload: product });
    } else {
      // Mostrar mensaje de error inmediatamente
      if (isOutOfStock) {
        notificationService.notify(`Lo sentimos, ${product.name} está agotado.`, "error");
      } else if (reachedPurchaseLimit) {
        notificationService.notify(`No puedes añadir más unidades de ${product.name}. Has alcanzado el límite máximo.`, "warning");
      } else {
        notificationService.notify(`No hay suficiente stock de ${product.name}.`, "warning");
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-48 object-cover ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          />

          {/* Sale Badge with Discount Percentage */}
          {product.onSale && (
            <div className="absolute top-2 right-2 bg-[#CC0000] text-white px-2 py-1 rounded-full text-sm font-bold animate-pulse">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-md font-bold transform rotate-12">
                ¡Agotado!
              </div>
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
          
          {/* Stock information */}
          {isLowStock && !isOutOfStock && (
            <div className="flex items-center text-orange-500 text-sm mb-2">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>¡Pocas unidades! ({product.stock} disponible{product.stock !== 1 ? 's' : ''})</span>
            </div>
          )}
          
          {/* Max purchase limit warning - usando config global */}
          {product.stock > 0 && (
            <div className="text-xs text-gray-500 mb-2">
              Máximo {STORE_CONFIG.maxPurchaseLimit} unidades por compra
            </div>
          )}
          
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
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`add-to-cart-button px-3 py-2 rounded-full flex items-center gap-2 transition-colors
                ${canAddToCart 
                  ? 'bg-[#2D7337] text-white hover:bg-[#236129]' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{canAddToCart ? 'Add' : 'No disponible'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ensure Review Modal is rendered */}
      {selectedProductForReviews && (
        <ReviewModal 
          product={selectedProductForReviews} 
          onClose={() => setSelectedProductForReviews(null)} 
        />
      )}
    </>
  );
};