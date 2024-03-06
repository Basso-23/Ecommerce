import Link from "next/link";
import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const Catalogo = ({ catalogo, setCatalogo }) => {
  //Asigna un key aleatorio al producto
  function keyMaker(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const firebase_write = async (e) => {
    try {
      const docRef = await addDoc(collection(db, "catalogo"), {
        key: keyMaker(8),
        title: "Nuevo",
        qty: 1,
        cover: "https://i.imgur.com/NSdjo7f.jpeg",
        size: "S",
        price: 10,
        available_sizes: [
          { key: 1, option: "S", price: 10 },
          { key: 2, option: "M", price: 20 },
          { key: 3, option: "L", price: 30 },
        ],
      });
      firebase_read();
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  //Asigna y Actualiza la informacion de la base de datos seleccionada a una variable "catalogo"
  const firebase_read = async () => {
    await getDocs(collection(db, "catalogo")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCatalogo(newData);
    });
  };

  return (
    <main>
      <div className=" flex">
        {/* Left container*/}
        <div className=" w-[250px] h-[800px] p-5 gap-6 flex flex-col">
          <div className="w-full h-64 border"></div>
          <button
            onClick={() => {
              firebase_write();
            }}
            className=" text-center py-2  bg-orange-500 text-white"
          >
            Agregar Producto
          </button>
        </div>
        {/* Right container */}
        <div className=" flex-1 p-5">
          {/* Products---------------------------------------------------------------------------------------------- */}
          <section className="grid grid-cols-3 gap-x-6 gap-y-10">
            {catalogo
              .map((item) => (
                <div key={item.key}>
                  {/* Image with dynamic routing */}
                  <Link
                    href={{
                      pathname: "/product/[id]",
                      query: { id: item.key },
                    }}
                  >
                    <div className=" w-full h-[350px] justify-center items-center flex bg-[#F1F4F6] shadow-sm">
                      <div
                        style={{ backgroundImage: `url(${item.cover})` }}
                        className=" bg-contain bg-no-repeat mb-2 w-full h-full bg-center"
                      ></div>
                    </div>
                  </Link>
                  {/* Price */}
                  <div className="mb-2">${item.price.toFixed(2)}</div>
                  {/* Sizes */}
                </div>
              ))
              .reverse()}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Catalogo;
