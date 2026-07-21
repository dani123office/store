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

  // Simulate discount for SALE items (50% off for demo)
  const originalPrice = price * 2;
  const discountPercent = Math.round((1 - price / originalPrice) * 100);

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
    <div className="product-card group relative bg-canvas rounded-none">
      <Link to={`/product/${id}`} className="block relative overflow-hidden bg-canvas-cream rounded-md">
        {/* Wishlist Heart */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 group/heart"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? (
            <HiHeart className="text-red-500 text-lg transition-transform duration-300" />
          ) : (
            <HiOutlineHeart className="text-ink text-lg group-hover/heart:text-red-500 transition-colors duration-300" />
          )}
        </button>

        {/* Sold Out Badge */}
        {stock === 0 && (
          <div className="absolute top-3 left-3 z-20 bg-ink/90 text-on-primary text-caption uppercase tracking-tracked font-medium px-3 py-1 rounded-pill">
            Sold Out
          </div>
        )}

        {/* Discount Badge — coral pill */}
        {stock > 0 && discountPercent >= 30 && (
          <div className="absolute top-3 left-3 z-20 bg-primary text-on-primary text-caption uppercase tracking-tracked font-medium px-3 py-1 rounded-pill">
            {discountPercent}% OFF
          </div>
        )}

        <img
          src={`/assets/${image}`}
          alt={title}
          className={`w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105 rounded-md ${stock === 0 ? "opacity-60 grayscale-[30%]" : ""}`}
        />
        <div className="quick-view">
          {stock === 0 ? "Out of Stock" : "Quick View"}
        </div>
      </Link>
      <div className="mt-3 text-left px-0">
        {/* Category caption — grey */}
        <p className="text-product-caption text-shade-50 uppercase tracking-tracked-wide mb-1">
          {_category}
        </p>
        <Link to={`/product/${id}`}>
          <h3 className="text-product-title text-ink leading-tight">
            {title}
          </h3>
        </Link>
        {/* Price row: strike + current + badge */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-price-strike text-price-strike line-through">
            PKR {originalPrice.toLocaleString()}
          </span>
          <span className="text-price-current text-ink">
            PKR {price.toLocaleString()}
          </span>
          {stock > 0 && discountPercent >= 30 && (
            <span className="bg-primary text-on-primary text-caption uppercase tracking-tracked font-medium px-2 py-0.5 rounded-pill">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;