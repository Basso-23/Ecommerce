import Incio from "./Incio";

export default function App({
  cart,
  setCart,
  render,
  setRender,
  userState,
  setUserState,
  catalogo,
  setCatalogo,
}) {
  return (
    <>
      <Incio
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
  );
}
