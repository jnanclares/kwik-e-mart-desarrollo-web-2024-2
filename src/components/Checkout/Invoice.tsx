'use client';

import { InvoiceData } from '@/models/invoice';
import React from 'react';

export const Invoice: React.FC<{ invoice: InvoiceData }> = ({ invoice }) => {
  return (
    <div className="p-6 bg-white border-2 border-[#2D7337] shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-[#2D7337]">Factura de Compra</h1>
      <div className="mb-4">
        <p className="text-lg">
          <strong>Fecha:</strong> {new Date(invoice.date).toLocaleString()}
        </p>
        <p className="text-lg">
          <strong>Cliente:</strong> {invoice.customer ?? 'Sin nombre'}
        </p>
      </div>
      <table className="w-full mb-4 border-collapse">
        <thead>
          <tr>
            <th className="text-left border-b-2 pb-2 border-[#2D7337]">Producto</th>
            <th className="text-right border-b-2 pb-2 border-[#2D7337]">Cantidad</th>
            <th className="text-right border-b-2 pb-2 border-[#2D7337]">Precio Unitario</th>
            <th className="text-right border-b-2 pb-2 border-[#2D7337]">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => {
            const effectivePrice =
              item.salePrice && item.salePrice < item.price
                ? item.salePrice
                : item.price;
            return (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2">{item.name}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">${Number(effectivePrice).toFixed(2)}</td>
                <td className="py-2 text-right">
                  ${(effectivePrice * item.quantity).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-right">
        <p className="text-lg">
          <strong>Envío:</strong> ${invoice.shipping.toFixed(2)}
        </p>
        <p className="text-lg">
          <strong>Impuestos:</strong> ${invoice.tax.toFixed(2)}
        </p>
        <p className="text-xl font-bold mt-2 text-[#2D7337]">
          <strong>Total:</strong> ${invoice.total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

