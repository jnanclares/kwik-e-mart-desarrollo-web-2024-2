import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Product } from "../models/products";

// 🔹 Múltiples ofertas por día de la semana
const DAILY_DEALS: Record<number, { name: string; discount: number }[]> = {
  1: [{ name: "Squishee", discount: 0.5 }, { name: "Rosquilla Rosa", discount: 0.25 }], // Lunes - 2 ofertas
  2: [{ name: "Rosquilla Rosa", discount: 0.3 }], // Martes - 1 oferta
  3: [{ name: "Hot Dog", discount: 0.25 }, { name: "Krusty Burger", discount: 0.15 }], // Miércoles - 2 ofertas
  4: [{ name: "Buzz Cola", discount: 0.4 }], // Jueves - 1 oferta
  5: [{ name: "Cereal Krusty-O's", discount: 0.2 }], // Viernes - 1 oferta
  6: [{ name: "Flaming Moe", discount: 0.35 }, { name: "Cerveza Duff", discount: 0.3 }], // Sábado - 2 ofertas
  0: [{ name: "Caramelo de Radioactivo Man", discount: 0.2 }, { name: "Comics de Radioactivo Man", discount: 0.3 }], // Domingo - 2 ofertas
};

export const applyDailyDeals = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const today = new Date().getDay(); // 🔹 Obtener el día actual (0 = Domingo, 6 = Sábado)
    const dealsToday = DAILY_DEALS[today] || [];

    for (const productDoc of querySnapshot.docs) {
      const product = productDoc.data() as Product;

      // 🔹 Filtrar todas las ofertas aplicables a este producto
      const applicableDeals = dealsToday.filter((deal) => deal.name === product.name);

      if (applicableDeals.length > 0) {
        // 🔹 Si hay múltiples descuentos, tomar el mayor
        const maxDiscount = Math.max(...applicableDeals.map((deal) => deal.discount));
        const salePrice = Number((product.price * (1 - maxDiscount)).toFixed(2));

        await updateDoc(doc(db, "products", productDoc.id), {
          onSale: true,
          salePrice: salePrice,
        });

        console.log(`✅ ${product.name}: Descuento del ${maxDiscount * 100}% aplicado (${salePrice}$)`);
      } else {
        // 🔹 Si el producto no está en oferta hoy, restablecer su estado
        await updateDoc(doc(db, "products", productDoc.id), {
          onSale: false,
          salePrice: null,
        });
      }
    }

    console.log("✅ Ofertas del día aplicadas correctamente.");
  } catch (error) {
    console.error("⚠️ Error al aplicar ofertas diarias:", error);
  }
};
