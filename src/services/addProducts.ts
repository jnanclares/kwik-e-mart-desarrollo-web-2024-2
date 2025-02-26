import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const products = [
    {
      "name": "Rosquilla Rosa",
      "price": 1.99,
      "category": "snacks",
      "image": "https://images.unsplash.com/photo-1551024601-bec78aea704b",
      "rating": 5,
      "reviews": 256,
      "description": "La favorita de Homero Simpson, con glaseado rosa y chispas",
      "featured": true
    },
    {
      "name": "Cerveza Duff",
      "price": 4.99,
      "category": "beverages",
      "image": "https://images.unsplash.com/photo-1608270586620-248524c67de9",
      "rating": 4,
      "reviews": 167,
      "description": "No puedes tener suficiente de esa maravillosa Duff",
      "featured": true
    },
    {
      "name": "Krusty Burger",
      "price": 5.99,
      "category": "snacks",
      "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      "rating": 4,
      "reviews": 122,
      "description": "La hamburguesa aprobada por Krusty el Payaso",
      "onSale": true,
      "salePrice": 3.99,
      "dailyDeal": true
    },
    {
      "name": "Buzz Cola",
      "price": 2.49,
      "category": "beverages",
      "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97",
      "rating": 4,
      "reviews": 75,
      "description": "¡La cola que te da energía!",
      "onSale": true,
      "salePrice": 1.49
    },
    {
      "name": "Flaming Moe",
      "price": 6.99,
      "category": "beverages",
      "image": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
      "rating": 4,
      "reviews": 156,
      "description": "La bebida secreta de Moe, con un ingrediente misterioso",
      "featured": true
    },
    {
      "name": "Ladrillo Nutricional de Krusty",
      "price": 3.50,
      "category": "snacks",
      "image": "https://images.unsplash.com/photo-1598373182133-cb57cf1b40b3",
      "rating": 3,
      "reviews": 45,
      "description": "El bocadillo con el sello de calidad de Krusty el Payaso"
    },
    {
      "name": "Caramelo de Radioactivo Man",
      "price": 1.50,
      "category": "snacks",
      "image": "https://images.unsplash.com/photo-1589927986089-35812388d1c8",
      "rating": 5,
      "reviews": 98,
      "description": "Dulces inspirados en el superhéroe favorito de Bart"
    },
    {
      "name": "Cereal Krusty-O's",
      "price": 3.99,
      "category": "snacks",
      "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      "rating": 3,
      "reviews": 200,
      "description": "El cereal favorito de Krusty el Payaso, ¡ahora con menos objetos metálicos!"
    },
    {
      "name": "Comics de Radioactivo Man",
      "price": 9.99,
      "category": "essentials",
      "image": "https://images.unsplash.com/photo-1612036782180-6f0822045d23",
      "rating": 5,
      "reviews": 42,
      "description": "Las mejores aventuras de Radioactivo Man",
      "featured": true
    }
  ];
  

export const addProducts = async () => {
  try {
    for (const product of products) {
      await addDoc(collection(db, "products"), product);
    }
    console.log("Productos agregados correctamente");
  } catch (error) {
    console.error("Error al agregar productos:", error);
  }
};



addProducts();