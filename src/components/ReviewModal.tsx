import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../models/products";
import { X, Star } from "lucide-react";

interface ReviewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
        <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
            e.stopPropagation(); // Prevents bubbling up to ProductCard
            onClose();
        }}
        >

        <motion.div
          className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Reviews Header */}
          <h2 className="text-xl font-bold text-center mb-4">
            Reviews para {product.name}
          </h2>

          {/* Display Reviews */}
          <div className="space-y-4">
            {product.reviews.length === 0 ? (
              <p className="text-gray-500 text-center">No hay reviews. Se el primero en dejar una review!</p>
            ) : (
              product.reviews.map((review, index) => (
                <div key={index} className="border p-3 rounded-lg shadow-sm">
                  <p className="font-semibold">{review.username}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "text-[#FED41D] fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                  <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>

          {/* Close Button */}
          <button
            className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
