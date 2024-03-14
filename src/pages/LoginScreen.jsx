import React, { useState, useEffect, useRef } from "react";
import InputForm from "@/components/InputForm";
import { db } from "@/firebase/firebase";
import { keyMaker } from "@/components/keyMaker";
import {
  collection,
  getDocs,
  query,
  orderBy,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const CrearUsuario = () => {
  const [tempKey, setTempKey] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [data, setData] = useState([]);
  const [formInfo, setFormInfo] = useState({
    nombre: "",
    apellido: "",
  });
  const [editInfo, setEditInfo] = useState({
    nombre: "",
    apellido: "",
  });

  //FUNCTION: Almacena los datos a la BD requiere: (nombre de la coleccion, info a guardar)
  const firebase_write = async (coleccion, info) => {
    //* Guardar los datos en Firestore
    await setDoc(doc(db, coleccion, info.key), info);

    //* Lee y asigna los datos de la base de datos requiere: (nombre de la coleccion, variable donde guardar los datos, orden al guardar)
    firebase_read("usuarios", setData, "index");
  };

  //FUNCTION: Lee y asigna los datos de la BD requiere: (nombre de la coleccion, variable donde guardar los datos, orden al guardar)
  const firebase_read = async (coleccion, save, order) => {
    await getDocs(
      query(collection(db, coleccion), orderBy(order, "desc"))
    ).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      //* Asigna los datos leídos de la base de datos
      save(newData);
    });
  };

  //FUNCTION: Borra el dato seleccionado de la BD requiere: (nombre de la coleccion y la key del producto)
  const firebase_delete = async (coleccion, key) => {
    await deleteDoc(doc(db, coleccion, key));
    console.log("Articulo borrado", key);
    //* Lee y asigna los datos de la base de datos requiere: (nombre de la coleccion, variable donde guardar los datos, orden al guardar)
    firebase_read("usuarios", setData, "index");
  };

  //FUNCTION: Actualiza el dato seleccionado de la BD requiere: (nombre de la coleccion y la key del producto)
  const firebase_edit = async (coleccion, info) => {
    await updateDoc(doc(db, coleccion, tempKey), info);

    //* Lee y asigna los datos de la base de datos requiere: (nombre de la coleccion, variable donde guardar los datos, orden al guardar)
    firebase_read("usuarios", setData, "index");
  };

  //FUNCTION: Lee la base de datos al cargar la pagina
  useEffect(() => {
    //* Lee y asigna los datos de la base de datos requiere: (nombre de la coleccion, variable donde guardar los datos, orden al guardar)
    firebase_read("usuarios", setData, "index");
  }, []);

  //FUNCTION: Maneja el onChange los input
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  //FUNCTION: Maneja el submit del form
  const handleSubmit = async (event) => {
    event.preventDefault();

    //* Generar la key
    const randomKey = keyMaker(12);

    //* Asigna la fecha y hora actual
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleString();

    //* Definir la info a enviar
    const info = {
      key: randomKey,
      index: fechaFormateada,
      nombre: formInfo.nombre,
      apellido: formInfo.apellido,
    };

    //* Almacena los datos en Firestore requiere: (nombre de la coleccion, info a guardar)
    firebase_write("usuarios", info);

    //* Limpiar los campos después de enviar los datos
    formInfo.nombre = "";
    formInfo.apellido = "";
  };

  //FUNCTION: Maneja el onChange los input del edit
  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setEditInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  //FUNCTION: Maneja el submit del form de edit
  const handleSubmitEdit = async (event) => {
    event.preventDefault();

    //* Cierra el modal de editar
    setUpdateModal(false);

    //* Definir la info a enviar
    const info = {
      nombre: editInfo.nombre,
      apellido: editInfo.apellido,
    };

    //* Almacena los datos en Firestore requiere: (nombre de la coleccion, info a guardar)
    firebase_edit("usuarios", info);

    //* Limpiar los campos después de enviar los datos
    editInfo.nombre = "";
    editInfo.apellido = "";
  };

  return (
    <main className=" mt-10">
      {/*//SECTION: Form container // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      <section>
        <form className="flex gap-5 items-center" onSubmit={handleSubmit}>
          <label>
            <InputForm
              name="nombre"
              value={formInfo.nombre}
              placeholder={"Nombre"}
              onChange={handleChange}
            />
          </label>
          <label>
            <InputForm
              name="apellido"
              value={formInfo.apellido}
              placeholder={"Apellido"}
              onChange={handleChange}
            />
          </label>
          <button
            className=" px-10 py-1 bg-lime-500 text-white uppercase tracking-wide active:scale-95 transition-all"
            type="submit"
          >
            Crear Usuario
          </button>
        </form>
      </section>

      {/*//SECTION: Map de los datos // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      <section>
        <div className=" mt-20 flex flex-col gap-10">
          {data.map((item, index) => (
            <div className=" w-fit" key={index}>
              <form
                className=" flex gap-5 relative"
                onSubmit={handleSubmitEdit}
              >
                <div className="w-[500px] grid grid-cols-3">
                  {updateModal && tempKey == item.key ? (
                    <>
                      <label>
                        <InputForm
                          name="nombre"
                          value={editInfo.nombre}
                          placeholder={item.nombre}
                          onChange={handleChangeEdit}
                        />
                      </label>
                      <label>
                        <InputForm
                          name="apellido"
                          value={editInfo.apellido}
                          placeholder={item.apellido}
                          onChange={handleChangeEdit}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <div className="border-b border-transparent">
                        {item.nombre}
                      </div>
                      <div className="border-b border-transparent">
                        {item.apellido}
                      </div>
                    </>
                  )}
                  <div>{item.index}</div>
                </div>

                {updateModal && tempKey == item.key ? (
                  <>
                    <button
                      type="submit"
                      className=" cursor-pointer select-none"
                    >
                      ✅
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => {
                        setTempKey(item.key);
                        setUpdateModal(!updateModal);
                      }}
                      className={
                        updateModal || deleteModal
                          ? " pointer-events-none grayscale select-none"
                          : "cursor-pointer select-none"
                      }
                    >
                      ✏️
                    </div>
                  </>
                )}
                <div
                  onClick={() => {
                    setTempKey(item.key);
                    setDeleteModal(true);
                  }}
                  className={
                    updateModal || deleteModal
                      ? " pointer-events-none grayscale select-none"
                      : "cursor-pointer select-none"
                  }
                >
                  🗑️
                </div>
                {updateModal && tempKey == item.key ? (
                  <button
                    onClick={() => {
                      setUpdateModal(false);
                    }}
                    className=" cursor-pointer select-none font-medium  tracking-wide text-rose-600 "
                  >
                    CLOSE
                  </button>
                ) : null}
                {deleteModal && tempKey == item.key ? (
                  <div className="  absolute w-full  grid grid-cols-2 gap-6 text-center tracking-wide">
                    <div
                      onClick={() => {
                        firebase_delete("usuarios", tempKey);
                        setDeleteModal(false);
                      }}
                      className=" bg-lime-500 text-white py-1 cursor-pointer"
                    >
                      CONFIRMAR
                    </div>
                    <div
                      onClick={() => {
                        setDeleteModal(false);
                      }}
                      className=" bg-rose-600  text-white py-1 cursor-pointer"
                    >
                      CANCELAR
                    </div>
                  </div>
                ) : null}
              </form>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default CrearUsuario;
