import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const migrateReviews = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));

    for (const productDoc of querySnapshot.docs) {
      const productData = productDoc.data();

      // 🔹 If reviews is already an array, skip this product
      if (Array.isArray(productData.reviews)) continue;

      // 🔹 Convert reviews number to an array of objects
      const reviewsArray = [];
      if (typeof productData.reviews === "number" && productData.reviews > 0) {
        reviewsArray.push({
          userId: "admin",
          username: "Auto Migration",
          rating: 5,
          comment: `This product has ${productData.reviews} past reviews.`,
          date: new Date().toISOString(),
        });
      }

      // 🔹 Update the product in Firebase
      await updateDoc(doc(db, "products", productDoc.id), {
        reviews: reviewsArray, // Now it becomes an array
      });

      console.log(`✅ Updated product: ${productDoc.id}`);
    }

    console.log("🎉 Migration completed successfully!");
  } catch (error) {
    console.error("⚠️ Error migrating reviews:", error);
  }
};
