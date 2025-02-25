'use client';
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, Truck, ShoppingBag, AlertTriangle } from 'lucide-react';

interface ShippingDetails {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

export const CheckoutPage = () => {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { state: authState, dispatch: authDispatch } = useAuth();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [error, setError] = useState<string | null>(null);
  
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  const subtotal = cartState.items.reduce(
    (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
    0
  );
  const shipping = 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verificar que todos los campos estén completos
    if (!shippingDetails.address || !shippingDetails.city || !shippingDetails.state || !shippingDetails.zipCode) {
      setError('Por favor completa todos los campos de envío');
      return;
    }
    // Validar que el código postal tenga 5 o 6 dígitos
    const zipCodeRegex = /^\d{5,6}$/;
    if (!zipCodeRegex.test(shippingDetails.zipCode)) {
      setError('El código postal es inválido. Debe contener 5 o 6 dígitos.');
      return;
    }
    setError(null);
    setStep('payment');
  };

  // Función de validación para el formulario de pago
  const validatePaymentDetails = () => {
    const { cardNumber, expiryDate, cvv, nameOnCard } = paymentDetails;
    const sanitizedCardNumber = cardNumber.replace(/\s+/g, '');
    const cardRegex = /^[0-9]{13,19}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3,4}$/;

    if (!cardRegex.test(sanitizedCardNumber)) {
      return 'El número de tarjeta es inválido.';
    }
    if (!expiryRegex.test(expiryDate)) {
      return 'La fecha de expiración debe tener el formato MM/YY.';
    }
    // Validar que la fecha de expiración sea en el futuro
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const expiry = new Date(Number(`20${year}`), Number(month) - 1, 1);
    // Establecer la fecha al último día del mes de expiración
    expiry.setMonth(expiry.getMonth() + 1);
    expiry.setDate(0);
    if (expiry < currentDate) {
      return 'La tarjeta está expirada.';
    }
    if (!cvvRegex.test(cvv)) {
      return 'El CVV es inválido.';
    }
    if (!nameOnCard.trim()) {
      return 'El nombre en la tarjeta no puede estar vacío.';
    }
    return null;
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validatePaymentDetails();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    processOrder();
  };

  const processOrder = () => {
    try {
      // Actualizar el historial de compras del usuario si está autenticado
      if (authState.user) {
        const newPurchase = {
          date: new Date().toISOString(),
          items: cartState.items,
          total: total,
        };

        const updatedUser = {
          ...authState.user,
          purchaseHistory: [...authState.user.purchaseHistory, newPurchase],
        };

        authDispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }

      // Limpiar el carrito y mostrar la confirmación
      cartDispatch({ type: 'CLEAR_CART' });
      setStep('confirmation');
    } catch (err) {
      setError('Ocurrió un error al procesar tu orden. Por favor, intenta nuevamente.');
    }
  };

  if (cartState.items.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Tu carrito está vacío</h2>
          <p className="mt-1 text-sm text-gray-500">Agrega algunos productos para continuar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {step === 'shipping' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="h-6 w-6 text-[#2D7337]" />
                <h2 className="text-2xl font-bold">Detalles de Envío</h2>
              </div>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dirección</label>
                  <input
                    type="text"
                    value={shippingDetails.address}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                    <input
                      type="text"
                      value={shippingDetails.city}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <input
                      type="text"
                      value={shippingDetails.state}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                  <input
                    type="text"
                    value={shippingDetails.zipCode}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, zipCode: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                    placeholder="Ej: 28013 o 280130"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#2D7337] text-white py-3 rounded-lg hover:bg-[#236129] transition-colors"
                >
                  Continuar a Pago
                </button>
              </form>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="h-6 w-6 text-[#2D7337]" />
                <h2 className="text-2xl font-bold">Detalles de Pago</h2>
              </div>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre en la Tarjeta</label>
                  <input
                    type="text"
                    value={paymentDetails.nameOnCard}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, nameOnCard: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número de Tarjeta</label>
                  <input
                    type="text"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                    placeholder="**** **** **** ****"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Expiración</label>
                    <input
                      type="text"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                      placeholder="***"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-[#2D7337] text-white py-3 rounded-lg hover:bg-[#236129] transition-colors"
                  >
                    Realizar Pedido
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-[#2D7337]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">¡Gracias por tu compra!</h2>
              <p className="text-gray-600 mb-6">
                Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-[#2D7337] text-white py-3 px-6 rounded-lg hover:bg-[#236129] transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          )}
        </div>

        {step !== 'confirmation' && (
          <div className="lg:w-96">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">Resumen del Pedido</h3>
              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 block text-sm">Cant: {item.quantity}</span>
                    </div>
                    <span>${((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
