import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { HiAdjustmentsHorizontal, HiXMark } from "react-icons/hi2";

const colors = ["Black", "Red", "Blue", "White", "Rose", "Green"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const ShopFilterAndSort = ({
  sortCriteria,
  setSortCriteria,
}: {
  sortCriteria: string;
  setSortCriteria: (value: string) => void;
}) => {
  const { showingProducts, totalProducts } = useAppSelector((state) => state.shop);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const activeColor = searchParams.get("color") || "";
  const activeSize = searchParams.get("size") || "";
  const activePrice = searchParams.get("price") ? Number(searchParams.get("price")) : 35000;

  const updateFilters = (key: string, value: string | number | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (sortCriteria) newParams.set("sort", sortCriteria);
    setSearchParams(newParams);
    setShowFilters(false);
  };

  useEffect(() => {
    const urlSort = searchParams.get("sort");
    if (urlSort && urlSort !== sortCriteria) {
      setSortCriteria(urlSort);
    }
  }, [searchParams]);

  const handleSortChange = (value: string) => {
    setSortCriteria(value);
    updateFilters("sort", value === "default" ? null : value);
  };

  return (
    <div className="px-5 mb-8">
      <div className="flex justify-between items-center pb-4 border-b border-hairline max-sm:flex-col max-sm:gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-ink px-4 py-2 text-caption uppercase tracking-tracked font-medium hover:bg-ink hover:text-on-primary transition-all focus:outline-none rounded-pill"
          >
            <HiAdjustmentsHorizontal className="text-sm" />
            {showFilters ? "Hide Filters" : "Filter"}
          </button>
          <p className="text-caption text-shade-50 tracking-tracked-wide">
            Showing {showingProducts} of {totalProducts} results
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <label className="text-caption uppercase tracking-tracked text-shade-50">Sort by:</label>
          <select
            className="border border-hairline px-3 py-2 text-caption bg-canvas text-ink focus:outline-none focus:border-ink font-medium rounded-sm"
            onChange={(e) => handleSortChange(e.target.value)}
            value={sortCriteria}
          >
            <option value="default">Default</option>
            <option value="popularity">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="bg-canvas-cream border-b border-x border-hairline p-6 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade">
          <div className="space-y-3">
            <h4 className="text-caption uppercase tracking-tracked font-medium text-ink">
              Max Price (PKR)
            </h4>
            <div className="space-y-2">
              <input
                type="range"
                min="2000"
                max="50000"
                step="1000"
                value={activePrice}
                onChange={(e) => updateFilters("price", e.target.value)}
                className="w-full h-1 bg-shade-20 rounded-lg appearance-none cursor-pointer accent-ink"
              />
              <div className="flex justify-between text-caption font-medium text-shade-50">
                <span>PKR 2,000</span>
                <span className="font-bold text-ink">PKR {activePrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-caption uppercase tracking-tracked font-medium text-ink">
              Filter by Color
            </h4>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => {
                const isActive = activeColor.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={color}
                    onClick={() => updateFilters("color", isActive ? null : color.toLowerCase())}
                    className={`text-caption uppercase font-medium tracking-tracked px-3 py-1.5 border transition-all rounded-pill ${
                      isActive
                        ? "bg-ink text-on-primary border-ink"
                        : "bg-canvas text-shade-50 border-hairline hover:border-ink"
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-caption uppercase tracking-tracked font-medium text-ink">
              Filter by Size
            </h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const isActive = activeSize.toLowerCase() === size.toLowerCase();
                return (
                  <button
                    key={size}
                    onClick={() => updateFilters("size", isActive ? null : size.toLowerCase())}
                    className={`text-caption font-medium px-3 py-1.5 border transition-all rounded-sm ${
                      isActive
                        ? "bg-ink text-on-primary border-ink"
                        : "bg-canvas text-shade-50 border-hairline hover:border-ink"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-end space-y-2">
            <div className="flex flex-wrap gap-1 mb-2">
              {activeColor && (
                <span className="inline-flex items-center gap-1 text-caption uppercase font-medium bg-shade-20 px-2.5 py-1 rounded-pill text-ink">
                  Color: {activeColor}
                  <button onClick={() => updateFilters("color", null)} className="text-primary hover:text-primary-dark">x</button>
                </span>
              )}
              {activeSize && (
                <span className="inline-flex items-center gap-1 text-caption uppercase font-medium bg-shade-20 px-2.5 py-1 rounded-pill text-ink">
                  Size: {activeSize}
                  <button onClick={() => updateFilters("size", null)} className="text-primary hover:text-primary-dark">x</button>
                </span>
              )}
              {searchParams.get("price") && (
                <span className="inline-flex items-center gap-1 text-caption uppercase font-medium bg-shade-20 px-2.5 py-1 rounded-pill text-ink">
                  Under: {activePrice.toLocaleString()}
                  <button onClick={() => updateFilters("price", null)} className="text-primary hover:text-primary-dark">x</button>
                </span>
              )}
            </div>
            
            <button
              onClick={clearAllFilters}
              className="flex items-center justify-center gap-1.5 border border-primary text-primary hover:bg-primary hover:text-on-primary text-caption uppercase tracking-tracked font-medium px-4 py-2.5 transition-all rounded-pill"
            >
              <HiXMark className="text-sm" />
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopFilterAndSort;