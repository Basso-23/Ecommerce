import Incio from "./Incio";

export default function App({
  cart,
  setCart,
  render,
  setRender,
  userState,
  setUserState,
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
      />
    </>
  );
}
