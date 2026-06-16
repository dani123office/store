import { useEffect, useState, useMemo } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { HiPencilSquare, HiTrash, HiPlus, HiXMark, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

const ROWS_PER_PAGE = 10;

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "", category: "special-edition", price: "", stock: "",
    image: "", popularity: "1",
  });

  const fetchProducts = async () => {
    try {
      const res = await customFetch.get("/products");
      setProducts(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm({ title: "", category: "special-edition", price: "", stock: "", image: "", popularity: "1" });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      title: product.title, category: product.category,
      price: String(product.price), stock: String(product.stock),
      image: product.image, popularity: String(product.popularity),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await customFetch.delete(`/products/${id}`);
      toast.success("Product deleted");
      setConfirmDelete(null);
      fetchProducts();
    } catch { toast.error("Failed to delete"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title, category: form.category, price: Number(form.price),
      stock: Number(form.stock), image: form.image || "product image 1.jpg",
      popularity: Number(form.popularity),
    };
    try {
      if (editingProduct) {
        await customFetch.put(`/products/${editingProduct.id}`, payload);
        toast.success("Product updated");
      } else {
        await customFetch.post("/products", payload);
        toast.success("Product added");
      }
      resetForm();
      fetchProducts();
    } catch { toast.error("Something went wrong"); }
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

  useEffect(() => { setPage(1); }, [search, categoryFilter, stockFilter]);

  const stockBadge = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", bg: "bg-[#fef1ee]", text: "text-[#d72c0d]" };
    if (stock <= 15) return { label: "Low Stock", bg: "bg-[#fff5e6]", text: "text-[#b8860b]" };
    return { label: "In Stock", bg: "bg-[#f1f8f5]", text: "text-[#008060]" };
  };

  return (
    <div>
      <ConfirmModal
        open={confirmDelete !== null}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[#202223]">Products</h1>
        <Link
          to="/admin/products/add"
          className="flex items-center gap-2 bg-[#008060] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#006e52] transition-colors"
        >
          <HiPlus className="text-lg" />
          Add Product
        </Link>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={resetForm} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
              <h2 className="text-base font-semibold text-[#202223]">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={resetForm} className="text-[#6d7175] hover:text-[#202223]">
                <HiXMark className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Title</label>
                <input type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Category</label>
                <select value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white"
                >
                  <option value="special-edition">Special Edition</option>
                  <option value="luxury-collection">Luxury Collection</option>
                  <option value="summer-edition">Summer Edition</option>
                  <option value="unique-collection">Unique Collection</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#202223] mb-1">Price (Rs.)</label>
                  <input type="number" required min="0" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#202223] mb-1">Stock</label>
                  <input type="number" required min="0" value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Image</label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input type="text" value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="product image 1.jpg"
                      className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] mb-2"
                    />
                    <label className="flex items-center gap-2 cursor-pointer bg-[#f1f1f1] hover:bg-[#e5e5e5] text-sm font-medium px-4 py-2 rounded-lg text-[#202223] transition-colors w-fit">
                      <HiPlus className="text-base" />
                      Upload Image
                      <input type="file" accept="image/*" className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append("file", file);
                          try {
                            const res = await customFetch.post("/upload", fd);
                            setForm({ ...form, image: res.data.filename });
                            toast.success("Image uploaded");
                          } catch { toast.error("Upload failed"); }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  {form.image && (
                    <img src={`/assets/${form.image}`} alt="preview"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/80?text=No+Image"; }}
                      className="w-20 h-20 object-cover rounded border border-[#e0e0e0] flex-shrink-0"
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="bg-[#008060] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#006e52] transition-colors"
                >
                  {editingProduct ? "Update" : "Add Product"}
                </button>
                <button type="button" onClick={resetForm}
                  className="border border-[#e0e0e0] text-sm font-medium px-6 py-2.5 rounded-lg text-[#6d7175] hover:bg-[#f1f1f1] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input type="text" placeholder="Search products..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] w-60"
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat.replace(/-/g, " ")}</option>
          ))}
        </select>
        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}
          className="border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] bg-white"
        >
          <option value="">All Stock</option>
          <option value="in">In Stock (16+)</option>
          <option value="low">Low Stock (1-15)</option>
          <option value="out">Out of Stock (0)</option>
        </select>
        <span className="text-xs text-[#6d7175] ml-auto">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fafafa]">
              <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase w-14">Image</th>
              <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Title</th>
              <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Category</th>
              <th className="text-right py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Price</th>
              <th className="text-right py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Stock</th>
              <th className="text-right py-3 px-5 text-xs font-medium text-[#6d7175] uppercase w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((product) => {
              const badge = stockBadge(product.stock);
              return (
                <tr key={product.id} className="border-t border-[#e0e0e0] hover:bg-[#f5f5f5] transition-colors">
                  <td className="py-2 px-5">
                    <img src={`/assets/${product.image}`} alt={product.title}
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/40?text=N/A"; }}
                    />
                  </td>
                  <td className="py-3 px-5 font-medium text-[#202223]">{product.title}</td>
                  <td className="py-3 px-5 text-[#6d7175] text-xs uppercase tracking-wider">{product.category.replace(/-/g, " ")}</td>
                  <td className="py-3 px-5 text-right font-medium tabular-nums">Rs.{product.price.toLocaleString()}</td>
                  <td className="py-3 px-5 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.text.replace("text", "bg")}`} />
                      {badge.label}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        className="p-1.5 hover:bg-[#f1f1f1] rounded text-[#6d7175] hover:text-[#2c6ecb] transition-colors"
                        title="Edit product">
                        <HiPencilSquare className="text-base" />
                      </button>
                      <button onClick={() => setConfirmDelete(product.id)}
                        className="p-1.5 hover:bg-[#f1f1f1] rounded text-[#6d7175] hover:text-[#d72c0d] transition-colors"
                        title="Delete product">
                        <HiTrash className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {paginated.length === 0 && (
          <p className="text-sm text-[#6d7175] p-6 text-center">No products found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-[#6d7175]">
          <span>
            Showing {(page - 1) * ROWS_PER_PAGE + 1}-{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}
              className="p-1.5 rounded hover:bg-[#f1f1f1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <HiChevronLeft className="text-lg" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  p === page ? "bg-[#008060] text-white" : "hover:bg-[#f1f1f1] text-[#6d7175]"
                }`}>
                {p}
              </button>
            ))}
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
              className="p-1.5 rounded hover:bg-[#f1f1f1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <HiChevronRight className="text-lg" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
