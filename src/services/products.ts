import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Product } from "../models";

export const fetchProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "products"));
  
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name || "Unknown Product",
      price: data.price || 0,
      salePrice: data.salePrice ?? null, // Ensure it's always defined
      onSale: data.onSale ?? false, // Ensure it's always defined
      category: data.category || "uncategorized",
      image: data.image || "",
      rating: data.rating || 0,
      reviews: data.reviews,
      description: data.description || "No description available",
      featured: data.featured ?? false,
    };
  });
};
