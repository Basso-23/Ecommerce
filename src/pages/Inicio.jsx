import React, { useState, useEffect } from "react";
import Link from "next/link";
import { products_db } from "@/json/products_db";

const Inicio = ({ catalogo, setCatalogo }) => {
  return (
    <main>
      <div>INICIO</div>
      {/* Products---------------------------------------------------------------------------------------------- */}
      <section className="flex justify-center gap-4 h-fit flex-wrap">
        {catalogo.map((item) => (
          <div key={item.key} className="mt-10">
            {/* Image with dynamic routing */}
            <Link
              href={{
                pathname: "/product/[id]",
                query: { id: item.key },
              }}
            >
              <div
                style={{ backgroundImage: `url(${item.cover})` }}
                className="aspect-[12/18] bg-cover bg-no-repeat mb-2"
              ></div>
            </Link>
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
          </div>
        ))}
      </section>
    </main>
  );
};

export default Inicio;
