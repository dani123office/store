import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="hero-banner w-full flex flex-col justify-end items-center pb-16 md:pb-24">
      <h2 className="text-white text-center text-4xl md:text-6xl font-light tracking-[0.15em] uppercase leading-tight max-w-2xl">
        Luxury Designer Dresses
      </h2>
      <h3 className="text-white/80 text-lg md:text-xl font-light tracking-[0.1em] mt-3">
        Elegance Redefined
      </h3>
      <div className="flex justify-center items-center gap-4 mt-8 flex-col sm:flex-row">
        <Link
          to="/shop"
          className="bg-white text-[#151515] text-sm tracking-[0.15em] uppercase font-medium px-10 py-3.5 hover:bg-white/90 transition-colors"
        >
          Shop Now
        </Link>
        <Link
          to="/shop/luxury-collection"
          className="text-white border border-white text-sm tracking-[0.15em] uppercase font-medium px-10 py-3.5 hover:bg-white/10 transition-colors"
        >
          See Collection
        </Link>
      </div>
    </div>
  );
};

export default Banner;
