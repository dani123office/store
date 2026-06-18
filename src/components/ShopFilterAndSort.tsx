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

  // Read filter values from URL search params
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
    // reset page to 1 on filter change
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (sortCriteria) newParams.set("sort", sortCriteria);
    setSearchParams(newParams);
    setShowFilters(false);
  };

  // Keep sorting synced with URL
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
      {/* Top Bar with Totals, Toggle, and Sort */}
      <div className="flex justify-between items-center pb-4 border-b border-[#E2E2E2] max-sm:flex-col max-sm:gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-[#151515] px-4 py-2 text-xs font-semibold tracking-widest uppercase hover:bg-[#151515] hover:text-white transition-all focus:outline-none"
          >
            <HiAdjustmentsHorizontal className="text-sm" />
            {showFilters ? "Hide Filters" : "Filter"}
          </button>
          <p className="text-xs text-[#151515]/60 tracking-wider">
            Showing {showingProducts} of {totalProducts} results
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <label className="text-xs tracking-wider uppercase text-[#151515]/70">Sort by:</label>
          <select
            className="border border-[#E2E2E2] px-3 py-2 text-xs bg-white text-[#151515] focus:outline-none focus:border-[#151515] font-medium"
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

      {/* Expandable Filter Drawer Panel */}
      {showFilters && (
        <div className="bg-[#fcfbf9] border-b border-x border-[#E2E2E2] p-6 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade">
          {/* Price Range Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151515]">
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
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#151515]"
              />
              <div className="flex justify-between text-xs font-medium text-[#151515]/70">
                <span>PKR 2,000</span>
                <span className="font-bold text-[#151515]">PKR {activePrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151515]">
              Filter by Color
            </h4>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => {
                const isActive = activeColor.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={color}
                    onClick={() => updateFilters("color", isActive ? null : color.toLowerCase())}
                    className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 border transition-all ${
                      isActive
                        ? "bg-[#151515] text-white border-[#151515]"
                        : "bg-white text-[#151515]/70 border-[#e0e0e0] hover:border-[#151515]"
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151515]">
              Filter by Size
            </h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const isActive = activeSize.toLowerCase() === size.toLowerCase();
                return (
                  <button
                    key={size}
                    onClick={() => updateFilters("size", isActive ? null : size.toLowerCase())}
                    className={`text-[10px] font-bold px-3 py-1.5 border transition-all ${
                      isActive
                        ? "bg-[#151515] text-white border-[#151515]"
                        : "bg-white text-[#151515]/70 border-[#e0e0e0] hover:border-[#151515]"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex flex-col justify-end space-y-2">
            <div className="flex flex-wrap gap-1 mb-2">
              {activeColor && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase bg-gray-100 px-2.5 py-1 rounded">
                  Color: {activeColor}
                  <button onClick={() => updateFilters("color", null)} className="text-red-500 hover:text-red-700">×</button>
                </span>
              )}
              {activeSize && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase bg-gray-100 px-2.5 py-1 rounded">
                  Size: {activeSize}
                  <button onClick={() => updateFilters("size", null)} className="text-red-500 hover:text-red-700">×</button>
                </span>
              )}
              {searchParams.get("price") && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase bg-gray-100 px-2.5 py-1 rounded">
                  Under: {activePrice.toLocaleString()}
                  <button onClick={() => updateFilters("price", null)} className="text-red-500 hover:text-red-700">×</button>
                </span>
              )}
            </div>
            
            <button
              onClick={clearAllFilters}
              className="flex items-center justify-center gap-1.5 border border-red-500 hover:bg-red-500 hover:text-white text-red-500 text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 transition-all"
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
