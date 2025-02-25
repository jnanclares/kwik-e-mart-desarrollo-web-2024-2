import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export const Cart = () => {
  const { state, dispatch } = useCart();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Estado para mostrar el diálogo

  const total = state.items.reduce(
    (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
    0
  );

  if (!state.isOpen) return null;

  // Función para vaciar el carrito
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    setShowConfirmDialog(false); // Cerrar el diálogo después de vaciar
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => dispatch({ type: 'TOGGLE_CART' })} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500">Thank you, come again! Your cart is empty.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 mb-4 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="text-sm text-gray-600">
                        ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: { id: item.id, quantity: Math.max(0, item.quantity - 1) },
                            })
                          }
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: { id: item.id, quantity: item.quantity + 1 },
                            })
                          }
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                      className="p-2 hover:bg-gray-200 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  {/* Botón de Vaciar Carrito */}
                  <button
                    onClick={() => setShowConfirmDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                    Vaciar Carrito
                  </button>

                  {/* Botón de Finalizar Compra */}
                  <Link
                    href="/checkout"
                    onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                    className="px-6 py-2 bg-[#2D7337] text-white rounded-lg hover:bg-[#236129] transition inline-block text-center"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 🔹 Diálogo de Confirmación para Vaciar Carrito */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
    </div>
  );
};
