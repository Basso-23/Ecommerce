import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import { auth } from "@/firebase/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const App = ({ Component, pageProps, router }) => {
  const [cart, setCart] = useState([]);
  const [render, setRender] = useState(true);
  const [userState, setUserState] = useState();
  const [catalogo, setCatalogo] = useState([]);

  //Verifica el estado del usuario
  useEffect(() => {
    onAuthStateChanged(auth, userCheckState);
  }, []);

  //Muestra en consola del estado del usuario
  function userCheckState(user) {
    if (user) {
      setUserState(user.displayName);
      console.log("HAY USER (app)");
    } else {
      console.log("NO HAY USER (app)");
    }
  }

  //Muestra en consola el nombre del usuario
  useEffect(() => {
    console.log("USER:", userState);
  }, [userState]);

  //Escribir en la base de datos
  const addTodo = async (e) => {
    try {
      const docRef = await addDoc(collection(db, "catalogo"), {
        key: "Harry-Goblet",
        title: "Harry Potter and the Goblet of Fire",
        qty: 1,
        cover: "https://i.imgur.com/dzsyK29.jpeg",
        size: "S",
        price: 10,
        available_sizes: [
          { key: 1, option: "S", price: 10 },
          { key: 2, option: "M", price: 20 },
          { key: 3, option: "L", price: 30 },
        ],
      });
      fetchPost();
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  //Leer base de datos
  const fetchPost = async () => {
    await getDocs(collection(db, "catalogo")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCatalogo(newData);
      console.log("json", catalogo);
    });
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <>
      <Navbar
        cart={cart}
        setCart={setCart}
        render={render}
        setRender={setRender}
        userState={userState}
        setUserState={setUserState}
        catalogo={catalogo}
        setCatalogo={setCatalogo}
      />
      <div className="pt-[80px] relative">
        <div
          onClick={() => {
            addTodo();
          }}
          className=" absolute w-20 h-20 left-0 bottom-0 bg-amber-300 cursor-pointer"
        ></div>
        <Component
          key={router.pathname}
          {...pageProps}
          cart={cart}
          setCart={setCart}
          render={render}
          setRender={setRender}
          userState={userState}
          setUserState={setUserState}
          catalogo={catalogo}
          setCatalogo={setCatalogo}
        />
      </div>
    </>
  );
};

export default App;
