'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { Package, Plus, Minus, Trash2, Edit, Check, X, Save, RefreshCw } from 'lucide-react';
import { Product } from '@/models/products';
import { checkProductStock, updateProductStock } from '@/services/productService';
import { notificationService } from '@/services/notificationService';

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockUpdating, setStockUpdating] = useState<{ [key: string]: boolean }>({});
  const [stockInputs, setStockInputs] = useState<{ [key: string]: number }>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null
  });

  // Estado para un nuevo producto
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'snacks',
    stock: 0,
    image: '',
    rating: 5,
    reviews: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("Fetching products...");

      const querySnapshot = await getDocs(collection(db, 'products'));
      console.log(`Got ${querySnapshot.docs.length} products`);

      const productsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Asegurar que stock, price y reviews existan para evitar errores
          stock: Number(data.stock) || 0,
          price: Number(data.price) || 0,
          reviews: data.reviews || []
        };
      }) as Product[];

      console.log("Products data:", productsData);

      // Inicializar los inputs de stock con los valores actuales
      const initialStockInputs: { [key: string]: number } = {};
      productsData.forEach(product => {
        initialStockInputs[product.id] = product.stock;
      });

      setProducts(productsData);
      setStockInputs(initialStockInputs);

    } catch (error) {
      console.error('Error fetching products:', error);
      notificationService.notify(`Error al cargar productos: ${error instanceof Error ? error.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (productId: string, value: number) => {
    setStockInputs({
      ...stockInputs,
      [productId]: value
    });
  };

  const updateStock = async (productId: string) => {
    try {
      setStockUpdating({ ...stockUpdating, [productId]: true });

      const currentProduct = products.find(p => p.id === productId);
      if (!currentProduct) return;

      const currentStock = await checkProductStock(productId);
      if (currentStock === null) {
        notificationService.notify('Error al verificar el stock actual', 'error');
        return;
      }

      const newStockValue = stockInputs[productId];
      const stockDifference = currentStock - newStockValue;

      // Use the existing updateProductStock method from the service
      const success = await updateProductStock(productId, stockDifference);

      if (success) {
        // Actualizar los productos en el estado local
        setProducts(products.map(product =>
          product.id === productId
            ? { ...product, stock: newStockValue }
            : product
        ));

        notificationService.notify(`Stock de ${currentProduct.name} actualizado a ${newStockValue}`, 'success');
      } else {
        notificationService.notify('Error al actualizar el stock', 'error');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      notificationService.notify(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`, 'error');
    } finally {
      setStockUpdating({ ...stockUpdating, [productId]: false });
    }
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const saveEditedProduct = async () => {
    if (!editingProduct) return;

    try {
      // Referencia al documento en Firestore
      const productRef = doc(db, 'products', editingProduct.id);

      // Actualizar el producto en Firestore
      await updateDoc(productRef, {
        name: editingProduct.name,
        description: editingProduct.description,
        price: Number(editingProduct.price),
        category: editingProduct.category
      });

      // Actualizar el estado local
      setProducts(products.map(p =>
        p.id === editingProduct.id ? editingProduct : p
      ));

      // Notificar éxito
      notificationService.notify(`Producto ${editingProduct.name} actualizado`, 'success');

      // Cerrar el modo de edición
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      notificationService.notify(`Error al actualizar producto: ${error instanceof Error ? error.message : 'Error desconocido'}`, 'error');
    }
  };

  const confirmDeleteProduct = (product: Product) => {
    setConfirmDelete({
      isOpen: true,
      product
    });
  };

  const addProduct = async () => {
    try {
      setLoading(true);

      // Validar campos obligatorios
      if (!newProduct.name || !newProduct.description || !newProduct.image) {
        notificationService.notify('Por favor complete todos los campos obligatorios', 'warning');
        return;
      }

      // Validar que el precio y el stock sean números válidos
      if (isNaN(Number(newProduct.price)) || isNaN(Number(newProduct.stock))) {
        notificationService.notify('Precio y stock deben ser números válidos', 'warning');
        return;
      }

      // Crear el nuevo producto
      const productRef = await addDoc(collection(db, 'products'), {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        category: newProduct.category,
        stock: Number(newProduct.stock),
        image: newProduct.image,
        rating: Number(newProduct.rating) || 5,
        reviews: []
      });

      // Actualizar la lista de productos
      const newProductWithId = {
        id: productRef.id,
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        category: newProduct.category,
        stock: Number(newProduct.stock),
        image: newProduct.image,
        rating: Number(newProduct.rating) || 5,
        reviews: []
      } as Product;

      // Actualizar el estado local
      setProducts([...products, newProductWithId]);

      // Actualizar los inputs de stock
      setStockInputs(prevInputs => ({
        ...prevInputs,
        [productRef.id]: Number(newProduct.stock)
      }));

      // Resetear el formulario
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: 'snacks',
        stock: 0,
        image: '',
        rating: 5,
        reviews: []
      });

      // Ocultar el formulario
      setShowAddForm(false);

      notificationService.notify(`Producto ${newProduct.name} añadido con éxito`, 'success');
    } catch (error) {
      console.error('Error adding product:', error);
      notificationService.notify(`Error al añadir producto: ${error instanceof Error ? error.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async () => {
    if (!confirmDelete.product) return;

    try {
      const productId = confirmDelete.product.id;
      const productName = confirmDelete.product.name;

      // Borrar el producto de Firestore
      await deleteDoc(doc(db, 'products', productId));

      // Actualizar el estado local
      setProducts(products.filter(product => product.id !== productId));

      // Cerrar el modal de confirmación
      setConfirmDelete({ isOpen: false, product: null });

      notificationService.notify(`Producto ${productName} eliminado`, 'warning');
    } catch (error) {
      console.error('Error deleting product:', error);
      notificationService.notify(`Error al eliminar producto: ${error instanceof Error ? error.message : 'Error desconocido'}`, 'error');
    }
  };

  // Renderización del modal de confirmación de eliminación
  const DeleteConfirmationModal = () => {
    if (!confirmDelete.isOpen || !confirmDelete.product) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Confirmar Eliminación</h2>
          <p className="text-gray-700 mb-6">
            ¿Estás seguro de que deseas eliminar el producto
            <span className="font-bold ml-1">{confirmDelete.product.name}</span>?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setConfirmDelete({ isOpen: false, product: null })}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              onClick={deleteProduct}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full relative">
      {/* Renderizar modal de confirmación */}
      <DeleteConfirmationModal />

      <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          {products.length} productos en inventario
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchProducts}
            className="bg-blue-100 text-blue-600 text-sm py-1 px-3 rounded-md hover:bg-blue-200 transition flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Actualizar
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-100 text-green-600 text-sm py-1 px-3 rounded-md hover:bg-green-200 transition flex items-center gap-1"
          >
            {showAddForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            {showAddForm ? 'Cancelar' : 'Nuevo Producto'}

          </button>
        </div>
      </div>

      {/* Add Product Form - Shown conditionally */}
      {showAddForm && (
        <div className="p-4 border-b border-gray-200 bg-green-50">
          <h3 className="text-md font-semibold text-green-700 mb-3">Añadir Nuevo Producto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto*</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría*</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as 'beverages' | 'snacks' | 'essentials' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="beverages">Bebidas</option>
                <option value="snacks">Snacks</option>
                <option value="essentials">Esenciales</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio*</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial*</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen*</label>
              <input
                type="text"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción*</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              ></textarea>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition mr-2"
            >
              Cancelar
            </button>
            <button
              onClick={addProduct}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Guardar Producto
            </button>
          </div>
        </div>
      )}

      {/* Table Container with Responsive Scroll */}
      <div className="w-full overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Producto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Detalles
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Precio
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                {/* Producto (Imagen y Nombre) */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 mr-4">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                    <div>
                      {editingProduct?.id === product.id ? (
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct,
                            name: e.target.value
                          })}
                          className="text-sm font-medium text-gray-900 border rounded px-2 py-1"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {product.category}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Detalles */}
                <td className="px-4 py-4 text-sm text-gray-500">
                  {editingProduct?.id === product.id ? (
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        description: e.target.value
                      })}
                      className="w-full border rounded px-2 py-1 text-sm"
                      rows={2}
                    />
                  ) : (
                    <>
                      <div className="line-clamp-2">{product.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Calificación: {product.rating}/5
                      </div>
                    </>
                  )}
                </td>

                {/* Precio */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {editingProduct?.id === product.id ? (
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value)
                      })}
                      className="w-full border rounded px-2 py-1 text-sm"
                      min="0"
                      step="0.01"
                    />
                  ) : (
                    <>
                      <span className={`text-sm font-medium ${product.onSale ? 'text-red-600 line-through' : 'text-gray-900'}`}>
                        {`$${Number(product.price || 0).toFixed(2)}`}
                      </span>
                      {product.onSale && (
                        <span className="ml-2 text-sm font-medium text-green-600">
                          {`$${Number(product.salePrice || product.price || 0).toFixed(2)}`}
                        </span>
                      )}
                    </>
                  )}
                </td>

                {/* Stock */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      value={stockInputs[product.id] ?? product.stock}
                      onChange={(e) => handleStockChange(product.id, parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm mr-2"
                    />
                    <button
                      onClick={() => updateStock(product.id)}
                      disabled={stockUpdating[product.id]}
                      className={`
                        px-2 py-1 rounded-md text-sm 
                        ${stockUpdating[product.id]
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-yellow-500 text-white hover:bg-yellow-600'}
                      `}
                    >
                      {stockUpdating[product.id] ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className={`text-xs mt-1 ${product.stock <= 10 ? 'text-red-500' : 'text-gray-500'}`}>
                    {product.stock <= 10 && 'Bajo stock'}
                  </div>
                </td>

                {/* Acciones */}
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {editingProduct?.id === product.id ? (
                      <>
                        <button
                          onClick={saveEditedProduct}
                          className="text-green-600 hover:text-green-900"
                          title="Guardar cambios"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setEditingProduct(null)}
                          className="text-red-600 hover:text-red-900"
                          title="Cancelar edición"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar producto"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => confirmDeleteProduct(product)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;