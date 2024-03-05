import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const App = ({ Component, pageProps, router }) => {
  const [cart, setCart] = useState([]);
  const [render, setRender] = useState(true);
  const [userState, setUserState] = useState();
  const [catalogo, setCatalogo] = useState([]);

  //Verifica si el usuario esta registrado
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

  //Obtiene los datos del catalogo de la base de datos cuando carga la pagina
  useEffect(() => {
    firebase_read();
  }, []);

  //Asigna la informacion de la base de datos seleccionada a una variable "catalogo"
  const firebase_read = async () => {
    await getDocs(collection(db, "catalogo")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCatalogo(newData);
    });
  };

  //Muestra en consola el catalogo cada vez que cambia
  useEffect(() => {
    console.log("CATALOGO:", catalogo);
  }, [catalogo]);

  return (
    <div className=" flex flex-col items-center ">
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
      <div className="pt-[80px] pageSize">
        <Component
          key={router.pathname}
          {...pageProps}
          userState={userState}
          setUserState={setUserState}
          cart={cart}
          setCart={setCart}
          catalogo={catalogo}
          setCatalogo={setCatalogo}
          render={render}
          setRender={setRender}
        />
      </div>
    </div>
  );
};

export default App;
