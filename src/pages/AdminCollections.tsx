import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { HiPencilSquare, HiTrash, HiPlus, HiXMark, HiOutlineMagnifyingGlass, HiOutlinePhoto } from "react-icons/hi2";
import ConfirmModal from "../components/ConfirmModal";

interface Collection {
  cat_item_id: string;
  cat_item_title: string;
  cat_item_img: string;
  subcat_id: string;
  handle: string;
  SEOdescription: string;
  SEOtitle: string;
}

interface SubCategory {
  subcat_id: string;
  cat_id: string;
  subcat_title: string;
  subcat_img: string;
  handle: string;
  SEOdescription: string;
  SEOtitle: string;
}

function normalizeItems(data: any[]): Collection[] {
  return data.map((item) => ({
    cat_item_id: item.cat_item_id || item.id || "",
    cat_item_title: item.cat_item_title || "",
    cat_item_img: item.cat_item_img || "",
    subcat_id: item.subcat_id || "",
    handle: item.handle || "",
    SEOdescription: item.SEOdescription || "",
    SEOtitle: item.SEOtitle || "",
  }));
}

function normalizeSubcategories(data: any[]): SubCategory[] {
  return data.map((item) => ({
    subcat_id: item.subcat_id || item.id || "",
    cat_id: item.cat_id || "",
    subcat_title: item.subcat_title || "",
    subcat_img: item.subcat_img || "",
    handle: item.handle || "",
    SEOdescription: item.SEOdescription || "",
    SEOtitle: item.SEOtitle || "",
  }));
}

const ImgPlaceholder = () => (
  <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
    <HiOutlinePhoto className="text-gray-300 text-lg" />
  </div>
);

