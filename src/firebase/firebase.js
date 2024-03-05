import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
//Declarar las variables en .env.local y tambien en next.config
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
};

export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
