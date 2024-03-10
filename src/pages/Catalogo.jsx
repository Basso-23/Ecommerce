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
  const [deleteModal, setDeleteModal] = useState(false); //Estado para abrir y cerrar el si estas seguro borrar el producto
  const [updateModal, setUpdateModal] = useState(false); //Estado para abrir y cerrar el form para editar el producto
  const [tempKey, setTempKey] = useState(""); //Guarda la key del producto cuando le das click a borrar o editar
  const [verifyMessage, setVerifyMessage] = useState([]); //Estado del mensaje que si necesita guardar los cambios
  const [updateChange, setUpdateChange] = useState(false); //Estado del si edito un producto para despues darle a guardar
  const [categorias, setCategorias] = useState([]); //Array donde se almacenan las categorias existentes
  const [filter, setFilter] = useState("default"); //Filtro de ordenar por
  const [filteredProducts, setFilteredProducts] = useState(catalogo); //Array contiene la info de catalogo para controlar los filtros
  const [filteredSize, setFilteredSize] = useState(0); //Almacena el tamaño del catalogo
  const [indicesToShow, setIndicesToShow] = useState([]); //Almacena los indices de los productos que mostrara en el catalogo
  //Guarda la data del form de CREAR un producto
  const [formData, setFormData] = useState({
    key: "",
    name: "",
    image: "",
    category: "",
    description: "",
    price: "",
    available_qty: "",
  });
  //Guarda la data del form de EDITAR un producto
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

  //Se encarga de asignar los cambios del input para CREAR un producto //////////////////////////////////////////////////////////////////////////////////////////////
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  //SUBMIT de CREAR producto //////////////////////////////////////////////////////////////////////////////////////////////
  const handleSubmit = (event) => {
    event.preventDefault();
    //Asigna una key aleatoria
    formData.key = keyMaker(10);

    //Tranforma de string a number el precio y las cantidades disponibles
    formData.price = Number(formData.price);
    formData.available_qty = Number(formData.available_qty);
    console.log(formData);
    //Escribe los datos en la base de datos
    firebase_write();
  };

  //Escribe la informacion en la base de datos //////////////////////////////////////////////////////////////////////////////////////////////
  const firebase_write = async () => {
    try {
      //Transforma a minusculas el nombre y la categoria del producto para que uno haya problemas al momento de buscar un producto
      const lowerCaseName = formData.name.toLowerCase();
      const lowerCaseCategory = formData.category.toLowerCase();
      await setDoc(doc(db, "catalogo", formData.key), {
        key: formData.key,
        name: lowerCaseName,
        image: formData.image,
        category: lowerCaseCategory,
        description: formData.description,
        price: formData.price,
        qty: 1,
        available_qty: formData.available_qty,
        index: catalogo.length,
      });
      //Lee la base de datos y actualiza los datos
      firebase_read();

      console.log("Nuevo producto creado con la key:", formData.key);
      //Borra los valores almacenados en el array para asi poder crear un nuevo producto
      formData.key = "";
      formData.name = "";
      formData.image = "";
      formData.category = "";
      formData.description = "";
      formData.price = "";

      formData.available_qty = "";
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  //Se encarga de asignar los cambios en el input para EDITAR un producto //////////////////////////////////////////////////////////////////////////////////////////////
  const handleChangeUpdate = (event) => {
    const { name, value } = event.target;
    setFormDataUpdate((prevState) => ({ ...prevState, [name]: value }));
    setUpdateChange(true);
  };

  //Actualiza el articulo requiere: (nombre de la coleccion y la key del producto a actualizar) //////////////////////////////////////////////////////////////////////////////////////////////
  const firebase_update = async (event) => {
    //Reinicia la temp key
    setTempKey("");
    //Cierra el form de editar
    setUpdateModal(false);
    event.preventDefault();
    //Transforma de string a number el precio y las cantidades disponibles
    formDataUpdate.price = Number(formDataUpdate.price);
    formDataUpdate.available_qty = Number(formDataUpdate.available_qty);

    //Transforma a minusculas el nombre del producto para que uno haya problemas al momento de buscar un producto
    const lowerCaseName = formDataUpdate.name.toLowerCase();
    const lowerCaseCategory = formDataUpdate.category.toLowerCase();
    await updateDoc(doc(db, "catalogo", tempKey), {
      name: lowerCaseName,
      image: formDataUpdate.image,
      category: lowerCaseCategory,
      description: formDataUpdate.description,
      price: formDataUpdate.price,
      available_qty: formDataUpdate.available_qty,
    });
    //Lee la base de datos y actualiza los datos
    firebase_read();
    setUpdateChange(false);
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

    //Ordena el catalogo por orden de creacion
    catalogo.sort((a, b) => {
      if (a.index < b.index) {
        return -1;
      }
    });

    //Verifica si hay cambios sin guardar cada vez que se borra algo del catalogo
    firebase_verify_message();

    //Se encarga de el manejor de categorias, si detecta una categoria que no existe cuando el catalogo se actualiza la agrega automaticamente
    const categories = new Set();
    catalogo.forEach((product) => {
      categories.add(product.category);
    });

    //Ingresa todas las categorias existentes del catalogo a un array
    const uniqueCategories = Array.from(categories);
    setCategorias(uniqueCategories);
  }, [catalogo]);

  //Funcion que filtra el array en base a lo que escribe en el input de search //////////////////////////////////////////////////////////////////////////////////////////////
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

  //Verifica el estado del mensaje si hay cambios sin guardar a la base de datos //////////////////////////////////////////////////////////////////////////////////////////////
  const firebase_verify_message = async () => {
    await getDocs(collection(db, "verifyMessage")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      //Asigna el estado del mensaje de cambios sin guardar
      setVerifyMessage(newData);
    });
    {
      verifyMessage.map((item) =>
        console.log("CAMBIOS SIN GUARDAR", item.cambios_sin_guardar)
      );
    }
  };

  //Actualiza el estado del mensaje si hay cambios por guardar //////////////////////////////////////////////////////////////////////////////////////////////
  const verifyMessageState = async (state) => {
    if (state) {
      await updateDoc(doc(db, "verifyMessage", "OOzVQ50JrdJvEAv8H63Z"), {
        cambios_sin_guardar: true,
      });
    } else {
      await updateDoc(doc(db, "verifyMessage", "OOzVQ50JrdJvEAv8H63Z"), {
        cambios_sin_guardar: false,
      });
    }

    //Lee la base de datos y actualiza los datos
    firebase_verify_message();
  };

  //Filtra el array con la categoria seleccionada //////////////////////////////////////////////////////////////////////////////////////////////
  const categorySelection = async (category) => {
    const filtered = catalogo.filter((item) =>
      item.category.includes(category)
    );

    //Asigna los valores filtrados
    setFilteredProducts(filtered);

    setFilter("default");
  };

  const [sortedAscProducts, setSortedAscProducts] = useState([]);
  const [sortedDescProducts, setSortedDescProducts] = useState([
    ...filteredProducts,
  ]);

  //Cada vez que se actualiza el filtro verifica cual es el actual para ordenar el catalogo de esa forma //////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (filter == "default") {
      //Ordena el catalogo por orden de creacion
      filteredProducts.sort((a, b) => {
        if (a.index < b.index) {
          return -1;
        }
      });
    }
    if (filter == "menor") {
      // Ordenar el catalogo según el valor de price
      filteredProducts.sort((a, b) => a.price - b.price);
    }
    if (filter == "mayor") {
      // Ordenar el catalogo según el valor de price
      filteredProducts.sort((a, b) => b.price - a.price);

      const sortedProducts = [...filteredProducts].sort(
        (a, b) => a.price - b.price
      );
      setSortedAscProducts(sortedProducts);

      setFilteredProducts(sortedProducts);

      console.log("sortedd", sortedProducts);
    }
  }, [filter]);

  const productsToShow = 4; //si se desea cambiar la cantidad de productos a mostrar debe cambiar esto#######################

  //Cada vez que se actualiza el tamaño del catalogo se calcula los indices que debe mostrar //////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // Creamos un array con el número dado y los siguientes tres números en cuenta regresiva
    const generarArray = (numero, cantidad) => {
      const array = [numero];
      for (let i = 1; i < cantidad; i++) {
        array.push(numero - i);
      }
      return array;
    };
    //Asigna los indices a mostarr en base al largo del catalogo en ese momento
    setIndicesToShow(generarArray(filteredSize - 1, productsToShow));
  }, [filteredSize]);

  useEffect(() => {
    console.log("TAMAÑO", filteredProducts.length);
    setFilteredSize(filteredProducts.length);
  }, [filteredProducts]);

  //PAGINA ANTERIOR //////////////////////////////////////////////////////////////////////////////////////////////
  const prevPage = () => {
    const nuevosIndices = indicesToShow.map((index) => index + productsToShow);

    if (indicesToShow.includes(filteredSize - 1)) {
      console.log("ESTAS EN LA PRIMERA PAGINA");
    } else {
      setIndicesToShow(nuevosIndices);
    }
  };

  //PAGINA SIGUIENTE //////////////////////////////////////////////////////////////////////////////////////////////
  const nextPage = () => {
    const nuevosIndices = indicesToShow.map((index) => index - productsToShow);
    if (indicesToShow.includes(0)) {
      console.log("YA NO SE PUEDE AVANZAR");
    } else {
      setIndicesToShow(nuevosIndices);
    }
    console.log("next", filteredProducts);
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
              className="capitalize border mt-2"
              onChange={handleFilter}
            />
          </div>

          {/* Ordenar por container*/}
          <div>
            Ordenar por
            <div className="w-full font-medium capitalize mt-2 select-none">
              {/* Map de las categorias*/}
              <div
                className={
                  !updateModal
                    ? "flex flex-col gap-2 "
                    : "text-gray-300 flex flex-col gap-2 pointer-events-none"
                }
              >
                <div
                  className=" cursor-pointer hover:text-amber-500 w-fit "
                  onClick={() => {
                    //Debo ponerlo aqui y en el useEffect para que funcione
                    filteredProducts.sort((a, b) => {
                      if (a.index < b.index) {
                        return -1;
                      }
                    });
                    setFilter("default");
                  }}
                >
                  Nuevos
                </div>
                <div
                  className=" cursor-pointer hover:text-amber-500 w-fit "
                  onClick={() => {
                    //Debo ponerlo aqui y en el useEffect para que funcione
                    filteredProducts.sort((a, b) => b.price - a.price);
                    setFilter("menor");
                  }}
                >
                  Menor Precio
                </div>
                <div
                  className=" cursor-pointer hover:text-amber-500 w-fit "
                  onClick={() => {
                    //Debo ponerlo aqui y en el useEffect para que funcione
                    filteredProducts.sort((a, b) => a.price - b.price);
                    setFilter("mayor");
                  }}
                >
                  Mayor Precio
                </div>
              </div>
            </div>
          </div>

          {/* Categories container*/}
          <div>
            Categorias
            <div className="w-full font-medium capitalize mt-2 max-h-[250px] overflow-y-auto">
              {/* Todos los productos */}
              <div
                className=" cursor-pointer hover:text-amber-500 w-fit mb-2 "
                onClick={() => {
                  categorySelection("");
                }}
              >
                All
              </div>
              {/* Map de las categorias*/}
              <div className="flex flex-col gap-2 ">
                {categorias.map((item, index) => (
                  <div
                    className=" cursor-pointer hover:text-amber-500 w-fit "
                    onClick={() => {
                      categorySelection(item);
                    }}
                    key={index}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                  //Ordena el index de los productos
                  indexVerify();
                  //Actualiza el estado del mensaje de cambios sin guardar
                  verifyMessageState(false);
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
              .map((item, index) => (
                <div
                  key={item.key}
                  style={{
                    display: indicesToShow.includes(index) ? "block" : "none",
                  }}
                >
                  {index}
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
                      {/* Index y stock container */}
                      <div
                        className={
                          userState === process.env.ADMINID ? "flex" : "hidden"
                        }
                      >
                        {/* Stock */}
                        <div className="top-0 right-0 absolute bg-lime-500 px-2 py-1 text-white">
                          Stock: {item.available_qty}
                        </div>
                        {/* Index */}
                        <div className=" top-0 left-1   absolute text-gray-300">
                          {item.index}
                        </div>
                      </div>
                    </div>
                  </Link>
                  {/* Botones de productos container */}
                  <div
                    className={
                      userState === process.env.ADMINID
                        ? "flex justify-end gap-0"
                        : "hidden"
                    }
                  >
                    {/* Borrar Producto */}
                    <button
                      className="bg-rose-500 px-2 py-1 text-white"
                      onClick={() => {
                        setDeleteModal(true);
                        setTempKey(item.key);
                      }}
                    >
                      🗑️
                    </button>
                    {/* Editar Producto */}
                    <button
                      className=" "
                      onClick={() => {
                        //Si el producto es el seleccionado cuando le de denuevo al icono de editar se cerrara, si la da al icono de otro porducto se le abrira el modal de ese producto
                        if (tempKey === item.key) {
                          setUpdateModal(!updateModal);
                        } else {
                          setUpdateModal(true);
                        }
                        setUpdateChange(false);

                        // Asigna los valores del producto para que se vean en el form de EDITAR
                        formDataUpdate.name = item.name;
                        formDataUpdate.image = item.image;
                        formDataUpdate.category = item.category;
                        formDataUpdate.description = item.description;
                        formDataUpdate.price = item.price;
                        formDataUpdate.available_qty = item.available_qty;
                      }}
                    >
                      {/* Controla si se muestra el icono de editar o el de cerrar de acuerdo al producto seleccionado */}
                      {updateModal && tempKey === item.key ? (
                        <div
                          onClick={() => {
                            setTempKey("");
                          }}
                          className="bg-white px-2 py-1 text-white"
                        >
                          ❌
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setTempKey(item.key);
                          }}
                          className="bg-lime-500 px-2 py-1 text-white"
                        >
                          ⚙️
                        </div>
                      )}
                    </button>
                  </div>
                  {/* Info container */}
                  <div
                    className={
                      tempKey != item.key
                        ? "flex flex-col gap-2 mt-4"
                        : "hidden"
                    }
                  >
                    {/* Category */}
                    <div className=" text-sm text-zinc-400  capitalize">
                      {item.category}
                    </div>
                    {/* Name */}
                    <div className=" text-xl font-medium capitalize">
                      {item.name}
                    </div>
                    {/* Price */}
                    <div className="">${item.price.toFixed(2)}</div>
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
                      className="flex flex-col gap-2 mt-4 text-center "
                      onSubmit={firebase_update}
                    >
                      <input
                        className={
                          updateChange
                            ? "w-full py-2 bg-amber-500 text-white cursor-pointer"
                            : "w-full py-2 bg-gray-200 text-white pointer-events-none"
                        }
                        type="submit"
                        value="GUARDAR"
                      />

                      <label className="hidden">
                        Descripcion
                        <textarea
                          className=" border border-black w-full h-40 "
                          rows={4}
                          cols={40}
                          type="text"
                          name="description"
                          value={formDataUpdate.description}
                          onChange={handleChangeUpdate}
                          required
                        />
                      </label>
                      <div className=" grid grid-cols-2 ">
                        <label>
                          Producto
                          <input
                            className=" border border-black w-full text-center capitalize"
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
                            className=" border border-black w-full text-center capitalize"
                            type="text"
                            name="category"
                            value={formDataUpdate.category}
                            onChange={handleChangeUpdate}
                            required
                          />
                        </label>
                      </div>
                      <div className=" grid grid-cols-2">
                        <label>
                          Precio 💸
                          <input
                            className=" border border-black w-full text-center"
                            type="number"
                            name="price"
                            value={formDataUpdate.price}
                            onChange={handleChangeUpdate}
                            required
                          />
                        </label>
                        <label>
                          Stock
                          <input
                            className=" border border-black w-full text-center"
                            type="number"
                            name="available_qty"
                            value={formDataUpdate.available_qty}
                            onChange={handleChangeUpdate}
                            required
                          />
                        </label>
                      </div>
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
                    </form>
                  </div>
                </div>
              ))
              .reverse()}
          </div>
          <div className=" flex gap-10">
            <button onClick={prevPage}>Previous</button>
            <button onClick={nextPage}>Next</button>

            <p>Índices a mostrar: {JSON.stringify(indicesToShow)}</p>
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
                    setTempKey("");
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
                    //Actualiza el estado del mensaje de cambios sin guardar
                    verifyMessageState(true);
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
      <div className=" min-h-screen"></div>
    </main>
  );
};

export default Catalogo;
