import { useRouter } from "next/router";

const ProductInfo = ({ cart, setCart }) => {
  const router = useRouter();

  const id = router.query;
  console.log(id, "productInfo");
  return (
    <div className=" flex">
      <div className="m-auto text-sm flex flex-col gap-6">productinfo</div>
    </div>
  );
};

export default ProductInfo;
