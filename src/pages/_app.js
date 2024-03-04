import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import { auth } from "@/firebase/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

const App = ({ Component, pageProps, router }) => {
  const [cart, setCart] = useState([]);
  const [render, setRender] = useState(true);
  const [userState, setUserState] = useState();

  //Muestra en consola el nombre del usuario
  useEffect(() => {
    console.log("USER:", userState);
  }, [userState]);

  //Verifica el estado del usuario
  useEffect(() => {
    onAuthStateChanged(auth, userCheckState);
  }, []);
  //console.log del estado del usuario
  function userCheckState(user) {
    if (user) {
      setUserState(user.displayName);
      console.log("HAY USER (app)");
    } else {
      console.log("NO HAY USER (app)");
    }
  }

  return (
    <>
      <Navbar
        cart={cart}
        setCart={setCart}
        render={render}
        setRender={setRender}
        userState={userState}
        setUserState={setUserState}
      />
      <div className="pt-[80px]">
        <Component
          key={router.pathname}
          {...pageProps}
          cart={cart}
          setCart={setCart}
          render={render}
          setRender={setRender}
          userState={userState}
          setUserState={setUserState}
        />
      </div>
    </>
  );
};

export default App;
