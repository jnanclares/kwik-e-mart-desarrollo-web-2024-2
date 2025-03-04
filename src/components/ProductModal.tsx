import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../models/products";
import { X, Star, ShoppingCart, AlertTriangle, MinusCircle, PlusCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { STORE_CONFIG } from "../config/storeConfig";
import { notificationService } from "@/services/notificationService";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { dispatch, state } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  // Referencia para rastrear cuando se hace clic en el botón
  const addToCartClicked = useRef(false);
  // Referencia para rastrear cantidad previa en el carrito
  const prevQuantityRef = useRef<number>(0);
  // Referencia para recordar la cantidad que se intentó añadir
  const attemptedQuantityRef = useRef<number>(1);

  if (!product) return null;

  // Verificar cantidad en carrito para este producto
  const itemInCart = state.items.find(item => item.id === product.id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;
  
  // Efecto para mostrar notificaciones cuando se añade al carrito
  useEffect(() => {
    if (!product) return;
    
    // Verificar si prevQuantity está inicializado y se hizo clic en el botón
    if (addToCartClicked.current) {
      // Si la cantidad en el carrito aumentó
      if (quantityInCart > prevQuantityRef.current) {
        const addedQuantity = quantityInCart - prevQuantityRef.current;
        
        if (addedQuantity === 1) {
          notificationService.notify(`¡${product.name} añadido al carrito!`, "success");
        } else {
          notificationService.notify(`¡${addedQuantity} unidades de ${product.name} añadidas al carrito!`, "success");
        }
      }
      // Resetear la bandera de clic
      addToCartClicked.current = false;
    }
    
    // Actualizar la cantidad previa
    prevQuantityRef.current = quantityInCart;
  }, [quantityInCart, product, notificationService.notify]);
  
  // Verificar si hay stock disponible
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= STORE_CONFIG.lowStockThreshold;
  
  // Calcular la cantidad máxima que se puede añadir al carrito
  const maxAddQuantity = isOutOfStock ? 0 : Math.min(
    product.stock - quantityInCart,
    STORE_CONFIG.maxPurchaseLimit - quantityInCart
  );

  // Verificar si se puede añadir al carrito
  const canAddToCart = maxAddQuantity > 0;

  // Función para añadir al carrito
  const addToCart = () => {
    if (canAddToCart && quantity > 0) {
      // Guardar la cantidad que se intentó añadir
      attemptedQuantityRef.current = quantity;
      // Marcar que se hizo clic en el botón
      addToCartClicked.current = true;
      
      dispatch({ 
        type: "ADD_ITEM", 
        payload: { ...product, quantity: quantity }
      });
      
      onClose();
    } else {
      // Mostrar mensaje de error inmediatamente
      if (isOutOfStock) {
        notificationService.notify(`Lo sentimos, ${product.name} está agotado.`, "error");
      } else if (quantityInCart >= STORE_CONFIG.maxPurchaseLimit) {
        notificationService.notify(
          `Has alcanzado el límite máximo de ${STORE_CONFIG.maxPurchaseLimit} unidades para ${product.name}.`, 
          "warning"
        );
      } else {
        notificationService.notify(`No hay suficiente stock de ${product.name}.`, "warning");
      }
    }
  };

  // Controlar cantidad
  const incrementQuantity = () => {
    if (quantity < maxAddQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Función para asegurarse de que salePrice es un número
  const salePrice = product.salePrice ?? product.price;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg w-full max-w-md relative overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()} // Evita que el modal se cierre al hacer clic en su interior
        >
          {/* Contenedor de la imagen con tamaño controlado */}
          <div className="relative h-64">
            <motion.img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-md font-bold transform rotate-12">
                  ¡Agotado!
                </div>
              </div>
            )}
            
            {/* Botón de Cerrar reposicionado y con fondo semitransparente */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-white bg-opacity-70 rounded-full p-1 text-gray-700 hover:text-gray-900 hover:bg-white hover:bg-opacity-100 transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Información del Producto */}
          <motion.div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

            {/* Categoría */}
            <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
              {product.category}
            </span>

            {/* Descripción */}
            <p className="text-gray-600 my-4">{product.description}</p>

            {/* Calificación con estrellas */}
            <div className="flex justify-center items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < product.rating ? "text-[#FED41D] fill-current" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600">
                ({product.reviews.length} {product.reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Información de Stock */}
            <div className="mb-3">
              {isOutOfStock ? (
                <div className="text-red-500 font-medium flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 mr-1" />
                  <span>Producto agotado</span>
                </div>
              ) : isLowStock ? (
                <div className="text-orange-500 font-medium">
                  Stock disponible: {product.stock} unidades (¡Pocas unidades!)
                </div>
              ) : (
                <div className="text-green-600 font-medium">
                  Stock disponible: {product.stock} unidades
                </div>
              )}
              
              {/* Mensaje de cantidad en carrito */}
              {quantityInCart > 0 && (
                <div className="text-blue-600 text-sm mt-1">
                  Ya tienes {quantityInCart} {quantityInCart === 1 ? 'unidad' : 'unidades'} en tu carrito
                </div>
              )}
            </div>

            {/* Precio */}
            <div className="flex justify-center items-center mb-4">
              {product.onSale ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-xl">
                    ${salePrice.toFixed(2)}
                  </span>
                  <span className="text-gray-500 line-through text-lg">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-xl">${Number(product.price).toFixed(2)}</span>
              )}
            </div>

            {/* Selector de cantidad */}
            {canAddToCart && (
              <div className="flex items-center justify-center gap-3 mb-4">
                <button 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className={`${quantity <= 1 ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  <MinusCircle className="h-6 w-6" />
                </button>
                
                <span className="text-xl font-bold w-8">{quantity}</span>
                
                <button 
                  onClick={incrementQuantity}
                  disabled={quantity >= maxAddQuantity}
                  className={`${quantity >= maxAddQuantity ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  <PlusCircle className="h-6 w-6" />
                </button>
              </div>
            )}

            {/* Botón de Añadir al Carrito */}
            <motion.button
              className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition mb-3 ${
                canAddToCart 
                  ? 'bg-[#2D7337] text-white hover:bg-[#236129]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              whileHover={canAddToCart ? { scale: 1.05 } : {}}
              whileTap={canAddToCart ? { scale: 0.95 } : {}}
              onClick={addToCart}
              disabled={!canAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>
                {isOutOfStock 
                  ? 'Producto Agotado' 
                  : quantityInCart >= STORE_CONFIG.maxPurchaseLimit
                    ? 'Límite máximo alcanzado'
                    : `Añadir ${quantity > 1 ? `(${quantity})` : ''} al Carrito`
                }
              </span>
            </motion.button>

            {/* Botón de Cerrar */}
            <motion.button
              className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
            >
              Cerrar
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};