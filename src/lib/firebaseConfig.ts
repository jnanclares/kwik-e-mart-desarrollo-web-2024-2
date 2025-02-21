import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDXn1EoI9orXWA0GxWqnMK_ODBQo2Qmdwk",
    authDomain: "kwik-e-mart-29500.firebaseapp.com",
    projectId: "kwik-e-mart-29500",
    storageBucket: "kwik-e-mart-29500.firebasestorage.app",
    messagingSenderId: "291584436116",
    appId: "1:291584436116:web:682bf267792c73e722d181",
    measurementId: "G-N17380EJ17"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
