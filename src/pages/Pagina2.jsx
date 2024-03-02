const Pagina2 = ({ cart, setCart }) => {
  return (
    <div className=" flex">
      <div className="m-auto text-sm flex flex-col gap-6">
        {cart.map((item) => (
          <div key={item.key}>{item.title}</div>
        ))}
      </div>
    </div>
  );
};

export default Pagina2;
