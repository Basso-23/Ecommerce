import Incio from "./Incio";

export default function App({ cart, setCart, render, setRender }) {
  return (
    <>
      <Incio
        cart={cart}
        setCart={setCart}
        render={render}
        setRender={setRender}
      />
    </>
  );
}
