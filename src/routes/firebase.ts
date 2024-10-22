// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaZo0bvSBNuPJkpxL6NmOMyDXEeU5pz-E",
  authDomain: "nx-reloaded-d3fda.firebaseapp.com",
  projectId: "nx-reloaded-d3fda",
  storageBucket: "nx-reloaded-d3fda.appspot.com",
  messagingSenderId: "850290074078",
  appId: "1:850290074078:web:309817099c60afcf2efd4f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
