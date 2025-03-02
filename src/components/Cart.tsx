import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_CONFIG } from '../config/storeConfig';
import Link from 'next/link';
import { notificationService } from '../services/notificationService';

export const Cart: React.FC = () => {
  const { state, dispatch } = useCart();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Referencias para rastrear acciones
  const itemActionsRef = useRef<{ id: string, type: 'remove' | 'increase' | 'decrease', name: string, prevQty?: number }[]>([]);
  const clearCartRequestedRef = useRef(false);
  const prevItemsCountRef = useRef(state.items.length);
  
  // Efecto para mostrar notificaciones cuando cambia el carrito
  useEffect(() => {
    // Manejo de vaciar carrito
    if (clearCartRequestedRef.current && state.items.length === 0 && prevItemsCountRef.current > 0) {
      notificationService.notify("Se ha vaciado el carrito", "warning");
      clearCartRequestedRef.current = false;
    }
    
    // Manejo de acciones en items individuales
    if (itemActionsRef.current.length > 0) {
      itemActionsRef.current.forEach(action => {
        const item = state.items.find(i => i.id === action.id);
        
        if (action.type === 'remove' && !item) {
          // El item ya no existe, se ha eliminado
          notificationService.notify(`${action.name} eliminado del carrito`, "warning");
        } else if (action.type === 'increase' && item && action.prevQty !== undefined) {
          // El item ha aumentado su cantidad
          if (item.quantity > action.prevQty) {
            notificationService.notify(`Cantidad de ${action.name} aumentada a ${item.quantity}`, "success");
          }
        } else if (action.type === 'decrease' && item && action.prevQty !== undefined) {
          // El item ha disminuido su cantidad
          if (item.quantity < action.prevQty) {
            notificationService.notify(`Cantidad de ${action.name} reducida a ${item.quantity}`, "warning");
          }
        }
      });
      
      // Limpiar las acciones procesadas
      itemActionsRef.current = [];
    }
    
    // Actualizar la referencia de la cantidad de items
    prevItemsCountRef.current = state.items.length;
  }, [state.items]);

  const handleRemoveItem = (itemId: string, itemName: string) => {
    // Registrar la acción de eliminar
    itemActionsRef.current.push({ id: itemId, type: 'remove', name: itemName });
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const handleUpdateQuantity = (id: string, quantity: number, currentQuantity: number, itemName: string) => {
    if (quantity <= 0) {
      // Registrar la acción de eliminar (porque la cantidad es 0)
      itemActionsRef.current.push({ id, type: 'remove', name: itemName });
      dispatch({ type: 'REMOVE_ITEM', payload: id });
      return;
    }
    
    const item = state.items.find(item => item.id === id);
    if (!item) return;
    
    // Determinar si es un aumento o disminución
    const actionType = quantity > currentQuantity ? 'increase' : 'decrease';
    
    // Validar límites
    if (quantity > item.stock) {
      quantity = item.stock;
      notificationService.notify(`No hay suficiente stock de ${itemName}`, "warning");
    }
    
    if (quantity > STORE_CONFIG.maxPurchaseLimit) {
      quantity = STORE_CONFIG.maxPurchaseLimit;
      notificationService.notify(`No puedes comprar más de ${STORE_CONFIG.maxPurchaseLimit} unidades de un producto`, "warning");
    }
    
    // Registrar la acción con la cantidad previa
    itemActionsRef.current.push({ 
      id, 
      type: actionType, 
      name: itemName,
      prevQty: currentQuantity
    });
    
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    if (state.items.length > 0) {
      clearCartRequestedRef.current = true;
      dispatch({ type: 'CLEAR_CART' });
    }
    setShowConfirmDialog(false); // Cerrar el diálogo después de vaciar
  };

  const totalAmount = state.items.reduce(
    (total, item) => total + (item.salePrice || item.price) * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Overlay de fondo */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
          />

          {/* Panel del carrito */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Cabecera */}
            <div className="p-4 bg-[#2D7337] text-white flex items-center justify-between shadow-md">
              <div className="flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold">Tu Carrito</h2>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                className="text-white hover:text-[#FED41D] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del carrito */}
            <div className="flex-1 overflow-y-auto p-4">
              {state.items.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Tu carrito está vacío</p>
                  <p className="text-gray-400 text-sm mt-2">
                    ¡Agrega algunos productos de la tienda!
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {state.items.map((item) => (
                    <li
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-3 flex gap-3 relative"
                    >
                      {/* Imagen del producto */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />

                      {/* Información del producto */}
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-[#2D7337] font-bold">
                            ${(item.salePrice || item.price).toFixed(2)}
                          </div>
                          
                          {/* Controles de cantidad */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(
                                item.id,
                                item.quantity - 1,
                                item.quantity,
                                item.name
                              )}
                              className="text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(
                                item.id,
                                item.quantity + 1,
                                item.quantity,
                                item.name
                              )}
                              disabled={item.quantity >= Math.min(item.stock, STORE_CONFIG.maxPurchaseLimit)}
                              className={`${
                                item.quantity >= Math.min(item.stock, STORE_CONFIG.maxPurchaseLimit)
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'text-gray-500 hover:text-green-500'
                              } transition-colors`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Stock disponible */}
                        <div className="text-xs text-gray-500 mt-1">
                          Stock disponible: {item.stock}
                        </div>
                      </div>

                      {/* Botón para eliminar */}
                      <button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pie del carrito */}
            {state.items.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowConfirmDialog(true)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    Vaciar carrito
                  </button>
                  <Link
                    href="/checkout"
                    onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                    className="px-4 py-2 bg-[#2D7337] text-white rounded hover:bg-[#236129] transition text-center"
                  >
                    Comprar ahora
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Diálogo de Confirmación para Vaciar Carrito */}
          {showConfirmDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
                <h3 className="text-lg font-semibold mb-4">¿Vaciar el carrito?</h3>
                <p className="text-gray-600 mb-4">Esta acción eliminará todos los productos del carrito.</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={clearCart}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Sí, vaciar
                  </button>
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};