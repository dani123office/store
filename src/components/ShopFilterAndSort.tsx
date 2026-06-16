import { useAppSelector } from "../hooks";

const ShopFilterAndSort = ({
  sortCriteria,
  setSortCriteria,
}: {
  sortCriteria: string;
  setSortCriteria: (value: string) => void;
}) => {
  const { showingProducts, totalProducts } = useAppSelector(state => state.shop);
  return (
    <div className="flex justify-between items-center px-5 pb-6 border-b border-[#E2E2E2] max-sm:flex-col max-sm:gap-4">
      <p className="text-sm text-[#151515]/60 tracking-wider">
        Showing {showingProducts} of {totalProducts} results
      </p>
      <div className="flex gap-3 items-center">
        <label className="text-xs tracking-wider uppercase text-[#151515]/70">Sort by:</label>
        <select
          className="border border-[#E2E2E2] px-3 py-2 text-sm bg-white text-[#151515] focus:outline-none focus:border-[#151515]"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSortCriteria(e.target.value)
          }
          value={sortCriteria}
        >
          <option value="default">Default</option>
          <option value="popularity">Popularity</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default ShopFilterAndSort;
