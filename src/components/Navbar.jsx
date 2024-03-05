import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Mycart from "./Mycart";
import { auth } from "@/firebase/firebase";

import Router from "next/router";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  signInWithPopup,
} from "firebase/auth";

const Navbar = ({
  cart,
  setCart,
  render,
  setRender,
  userState,
  setUserState,
  catalogo,
  setCatalogo,
}) => {
  const [cartIsOpen, setCartIsOpen] = useState(false);

  //Console log cada vez que se modifica el carrito
  useEffect(() => {
    console.log(cart);
  }, [cart]);

  const pathname = usePathname();
  const Nav = ({ name, url }) => {
    return (
      <div>
        <Link
          className={pathname === url ? "text-[#5649e4] " : " text-[#b1b1b1] "}
          href={url}
        >
          {name}
        </Link>
      </div>
    );
  };

  //Auth with Google
  async function handleLogin() {
    const googleProvider = new GoogleAuthProvider();
    await signInWithGoogle(googleProvider);
    async function signInWithGoogle(googleProvider) {
      try {
        console.log("antes");
        const res = await signInWithPopup(auth, googleProvider);
        console.log("despues");
      } catch (error) {
        console.log(error);
      }
    }
  }

  //Sign Out y redireccion a home
  function handleSignOut() {
    signOut(auth);
    Router.push("/");
  }

  return (
    <main className="pageSize fixed  ">
      {/* Carrito ---------------------------------------------------------------------------------------------- */}
      {cartIsOpen ? (
        <>
          <Mycart
            cart={cart}
            setCart={setCart}
            render={render}
            setRender={setRender}
            userState={userState}
            setUserState={setUserState}
            catalogo={catalogo}
            setCatalogo={setCatalogo}
          />
        </>
      ) : null}

      <section className=" flex  justify-between h-[80px] items-center z-50 bg-white  ">
        <div className=" flex gap-6">
          <Nav name={"Inicio"} url={"/"} />
          <Nav name={"Catalogo"} url={"/Catalogo"} />
        </div>
        <div className=" flex gap-6">
          {userState ? (
            <div className=" flex gap-4">
              <div> {userState}</div>
              <button
                onClick={() => {
                  handleSignOut();
                  setUserState();
                }}
              >
                Cerrar Sesión
              </button>
              <div
                onClick={() => {
                  setCartIsOpen(!cartIsOpen);
                }}
                className=" cursor-pointer select-none"
              >
                🛒 <span>{cart.length}</span>
              </div>
            </div>
          ) : (
            <button onClick={handleLogin}>Identifícate</button>
          )}
        </div>
      </section>
    </main>
  );
};

export default Navbar;
