import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { HiPencilSquare, HiTrash, HiPlus, HiXMark, HiOutlinePhoto, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import ConfirmModal from "../components/ConfirmModal";

interface Category {
  cat_id: string;
  cat_title: string;
  cat_img: string;
  handle?: string;
  SEOtitle?: string;
  SEOdescription?: string;
}

function normalize(data: any[]): Category[] {
  return data.map((item) => ({
    cat_id: item.cat_id || item.id || "",
    cat_title: item.cat_title || "",
    cat_img: item.cat_img || "",
    handle: item.handle || "",
    SEOtitle: item.SEOtitle || "",
    SEOdescription: item.SEOdescription || "",
  }));
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [form, setForm] = useState({ cat_title: "", cat_img: "", handle: "", SEOtitle: "", SEOdescription: "" });
  const [deleteTarget, setDeleteTarget] = useState<{ cat_id: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await customFetch.get("/categories");
      setCategories(normalize(res.data));
    } catch {
      setError("Failed to load categories. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ cat_title: "", cat_img: "", handle: "", SEOtitle: "", SEOdescription: "" });
    setImgError(false);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: Category) => {
    setEditing(item);
    setForm({
      cat_title: item.cat_title,
      cat_img: item.cat_img,
      handle: item.handle || "",
      SEOtitle: item.SEOtitle || "",
      SEOdescription: item.SEOdescription || "",
    });
    setImgError(false);
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await customFetch.delete(`/categories/${deleteTarget.cat_id}`);
      toast.success("Category deleted");
      setDeleteTarget(null);
      fetchData();
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cat_title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (editing) {
        await customFetch.put(`/categories/${editing.cat_id}`, form);
        toast.success("Category updated");
      } else {
        await customFetch.post("/categories", form);
        toast.success("Category added");
      }
      resetForm();
      fetchData();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const filtered = categories.filter((c) =>
    c.cat_title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-[#202223]">Categories</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#008060] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#006e52] transition-colors"
        >
          <HiPlus className="text-lg" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={resetForm} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
              <h2 className="text-base font-semibold text-[#202223]">{editing ? "Edit" : "Add"} Category</h2>
              <button onClick={resetForm} className="text-[#6d7175] hover:text-[#202223]"><HiXMark className="text-xl" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Title *</label>
                <input type="text" required value={form.cat_title}
                  onChange={(e) => setForm({ ...form, cat_title: e.target.value })}
                  placeholder="e.g. Luxury Collection"
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Handle</label>
                <input type="text" value={form.handle}
                  onChange={(e) => setForm({ ...form, handle: e.target.value })}
                  placeholder="Auto-generated from title"
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Image</label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input type="text" value={form.cat_img}
                      onChange={(e) => { setForm({ ...form, cat_img: e.target.value }); setImgError(false); }}
                      placeholder="category-image.jpg"
                      className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] mb-2"
                    />
                    <label className="flex items-center gap-2 cursor-pointer bg-[#f1f1f1] hover:bg-[#e5e5e5] text-sm font-medium px-4 py-2 rounded-lg text-[#202223] transition-colors w-fit">
                      <HiPlus className="text-base" /> Upload Image
                      <input type="file" accept="image/*" className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append("file", file);
                          try {
                            const res = await customFetch.post("/upload", fd);
                            setForm({ ...form, cat_img: res.data.filename });
                            setImgError(false);
                            toast.success("Image uploaded");
                          } catch (err: any) { toast.error(err?.response?.data?.message || "Upload failed"); }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  {form.cat_img && !imgError ? (
                    <img src={`/assets/${form.cat_img}`} alt="preview"
                      onError={() => setImgError(true)}
                      className="w-20 h-20 object-cover rounded border border-[#e0e0e0] flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-[#f1f1f1] rounded border border-[#e0e0e0] flex items-center justify-center text-[#6d7175] text-xs flex-shrink-0">
                      {form.cat_img ? "Invalid" : "No image"}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">SEO Title</label>
                <input type="text" value={form.SEOtitle}
                  onChange={(e) => setForm({ ...form, SEOtitle: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">SEO Description</label>
                <textarea value={form.SEOdescription} rows={3}
                  onChange={(e) => setForm({ ...form, SEOdescription: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="bg-[#008060] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#006e52] transition-colors disabled:opacity-50"
                >{saving ? "Saving..." : editing ? "Update" : "Add Category"}</button>
                <button type="button" onClick={resetForm}
                  className="border border-[#e0e0e0] text-sm font-medium px-6 py-2.5 rounded-lg text-[#6d7175] hover:bg-[#f1f1f1] transition-colors"
                >Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#e0e0e0]">
          <div className="flex items-center gap-3">
            <button className="px-3 py-1 text-sm font-medium text-[#2c6ecb] bg-[#f1f8fe] rounded-lg border border-[#2c6ecb]">
              All
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded transition-colors ${showSearch ? "bg-blue-50 text-[#2c6ecb]" : "text-[#6d7175] hover:text-[#202223] hover:bg-gray-100"}`}
              title="Search"
            >
              <HiOutlineMagnifyingGlass className="text-lg" />
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="px-5 py-2 border-b border-[#e0e0e0] bg-[#fafafa]">
            <div className="relative max-w-xs">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175] text-sm" />
              <input type="text" placeholder="Search categories..." value={search}
                onChange={(e) => setSearch(e.target.value)}
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

        {loading ? (
          <div className="text-center py-12 text-[#6d7175] text-sm">Loading categories...</div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-[#d72c0d] text-sm mb-3">{error}</p>
            <button onClick={fetchData}
              className="text-sm font-medium text-[#2c6ecb] hover:text-[#1a4fa0] underline underline-offset-2">Retry</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#e0e0e0]">
                  <th className="text-left py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Image</th>
                  <th className="text-left py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Title</th>
                  <th className="text-left py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Handle</th>
                  <th className="text-right py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.cat_id} className="border-b border-[#e0e0e0] hover:bg-[#fafafa] transition-colors">
                    <td className="py-3 pl-5 pr-5 align-middle">
                      {item.cat_img ? (
                        <img src={`/assets/${item.cat_img}`} alt={item.cat_title} className="w-10 h-10 object-cover rounded border border-[#e0e0e0]" />
                      ) : (
                        <div className="w-10 h-10 bg-[#fafafa] rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                          <HiOutlinePhoto className="text-base" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 pl-5 pr-5 font-medium text-[#202223] align-middle">{item.cat_title}</td>
                    <td className="py-3 pl-5 pr-5 text-[#6d7175] align-middle text-xs">{item.handle || "—"}</td>
                    <td className="py-3 pl-5 pr-5 text-right align-middle">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => handleEdit(item)}
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 transition-colors" title="Edit">
                          <HiPencilSquare className="text-base" />
                        </button>
                        <button onClick={() => setDeleteTarget({ cat_id: item.cat_id })}
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                          <HiTrash className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-sm text-gray-500 py-16 text-center align-middle">
                      {search ? "No categories found matching your search." : "No categories found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminCategories;
