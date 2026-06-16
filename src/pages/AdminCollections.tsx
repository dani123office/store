import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { HiPencilSquare, HiTrash, HiPlus, HiXMark } from "react-icons/hi2";
import ConfirmModal from "../components/ConfirmModal";

interface Collection {
  id: string;
  cat_item_title: string;
  cat_item_img: string;
  subcat_id: string;
  handle: string;
  SEOdescription: string;
  SEOtitle: string;
}

interface SubCategory {
  id: string;
  subcat_title: string;
}

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
  const [deleteTarget, setDeleteTarget] = useState<{ id: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fetchData = async () => {
    try {
      const res = await customFetch.get("/cat-items");
      setItems(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await customFetch.get("/sub-categories");
      setSubcategories(res.data);
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
      await customFetch.delete(`/cat-items/${deleteTarget.id}`);
      toast.success("Collection deleted");
      fetchData();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await customFetch.put(`/cat-items/${editing.id}`, form);
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
    const sc = subcategories.find((s) => s.id === id);
    return sc ? sc.subcat_title : id;
  };

  const filtered = items.filter((c) =>
    c.cat_item_title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
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
                <label className="block text-sm font-medium text-[#202223] mb-1">Image filename</label>
                <input type="text" value={form.cat_item_img}
                  onChange={(e) => { setForm({ ...form, cat_item_img: e.target.value }); setImgError(false); }}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
                <div className="mt-2">
                  {form.cat_item_img && !imgError ? (
                    <img
                      src={`/assets/${form.cat_item_img}`}
                      alt="preview"
                      onError={() => setImgError(true)}
                      className="w-20 h-20 object-cover rounded border border-[#e0e0e0]"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-[#f1f1f1] rounded border border-[#e0e0e0] flex items-center justify-center text-[#6d7175] text-xs">
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
                    <option key={sc.id} value={sc.id}>{sc.subcat_title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Image</label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input type="text" value={form.cat_item_img}
                      onChange={(e) => setForm({ ...form, cat_item_img: e.target.value })}
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
                            toast.success("Image uploaded");
                          } catch { toast.error("Upload failed"); }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  {form.cat_item_img && (
                    <img src={`/assets/${form.cat_item_img}`} alt="preview"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/80?text=No+Image"; }}
                      className="w-20 h-20 object-cover rounded border border-[#e0e0e0] flex-shrink-0"
                    />
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

      <div className="mb-4">
        <input type="text" placeholder="Search collections..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
        />
      </div>

      <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fafafa]">
              <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Image</th>
              <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Title</th>
              <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Subcategory</th>
              <th className="text-right py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t border-[#e0e0e0] hover:bg-[#fafafa]">
                <td className="py-2 px-5">
                  {item.cat_item_img ? (
                    <img src={`/assets/${item.cat_item_img}`} alt={item.cat_item_title} className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-[#f1f1f1] rounded" />
                  )}
                </td>
                <td className="py-3 px-5 font-medium text-[#202223]">{item.cat_item_title}</td>
                <td className="py-3 px-5 text-[#6d7175]">{getSubcategoryTitle(item.subcat_id)}</td>
                <td className="py-3 px-5 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => handleEdit(item)}
                      className="p-1.5 hover:bg-[#f1f1f1] rounded text-[#6d7175] hover:text-[#2c6ecb]">
                      <HiPencilSquare className="text-base" />
                    </button>
                    <button onClick={() => setDeleteTarget({ id: item.id })}
                      className="p-1.5 hover:bg-[#f1f1f1] rounded text-[#6d7175] hover:text-[#d72c0d]">
                      <HiTrash className="text-base" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-sm text-[#6d7175] p-6 text-center">No collections found.</p>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete collection"
        description="Are you sure you want to delete this collection? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminCollections;
