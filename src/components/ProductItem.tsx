import { Link } from "react-router-dom";

const ProductItem = ({
  id,
  image,
  title,
  category: _category,
  price,
}: {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
  popularity: number;
  stock: number;
}) => {
  return (
    <div className="product-card">
      <Link to={`/product/${id}`} className="block relative overflow-hidden bg-[#f8f8f8]">
        <img
          src={`/assets/${image}`}
          alt={title}
          className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="quick-view">
          Quick View
        </div>
      </Link>
      <div className="mt-4 text-center">
        <Link to={`/product/${id}`}>
          <h3 className="text-sm md:text-base font-medium text-[#151515] tracking-wider uppercase">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-[#151515]/70 mt-1 tracking-wider">
          Rs.{price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
