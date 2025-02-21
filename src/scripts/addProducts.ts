import { addProducts } from "../services/addProducts";

// Ejecuta la función para agregar productos
addProducts().then(() => {
  console.log("✅ Productos agregados correctamente");
  process.exit(0); // Cierra el proceso de Node al finalizar
}).catch(error => {
  console.error("❌ Error al agregar productos:", error);
  process.exit(1);
});
