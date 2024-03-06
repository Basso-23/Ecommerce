import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

const Catalogo = ({ catalogo, setCatalogo, userState }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [tempKey, setTempKey] = useState("");
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

  //Se encarga de mostrar los cambios en el input para crear un producto
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  //Cuando le dan a agregar producto
  const handleSubmit = (event) => {
    event.preventDefault();
    //Asigna una key aleatoria
    formData.key = keyMaker(10);
    formData.qty = 1;
    //Tranforma de string a number el precio y las cantidades disponibles
    formData.price = Number(formData.price);
    formData.available_qty = Number(formData.available_qty);
    console.log(formData);
    firebase_write();
  };

  //Funcion que crea la key aleatoria
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

  //Escribe la informacion en la base de datos
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

  //Actualiza el articulo requiere: (nombre de la coleccion y la key del producto a actualizar)
  const firebase_update = async (coleccion, key) => {
    const dbRef = doc(db, coleccion, key);
    await updateDoc(dbRef, {
      name: "cambiado",
    });
    firebase_read();
  };

  //Borra el articulo requiere: (nombre de la coleccion y la key del producto a borrar)
  const firebase_delete = async (coleccion, key) => {
    await deleteDoc(doc(db, coleccion, key));
    console.log("Articulo borrado", key);
    firebase_read();
  };

  //Muestra en consola la key temporal del producto seleccionado
  useEffect(() => {
    console.log("TEMP KEY:", tempKey);
  }, [tempKey]);

  return (
    <main>
      <div className=" flex">
        {/* Left container*/}
        <div className=" w-[250px] h-[800px] p-5 gap-6 flex flex-col">
          <div className="w-full h-64 border"></div>
          {/* Form container*/}
          <div
            className={userState === process.env.ADMINID ? "flex" : "hidden"}
          >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <label>
                Nombre del Producto
                <input
                  className=" border border-black w-full"
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
                  className=" border border-black w-full"
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
                  className=" border border-black w-full"
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
                  className=" border border-black w-full"
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
                  className=" border border-black w-full"
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
                  className=" border border-black w-full"
                  type="number"
                  name="available_qty"
                  value={formData.available_qty}
                  onChange={handleChange}
                  required
                />
              </label>

              <input
                className=" w-full py-2 bg-amber-500 text-white cursor-pointer"
                type="submit"
                value="Agregar Producto"
              />
            </form>
          </div>
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
                    <div className=" w-full h-[350px] justify-center items-center flex bg-[#F1F4F6] shadow-sm ">
                      <div
                        style={{ backgroundImage: `url(${item.image})` }}
                        className=" bg-contain bg-no-repeat mb-2 w-full h-full bg-center"
                      ></div>
                    </div>
                  </Link>
                  {/* Info container */}
                  <div className=" flex flex-col gap-2 mt-4">
                    {/* Category */}
                    <div className=" text-sm text-zinc-400">
                      {item.category}
                    </div>
                    {/* Name */}
                    <div className=" text-xl font-medium">{item.name}</div>
                    {/* Price */}
                    <div className="">${item.price.toFixed(2)}</div>
                  </div>
                  {/* Admin container */}
                  <div
                    className={
                      userState === process.env.ADMINID
                        ? "flex flex-col mt-6 gap-4"
                        : "hidden"
                    }
                  >
                    {/* Update */}
                    <button
                      className="border py-1"
                      onClick={() => {
                        firebase_update("catalogo", item.key);
                      }}
                    >
                      MODIFICAR
                    </button>
                    {/* Price */}
                    <button
                      className="border py-1 "
                      onClick={() => {
                        setDeleteModal(true);
                        setTempKey(item.key);
                      }}
                    >
                      BORRAR
                    </button>
                  </div>
                </div>
              ))
              .reverse()}
          </section>
        </div>

        {/* Dlete modal container */}
        {deleteModal ? (
          <div className="pageSize h-screen flex flex-col justify-center items-center fixed z-50 bg-[#ffffff]">
            <div className="flex flex-col -mt-44 gap-10">
              <div className=" text-xl">
                ¿Confirmas que quieres eliminar este producto?
              </div>
              <div className="  grid grid-cols-2 gap-10 w-[#ffffff]">
                {/* Cerrar modal */}
                <button
                  onClick={() => {
                    setDeleteModal(false);
                  }}
                  className="w-full py-2 px-6 bg-red-500 text-white"
                >
                  CANCELAR
                </button>
                {/* Borrar producto */}
                <button
                  onClick={() => {
                    firebase_delete("catalogo", tempKey);
                    setDeleteModal(false);
                  }}
                  className="w-full py-2 px-6 bg-amber-500 text-white"
                >
                  SI
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Catalogo;
