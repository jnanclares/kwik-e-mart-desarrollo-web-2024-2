import { 
    doc, 
    getDoc, 
    updateDoc, 
    writeBatch,
    increment,
    runTransaction 
  } from 'firebase/firestore';
  import { db } from '@/config/firebaseConfig';
  import { Product } from '../models/products';
  import { CartItem } from '../models/cart';
  
  const PRODUCTS_COLLECTION = 'products';
  
  /**
   * Verifica el stock actual de un producto
   * @param productId ID del producto a verificar
   * @returns El stock actual o null si hay error
   */
  export const checkProductStock = async (productId: string): Promise<number | null> => {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        const productData = productSnap.data() as Product;
        return productData.stock;
      }
      
      return null;
    } catch (error) {
      console.error('Error al verificar stock:', error);
      return null;
    }
  };
  
  /**
   * Verifica si hay stock suficiente para todos los productos del carrito
   * @param items Items del carrito a verificar
   * @returns Objeto con resultado y mensaje
   */
  export const validateCartStock = async (items: CartItem[]): Promise<{
    isValid: boolean;
    message?: string;
    invalidItems?: { id: string; name: string; requested: number; available: number }[];
  }> => {
    try {
      const invalidItems: { id: string; name: string; requested: number; available: number }[] = [];
      
      // Verificar cada item del carrito
      for (const item of items) {
        const currentStock = await checkProductStock(item.id);
        
        if (currentStock === null) {
          return { 
            isValid: false, 
            message: `Error al verificar el stock del producto "${item.name}". Intenta nuevamente.` 
          };
        }
        
        if (currentStock < item.quantity) {
          invalidItems.push({
            id: item.id,
            name: item.name,
            requested: item.quantity,
            available: currentStock
          });
        }
      }
      
      if (invalidItems.length > 0) {
        return {
          isValid: false,
          message: 'Algunos productos no tienen stock suficiente',
          invalidItems
        };
      }
      
      return { isValid: true };
    } catch (error) {
      console.error('Error al validar stock del carrito:', error);
      return { 
        isValid: false, 
        message: 'Error al validar el stock. Por favor, intenta nuevamente.' 
      };
    }
  };
  
  /**
   * Actualiza el stock de un producto
   * @param productId ID del producto
   * @param quantity Cantidad a restar del stock (negativa para sumar)
   */
  export const updateProductStock = async (
    productId: string, 
    quantity: number
  ): Promise<boolean> => {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      
      await updateDoc(productRef, {
        stock: increment(-quantity) // Restamos la cantidad del stock
      });
      
      return true;
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      return false;
    }
  };
  
  /**
   * Actualiza el stock de múltiples productos después de una compra
   * @param items Items comprados
   * @returns True si se actualizó correctamente, False si hubo error
   */
  export const updateStockAfterPurchase = async (items: CartItem[]): Promise<boolean> => {
    const batch = writeBatch(db);
    
    try {
      // Primero validamos que hay stock suficiente
      const stockValidation = await validateCartStock(items);
      
      if (!stockValidation.isValid) {
        console.error('Error de validación de stock:', stockValidation.message);
        return false;
      }
      
      // Utilizamos una transacción para actualizar todo o nada
      await runTransaction(db, async (transaction) => {
        // Obtenemos el stock actual de cada producto
        const productsWithStock = await Promise.all(
          items.map(async (item) => {
            const productRef = doc(db, PRODUCTS_COLLECTION, item.id);
            const productSnap = await transaction.get(productRef);
            
            if (!productSnap.exists()) {
              throw new Error(`Producto ${item.id} no encontrado`);
            }
            
            const productData = productSnap.data() as Product;
            
            // Verificar si hay stock suficiente
            if (productData.stock < item.quantity) {
              throw new Error(`Stock insuficiente para ${item.name}`);
            }
            
            return {
              ref: productRef,
              currentStock: productData.stock,
              requestedQuantity: item.quantity
            };
          })
        );
        
        // Actualizar el stock de cada producto
        productsWithStock.forEach(({ ref, currentStock, requestedQuantity }) => {
          transaction.update(ref, {
            stock: currentStock - requestedQuantity
          });
        });
      });
      
      return true;
    } catch (error) {
      console.error('Error al actualizar stock después de compra:', error);
      return false;
    }
  };
  
  /**
   * Restaura el stock de productos si se cancela un pedido
   * @param items Items a restaurar
   */
  export const restoreStockAfterCancellation = async (items: CartItem[]): Promise<boolean> => {
    const batch = writeBatch(db);
    
    try {
      items.forEach(item => {
        const productRef = doc(db, PRODUCTS_COLLECTION, item.id);
        batch.update(productRef, {
          stock: increment(item.quantity) // Sumamos la cantidad al stock
        });
      });
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error al restaurar stock:', error);
      return false;
    }
  };