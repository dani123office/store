import { useEffect, useState, useMemo, useCallback } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import {
  HiPencilSquare, HiTrash, HiPlus, HiChevronLeft, HiChevronRight,
  HiOutlineShoppingBag, HiOutlineMagnifyingGlass, HiXMark,
} from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

const ROWS_PER_PAGE = 10;

const SkeletonRow = () => (
  <tr className="border-b border-[#e0e0e0]">
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <td key={i} className="py-3 pr-5">
        <div className="h-4 bg-gray-100 rounded skeleton-shimmer" style={{ width: i === 0 ? "40px" : i === 5 ? "60px" : "80%", height: i === 0 ? "40px" : "16px" }} />
      </td>
    ))}
  </tr>
);

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customFetch.get("/products");
      setProducts(res.data.data ?? []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    try {
      await customFetch.delete(`/products/${id}`);
      toast.success("Product deleted");
      setConfirmDelete(null);
      fetchProducts();
    } catch { toast.error("Failed to delete"); }
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    try {
      await Promise.all(Array.from(selected).map((id) => customFetch.delete(`/products/${id}`)));
      toast.success(`${selected.size} product${selected.size > 1 ? "s" : ""} deleted`);
      setSelected(new Set());
      setSelectAll(false);
      fetchProducts();
    } catch { toast.error("Failed to delete some products"); }
  };

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      const matchesStock =
        !stockFilter ||
        (stockFilter === "out" && p.stock === 0) ||
        (stockFilter === "low" && p.stock >= 1 && p.stock <= 15) ||
        (stockFilter === "in" && p.stock >= 16);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  useEffect(() => { setPage(1); setSelected(new Set()); setSelectAll(false); }, [search, categoryFilter, stockFilter]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) { setSelected(new Set()); setSelectAll(false); }
    else { setSelected(new Set(paginated.map((p) => p.id))); setSelectAll(true); }
  };

  const stockBadge = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", bg: "bg-[#fef1ee]", text: "text-[#d72c0d]" };
    if (stock <= 15) return { label: "Low Stock", bg: "bg-[#fff5e6]", text: "text-[#b8860b]" };
    return { label: "In Stock", bg: "bg-[#f1f8f5]", text: "text-[#008060]" };
  };

  const hasActiveFilters = search || categoryFilter || stockFilter;

  return (
    <div className="p-6 space-y-6 admin-theme text-[#000000]">
      <ConfirmModal
        open={confirmDelete !== null}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-wide text-[#000000]">Products</h1>
        <Link
          to="/admin/products/add"
          className="bg-[#000000] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#3f3f46] transition-all shadow-sm flex items-center gap-2"
        >
          <HiPlus className="text-base" />
          Add Product
        </Link>
      </div>

      <div className="bg-white border border-[#e4e4e7] rounded-xl overflow-hidden shadow-[0_8px_8px_rgba(0,0,0,0.01),0_4px_4px_rgba(0,0,0,0.01),0_2px_2px_rgba(0,0,0,0.01),0_0_0_1px_rgba(0,0,0,0.03)]">
        <div className="px-5 py-3 border-b border-[#e4e4e7] bg-[#fbfbf5]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setCategoryFilter(""); setStockFilter(""); }}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                  !categoryFilter && !stockFilter
                    ? "bg-[#c1fbd4] text-[#000000] border-transparent font-bold"
                    : "bg-white text-[#52525b] border-[#e4e4e7] hover:text-[#000000]"
                }`}
              >
                All
              </button>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-[#e4e4e7] rounded-full px-4 py-1.5 text-xs font-medium text-[#000000] outline-none focus:border-[#000000] bg-white transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.length > 0 && categories.map((cat) => (
                  <option key={cat} value={cat}>{cat.replace(/-/g, " ")}</option>
                ))}
              </select>
              <select 
                value={stockFilter} 
                onChange={(e) => setStockFilter(e.target.value)}
                className="border border-[#e4e4e7] rounded-full px-4 py-1.5 text-xs font-medium text-[#000000] outline-none focus:border-[#000000] bg-white transition-all cursor-pointer"
              >
                <option value="">All Stock</option>
                <option value="in">In Stock (16+)</option>
                <option value="low">Low Stock (1-15)</option>
                <option value="out">Out of Stock (0)</option>
              </select>
              <span className="text-[10px] uppercase font-bold text-[#a1a1aa] tracking-wide ml-2">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2 rounded-full transition-all ${showSearch ? "bg-[#c1fbd4] text-[#000000]" : "text-[#52525b] hover:text-[#000000] hover:bg-gray-100"}`}
                title="Search"
              >
                <HiOutlineMagnifyingGlass className="text-base" />
              </button>
            </div>
          </div>
        </div>

        {showSearch && (
          <div className="px-5 py-3 border-b border-[#e4e4e7] bg-[#fbfbf5]">
            <div className="relative max-w-xs">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b] text-sm" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full border border-[#e4e4e7] rounded-full pl-9 pr-8 py-1.5 text-xs outline-none focus:border-[#000000] transition-all bg-white"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#000000]">
                  <HiXMark className="text-sm" />
                </button>
              )}
            </div>
          </div>
        )}

        {selected.size > 0 && (
          <div className="flex items-center gap-3 px-5 py-2.5 border-b border-[#e4e4e7] bg-[#d4f9e0] text-xs font-semibold">
            <span className="text-[#008060]">{selected.size} Selected</span>
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 text-[#d72c0d] hover:text-[#b8200a] font-bold transition-all"
            >
              <HiTrash className="text-sm" />
              Delete Selected
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#fbfbf5] border-b border-[#e4e4e7] text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider">
                <th className="py-3 pl-5 pr-2 w-10">
                  <input 
                    type="checkbox"
                    checked={selectAll && paginated.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-[#000000] focus:ring-[#000000] cursor-pointer"
                  />
                </th>
                <th className="text-left py-3 pr-5">Image</th>
                <th className="text-left py-3 pr-5">Title</th>
                <th className="text-left py-3 pr-5">Category</th>
                <th className="text-right py-3 pr-5">Price</th>
                <th className="text-right py-3 pr-5">Stock</th>
                <th className="text-right py-3 pr-5 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginated.length > 0 ? (
                paginated.map((product) => {
                  const badge = stockBadge(product.stock);
                  const isLow = product.stock > 0 && product.stock <= 15;
                  const isOut = product.stock === 0;
                  return (
                    <tr key={product.id} className="border-b border-[#e4e4e7] hover:bg-[#fbfbf5]/40 transition-colors">
                      <td className="py-3 pl-5 pr-2 text-center">
                        <input 
                          type="checkbox"
                          checked={selected.has(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="rounded border-gray-300 text-[#000000] focus:ring-[#000000] cursor-pointer"
                        />
                      </td>
                      <td className="py-3 pr-5">
                        <img 
                          src={`/assets/${product.image}`} 
                          alt={product.title}
                          className="w-10 h-12 object-cover rounded border border-[#e4e4e7]"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/assets/product image 1.jpg"; }}
                        />
                      </td>
                      <td className="py-3 pr-5 font-bold text-[#000000]">{product.title}</td>
                      <td className="py-3 pr-5 text-[#52525b] text-[10px] font-bold uppercase tracking-wider">{product.category.replace(/-/g, " ")}</td>
                      <td className="py-3 pr-5 text-right font-semibold tabular-nums text-gray-800">Rs.{product.price.toLocaleString()}</td>
                      <td className="py-3 pr-5 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          isOut ? "bg-[#fef1ee] text-[#d72c0d] border-[#fdd1c9]" :
                          isLow ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-[#d4f9e0] text-[#008060] border-[#c1fbd4]"
                        }`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 pr-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            className="p-1.5 hover:bg-gray-100 rounded-full text-[#52525b] hover:text-[#000000] transition-all"
                            title="Edit product"
                          >
                            <HiPencilSquare className="text-base" />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete(product.id)}
                            className="p-1.5 hover:bg-red-50 rounded-full text-[#52525b] hover:text-[#d72c0d] transition-all"
                            title="Delete product"
                          >
                            <HiTrash className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <HiOutlineShoppingBag className="text-5xl text-gray-300" />
                      <p className="text-sm font-semibold text-[#000000] uppercase tracking-wide">No products found</p>
                      <p className="text-xs text-[#52525b] max-w-xs leading-relaxed">
                        {hasActiveFilters
                          ? "Try adjusting your search or filters to find what you're looking for."
                          : "Get started by adding your first product to the store."}
                      </p>
                      {hasActiveFilters ? (
                        <button 
                          onClick={() => { setSearch(""); setCategoryFilter(""); setStockFilter(""); }}
                          className="mt-2 text-xs font-bold text-[#000000] hover:underline transition-all uppercase tracking-wider"
                        >
                          Clear all filters
                        </button>
                      ) : (
                        <Link 
                          to="/admin/products/add"
                          className="mt-2 bg-[#000000] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#3f3f46] transition-all shadow-sm inline-flex items-center gap-2"
                        >
                          <HiPlus className="text-base" />
                          Add Product
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-[#e4e4e7] text-xs text-[#52525b] bg-[#fbfbf5]">
          <span>
            {filtered.length > 0
              ? `Showing ${(page - 1) * ROWS_PER_PAGE + 1}-${Math.min(page * ROWS_PER_PAGE, filtered.length)} of ${filtered.length} results`
              : "Showing 0 results"}
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <HiChevronLeft className="text-lg" />
            </button>
            <span className="text-[10px] font-bold px-2">{page} of {Math.max(totalPages, 1)}</span>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <HiChevronRight className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
