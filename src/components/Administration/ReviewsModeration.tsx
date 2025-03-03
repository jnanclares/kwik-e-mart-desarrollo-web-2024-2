import React, { useEffect, useState } from 'react';
import { db } from '@/config/firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Trash2, Edit } from 'lucide-react';

// Import the Product interface
import { Product } from '../../models/products'; 

interface Review {
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  productId: string;
  reviewIndex: number; // To track review position inside a product
}

const ReviewsModeration: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editedComment, setEditedComment] = useState<string>('');

  useEffect(() => {
    const fetchReviews = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      let allReviews: Review[] = [];

      querySnapshot.forEach((productDoc) => {
        const productData = productDoc.data() as Product;
        if (productData.reviews) {
          productData.reviews.forEach((review, index) => {
            allReviews.push({
              ...review,
              productId: productDoc.id,
              reviewIndex: index, // Track the review position in the array
            });
          });
        }
      });

      setReviews(allReviews);
    };

    fetchReviews();
  }, []);

  const handleDeleteReview = async (productId: string, reviewIndex: number) => {
    const productRef = doc(db, 'products', productId);
    const productSnapshot = await getDocs(collection(db, 'products'));
    const productData = productSnapshot.docs.find(doc => doc.id === productId)?.data() as Product;

    if (productData && productData.reviews) {
      const updatedReviews = productData.reviews.filter((_, index) => index !== reviewIndex);
      await updateDoc(productRef, { reviews: updatedReviews });
      setReviews(reviews.filter(review => !(review.productId === productId && review.reviewIndex === reviewIndex)));
    }
  };

  const handleEditReview = async () => {
    if (!editingReview) return;

    const productRef = doc(db, 'products', editingReview.productId);
    const productSnapshot = await getDocs(collection(db, 'products'));
    const productData = productSnapshot.docs.find(doc => doc.id === editingReview.productId)?.data() as Product;

    if (productData && productData.reviews) {
      const updatedReviews = productData.reviews.map((review, index) =>
        index === editingReview.reviewIndex ? { ...review, comment: editedComment } : review
      );

      await updateDoc(productRef, { reviews: updatedReviews });

      setReviews(
        reviews.map((review) =>
          review.productId === editingReview.productId && review.reviewIndex === editingReview.reviewIndex
            ? { ...review, comment: editedComment }
            : review
        )
      );

      setEditingReview(null);
      setEditedComment('');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Moderación de Reseñas</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Usuario</th>
              <th className="border border-gray-300 p-2">Reseña</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={`${review.productId}-${review.reviewIndex}`} className="border border-gray-300">
                <td className="p-2">{review.username}</td>
                <td className="p-2">{review.comment}</td>
                <td className="p-2 flex gap-2">
                  <button 
                    onClick={() => handleDeleteReview(review.productId, review.reviewIndex)} 
                    className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                  <button 
                    onClick={() => { setEditingReview(review); setEditedComment(review.comment); }} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                    <Edit className="w-4 h-4" /> Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingReview && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Editar Reseña</h2>
          <textarea
            className="w-full p-2 border rounded-lg"
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleEditReview} className="bg-green-600 text-white px-4 py-2 rounded-md">
              Guardar
            </button>
            <button onClick={() => setEditingReview(null)} className="bg-gray-400 text-white px-4 py-2 rounded-md">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsModeration;
