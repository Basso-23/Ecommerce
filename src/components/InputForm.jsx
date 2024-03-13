import React from "react";

const InputForm = ({ name, value, onChange }) => {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="border"
    />
  );
};

export default InputForm;
