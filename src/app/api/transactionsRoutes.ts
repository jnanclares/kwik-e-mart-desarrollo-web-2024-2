// src/app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createTransaction } from '@/services/salesService';
import { Timestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validar datos básicos
    if (!data.userId || !data.products || !Array.isArray(data.products) || data.products.length === 0) {
      return NextResponse.json(
        { error: 'Datos de transacción inválidos' },
        { status: 400 }
      );
    }
    
    // Calcular monto total
    let totalAmount = 0;
    const productsList = data.products.map((product: any) => {
      const subtotal = product.price * product.quantity;
      totalAmount += subtotal;
      
      return {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: product.quantity
      };
    });
    
    // Crear objeto de transacción
    const transaction = {
      userId: data.userId,
      userName: data.userName || 'Cliente',
      userEmail: data.userEmail || 'cliente@example.com',
      productsList,
      totalAmount,
      timestamp: Timestamp.now(),
      paymentMethod: data.paymentMethod || 'Efectivo',
      status: 'completed' as const
    };
    
    // Guardar la transacción
    const transactionId = await createTransaction(transaction);
    
    return NextResponse.json({
      success: true,
      transactionId,
      message: 'Transacción registrada correctamente'
    });
  } catch (error) {
    console.error('Error al procesar la transacción:', error);
    return NextResponse.json(
      { error: 'Error al procesar la transacción' },
      { status: 500 }
    );
  }
}