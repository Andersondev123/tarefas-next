
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAuJxJ1VQQd_9ku0tzcie2GkL_KA6s_EmQ",
  authDomain: "tarefasplus-45ad5.firebaseapp.com",
  projectId: "tarefasplus-45ad5",
  storageBucket: "tarefasplus-45ad5.firebasestorage.app",
  messagingSenderId: "1000989601308",
  appId: "1:1000989601308:web:d221dae62d424f144779d9"
};


const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };