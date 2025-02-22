import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../models";
import { X, Star, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext"; // Importamos el carrito

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { dispatch } = useCart(); // Accedemos al carrito

  if (!product) return null;

  // Función para añadir al carrito
  const addToCart = () => {
    dispatch({ type: "ADD_ITEM", payload: { ...product} });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()} // Evita que el modal se cierre al hacer clic en su interior
        >
          {/* Botón de Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Imagen del Producto */}
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Información del Producto */}
          <motion.div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

            {/* Categoría */}
            <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
              {product.category}
            </span>

            {/* Descripción */}
            <p className="text-gray-600 my-4">{product.description}</p>

            {/* Calificación con estrellas */}
            <div className="flex justify-center items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < product.rating ? "text-[#FED41D] fill-current" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600">({product.reviews} opiniones)</span>
            </div>

            {/* Precio */}
            <div className="flex justify-center items-center mb-4">
              {product.onSale ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-xl">
                    ${product.salePrice?.toFixed(2)}
                  </span>
                  <span className="text-gray-500 line-through text-lg">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-xl">${product.price.toFixed(2)}</span>
              )}
            </div>

            {/* Botón de Añadir al Carrito */}
            <motion.button
              className="w-full bg-[#2D7337] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#236129] transition mb-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Añadir al Carrito</span>
            </motion.button>

            {/* Botón de Cerrar */}
            <motion.button
              className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
            >
              Cerrar
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
