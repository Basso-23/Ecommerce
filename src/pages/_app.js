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

  //Verifica el estado del usuario
  useEffect(() => {
    onAuthStateChanged(auth, userCheckState);
  }, [userState]);
  //console.log del estado del usuario
  function userCheckState(user) {
    if (user) {
      setUserState(user.displayName);
      console.log("USER STATE:", userState);
    } else {
      console.log("User undefined");
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
