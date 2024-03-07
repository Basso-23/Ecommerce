import React, { useState, useEffect } from "react";
import Link from "next/link";
import { products_db } from "@/json/products_db";

const Inicio = ({ catalogo, setCatalogo }) => {
  const users = [
    { name: "John", age: 25 },
    { name: "Mary", age: 30 },
    { name: "Jane", age: 20 },
    { name: "Bob", age: 35 },
  ];

  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleFilter = (event) => {
    const value = event.target.value;
    const filtered = users.filter((user) => user.name.includes(value));
    setFilteredUsers(filtered);
  };
  return (
    <main>
      <div>
        <input
          type="text"
          className="capitalize border"
          onChange={handleFilter}
        />
        {filteredUsers.map((user) => (
          <div key={user.name}>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
          </div>
        ))}
      </div>
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
