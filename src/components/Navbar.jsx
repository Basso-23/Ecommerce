import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Mycart from "./Mycart";

const Navbar = ({ cart, setCart, render, setRender }) => {
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
          />
        </>
      ) : null}

      <section className=" flex justify-evenly h-[80px] items-center fixed w-full font-bold z-50 bg-white ">
        <Nav name={"Pagina 1"} url={"/"} />
        <Nav name={"Pagina 2"} url={"/Pagina2"} />
        <Nav name={"Pagina 3"} url={"/Pagina3"} />
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
