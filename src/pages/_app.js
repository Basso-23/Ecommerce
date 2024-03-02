import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";

const App = ({ Component, pageProps, router }) => {
  const [cart, setCart] = useState([]);
  const [render, setRender] = useState(true);
  return (
    <>
      <Navbar
        cart={cart}
        setCart={setCart}
        render={render}
        setRender={setRender}
      />
      <div className="pt-[80px]">
        <Component
          key={router.pathname}
          {...pageProps}
          cart={cart}
          setCart={setCart}
          render={render}
          setRender={setRender}
        />
      </div>
    </>
  );
};

export default App;
