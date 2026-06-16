import { formatCategoryName } from "../utils/formatCategoryName";

const ShopBanner = ({ category }: { category: string }) => {
  return (
    <div className="bg-[#151515] text-white py-14 flex justify-center items-center mx-5 my-8">
      <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] uppercase">
        {category ? formatCategoryName(category) : "All Products"}
      </h2>
    </div>
  );
};

export default ShopBanner;
