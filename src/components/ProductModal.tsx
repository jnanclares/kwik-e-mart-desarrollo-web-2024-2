import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../models";
import { X } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  if (!product) return null;

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
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.h2 className="text-2xl font-bold mb-2">{product.name}</motion.h2>
          <motion.p className="text-gray-600 mb-4">{product.description}</motion.p>
          
          <motion.div className="flex items-center mb-4">
            <span className="text-lg font-bold text-green-600">
              ${product.onSale ? product.salePrice?.toFixed(2) : product.price.toFixed(2)}
            </span>
            {product.onSale && (
              <span className="ml-2 text-gray-500 line-through">${product.price.toFixed(2)}</span>
            )}
          </motion.div>

          <motion.button
            className="w-full bg-[#2D7337] text-white py-2 rounded-lg hover:bg-[#236129] transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            Cerrar
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
