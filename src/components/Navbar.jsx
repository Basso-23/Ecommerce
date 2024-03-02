import Link from "next/link";
import { usePathname } from "next/navigation";
import Mycart from "./Mycart";
const Navbar = ({ cart, setCart, render, setRender }) => {
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
      {/* Carrito---------------------------------------------------------------------------------------------- */}
      <Mycart
        cart={cart}
        setCart={setCart}
        render={render}
        setRender={setRender}
      />
      <div className=" flex justify-evenly h-[80px] items-center fixed w-full font-bold z-50 bg-white ">
        <Nav name={"Pagina 1"} url={"/"} />
        <Nav name={"Pagina 2"} url={"/Pagina2"} />
        <Nav name={"Pagina 3"} url={"/Pagina3"} />
      </div>
    </main>
  );
};

export default Navbar;
