/**
 * Configuración global para la tienda Kwik-E-Mart
 */
export const STORE_CONFIG = {
    // Configuración de stock
    lowStockThreshold: 5, // Mostrar alerta de "pocas unidades" cuando el stock sea igual o menor a este valor
    maxPurchaseLimit: 10, // Número máximo de unidades de un producto que puede comprar un usuario
    
    // Comportamiento de la UI
    showOutOfStockProducts: true, // Determina si los productos agotados se muestran por defecto
    defaultSortOrder: 'default', // Orden predeterminado ('default', 'price-asc', 'price-desc', etc.)
    
    // Otras configuraciones
    taxRate: 0.10, // 10% de impuestos
    minimumOrderValue: 10, // Valor mínimo para realizar un pedido
    shippingThreshold: 30, // Valor mínimo para envío gratuito
  };
  
  /**
   * Verifica si un producto tiene poco stock según la configuración global
   */
  export const hasLowStock = (stock: number): boolean => {
    return stock > 0 && stock <= STORE_CONFIG.lowStockThreshold;
  };
  
  /**
   * Verifica si la cantidad solicitada excede el límite de compra global
   */
  export const exceedsMaxPurchaseLimit = (quantity: number): boolean => {
    return quantity > STORE_CONFIG.maxPurchaseLimit;
  };
  
  /**
   * Calcula la cantidad máxima que un usuario puede comprar
   * (el mínimo entre el stock disponible y el límite de compra)
   */
  export const getMaxPurchaseQuantity = (stockAvailable: number): number => {
    return Math.min(stockAvailable, STORE_CONFIG.maxPurchaseLimit);
  };