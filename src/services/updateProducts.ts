import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { Product } from "../models";

// 🔹 Función para establecer `onSale: false` y `salePrice: null` en todos los productos
export const resetProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));

    for (const productDoc of querySnapshot.docs) {
      await updateDoc(doc(db, "products", productDoc.id), {
        onSale: false,
        salePrice: null,
      });
    }

    console.log("Todos los productos han sido actualizados con onSale: false y salePrice: null");
  } catch (error) {
    console.error("Error al actualizar productos:", error);
  }
};
