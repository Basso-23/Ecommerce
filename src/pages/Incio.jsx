import React, { useState } from "react";
import { products_db } from "@/json/products_db";
import Buttons from "@/components/Buttons";

const Inicio = ({ cart, setCart, render, setRender }) => {
  const [products, setProducts] = useState(products_db);

  //Importante: Valor unico del JSON: key
  //JSON que esta cambiando: cart
  //Cambiar estas dos cosas de ser necesario
  const addItem = (toAdd, id, modifier) => {
    //Encuentra el index del valor en el carrito
    const objIndex = cart.findIndex((item) => item.key === id);
    //1ro: Busca en "item.key" si el valor que recibe de "id" existe en el JSON del carrito
    //2do: Busca en index del objeto si el valor, que en este caso es "size" es igual a lo que recibe de "modifier"
    //Si ambos son "true" significa que en el carrito se encuentra el mismo producto con el mismo modifier asique aumentara la cantidad del producto
    //Si alguno de los dos es "false" agregara un nuevo producto al carrito
    if (
      cart.find((item) => item.key === id && cart[objIndex].size === modifier)
    ) {
      //Aumenta la qty del producto si ya esta en el carrito
      plusQty(id);
    } else {
      //Añade producto al carrito
      setCart((prevState) => [...prevState, toAdd]);
    }
  };

  const plusQty = (toFind) => {
    //Busca en "item.key" si el valor que recibe de "toFind" existe en el JSON del carrito
    if (cart.find((item) => item.key == toFind)) {
      const updatedItems = cart;
      //Encuentra el index del valor a cambiar
      const objIndex = cart.findIndex((item) => item.key == toFind);
      //Aumenta la qty del producto
      updatedItems[objIndex].qty += 1;
      //Actualiza la info del carrito
      setCart(updatedItems);
      console.log(cart);
      //Importante: Rerender al JSON
      setRender(!render);
    } else {
      console.log("NO existe");
    }
  };

  return (
    <main className=" flex min-h-screen justify-center ">
      {/* Products---------------------------------------------------------------------------------------------- */}
      <section
        key={render}
        className="flex justify-center gap-4 h-fit flex-wrap"
      >
        {products.map((item) => (
          <div key={item.key} className="mt-10">
            {/* Image */}
            <div
              style={{ backgroundImage: `url(${item.cover})` }}
              className="aspect-[10/14.8] w-[300px] bg-cover bg-no-repeat mb-2"
            ></div>
            {/* Price */}
            <div className="mb-2">${item.price.toFixed(2)}</div>
            {/* Sizes */}
            <div className="flex gap-6 mb-2">
              {item.available_sizes.map((data) => (
                <div
                  onClick={() => {
                    item.size = data.option;
                    item.price = data.price;
                    setRender(!render);
                  }}
                  key={data.key}
                  className={
                    item.size === data.option
                      ? "bg-orange-500 px-4 py-2 text-white select-none cursor-pointer"
                      : " bg-gray-300 px-4 py-2 text-white select-none cursor-pointer"
                  }
                >
                  {data.option}
                </div>
              ))}
            </div>
            {/* Add to cart */}
            {/* item.key + item.size = cambia el valor unico del producto al valor que posee actualmente mas su modifier */}
            <Buttons
              name={"Add"}
              action={addItem}
              id={item.key + item.size}
              modifier={item.size}
              data={{
                key: item.key + item.size,
                title: item.title,
                qty: item.qty,
                cover: item.cover,
                size: item.size,
                price: item.price,
                available_sizes: item.available_sizes,
              }}
            />
          </div>
        ))}
      </section>
    </main>
  );
};

export default Inicio;
