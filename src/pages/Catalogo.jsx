import Link from "next/link";
import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const Catalogo = ({ catalogo, setCatalogo }) => {
  const [formData, setFormData] = useState({
    key: "",
    name: "",
    image: "",
    category: "",
    description: "",
    price: "",
    qty: 1,
    available_qty: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    formData.key = keyMaker(10);
    formData.qty = 1;
    formData.price = Number(formData.price);
    formData.available_qty = Number(formData.available_qty);
    console.log(formData);
    firebase_write();
  };

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

  const firebase_write = async () => {
    try {
      await setDoc(doc(db, "catalogo", formData.key), {
        key: formData.key,
        name: formData.name,
        image: formData.image,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        qty: formData.qty,
        available_qty: formData.available_qty,
      });
      firebase_read();
      console.log("Document written with ID: ", formData.key);
      formData.key = "";
      formData.name = "";
      formData.image = "";
      formData.category = "";
      formData.description = "";
      formData.price = "";
      formData.qty = "";
      formData.available_qty = "";
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

          <form onSubmit={handleSubmit}>
            <label>
              Nombre del Producto
              <input
                className=" border border-black"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              URL de Imagen
              <input
                className=" border border-black"
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Categoria
              <input
                className=" border border-black"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Descripcion
              <input
                className=" border border-black"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Precio 💸
              <input
                className=" border border-black"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Cantidad en Stock
              <input
                className=" border border-black"
                type="number"
                name="available_qty"
                value={formData.available_qty}
                onChange={handleChange}
                required
              />
            </label>

            <input type="submit" value="Submit" />
          </form>
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
                        style={{ backgroundImage: `url(${item.image})` }}
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
