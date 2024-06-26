import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Substitua os valores de espaço reservado com suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA-2XotqAAWBK9B-a1-LpUNARMyqnzxwWQ",
  authDomain: "lista-de-contatos-5a54f.firebaseapp.com",
  projectId: "lista-de-contatos-5a54f",
  storageBucket: "lista-de-contatos-5a54f.appspot.com",
  messagingSenderId: "116710956370",
  appId: "1:116710956370:web:39c58264e21418e1e42e8b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