const AdminCollections = () => {
  const [items, setItems] = useState<Collection[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    cat_item_title: "", cat_item_img: "", subcat_id: "",
    handle: "", SEOdescription: "", SEOtitle: "",
  });
  const [deleteTarget, setDeleteTarget] = useState<{ cat_item_id: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fetchData = async () => {
    try {
      const res = await customFetch.get("/cat-items");
      setItems(normalizeItems(res.data));
    } catch (e) { console.error(e); }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await customFetch.get("/sub-categories");
      setSubcategories(normalizeSubcategories(res.data));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); fetchSubcategories(); }, []);

  const resetForm = () => {
    setForm({ cat_item_title: "", cat_item_img: "", subcat_id: "", handle: "", SEOdescription: "", SEOtitle: "" });
    setImgError(false);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: Collection) => {
    setEditing(item);
    setForm({
      cat_item_title: item.cat_item_title, cat_item_img: item.cat_item_img,
      subcat_id: item.subcat_id, handle: item.handle || "",
      SEOdescription: item.SEOdescription || "", SEOtitle: item.SEOtitle || "",
    });
    setImgError(false);
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await customFetch.delete(`/cat-items/${deleteTarget.cat_item_id}`);
      toast.success("Collection deleted");
      fetchData();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await customFetch.put(`/cat-items/${editing.cat_item_id}`, form);
        toast.success("Collection updated");
      } else {
        await customFetch.post("/cat-items", form);
        toast.success("Collection added");
      }
      resetForm();
      fetchData();
    } catch { toast.error("Something went wrong"); }
  };

  const getSubcategoryTitle = (id: string) => {
    const sc = subcategories.find((s) => s.subcat_id === id);
    return sc ? sc.subcat_title : id;
  };

  const filtered = items.filter((c) =>
    c.cat_item_title?.toLowerCase().includes(search.toLowerCase())
  );

  const hasActiveFilters = search;

  return (
    <div>
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete collection"
        description="Are you sure you want to delete this collection? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[#202223]">Collections</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#008060] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#006e52] transition-colors"
        >
          <HiPlus className="text-lg" />
          Add Collection
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={resetForm} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
              <h2 className="text-base font-semibold text-[#202223]">
                {editing ? "Edit Collection" : "Add Collection"}
              </h2>
              <button onClick={resetForm} className="text-[#6d7175] hover:text-[#202223]">
                <HiXMark className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Title</label>
                <input type="text" required value={form.cat_item_title}
                  onChange={(e) => setForm({ ...form, cat_item_title: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Image</label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input type="text" value={form.cat_item_img}
                      onChange={(e) => { setForm({ ...form, cat_item_img: e.target.value }); setImgError(false); }}
                      placeholder="collection-image.jpg"
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
                            setForm({ ...form, cat_item_img: res.data.filename });
                            setImgError(false);
                            toast.success("Image uploaded");
                          } catch { toast.error("Upload failed"); }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  {form.cat_item_img && !imgError ? (
                    <img src={`/assets/${form.cat_item_img}`} alt="preview"
                      onError={() => setImgError(true)}
                      className="w-20 h-20 object-cover rounded border border-[#e0e0e0] flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center text-[#6d7175] text-xs flex-shrink-0">
                      {form.cat_item_img ? "Invalid image" : "No image"}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Subcategory</label>
                <select required value={form.subcat_id}
                  onChange={(e) => setForm({ ...form, subcat_id: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white"
                >
                  <option value="">Select subcategory</option>
                  {subcategories.map((sc) => (
                    <option key={sc.subcat_id} value={sc.subcat_id}>{sc.subcat_title}</option>
                  ))}
                </select>
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
                <button type="submit"
                  className="bg-[#008060] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#006e52] transition-colors"
                >
                  {editing ? "Update" : "Add Collection"}
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
      <div className="mb-4">
        <div className="relative w-full max-w-sm">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175] text-sm" />
          <input type="text" placeholder="Search collections..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-[#e0e0e0] rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fafafa] border-b border-[#e0e0e0]">
              <th className="text-left py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase w-20">Image</th>
              <th className="text-left py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Title</th>
              <th className="text-left py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Subcategory</th>
              <th className="text-right py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.cat_item_id} className="border-t border-[#e0e0e0] hover:bg-[#f5f5f5] transition-colors">
                  <td className="py-3 px-5">
                    {item.cat_item_img ? (
                      <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                        <img src={`/assets/${item.cat_item_img}`} alt={item.cat_item_title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).parentElement!.classList.add("bg-gray-50", "flex", "items-center", "justify-center");
                            const icon = document.createElement("div");
                            icon.innerHTML = "📷";
                            (e.target as HTMLImageElement).parentElement!.appendChild(icon);
                          }}
                        />
                      </div>
                    ) : (
                      <ImgPlaceholder />
                    )}
                  </td>
                  <td className="py-3 px-5 font-medium text-[#202223] align-middle">{item.cat_item_title}</td>
                  <td className="py-3 px-5 text-[#6d7175] align-middle">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f1f8f5] text-[#008060] text-xs font-medium">
                      {getSubcategoryTitle(item.subcat_id)}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right align-middle">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEdit(item)}
                        className="p-1.5 hover:bg-[#f1f1f1] rounded text-[#6d7175] hover:text-[#2c6ecb] transition-colors"
                        title="Edit collection">
                        <HiPencilSquare className="text-base" />
                      </button>
                      <button onClick={() => setDeleteTarget({ cat_item_id: item.cat_item_id })}
                        className="p-1.5 hover:bg-[#fef1ee] rounded text-[#6d7175] hover:text-[#d72c0d] transition-colors"
                        title="Delete collection">
                        <HiTrash className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <HiOutlinePhoto className="text-5xl text-[#d0d0d0]" />
                    <p className="text-base font-medium text-[#202223]">No collections found</p>
                    <p className="text-sm text-[#6d7175]">
                      {hasActiveFilters
                        ? "Try adjusting your search to find what you're looking for."
                        : "Get started by adding your first collection."}
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
                        Add Collection
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

export default AdminCollections;
