import React, { useState } from "react";

// Componente de paginación
const Pagination = ({
  currentPage,
  productsPerPage,
  totalProducts,
  paginate,
  pageNumbers,
}) => {
  return (
    <nav>
      <ul className="flex  justify-center gap-10 mt-10">
        {/* Botón de página anterior */}
        <li>
          <button
            onClick={() => {
              if (currentPage > 1) {
                paginate(currentPage - 1);
              }
            }}
          >
            Prev
          </button>
        </li>
        {/* Números de página */}
        {pageNumbers.map((number) => (
          <li key={number} className={currentPage === number ? "active" : ""}>
            <a onClick={() => paginate(number)} href="#">
              {number}
            </a>
          </li>
        ))}
        {/* Botón de página siguiente */}
        <li>
          <button
            onClick={() => {
              if (currentPage < Math.ceil(totalProducts / productsPerPage)) {
                paginate(currentPage + 1);
              }
            }}
          >
            Next
          </button>
        </li>
      </ul>
      <div className=" font-bold">Pagina actual: {currentPage}</div>
    </nav>
  );
};

const Inicio = ({ catalogo }) => {
  // Estado para manejar la página actual
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const products = catalogo;

  // Calcula los índices de los productos que se muestran en la página actual
  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Función para cambiar la página actual
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Genera los números de página para mostrar en la paginación
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / pageSize); i++) {
    pageNumbers.push(i);
  }

  // Determina qué números de página mostrar en la paginación
  const getPageNumbersToShow = () => {
    if (pageNumbers.length <= 4) {
      return pageNumbers;
    }
    const lastPage = pageNumbers[pageNumbers.length - 1];
    if (currentPage <= 2) {
      return [1, 2, 3, 4];
    } else if (currentPage >= lastPage - 1) {
      return [lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
    } else {
      return [currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    }
  };
  return (
    <div className="App">
      <h1 className=" text-center text-4xl font-bold mb-10">Productos</h1>
      {/* Renderiza la página de productos */}

      <div>
        <div className=" grid  grid-cols-4">
          {currentProducts
            .map((item) => (
              <div key={item.key}>
                {/* Link dynamic routing */}
                <div>
                  {/* Image */}
                  <div className=" w-full h-[350px] justify-center items-center flex bg-[#F1F4F6] shadow-sm relative ">
                    <div
                      style={{ backgroundImage: `url(${item.image})` }}
                      className=" bg-contain bg-no-repeat mb-2 w-full h-full bg-center"
                    ></div>
                    {/* Index y stock container */}
                    <div className="flex">
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
                </div>

                {/* Info container */}
                <div className="flex flex-col gap-2 mt-4">
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
              </div>
            ))
            .reverse()}
        </div>
        <Pagination
          currentPage={currentPage}
          productsPerPage={pageSize}
          totalProducts={products.length}
          paginate={paginate}
          pageNumbers={getPageNumbersToShow()}
        />
      </div>
    </div>
  );
};

export default Inicio;
