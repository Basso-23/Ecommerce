import React, { useState, useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";
import Router from "next/router";

const LoginScreen = ({
  cart,
  setCart,
  render,
  setRender,
  userState,
  setUserState,
}) => {
  const [redirect, setRedirect] = useState(false);

  //Si el usuario esta logged lo redireccion a home
  useEffect(() => {
    if (userState) {
      Router.push("/");
    } else {
      console.log("NO esta logged");
    }
  }, [userState]);

  //La variable "redirect hace el redirect instantaneo para que no espera la rspuesta de google para luego redirrecionar a home"
  useEffect(() => {
    if (redirect) {
      Router.push("/");
    }
  }, [redirect]);

  //Auth with Google
  async function handleLogin() {
    const googleProvider = new GoogleAuthProvider();
    await signInWithGoogle(googleProvider);
    async function signInWithGoogle(googleProvider) {
      try {
        setRedirect(true);
        const res = await signInWithRedirect(auth, googleProvider);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  }

  //Sign Out
  function handleSignOut() {
    signOut(auth);
    setRedirect(false);
  }

  return (
    <div className=" flex flex-col gap-20">
      <div className="m-auto text-7xl"> LoginScreen </div>

      <button onClick={handleLogin}>Login with google</button>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default LoginScreen;
