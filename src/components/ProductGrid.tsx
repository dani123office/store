import React from "react";
import ProductItem from "./ProductItem";
import { nanoid } from "nanoid";

interface ProductGridProps {
  products?: Product[];
  className?: string;
}

const ProductGrid = ({ products, className = "collection-grid" }: ProductGridProps) => {
  return (
    <div className={className}>
      {products &&
        products.map((product: Product) => (
          <ProductItem
            key={nanoid()}
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
  );
};

export default React.memo(ProductGrid);
