import React from "react";
import ProductItem from "./ProductItem";
import { nanoid } from "nanoid";

interface ProductGridProps {
  products?: Product[];
  className?: string;
}

const ProductGrid = ({ products, className = "collection-grid" }: ProductGridProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 w-full col-span-full">
        <p className="text-sm font-medium text-gray-500 tracking-wider">No products found matching your selection.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {products.map((product: Product) => (
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
