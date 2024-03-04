import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Mycart from "./Mycart";
import { auth } from "@/firebase/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import Router from "next/router";

const Navbar = ({
  cart,
  setCart,
  render,
  setRender,
  userState,
  setUserState,
}) => {
  const [cartIsOpen, setCartIsOpen] = useState(false);

  //Console log cada vez que se modifica el carrito
  useEffect(() => {
    console.log(cart);
  }, [cart]);

  //Sign Out
  function handleSignOut() {
    signOut(auth);
  }

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
      console.log("NO HAY USER (nav)");
    }
  }

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

  return (
    <main>
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
          />
        </>
      ) : null}

      <section
        key={render}
        className=" flex justify-evenly h-[80px] items-center fixed w-full font-bold z-50 bg-white "
      >
        <Nav name={"Home"} url={"/"} />
        <Nav name={"Payment"} url={"/PaymentScreen"} />
        {userState ? (
          <div>
            <div> {userState}</div>
            <button
              onClick={() => {
                handleSignOut();
                setUserState();
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Nav name={"Login"} url={"/LoginScreen"} />
        )}

        <div
          onClick={() => {
            setCartIsOpen(!cartIsOpen);
          }}
          className=" cursor-pointer select-none"
        >
          Mi carrito <span>{cart.length}</span>
        </div>
      </section>
    </main>
  );
};

export default Navbar;
