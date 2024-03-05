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
