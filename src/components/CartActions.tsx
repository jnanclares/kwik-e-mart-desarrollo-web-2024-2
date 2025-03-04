import { useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { notificationService } from '@/services/notificationService';

export const CartActions = () => {
    const { state, dispatch } = useCart();
    const clearCartRequestedRef = useRef(false);
    const previousItemCountRef = useRef(state.items.length);
  
    // Efecto para manejar la notificación después de vaciar el carrito
    useEffect(() => {
      // Si se solicitó vaciar el carrito y ahora está vacío
      if (clearCartRequestedRef.current && state.items.length === 0 && previousItemCountRef.current > 0) {
        notificationService.notify("Se ha vaciado el carrito", "warning");
        clearCartRequestedRef.current = false;
      }
      
      // Actualizar la referencia de la cantidad de items
      previousItemCountRef.current = state.items.length;
    }, [state.items.length, notificationService.notify]);
  
    const handleClearCart = () => {
      if (state.items.length > 0) {
        clearCartRequestedRef.current = true;
        dispatch({ type: 'CLEAR_CART' });
      }
    };
  
    return { handleClearCart };
};