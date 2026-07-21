import { formatCategoryName } from "../utils/formatCategoryName";

const ShopBanner = ({ category }: { category: string }) => {
  return (
    <div className="bg-canvas-cream py-huge flex flex-col justify-center items-center mx-0">
      <p className="text-script-lead text-shade-50 mb-2">Collection</p>
      <h2 className="text-heading-section text-ink">
        {category ? formatCategoryName(category) : "All Products"}
      </h2>
      <div className="w-12 h-px bg-hairline mt-4"></div>
    </div>
  );
};

export default ShopBanner;