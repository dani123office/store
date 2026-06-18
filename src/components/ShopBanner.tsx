import { formatCategoryName } from "../utils/formatCategoryName";

const ShopBanner = ({ category }: { category: string }) => {
  return (
    <div className="bg-gradient-to-r from-[#151515] to-[#2a2a2a] text-white py-16 flex flex-col justify-center items-center mx-5 my-8">
      <h2 className="text-2xl md:text-4xl font-light tracking-[0.2em] uppercase font-serif">
        {category ? formatCategoryName(category) : "All Products"}
      </h2>
      <div className="w-12 h-[1px] bg-white/40 mt-4"></div>
    </div>
  );
};

export default ShopBanner;
