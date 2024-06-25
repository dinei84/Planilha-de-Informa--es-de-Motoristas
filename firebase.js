import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Substitua os valores de espaço reservado com suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "BPFnGCQ7QO_Wd1ekntAUVJ--I-dZNf2nQgaY2tIQFcSunJ-5fs7j3Nu-y-xoU0sOFqfyyS5Knw5F37zCE-grwJc",
  authDomain: "116710956370.firebaseapp.com",
  projectId: "SEU_ID_DO_PROJETO",
  storageBucket: "SEU_ID_DO_PROJETO.appspot.com",
  messagingSenderId: "SEU_ID_DO_ENVIADOR_DE_MENSAGENS",
  appId: "SEU_ID_DO_APP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
