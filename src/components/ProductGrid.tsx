import React from "react";
import ProductItem from "./ProductItem";
import { nanoid } from "nanoid";

const ProductGrid = ({ products }: { products?: Product[] }) => {
  return (
    <div className="collection-grid">
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
