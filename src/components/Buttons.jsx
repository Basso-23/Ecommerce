const Buttons = ({ name, action, id, modifier, data }) => {
  return (
    <div
      onClick={() => {
        {
          action(data, id, modifier);
        }
      }}
      className=" text-center bg-orange-500 text-white uppercase py-2 text-sm font-medium cursor-pointer w-full select-none"
    >
      {name}
    </div>
  );
};

export default Buttons;
