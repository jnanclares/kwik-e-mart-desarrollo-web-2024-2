// src/components/Checkout/InvoiceHistory.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { Invoice } from './Invoice';
import Link from 'next/link';

interface InvoiceData {
  date: string;
  items: any[];
  shipping: number;
  tax: number;
  total: number;
  pay_method: string;
  customer?: string;
}

const InvoiceHistory: React.FC = () => {
  const { state: authState } = useAuth();
  const { user } = authState;
  
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setInvoices(data.purchaseHistory || []);
        }
      } catch (error) {
        console.error('Error al obtener las facturas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  if (loading) {
    return (
      <p className="p-6 text-center text-[#FED41D] font-bold bg-[#2D7337] min-h-screen">
        Cargando historial de facturas...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="p-6 text-center text-[#FED41D] font-bold bg-[#2D7337] min-h-screen">
        Debes iniciar sesión para ver tu historial.
      </p>
    );
  }

  if (invoices.length === 0) {
    return (
      <p className="p-6 text-center text-[#FED41D] font-bold bg-[#2D7337] min-h-screen">
        No tienes facturas registradas.
      </p>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[#2D7337]">
      {/* 
        Contenedor principal SIN esquinas redondeadas:
        - Fondo amarillo (#FED41D)
        - Borde rojo (#CC0000)
      */}
      <div className="max-w-4xl mx-auto bg-[#FED41D] p-6 border-4 border-[#CC0000] shadow-lg">
        {/* Encabezado con botón para volver al menú principal */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-[#2D7337]">
            Historial de Facturas
          </h1>
          <Link
            href="/"
            className="bg-[#2D7337] text-[#FED41D] py-2 px-6 border-2 border-[#CC0000] rounded-none hover:bg-[#236129] transition-colors font-bold"
          >
            Menú Principal
          </Link>
        </div>
        {/* Listado de facturas, ordenadas de la más nueva a la más vieja */}
        <div className="space-y-6">
          {invoices
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((invoice, index) => (
              <div key={index}>
                <Invoice order={invoice} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceHistory;
