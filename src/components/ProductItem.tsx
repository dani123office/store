import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { HiHeart, HiOutlineHeart } from "react-icons/hi2";
import toast from "react-hot-toast";

const ProductItem = ({
  id,
  image,
  title,
  category: _category,
  price,
  popularity,
  stock,
}: {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
  popularity: number;
  stock: number;
}) => {
  const dispatch = useAppDispatch();
  const { wishlistItems } = useAppSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some((item) => item.id === id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist({ id, image, title, category: _category, price, popularity, stock }));
    if (isWishlisted) {
      toast.error("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className="product-card group relative">
      <Link to={`/product/${id}`} className="block relative overflow-hidden bg-[#f8f8f8]">
        {/* Heart Icon Overlay */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 shadow hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 group/heart"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? (
            <HiHeart className="text-red-500 text-lg transition-transform duration-300" />
          ) : (
            <HiOutlineHeart className="text-[#151515] text-lg group-hover/heart:text-red-500 transition-colors duration-300" />
          )}
        </button>

        {/* Stock Badge Overlay */}
        {stock === 0 && (
          <div className="absolute top-3 left-3 z-20 bg-[#151515]/90 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 shadow-sm">
            Sold Out
          </div>
        )}

        <img
          src={`/assets/${image}`}
          alt={title}
          className={`w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105 ${stock === 0 ? "opacity-60 grayscale-[30%]" : ""}`}
        />
        <div className="quick-view">
          {stock === 0 ? "Out of Stock" : "Quick View"}
        </div>
      </Link>
      <div className="mt-4 text-left">
        <Link to={`/product/${id}`}>
          <h3 className="text-xs md:text-sm font-semibold text-[#151515] tracking-widest uppercase">
            {title}
          </h3>
        </Link>
        <p className="text-xs md:text-sm text-[#151515]/70 mt-1 tracking-widest">
          PKR {price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
