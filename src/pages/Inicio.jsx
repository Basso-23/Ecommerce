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
                className="aspect-[12/18] bg-cover bg-no-repeat mb-2 w-32"
              ></div>
            </Link>
            {/* Price */}
            <div className="mb-2">${item.price.toFixed(2)}</div>
            {/* Sizes */}
          </div>
        ))}
      </section>
    </main>
  );
};

export default Inicio;
