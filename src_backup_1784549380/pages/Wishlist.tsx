import { useAppSelector } from "../hooks";
import { ProductItem } from "../components";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlistItems } = useAppSelector((state) => state.wishlist);

  return (
    <div className="max-w-screen-2xl mx-auto px-5 py-16">
      <div className="text-center mb-16">
        <h1 className="text-heading-section text-ink mb-2">
          My Wishlist
        </h1>
        <p className="text-caption text-shade-50 uppercase tracking-tracked">
          Your saved items ({wishlistItems.length})
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 border border-hairline bg-canvas rounded-md max-w-xl mx-auto px-6">
          <svg
            className="w-12 h-12 text-shade-40 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <h2 className="text-heading-md text-ink mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-body-md text-shade-50 mb-8">
            Add items you love to your wishlist to keep track of them.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-ink text-on-primary text-button-label uppercase tracking-tracked px-8 py-4 rounded-pill hover:bg-shade-60 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="collection-grid">
          {wishlistItems.map((product) => (
            <ProductItem
              key={product.id}
              id={product.id}
              image={product.image}
              title={product.title}
              category={product.category}
              price={product.price}
              popularity={product.popularity}
              stock={product.stock}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;