'use client';

import React, { createContext, useEffect, useContext, useReducer } from "react";
import { Product } from "../models/products";
import { CartItem } from "../models/cart";
import { STORE_CONFIG } from "../config/storeConfig";
import { notificationService } from "@/services/notificationService";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: Product | (Product & { quantity?: number }) }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "TOGGLE_CART" }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  isOpen: false,
};

// Helper para verificar si se puede añadir más unidades según stock y configuración global
const canAddMoreToCart = (
  product: Product,
  currentQuantity: number,
  requestedQuantity: number = 1
): boolean => {
  // Verifica si el producto tiene stock
  if (product.stock <= 0) return false;
  
  // Verifica si hay suficiente stock para la cantidad solicitada
  if (currentQuantity + requestedQuantity > product.stock) return false;
  
  // Verifica si se excedería el límite máximo global
  if (currentQuantity + requestedQuantity > STORE_CONFIG.maxPurchaseLimit) {
    return false;
  }
  
  return true;
};

// Componente wrapper que proporciona el contexto del carrito y usa el hook de toast
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Creamos un cartReducer que usa el hook de toast
  const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
      case "ADD_ITEM": {
        const product = action.payload;
        const existingItem = state.items.find(item => item.id === product.id);
        
        // Determinar la cantidad a añadir
        const quantityToAdd = 'quantity' in product && product.quantity ? product.quantity : 1;
        
        if (existingItem) {
          // El producto ya está en el carrito, verificar stock
          if (!canAddMoreToCart(product, existingItem.quantity, quantityToAdd)) {
            // No se puede añadir más, ya se mostrará la alerta en el componente
            return state;
          }
          
          // Actualizar cantidad
          return {
            ...state,
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantityToAdd }
                : item
            ),
          };
        } else {
          // Nuevo producto, verificar stock
          if (!canAddMoreToCart(product, 0, quantityToAdd)) {
            // No hay stock suficiente, ya se mostrará la alerta en el componente
            return state;
          }
          
          // Añadir al carrito
          return {
            ...state,
            items: [...state.items, { ...product, quantity: quantityToAdd }],
          };
        }
      }
      
      case "REMOVE_ITEM": {
        const productId = action.payload;
        const productToRemove = state.items.find(item => item.id === productId);
        
        // Buscamos el producto para mostrar la notificación
        if (productToRemove) {
          notificationService.notify(`${productToRemove.name} eliminado del carrito`, "warning");
        }
        
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId),
        };
      }
      
      case "UPDATE_QUANTITY": {
        const { id, quantity } = action.payload;
        const item = state.items.find(item => item.id === id);
        
        if (!item) return state;
        
        // Si la cantidad es 0 o negativa, eliminar el producto
        if (quantity <= 0) {
          notificationService.notify(`${item.name} eliminado del carrito`, "warning");
          
          return {
            ...state,
            items: state.items.filter(item => item.id !== id),
          };
        }
        
        // Verificar si la nueva cantidad respeta el stock
        if (quantity > item.stock) {
          notificationService.notify(`No puedes añadir más de ${item.stock} unidades de "${item.name}" (stock disponible).`, "warning");
          
          // Establecer la cantidad al máximo disponible
          return {
            ...state,
            items: state.items.map(item =>
              item.id === id ? { ...item, quantity: item.stock } : item
            ),
          };
        }
        
        // Verificar límite máximo global
        if (quantity > STORE_CONFIG.maxPurchaseLimit) {
          notificationService.notify(`No puedes comprar más de ${STORE_CONFIG.maxPurchaseLimit} unidades de un mismo producto.`, "warning");
          
          // Establecer la cantidad al límite máximo
          return {
            ...state,
            items: state.items.map(item =>
              item.id === id ? { ...item, quantity: STORE_CONFIG.maxPurchaseLimit } : item
            ),
          };
        }
        
        // Validamos si está aumentando o disminuyendo la cantidad
        const currentItem = state.items.find(item => item.id === id);
        if (currentItem) {
          if (quantity > currentItem.quantity) {
            notificationService.notify(`Cantidad de ${item.name} aumentada a ${quantity}`, "success");
          } else {
            notificationService.notify(`Cantidad de ${item.name} reducida a ${quantity}`, "warning");
          }
        }
        
        // Actualizar cantidad normalmente
        return {
          ...state,
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        };
      }
      
      case "TOGGLE_CART":
        return {
          ...state,
          isOpen: !state.isOpen,
        };
        
      case "CLEAR_CART":
        // Solo mostramos notificación si había elementos
        if (state.items.length > 0) {
          notificationService.notify("Se ha vaciado el carrito", "warning");
        }
        
        return {
          ...state,
          items: [],
          isOpen: false,
        };
        
      default:
        return state;
    }
  };
  
  const [state, dispatch] = useReducer(cartReducer, initialState, initializer);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cartState", JSON.stringify(state));
      } catch (error) {
        console.error("Error saving cart state:", error);
      }
    }
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Inicializador para cargar el estado del carrito desde localStorage
const initializer = (initialState: CartState) => {
  if (typeof window !== "undefined") {
    const storedState = localStorage.getItem("cartState");
    if (storedState) {
      try {
        return JSON.parse(storedState);
      } catch (error) {
        console.error("Error parsing cart state:", error);
      }
    }
  }
  return initialState;
};

// Contexto del carrito
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

// Hook para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};