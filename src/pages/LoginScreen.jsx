import React, { useState, useEffect, useRef } from "react";
import InputForm from "@/components/InputForm";
import { db } from "@/firebase/firebase";
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

  //FUNCTION: Crea la key aleatoria requiere: (cantidad de caracteres que desea)
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

  //FUNCTION: Almacena los datos a la BD requiere: (nombre de la coleccion, info a guardar)
  const firebase_write = async (coleccion, info) => {
    //* Guardar los datos en Firestore
    await setDoc(doc(db, coleccion, info.key), info);

    //* Lee y asigna los datos de la base de datos requiere: (nombre de la coleccion, variable donde guardar los datos, orden al guardar)
    firebase_read("usuarios", setData, "index");
  };

  //FUNCTION: Lee y asigna los datos de la BD requiere: (nombre de la coleccion, variable donde guardar los datos, orden al guardar)
  const firebase_read = async (coleccion, save, order) => {
    await getDocs(query(collection(db, coleccion), orderBy(order))).then(
      (querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        //* Asigna los datos leídos de la base de datos
        save(newData);
      }
    );
  };

  //FUNCTION: Borra el dato seleccionado de la BD requiere: (nombre de la coleccion y la key del producto)
  const firebase_delete = async (coleccion, key) => {
    await deleteDoc(doc(db, coleccion, key));
    console.log("Articulo borrado", key);
    //* Lee y asigna los datos de la base de datos requiere: (nombre de la coleccion, variable donde guardar los datos, orden al guardar)
    firebase_read("usuarios", setData, "index");
  };

  //FUNCTION: Actualiza el dato seleccionado de la BD requiere: (nombre de la coleccion y la key del producto)
  const firebase_update = async (coleccion, info) => {
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
    firebase_update("usuarios", info);

    //* Limpiar los campos después de enviar los datos
    editInfo.nombre = "";
    editInfo.apellido = "";
  };

  return (
    <main>
      {/*//SECTION: Form container // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      <section>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <InputForm
              name="nombre"
              value={formInfo.nombre}
              onChange={handleChange}
            />
          </label>
          <label>
            Apellido:
            <InputForm
              name="apellido"
              value={formInfo.apellido}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Crear Usuario</button>
        </form>
      </section>

      {/*//SECTION: Map de los datos // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      <section>
        <div className=" mt-20 flex flex-col gap-10">
          {data
            .map((item, index) => (
              <div key={index} className=" flex gap-5">
                <div>
                  {item.nombre} - {item.index}
                </div>
                <div
                  onClick={() => {
                    setTempKey(item.key);
                    setDeleteModal(true);
                  }}
                  className=" cursor-pointer select-none"
                >
                  🗑️
                </div>
                <div
                  onClick={() => {
                    setTempKey(item.key);
                    setUpdateModal(!updateModal);
                  }}
                  className=" cursor-pointer select-none"
                >
                  ✏️
                </div>
              </div>
            ))
            .reverse()}
        </div>
      </section>

      {/*//SECTION: Modal de confirmar delete // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      <section>
        {deleteModal ? (
          <div className=" fixed top-96 left-5 w-80 h-32 grid grid-cols-2 justify-center items-center z-50 text-center gap-5 select-none">
            <div className=" absolute top-0 fixedCenterX w-full">
              Confirmas que quieres borrar este elemento?
            </div>
            <div
              onClick={() => {
                firebase_delete("usuarios", tempKey);
                setDeleteModal(false);
              }}
              className=" bg-lime-400 text-white py-1 cursor-pointer"
            >
              SI
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
      </section>

      {/*//SECTION: Form edit container // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}

      {updateModal ? (
        <section className=" fixed top-[600px] left-5 w-80 h-32 grid grid-cols-2 justify-center items-center z-50 text-center gap-5 select-none">
          <form onSubmit={handleSubmitEdit}>
            <label>
              Nombre:
              <InputForm
                name="nombre"
                value={editInfo.nombre}
                onChange={handleChangeEdit}
              />
            </label>
            <label>
              Apellido:
              <InputForm
                name="apellido"
                value={editInfo.apellido}
                onChange={handleChangeEdit}
              />
            </label>
            <button type="submit">Guardar</button>
          </form>
        </section>
      ) : null}
    </main>
  );
};

export default CrearUsuario;
