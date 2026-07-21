import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import customFetch from "../axios/custom";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setShowingProducts,
  setTotalProducts,
} from "../features/shop/shopSlice";

const ProductGridWrapper = ({
  searchQuery: propSearchQuery,
  sortCriteria: propSortCriteria,
  category,
  page,
  limit,
  children,
}: {
  searchQuery?: string;
  sortCriteria?: string;
  category?: string;
  page?: number;
  limit?: number;
  children:
    | ReactElement<{ products: Product[] }>
    | ReactElement<{ products: Product[] }>[];
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { totalProducts } = useAppSelector((state) => state.shop);
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  // Read URL search params
  const urlQuery = searchParams.get("query") || propSearchQuery || "";
  const urlSort = searchParams.get("sort") || propSortCriteria || "default";
  const urlColor = searchParams.get("color") || "";
  const urlSize = searchParams.get("size") || "";
  const urlPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null;

  const fetchAndFilterProducts = useCallback(async () => {
    try {
      const response = await customFetch("/products");
      const allProducts = response.data.data || [];

      // Dynamically simulate colors/sizes variants per product for search-params match
      let processed = allProducts.map((p: Product) => {
        // Assign deterministic colors and sizes based on product title/id hash
        const colorsList = ["black", "red", "blue", "white", "rose", "green"];
        const sizesList = ["xs", "s", "m", "lg", "xl", "xxl"];
        
        const hash = p.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + Number(p.id || 0);
        const pColors = [
          colorsList[hash % colorsList.length],
          colorsList[(hash + 2) % colorsList.length],
        ];
        const pSizes = [
          sizesList[hash % sizesList.length],
          sizesList[(hash + 1) % sizesList.length],
          sizesList[(hash + 3) % sizesList.length],
        ];

        return {
          ...p,
          colors: pColors,
          sizes: pSizes,
        };
      });

      // 1. Filter by Search Query
      if (urlQuery.trim()) {
        processed = processed.filter((product: any) =>
          product.title.toLowerCase().includes(urlQuery.toLowerCase())
        );
      }

      // 2. Filter by Category / Subcategory / Collection
      if (category && category !== "all") {
        processed = processed.filter((product: any) => {
          const filterSlug = category.toLowerCase().replace(/\s+/g, "-");

          // Match category slug (old slug compatibility)
          const catSlug = product.category?.toLowerCase().replace(/\s+/g, "-");
          if (catSlug === filterSlug) return true;

          // Match category relationship
          const catRel = product.category_relation || product.categoryRelation;
          if (catRel?.cat_title) {
            const relCatSlug = catRel.cat_title.toLowerCase().replace(/\s+/g, "-");
            if (relCatSlug === filterSlug) return true;
          }

          // Match subcategory relationship
          if (product.subcategory?.subcat_title) {
            const subcatSlug = product.subcategory.subcat_title.toLowerCase().replace(/\s+/g, "-");
            if (subcatSlug === filterSlug) return true;
          }

          // Match collections relationship
          if (Array.isArray(product.collections)) {
            const belongsToCollection = product.collections.some((col: any) => {
              const colTitleSlug = col.title?.toLowerCase().replace(/\s+/g, "-");
              const colHandleSlug = col.handle?.toLowerCase().replace(/\s+/g, "-");
              return colTitleSlug === filterSlug || colHandleSlug === filterSlug;
            });
            if (belongsToCollection) return true;
          }

          return false;
        });
      }

      // 3. Filter by Color
      if (urlColor) {
        processed = processed.filter((product: any) => product.colors.includes(urlColor.toLowerCase()));
      }

      // 4. Filter by Size
      if (urlSize) {
        processed = processed.filter((product: any) => product.sizes.includes(urlSize.toLowerCase()));
      }

      // 5. Filter by Max Price
      if (urlPrice) {
        processed = processed.filter((product: any) => product.price <= urlPrice);
      }

      // Update total products count
      if (totalProducts !== processed.length) {
        dispatch(setTotalProducts(processed.length));
      }

      // 6. Sort results
      if (urlSort === "price-asc") {
        processed.sort((a: any, b: any) => a.price - b.price);
      } else if (urlSort === "price-desc") {
        processed.sort((a: any, b: any) => b.price - a.price);
      } else if (urlSort === "popularity") {
        processed.sort((a: any, b: any) => b.popularity - a.popularity);
      }

      // 7. Paginate results
      if (limit) {
        setProducts(processed.slice(0, limit));
        dispatch(setShowingProducts(processed.slice(0, limit).length));
      } else if (page) {
        setProducts(processed.slice(0, page * 9));
        dispatch(setShowingProducts(processed.slice(0, page * 9).length));
      } else {
        setProducts(processed);
        dispatch(setShowingProducts(processed.length));
      }
    } catch (e) {
      console.error("Failed to fetch products in wrapper", e);
    }
  }, [urlQuery, urlSort, urlColor, urlSize, urlPrice, category, page, limit, totalProducts, dispatch]);

  useEffect(() => {
    fetchAndFilterProducts();
  }, [fetchAndFilterProducts]);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { products: products } as any);
    }
    return null;
  });

  return <>{childrenWithProps}</>;
};

export default ProductGridWrapper;
