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
  //Estado para abrir y cerrar el si estas seguro borrar el producto
  const [deleteModal, setDeleteModal] = useState(false);
  //Estado para abrir y cerrar el form para editar el producto
  const [updateModal, setUpdateModal] = useState(false);
  //Guarda la key del producto cuando le das click a borrar o editar
  const [tempKey, setTempKey] = useState("");
  //Estado del mensaje que necesita ordenar el index de los productos
  const [verifyMessage, setVerifyMessage] = useState([]);
  //Array contiene la info de catalogo para controlar los filtros
  const [filteredProducts, setFilteredProducts] = useState(catalogo);
  //Guarda la data de CREAR un producto
  const [formData, setFormData] = useState({
    key: "",
    name: "",
    image: "",
    category: "",
    description: "",
    price: "",
    qty: 1,
    available_qty: "",
    index: 0,
  });
  //Guarda la data de EDITAR un producto
  const [formDataUpdate, setFormDataUpdate] = useState({
    name: "",
    image: "",
    category: "",
    description: "",
    price: "",
    available_qty: "",
  });

  //Funcion que crea la key aleatoria requiere: (cantidad de caracteres que desea) //////////////////////////////////////////////////////////////////////////////////////////////
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

  //Muestra en consola la key temporal del producto seleccionado al darle al boton de borrar o editar //////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log("TEMP KEY:", tempKey);
  }, [tempKey]);

  //Se encarga de mostrar los cambios en el input para CREAR un producto //////////////////////////////////////////////////////////////////////////////////////////////
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  //SUBMIT de CREAR producto //////////////////////////////////////////////////////////////////////////////////////////////
  const handleSubmit = (event) => {
    event.preventDefault();
    //Asigna una key aleatoria
    formData.key = keyMaker(10);
    formData.qty = 1;
    formData.index = 0;
    //Tranforma de string a number el precio y las cantidades disponibles
    formData.price = Number(formData.price);
    formData.available_qty = Number(formData.available_qty);
    console.log(formData);
    //Escribe los datos en la base de datos
    firebase_write();
  };

  //Se encarga de mostrar los cambios en el input para EDITAR un producto //////////////////////////////////////////////////////////////////////////////////////////////
  const handleChangeUpdate = (event) => {
    const { name, value } = event.target;
    setFormDataUpdate((prevState) => ({ ...prevState, [name]: value }));
  };

  //Actualiza el articulo requiere: (nombre de la coleccion y la key del producto a actualizar) //////////////////////////////////////////////////////////////////////////////////////////////
  const firebase_update = async (event) => {
    //Cierra el form de editar
    setUpdateModal(false);
    event.preventDefault();
    //Transforma de string a number el precio y las cantidades disponibles
    formDataUpdate.price = Number(formDataUpdate.price);
    formDataUpdate.available_qty = Number(formDataUpdate.available_qty);

    //Transforma a minusculas el nombre del producto para que uno haya problemas al momento de buscar un producto
    const lowerCaseName = formDataUpdate.name.toLowerCase();
    await updateDoc(doc(db, "catalogo", tempKey), {
      name: lowerCaseName,
      image: formDataUpdate.image,
      category: formDataUpdate.category,
      description: formDataUpdate.description,
      price: formDataUpdate.price,
      available_qty: formDataUpdate.available_qty,
    });
    //Lee la base de datos y actualiza los datos
    firebase_read();
  };

  //Escribe la informacion en la base de datos //////////////////////////////////////////////////////////////////////////////////////////////
  const firebase_write = async () => {
    try {
      //Transforma a minusculas el nombre del producto para que uno haya problemas al momento de buscar un producto
      const lowerCaseName = formData.name.toLowerCase();
      await setDoc(doc(db, "catalogo", formData.key), {
        key: formData.key,
        name: lowerCaseName,
        image: formData.image,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        qty: formData.qty,
        available_qty: formData.available_qty,
        index: catalogo.length,
      });
      //Lee la base de datos y actualiza los datos
      firebase_read();

      console.log("Document written with ID: ", formData.key);
      //Borra los valores almacenados en el array para asi poder crear un nuevo producto
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

  //Lee la base de datos y Actualiza la informacion de la base de datos //////////////////////////////////////////////////////////////////////////////////////////////
  const firebase_read = async () => {
    await getDocs(collection(db, "catalogo")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      //Asigna los datos leidos de la base de datos al catalogo
      setCatalogo(newData);
    });
  };

  //Borra el articulo requiere: (nombre de la coleccion y la key del producto a borrar) //////////////////////////////////////////////////////////////////////////////////////////////
  const firebase_delete = async (coleccion, key) => {
    await deleteDoc(doc(db, coleccion, key));
    console.log("Articulo borrado", key);
    firebase_read();
  };

  //Actualiza el array cada vez que se actualiza el catalogo //////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setFilteredProducts(catalogo);
    firebase_read2();
    const data = catalogo.sort((a, b) => {
      if (a.index < b.index) {
        return -1;
      }
    });
    console.log("SORTED", data);
  }, [catalogo]);

  //Funcion que filtra el array en base a lo que escribe en el input //////////////////////////////////////////////////////////////////////////////////////////////
  const handleFilter = (event) => {
    const value = event.target.value;
    const filtered = catalogo.filter(
      //Transforma a minusculas el valor del input para que uno haya problemas al momento de buscar un producto
      (item) => item.name.includes(value.toLowerCase())
    );
    //Asigna los valores filtrados
    setFilteredProducts(filtered);
  };

  //Verifica y asigna el index correspondiente a cada producto (se debe usara cada vez que borras algun producto para re asignar los index correctos) //////////////////////////////////////////////////////////////////////////////////////////////
  const indexVerify = async () => {
    const handleVerify = async (key, index) => {
      console.log(key, index);
      await updateDoc(doc(db, "catalogo", key), {
        index: index,
      });

      //Lee la base de datos y actualiza los datos
      firebase_read();
    };
    {
      catalogo.map((item, index) => handleVerify(item.key, index));
    }
  };

  const firebase_read2 = async () => {
    await getDocs(collection(db, "verifyMessage")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      //Asigna los datos leidos de la base de datos al catalogo
      setVerifyMessage(newData);
    });
    {
      verifyMessage.map((item) =>
        console.log("CAMBIOS SIN GUARDAR", item.cambios_sin_guardar)
      );
    }
  };

  const verifyTrue = async () => {
    await updateDoc(doc(db, "verifyMessage", "OOzVQ50JrdJvEAv8H63Z"), {
      cambios_sin_guardar: true,
    });
    //Lee la base de datos y actualiza los datos
    firebase_read2();
  };

  const verifyFalse = async () => {
    await updateDoc(doc(db, "verifyMessage", "OOzVQ50JrdJvEAv8H63Z"), {
      cambios_sin_guardar: false,
    });
    //Lee la base de datos y actualiza los datos
    firebase_read2();
  };

  return (
    <main>
      <div className=" flex">
        {/* Left container ////////////////////////////////////////////////////////////////////////////////////////////// */}
        <section className=" w-[250px] h-[800px] p-5 gap-6 flex flex-col">
          {/* Search input*/}
          <div>
            Search
            <input
              type="text"
              className="capitalize border"
              onChange={handleFilter}
            />
          </div>
          <div className="w-full h-64 border"></div>
          {/* CREAR producto form -------------------------------------------------------------------*/}
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
                Descripcion
                <textarea
                  className=" border border-black w-full h-40"
                  rows={4}
                  cols={40}
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
        </section>
        {/* Right container ////////////////////////////////////////////////////////////////////////////////////////////// */}
        <section className=" flex-1 p-5">
          {/* Boton guardar */}

          {verifyMessage.map((item, index) => (
            <div
              key={index}
              className={
                item.cambios_sin_guardar ? "flex mb-8 gap-4" : "hidden"
              }
            >
              <div
                className=" px-10 py-2 bg-amber-500 w-fit text-white  cursor-pointer"
                onClick={() => {
                  indexVerify();
                  verifyFalse();
                }}
              >
                Guardar
              </div>
              <div className="flex my-auto text-red-600 font-semibold uppercase text-sm">
                cambios sin guardar
              </div>
            </div>
          ))}

          {/* Products container */}
          <div className="grid grid-cols-3 gap-x-6 gap-y-10">
            {filteredProducts
              .map((item) => (
                <div key={item.key}>
                  {/* Link dynamic routing */}
                  <Link
                    href={{
                      pathname: "/product/[id]",
                      query: { id: item.key },
                    }}
                  >
                    {/* Image */}
                    <div className=" w-full h-[350px] justify-center items-center flex bg-[#F1F4F6] shadow-sm relative ">
                      <div
                        style={{ backgroundImage: `url(${item.image})` }}
                        className=" bg-contain bg-no-repeat mb-2 w-full h-full bg-center"
                      ></div>
                      <div className=" top-o left-0 absolute bg-lime-500 px-2 text-white">
                        {item.available_qty}
                      </div>
                    </div>
                  </Link>
                  {/* Info container */}
                  <div className="flex flex-col gap-2 mt-4">
                    {/* Category */}
                    <div className=" text-sm text-zinc-400">
                      {item.category}
                    </div>
                    {/* Name */}
                    <div className=" text-xl font-medium capitalize">
                      {item.name}
                    </div>
                    <div className=" flex justify-between">
                      {/* Price */}
                      <div className="">${item.price.toFixed(2)}</div>
                      {/* Stock */}
                      <div
                        className={
                          userState === process.env.ADMINID
                            ? "font-medium text-gray-500"
                            : "hidden"
                        }
                      >
                        Index: {item.index}
                      </div>
                    </div>
                  </div>
                  {/* EDITAR producto form -------------------------------------------------------------------*/}
                  <div
                    className={
                      userState === process.env.ADMINID &&
                      item.key === tempKey &&
                      updateModal
                        ? "flex relative"
                        : "hidden"
                    }
                  >
                    <form
                      className="flex flex-col gap-4 mt-4 "
                      onSubmit={firebase_update}
                    >
                      <label>
                        Nombre del Producto
                        <input
                          className=" border border-black w-full capitalize"
                          type="text"
                          name="name"
                          value={formDataUpdate.name}
                          onChange={handleChangeUpdate}
                          required
                        />
                      </label>
                      <label>
                        Categoria
                        <input
                          className=" border border-black w-full"
                          type="text"
                          name="category"
                          value={formDataUpdate.category}
                          onChange={handleChangeUpdate}
                          required
                        />
                      </label>
                      <label>
                        URL de Imagen
                        <input
                          className=" border border-black w-full"
                          type="text"
                          name="image"
                          value={formDataUpdate.image}
                          onChange={handleChangeUpdate}
                          required
                        />
                      </label>
                      <label>
                        Descripcion
                        <textarea
                          className=" border border-black w-full h-40"
                          rows={4}
                          cols={40}
                          type="text"
                          name="description"
                          value={formDataUpdate.description}
                          onChange={handleChangeUpdate}
                          required
                        />
                      </label>
                      <label>
                        Precio 💸
                        <input
                          className=" border border-black w-full"
                          type="number"
                          name="price"
                          value={formDataUpdate.price}
                          onChange={handleChangeUpdate}
                          required
                        />
                      </label>
                      <label>
                        Cantidad en Stock
                        <input
                          className=" border border-black w-full"
                          type="number"
                          name="available_qty"
                          value={formDataUpdate.available_qty}
                          onChange={handleChangeUpdate}
                          required
                        />
                      </label>
                      <input
                        className=" w-full py-2 bg-amber-500 text-white cursor-pointer"
                        type="submit"
                        value="GUARDAR"
                      />
                    </form>

                    {/* Cerrar form */}
                    <div
                      onClick={() => {
                        setUpdateModal(false);
                      }}
                      className=" absolute right-0 top-0 cursor-pointer text-lg bg-red-600 text-white px-3 py-0"
                    >
                      X
                    </div>
                  </div>

                  {/* Editar Producto */}
                  <button
                    className={
                      userState === process.env.ADMINID && !updateModal
                        ? "border py-2 w-full mt-4"
                        : "hidden"
                    }
                    onClick={() => {
                      setUpdateModal(true);
                      setTempKey(item.key);
                      // Asigna los valores del producto para que se vean en el form de EDITAR
                      formDataUpdate.name = item.name;
                      formDataUpdate.image = item.image;
                      formDataUpdate.category = item.category;
                      formDataUpdate.description = item.description;
                      formDataUpdate.price = item.price;
                      formDataUpdate.available_qty = item.available_qty;
                    }}
                  >
                    EDITAR
                  </button>

                  {/* Borrar Producto */}
                  <button
                    className={
                      userState === process.env.ADMINID && !updateModal
                        ? "border py-2 w-full mt-4"
                        : "hidden"
                    }
                    onClick={() => {
                      setDeleteModal(true);
                      setTempKey(item.key);
                    }}
                  >
                    BORRAR
                  </button>
                </div>
              ))
              .reverse()}
          </div>
        </section>

        {/* Delete modal container */}
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
                    verifyTrue();
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
