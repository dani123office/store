import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { HiPencilSquare, HiTrash, HiPlus, HiXMark, HiOutlinePhoto, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import ConfirmModal from "../components/ConfirmModal";

interface SubCategory {
  subcat_id: string;
  subcat_title: string;
  subcat_img: string;
  cat_id: string;
}

interface Category {
  id: string;
  cat_title: string;
}

function normalizeSubcategories(data: any[]): SubCategory[] {
  return data.map((item) => ({
    subcat_id: item.subcat_id || item.id || "",
    subcat_title: item.subcat_title || "",
    subcat_img: item.subcat_img || "",
    cat_id: item.cat_id || "",
  }));
}

const ImgPlaceholder = () => (
  <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
    <HiOutlinePhoto className="text-gray-300 text-lg" />
  </div>
);

const AdminSubCategories = () => {
  const [items, setItems] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SubCategory | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ subcat_title: "", subcat_img: "", cat_id: "" });
  const [deleteTarget, setDeleteTarget] = useState<{ subcat_id: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fetchData = async () => {
    try {
      const res = await customFetch.get("/sub-categories");
      setItems(normalizeSubcategories(res.data));
    } catch (e) {
      console.error("Subcategories fetch failed, loading fallback", e);
      const stored = localStorage.getItem("zarka_subcategories_fallback");
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        const initial = [
          { subcat_id: "1", subcat_title: "Summer Collection", subcat_img: "luxury category 1.png", cat_id: "1" },
          { subcat_id: "2", subcat_title: "Winter Collection", subcat_img: "luxury category 2.png", cat_id: "2" }
        ];
        setItems(initial);
        localStorage.setItem("zarka_subcategories_fallback", JSON.stringify(initial));
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await customFetch.get("/categories");
      setCategories(res.data);
    } catch (e) {
      console.error("Categories fetch failed in subcategories panel, loading fallback", e);
      const stored = localStorage.getItem("zarka_categories_fallback");
      if (stored) {
        setCategories(JSON.parse(stored));
      } else {
        setCategories([
          { id: "1", cat_title: "Unstitched" },
          { id: "2", cat_title: "Ready To Wear" },
          { id: "3", cat_title: "Bridals" },
          { id: "4", cat_title: "Jewellery" }
        ]);
      }
    }
  };

  useEffect(() => { fetchData(); fetchCategories(); }, []);

  const resetForm = () => {
    setForm({ subcat_title: "", subcat_img: "", cat_id: "" });
    setImgError(false);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: SubCategory) => {
    setEditing(item);
    setForm({ subcat_title: item.subcat_title, subcat_img: item.subcat_img, cat_id: item.cat_id });
    setImgError(false);
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await customFetch.delete(`/sub-categories/${deleteTarget.subcat_id}`);
      toast.success("Subcategory deleted");
      fetchData();
    } catch {
      const updated = items.filter((s) => s.subcat_id !== deleteTarget.subcat_id);
      setItems(updated);
      localStorage.setItem("zarka_subcategories_fallback", JSON.stringify(updated));
      toast.success("Subcategory deleted (Local fallback)");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await customFetch.put(`/sub-categories/${editing.subcat_id}`, form);
        toast.success("Subcategory updated");
      } else {
        await customFetch.post("/sub-categories", form);
        toast.success("Subcategory added");
      }
      resetForm();
      fetchData();
    } catch {
      const updated = editing
        ? items.map((s) => (s.subcat_id === editing.subcat_id ? { ...s, ...form } : s))
        : [...items, { subcat_id: String(Date.now()), ...form }];
      setItems(updated);
      localStorage.setItem("zarka_subcategories_fallback", JSON.stringify(updated));
      toast.success(editing ? "Subcategory updated (Local fallback)" : "Subcategory added (Local fallback)");
      resetForm();
    }
  };

  const getCategoryTitle = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.cat_title : catId;
  };

  const filtered = items.filter((c) =>
    c.subcat_title?.toLowerCase().includes(search.toLowerCase())
  );

  const hasActiveFilters = search;

  return (
    <div>
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete subcategory"
        description="Are you sure you want to delete this subcategory? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[#202223]">Subcategories</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#008060] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#006e52] transition-colors"
        >
          <HiPlus className="text-lg" />
          Add Subcategory
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={resetForm} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
              <h2 className="text-base font-semibold text-[#202223]">
                {editing ? "Edit Subcategory" : "Add Subcategory"}
              </h2>
              <button onClick={resetForm} className="text-[#6d7175] hover:text-[#202223]">
                <HiXMark className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Subcategory Title</label>
                <input type="text" required value={form.subcat_title}
                  onChange={(e) => setForm({ ...form, subcat_title: e.target.value })}
                  placeholder="e.g. Lawn Suits"
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Image</label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input type="text" value={form.subcat_img}
                      onChange={(e) => { setForm({ ...form, subcat_img: e.target.value }); setImgError(false); }}
                      placeholder="subcategory-image.jpg"
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
                            setForm({ ...form, subcat_img: res.data.filename });
                            setImgError(false);
                            toast.success("Image uploaded");
                          } catch { toast.error("Upload failed"); }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  {form.subcat_img && !imgError ? (
                    <img src={`/assets/${form.subcat_img}`} alt="preview"
                      onError={() => setImgError(true)}
                      className="w-20 h-20 object-cover rounded border border-[#e0e0e0] flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center text-[#6d7175] text-xs flex-shrink-0">
                      {form.subcat_img ? "Invalid image" : "No image"}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Category</label>
                <select required value={form.cat_id}
                  onChange={(e) => setForm({ ...form, cat_id: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.cat_title}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="bg-[#008060] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#006e52] transition-colors"
                >
                  {editing ? "Update" : "Add Subcategory"}
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

      {/* Search */}
      <div className="mb-6 relative max-w-sm">
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
        <input type="text" placeholder="Search subcategories..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-[#e0e0e0] rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fafafa] border-b border-[#e0e0e0]">
              <th className="text-left py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase w-20">Image</th>
              <th className="text-left py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Title</th>
              <th className="text-left py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Category</th>
              <th className="text-right py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.subcat_id} className="border-t border-[#e0e0e0] hover:bg-gray-50/80 transition-colors">
                  <td className="py-2.5 px-5 align-middle">
                    {item.subcat_img ? (
                      <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                        <img src={`/assets/${item.subcat_img}`} alt={item.subcat_title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).parentElement!.classList.add("bg-gray-50", "flex", "items-center", "justify-center");
                          }}
                        />
                      </div>
                    ) : (
                      <ImgPlaceholder />
                    )}
                  </td>
                  <td className="py-3 px-5 font-medium text-[#202223] align-middle">{item.subcat_title}</td>
                  <td className="py-3 px-5 text-[#6d7175] align-middle">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f1f8f5] text-[#008060] text-xs font-medium">
                      {getCategoryTitle(item.cat_id)}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right align-middle">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEdit(item)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-slate-900 transition-colors"
                        title="Edit Subcategory"
                      >
                        <HiPencilSquare className="text-base" />
                      </button>
                      <button onClick={() => setDeleteTarget({ subcat_id: item.subcat_id })}
                        className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Subcategory"
                      >
                        <HiTrash className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-16 text-center align-middle">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <HiOutlinePhoto className="text-5xl text-[#d0d0d0]" />
                    <p className="text-base font-medium text-[#202223]">No subcategories found</p>
                    <p className="text-sm text-[#6d7175]">
                      {hasActiveFilters
                        ? "Try adjusting your search to find what you're looking for."
                        : "Get started by adding your first subcategory."}
                    </p>
                    {hasActiveFilters ? (
                      <button onClick={() => setSearch("")}
                        className="mt-2 text-sm font-medium text-[#2c6ecb] hover:text-[#1a4fa0] transition-colors underline underline-offset-2">
                        Clear search
                      </button>
                    ) : (
                      <button onClick={() => { resetForm(); setShowForm(true); }}
                        className="mt-2 inline-flex items-center gap-2 bg-[#008060] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#006e52] transition-colors">
                        <HiPlus className="text-base" />
                        Add Subcategory
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubCategories;
