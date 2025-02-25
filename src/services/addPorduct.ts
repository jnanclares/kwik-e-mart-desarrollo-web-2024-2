import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { Product } from "@/services/offers";


export const addSingleProduct = async (product: Partial<Product>) => {
  try {
    await addDoc(collection(db, "products"), product);
    console.log("Producto agregado correctamente");
  } catch (error) {
    console.error("Error al agregar producto:", error);
  }
};
