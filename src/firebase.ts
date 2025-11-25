import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCYiD5LVnWU7Y1iYOHy6fxl9zKcPtBd3-8",
  authDomain: "albercasyagua.firebaseapp.com",
  projectId: "albercasyagua",
  storageBucket: "albercasyagua.firebasestorage.app",
  messagingSenderId: "977857933974",
  appId: "1:977857933974:web:494aa2c6984b9128e9c8b7",
  measurementId: "G-GZSR71W7PE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);