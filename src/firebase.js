// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🔹 pridaj toto

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAm40NnY5ft7ZJKSJEQQrQhGtXuuggn2j4",
  authDomain: "medtest-5eb10.firebaseapp.com",
  projectId: "medtest-5eb10",
  storageBucket: "medtest-5eb10.firebasestorage.app",
  messagingSenderId: "976951571415",
  appId: "1:976951571415:web:0d9a16e90af1073e755192",
  measurementId: "G-ZCDW1L7X89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app); // 🔹 pridaj toto
