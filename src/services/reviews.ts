import { db } from "../lib/firebaseConfig";
import { collection, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

export interface Review {
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

// 🔹 Function to Add a Review
export const addReview = async (productId: string, review: Review) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      reviews: arrayUnion(review),
    });
    return true;
  } catch (error) {
    console.error("Error adding review:", error);
    return false;
  }
};

// 🔹 Function to Fetch Reviews for a Product
export const fetchReviews = async (productId: string) => {
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      return productSnap.data().reviews || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};
