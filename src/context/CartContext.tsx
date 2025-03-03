'use client';

import React, { createContext, useEffect, useContext, useReducer, useRef } from "react";
import { Product } from "../models/products";
import { CartItem } from "../models/cart";
import { STORE_CONFIG } from "../config/storeConfig";
import { notificationService } from "@/services/notificationService";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  // Añadimos esta propiedad para rastrear acciones que generarán notificaciones
  lastAction: {
    type: string;
    payload?: any;
  } | null;
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
  lastAction: null
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
  // Referencia para almacenar el estado anterior
  const prevItemsRef = useRef<CartItem[]>([]);
  
  // Creamos un cartReducer que NO usa notificationService directamente
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
            // No se puede añadir más
            return {
              ...state,
              lastAction: {
                type: "ADD_ITEM_FAILED",
                payload: { product, reason: "stock" }
              }
            };
          }
          
          // Actualizar cantidad
          return {
            ...state,
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantityToAdd }
                : item
            ),
            lastAction: {
              type: "ADD_ITEM_SUCCESS",
              payload: { product, quantity: quantityToAdd }
            }
          };
        } else {
          // Nuevo producto, verificar stock
          if (!canAddMoreToCart(product, 0, quantityToAdd)) {
            // No hay stock suficiente
            return {
              ...state,
              lastAction: {
                type: "ADD_ITEM_FAILED",
                payload: { product, reason: "stock" }
              }
            };
          }
          
          // Añadir al carrito
          return {
            ...state,
            items: [...state.items, { ...product, quantity: quantityToAdd }],
            lastAction: {
              type: "ADD_ITEM_SUCCESS",
              payload: { product, quantity: quantityToAdd }
            }
          };
        }
      }
      
      case "REMOVE_ITEM": {
        const productId = action.payload;
        const productToRemove = state.items.find(item => item.id === productId);
        
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId),
          lastAction: {
            type: "REMOVE_ITEM",
            payload: productToRemove
          }
        };
      }
      
      case "UPDATE_QUANTITY": {
        const { id, quantity } = action.payload;
        const item = state.items.find(item => item.id === id);
        
        if (!item) return state;
        
        // Si la cantidad es 0 o negativa, eliminar el producto
        if (quantity <= 0) {
          return {
            ...state,
            items: state.items.filter(item => item.id !== id),
            lastAction: {
              type: "REMOVE_ITEM",
              payload: item
            }
          };
        }
        
        // Verificar si la nueva cantidad respeta el stock
        if (quantity > item.stock) {
          return {
            ...state,
            items: state.items.map(item =>
              item.id === id ? { ...item, quantity: item.stock } : item
            ),
            lastAction: {
              type: "QUANTITY_LIMIT_STOCK",
              payload: { item, requestedQuantity: quantity }
            }
          };
        }
        
        // Verificar límite máximo global
        if (quantity > STORE_CONFIG.maxPurchaseLimit) {
          return {
            ...state,
            items: state.items.map(item =>
              item.id === id ? { ...item, quantity: STORE_CONFIG.maxPurchaseLimit } : item
            ),
            lastAction: {
              type: "QUANTITY_LIMIT_MAX",
              payload: { item, requestedQuantity: quantity }
            }
          };
        }
        
        // La acción en lastAction indicará si aumentó o disminuyó
        const actionType = quantity > item.quantity ? "QUANTITY_INCREASED" : "QUANTITY_DECREASED";
        
        // Actualizar cantidad normalmente
        return {
          ...state,
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
          lastAction: {
            type: actionType,
            payload: { item, newQuantity: quantity, oldQuantity: item.quantity }
          }
        };
      }
      
      case "TOGGLE_CART":
        return {
          ...state,
          isOpen: !state.isOpen,
          lastAction: {
            type: "TOGGLE_CART"
          }
        };
        
      case "CLEAR_CART":
        return {
          ...state,
          items: [],
          isOpen: false,
          lastAction: {
            type: "CLEAR_CART",
            payload: { itemCount: state.items.length }
          }
        };
        
      default:
        return state;
    }
  };
  
  const [state, dispatch] = useReducer(cartReducer, initialState, initializer);

  // Guardar el carrito en localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cartState", JSON.stringify(state));
      } catch (error) {
        console.error("Error saving cart state:", error);
      }
    }
  }, [state]);

  // Efecto para manejar notificaciones basadas en lastAction
  useEffect(() => {
    if (!state.lastAction) return;

    const { type, payload } = state.lastAction;

    switch (type) {
      case "REMOVE_ITEM":
        if (payload) {
          notificationService.notify(`${payload.name} eliminado del carrito`, "warning");
        }
        break;
      
      case "CLEAR_CART":
        if (payload && payload.itemCount > 0) {
          notificationService.notify("Se ha vaciado el carrito", "warning");
        }
        break;
        
      case "QUANTITY_INCREASED":
        notificationService.notify(
          `Cantidad de ${payload.item.name} aumentada a ${payload.newQuantity}`, 
          "success"
        );
        break;
        
      case "QUANTITY_DECREASED":
        notificationService.notify(
          `Cantidad de ${payload.item.name} reducida a ${payload.newQuantity}`, 
          "warning"
        );
        break;
        
      case "QUANTITY_LIMIT_STOCK":
        notificationService.notify(
          `No puedes añadir más de ${payload.item.stock} unidades de "${payload.item.name}" (stock disponible).`, 
          "warning"
        );
        break;
        
      case "QUANTITY_LIMIT_MAX":
        notificationService.notify(
          `No puedes comprar más de ${STORE_CONFIG.maxPurchaseLimit} unidades de un mismo producto.`, 
          "warning"
        );
        break;
      
      // Añadir más casos según sea necesario
    }
  }, [state.lastAction]);

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
        const parsedState = JSON.parse(storedState);
        return {
          ...parsedState,
          lastAction: null // Asegurar que lastAction es null al inicializar
        };
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