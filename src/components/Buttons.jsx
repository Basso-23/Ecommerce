import React, { useState, useEffect } from "react";
import Router from "next/router";
const Buttons = ({ name, action, data, modifier, id }) => {
  return (
    <div
      onClick={() => {
        //Valida si la accion es false, asi sabe si el usuario esta logged o no
        if (action) {
          {
            action(data, id, modifier);
          }
        } else {
          //Si la accion es false redirreciona al usuario a la pagina de Login
          Router.push("/LoginScreen");
        }
      }}
      className=" text-center bg-orange-500 text-white uppercase py-2 text-sm font-medium cursor-pointer w-full select-none"
    >
      {name}
    </div>
  );
};

export default Buttons;
