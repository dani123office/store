import ProductGrid from "./ProductGrid";
import ProductGridWrapper from "./ProductGridWrapper";
import { Link } from "react-router-dom";

const HomeCollectionSection = () => {
  return (
    <section className="max-w-screen-2xl mx-auto px-5 mt-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="section-title flex-1">Featured Collection</h2>
        <Link
          to="/shop"
          className="hidden sm:block text-xs tracking-[0.15em] uppercase text-[#151515] underline underline-offset-4 hover:opacity-60 transition-opacity"
        >
          View All
        </Link>
      </div>
      <ProductGridWrapper limit={6}>
        <ProductGrid />
      </ProductGridWrapper>
      <div className="text-center mt-10 sm:hidden">
        <Link
          to="/shop"
          className="text-xs tracking-[0.15em] uppercase text-[#151515] underline underline-offset-4"
        >
          View All
        </Link>
      </div>
    </section>
  );
};

export default HomeCollectionSection;
