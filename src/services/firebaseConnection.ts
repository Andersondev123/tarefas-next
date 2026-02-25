
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "tarefasplus-45ad5.firebaseapp.com",
  projectId: "tarefasplus-45ad5",
  storageBucket: "tarefasplus-45ad5.firebasestorage.app",
  messagingSenderId: "1000989601308",
  appId: "1:1000989601308:web:d221dae62d424f144779d9"
};


const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };