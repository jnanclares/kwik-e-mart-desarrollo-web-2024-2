'use client';
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  CreditCard,
  Truck,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react';

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

type PaymentMethod = 'card' | 'transferencia' | 'contraentrega' | 'mercado_pago';

interface OrderDetails {
  date: string;
  items: any[];
  shipping: number;
  tax: number;
  total: number;
  customer: string;
}

const Invoice: React.FC<{ order: OrderDetails }> = ({ order }) => {
  return (
    <div className="invoice p-6 bg-white rounded-lg shadow-xl mt-8">
      <h1 className="text-3xl font-bold mb-4">Factura de Compra</h1>
      <div className="mb-4">
        <p>
          <strong>Fecha:</strong> {new Date(order.date).toLocaleString()}
        </p>
        <p>
          <strong>Cliente:</strong> {order.customer}
        </p>
      </div>
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="text-left border-b pb-2">Producto</th>
            <th className="text-right border-b pb-2">Cantidad</th>
            <th className="text-right border-b pb-2">Precio Unitario</th>
            <th className="text-right border-b pb-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => {
            const effectivePrice =
              item.salePrice && item.salePrice < item.price ? item.salePrice : item.price;
            return (
              <tr key={item.id}>
                <td className="py-2">{item.name}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">${effectivePrice.toFixed(2)}</td>
                <td className="py-2 text-right">
                  ${(effectivePrice * item.quantity).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-right">
        <p>
          <strong>Envío:</strong> ${order.shipping.toFixed(2)}
        </p>
        <p>
          <strong>Impuestos:</strong> ${order.tax.toFixed(2)}
        </p>
        <p className="text-xl font-bold mt-2">
          <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export const CheckoutPage = () => {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { state: authState, dispatch: authDispatch } = useAuth();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

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

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  // Se calcula el subtotal usando el precio efectivo (salePrice si aplica)
  const subtotal = cartState.items.reduce(
    (sum, item) =>
      sum +
      ((item.salePrice && item.salePrice < item.price ? item.salePrice : item.price) *
        item.quantity),
    0
  );
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shippingDetails.address ||
      !shippingDetails.city ||
      !shippingDetails.state ||
      !shippingDetails.zipCode
    ) {
      setError('Por favor completa todos los campos de envío');
      return;
    }
    const zipCodeRegex = /^\d{5,6}$/;
    if (!zipCodeRegex.test(shippingDetails.zipCode)) {
      setError('El código postal es inválido. Debe contener 5 o 6 dígitos.');
      return;
    }
    setError(null);
    setStep('payment');
  };

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
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const expiry = new Date(Number(`20${year}`), Number(month) - 1, 1);
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
    if (paymentMethod === 'card') {
      const validationError = validatePaymentDetails();
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    setError(null);
    processOrder();
  };

  const processOrder = () => {
    try {
      const order = {
        date: new Date().toISOString(),
        items: cartState.items,
        shipping,
        tax,
        total,
        customer: authState.user?.name || 'Cliente',
      };
      setOrderDetails(order);

      if (authState.user) {
        const newPurchase = {
          date: order.date,
          items: cartState.items,
          total,
        };
        const updatedUser = {
          ...authState.user,
          purchaseHistory: [...authState.user.purchaseHistory, newPurchase],
        };
        authDispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
      cartDispatch({ type: 'CLEAR_CART' });
      setStep('confirmation');
    } catch (err) {
      setError('Ocurrió un error al procesar tu orden. Por favor, intenta nuevamente.');
    }
  };

  if (cartState.items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-[#FDFDF2] flex flex-col items-center justify-center text-center relative">
        <button
          onClick={() => (window.location.href = '/')}
          className="fixed top-4 left-4 bg-[#2D7337] border-2 border-[#FED41D] text-white py-2 px-4 rounded-lg hover:bg-[#236129] transition-colors z-50"
        >
          Volver a la página principal
        </button>
        <ShoppingBag className="h-16 w-16 text-[#2D7337]" />
        <h2
          className="mt-4 text-2xl font-bold"
          style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}
        >
          ¡Ay caramba! Tu carrito está vacío.
        </h2>
        <p className="mt-2 text-lg text-[#2D7337]">
          Agrega algunos productos y vuelve pronto.
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#FDFDF2] relative px-4 sm:px-6 lg:px-8 py-12"
      style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}
    >
      <button
        onClick={() => (window.location.href = '/')}
        className="fixed top-4 left-4 bg-[#2D7337] border-2 border-[#FED41D] text-white py-2 px-4 rounded-lg hover:bg-[#236129] transition-colors z-50"
      >
        Volver a la página principal
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-[#CC0000] rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {step === 'shipping' && (
            <div className="bg-white p-6 rounded-lg shadow-xl">
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
                    onChange={(e) =>
                      setShippingDetails({ ...shippingDetails, address: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                    <input
                      type="text"
                      value={shippingDetails.city}
                      onChange={(e) =>
                        setShippingDetails({ ...shippingDetails, city: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <input
                      type="text"
                      value={shippingDetails.state}
                      onChange={(e) =>
                        setShippingDetails({ ...shippingDetails, state: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                  <input
                    type="text"
                    value={shippingDetails.zipCode}
                    onChange={(e) =>
                      setShippingDetails({ ...shippingDetails, zipCode: e.target.value })
                    }
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
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="flex flex-col gap-4 mb-6">
                <h2 className="text-2xl font-bold">Selecciona tu método de pago</h2>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-4 rounded-lg transition-colors ${
                      paymentMethod === 'card'
                        ? 'bg-[#2D7337] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Tarjeta
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transferencia')}
                    className={`py-2 px-4 rounded-lg transition-colors ${
                      paymentMethod === 'transferencia'
                        ? 'bg-[#2D7337] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Transferencia
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('contraentrega')}
                    className={`py-2 px-4 rounded-lg transition-colors ${
                      paymentMethod === 'contraentrega'
                        ? 'bg-[#2D7337] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Contraentrega
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mercado_pago')}
                    className={`py-2 px-4 rounded-lg transition-colors ${
                      paymentMethod === 'mercado_pago'
                        ? 'bg-[#2D7337] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Mercado Pago
                  </button>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                {paymentMethod === 'card' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nombre en la Tarjeta
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.nameOnCard}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, nameOnCard: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.cardNumber}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                        placeholder="**** **** **** ****"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Fecha de Expiración
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.expiryDate}
                          onChange={(e) =>
                            setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CVV</label>
                        <input
                          type="text"
                          value={paymentDetails.cvv}
                          onChange={(e) =>
                            setPaymentDetails({ ...paymentDetails, cvv: e.target.value })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
                          placeholder="***"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-gray-100 rounded-lg">
                    {paymentMethod === 'transferencia' && (
                      <p className="text-gray-700">
                        Para pagar por transferencia bancaria, realice el pago a la cuenta:
                        <br />
                        <strong>Banco XYZ - Cuenta: 1234567890</strong>
                        <br />
                        Su pedido se procesará una vez se confirme la transacción.
                      </p>
                    )}
                    {paymentMethod === 'contraentrega' && (
                      <p className="text-gray-700">
                        Con contraentrega, pagará en efectivo al momento de recibir su pedido.
                      </p>
                    )}
                    {paymentMethod === 'mercado_pago' && (
                      <p className="text-gray-700">
                        Al seleccionar Mercado Pago, será redirigido a la plataforma para completar su pago.
                      </p>
                    )}
                  </div>
                )}
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

          {step === 'confirmation' && orderDetails && (
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-[#E3F9E5] rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-[#2D7337]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">¡Gracias por tu compra!</h2>
              <p className="text-gray-700 mb-6">
                Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación.
              </p>
              {/* Se muestra la factura de la compra */}
              <Invoice order={orderDetails} />
              <button
                onClick={() => (window.location.href = '/')}
                className="mt-6 bg-[#2D7337] text-white py-3 px-6 rounded-lg hover:bg-[#236129] transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          )}
        </div>

        {step !== 'confirmation' && (
          <div className="lg:w-96">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-bold mb-4">Resumen del Pedido</h3>
              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => {
                  const hasDiscount = item.salePrice && item.salePrice < item.price;
                  const originalPrice = item.price;
                  const discountedPrice = hasDiscount ? item.salePrice : item.price;
                  return (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() =>
                              cartDispatch({
                                type: 'UPDATE_QUANTITY',
                                payload: {
                                  id: item.id,
                                  quantity: Math.max(1, item.quantity - 1),
                                },
                              })
                            }
                            className="text-[#2D7337] hover:text-[#236129]"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              cartDispatch({
                                type: 'UPDATE_QUANTITY',
                                payload: { id: item.id, quantity: item.quantity + 1 },
                              })
                            }
                            className="text-[#2D7337] hover:text-[#236129]"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() =>
                              cartDispatch({ type: 'REMOVE_ITEM', payload: item.id })
                            }
                            className="text-[#CC0000] hover:text-[#CC0000]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {hasDiscount ? (
                          <>
                            <span className="text-gray-500 block text-sm line-through">
                              ${originalPrice.toFixed(2)}
                            </span>
                            <span className="text-green-600 block text-sm">
                              ${discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-green-600 block text-sm">
                              Descuento:{' '}
                              {Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)}%
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-700 block text-sm">
                            ${originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span>${(discountedPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Envío</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Impuestos</span>
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
