import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import {
  HiOutlineMagnifyingGlass, HiOutlineAdjustmentsHorizontal,
  HiOutlineChevronUpDown, HiPlus, HiXMark,
  HiOutlineArchiveBox,
} from "react-icons/hi2";

interface InventoryItem {
  id: string;
  product: string;
  variant: string;
  image: string;
  sku: string;
  unavailable: number;
  committed: number;
  available: number;
  onHand: number;
}

type SortField = "product" | "sku" | "available" | "onHand";
type SortDir = "asc" | "desc";

const AdminInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sortField, setSortField] = useState<SortField>("product");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showColumns, setShowColumns] = useState(false);
  const [columns, setColumns] = useState({
    product: true, sku: true, unavailable: true,
    committed: true, available: true, onHand: true,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await customFetch.get("/products");
        const mapped: InventoryItem[] = (res.data.data ?? []).map((p: Product) => ({

          id: p.id,
          product: p.title,
          variant: p.category.replace(/-/g, " "),
          image: p.image || "",
          sku: String(p.id),
          unavailable: 0,
          committed: 0,
          available: p.stock,
          onHand: p.stock,
        }));
        setItems(mapped);
      } catch (e) {
        console.error("Products fetch failed in inventory panel, loading mock products", e);
        const mockInventory = [
          { id: "1", product: "Satori Formal Suit", variant: "Unstitched", image: "product image 1.jpg", sku: "SKU-001", unavailable: 1, committed: 0, available: 15, onHand: 16 },
          { id: "2", product: "Silk Festive Dress", variant: "Ready To Wear", image: "product image 2.jpg", sku: "SKU-002", unavailable: 0, committed: 2, available: 8, onHand: 10 },
          { id: "3", product: "Traditional Bridal Lehnga", variant: "Bridals", image: "product image 3.jpg", sku: "SKU-003", unavailable: 0, committed: 0, available: 2, onHand: 2 }
        ];
        setItems(mockInventory);
      }
    };
    fetchProducts();
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((d) => d.id)));
    }
  };

  const updateField = (id: string, _field: "available" | "onHand", value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, available: num, onHand: num } : d)));
  };

  const handleStockSave = async (id: string, newStock: number) => {
    try {
      await customFetch.put(`/products/${id}`, { stock: newStock });
      toast.success("Stock updated successfully");
    } catch {
      toast.error("Failed to update stock in database");
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = items
    .filter((i) => i.product.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const cmp = a[sortField] > b[sortField] ? 1 : -1;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const allSelected = selected.size === items.length && items.length > 0;
  const activeColsCount = 1 + Object.values(columns).filter(Boolean).length;

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-xl font-semibold text-[#202223] mb-5">Inventory</h1>

      <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#e0e0e0]">
          <div className="flex items-center gap-3">
            <button className="px-3 py-1 text-sm font-medium text-[#2c6ecb] bg-[#f1f8fe] rounded-lg border border-[#2c6ecb]">
              All
            </button>
            <button className="p-1.5 text-[#6d7175] hover:text-[#202223] hover:bg-[#f1f1f1] rounded transition-colors">
              <HiPlus className="text-base" />
            </button>
          </div>
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded transition-colors ${showSearch ? "bg-blue-50 text-[#2c6ecb]" : "text-[#6d7175] hover:text-[#202223] hover:bg-gray-100"}`}
              title="Search"
            >
              <HiOutlineMagnifyingGlass className="text-lg" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowColumns(!showColumns)}
                className="p-2 text-[#6d7175] hover:text-[#202223] hover:bg-gray-100 rounded transition-colors"
                title="Columns"
              >
                <HiOutlineAdjustmentsHorizontal className="text-lg" />
              </button>
              {showColumns && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#e0e0e0] rounded-lg shadow-lg z-10 py-1">
                  {Object.entries(columns).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#202223] hover:bg-[#fafafa] cursor-pointer capitalize">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={() => setColumns({ ...columns, [key]: !val })}
                        className="rounded border-[#d0d0d0] text-[#2c6ecb] focus:ring-[#2c6ecb]"
                      />
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => toggleSort(sortField)}
              className="p-2 text-[#6d7175] hover:text-[#202223] hover:bg-gray-100 rounded transition-colors"
              title="Sort"
            >
              <HiOutlineChevronUpDown className="text-lg" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="px-5 py-2 border-b border-[#e0e0e0] bg-[#fafafa]">
            <div className="relative max-w-xs">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175] text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name..."
                autoFocus
                className="w-full border border-[#e0e0e0] rounded-lg pl-9 pr-8 py-1.5 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#202223]">
                  <HiXMark className="text-sm" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e0e0e0]">
                <th className="py-3 pl-5 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-[#d0d0d0] text-[#2c6ecb] focus:ring-[#2c6ecb]"
                  />
                </th>
                {columns.product && (
                  <th className="text-left py-3 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    <button onClick={() => toggleSort("product")} className="flex items-center gap-1 hover:text-[#202223] uppercase">
                      Product
                      {sortField === "product" && <HiOutlineChevronUpDown className={`text-xs ${sortDir === "desc" ? "rotate-180" : ""}`} />}
                    </button>
                  </th>
                )}
                {columns.sku && (
                  <th className="text-left py-3 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    <button onClick={() => toggleSort("sku")} className="flex items-center gap-1 hover:text-[#202223] uppercase">
                      SKU
                      {sortField === "sku" && <HiOutlineChevronUpDown className={`text-xs ${sortDir === "desc" ? "rotate-180" : ""}`} />}
                    </button>
                  </th>
                )}
                {columns.unavailable && (
                  <th className="text-right py-3 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Unavailable</th>
                )}
                {columns.committed && (
                  <th className="text-right py-3 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Committed</th>
                )}
                {columns.available && (
                  <th className="text-right py-3 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    <button onClick={() => toggleSort("available")} className="flex items-center gap-1 ml-auto hover:text-[#202223] uppercase">
                      Available
                      {sortField === "available" && <HiOutlineChevronUpDown className={`text-xs ${sortDir === "desc" ? "rotate-180" : ""}`} />}
                    </button>
                  </th>
                )}
                {columns.onHand && (
                  <th className="text-right py-3 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    <button onClick={() => toggleSort("onHand")} className="flex items-center gap-1 ml-auto hover:text-[#202223] uppercase">
                      On Hand
                      {sortField === "onHand" && <HiOutlineChevronUpDown className={`text-xs ${sortDir === "desc" ? "rotate-180" : ""}`} />}
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-[#e0e0e0] hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 pl-5 pr-2">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded border-[#d0d0d0] text-[#2c6ecb] focus:ring-[#2c6ecb]"
                    />
                  </td>
                  {columns.product && (
                    <td className="py-3 pr-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-[#f1f1f1] border border-[#e0e0e0] flex items-center justify-center text-[#b0b3b5] text-xs font-medium flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={`/assets/${item.image}`} alt={item.product} className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.innerText = item.product.charAt(0); }}
                            />
                          ) : (
                            item.product.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#202223]">{item.product}</p>
                          <p className="text-xs text-[#6d7175]">{item.variant}</p>
                        </div>
                      </div>
                    </td>
                  )}
                  {columns.sku && <td className="py-3 pr-5 text-[#6d7175]">{item.sku}</td>}
                  {columns.unavailable && (
                    <td className="py-3 pr-5">
                      <input type="number" value={item.unavailable} readOnly
                        className="w-16 text-right text-sm text-[#6d7175] bg-transparent border border-transparent rounded px-2 py-1 outline-none cursor-default" />
                    </td>
                  )}
                  {columns.committed && (
                    <td className="py-3 pr-5">
                      <input type="number" value={item.committed} readOnly
                        className="w-16 text-right text-sm text-[#6d7175] bg-transparent border border-transparent rounded px-2 py-1 outline-none cursor-default" />
                    </td>
                  )}
                  {columns.available && (
                    <td className="py-3 pr-5">
                      <input type="number" value={item.available}
                        onChange={(e) => updateField(item.id, "available", e.target.value)}
                        onBlur={() => handleStockSave(item.id, item.available)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className="w-16 text-right text-sm text-[#202223] border border-[#e0e0e0] rounded px-2 py-1 outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] transition-colors" />
                    </td>
                  )}
                  {columns.onHand && (
                    <td className="py-3 pr-5">
                      <input type="number" value={item.onHand}
                        onChange={(e) => updateField(item.id, "onHand", e.target.value)}
                        onBlur={() => handleStockSave(item.id, item.onHand)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className="w-16 text-right text-sm text-[#202223] border border-[#e0e0e0] rounded px-2 py-1 outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] transition-colors" />
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={activeColsCount} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <HiOutlineArchiveBox className="h-10 w-10 text-gray-400 mb-3 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-gray-900">
                        {search ? "No products match your search" : "No products found"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 mb-4 text-center">
                        {search
                          ? "We couldn't find any products matching your query. Try adjusting your search term."
                          : "Your inventory is currently empty. Add products or variants to start tracking stock."}
                      </p>
                      {!search && (
                        <Link
                          to="/admin/products/add"
                          className="bg-neutral-900 text-white text-xs font-medium px-4 py-2.5 rounded-md hover:bg-neutral-800 transition flex items-center gap-1.5 shadow-sm"
                        >
                          <HiPlus className="text-sm" />
                          Add product
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
