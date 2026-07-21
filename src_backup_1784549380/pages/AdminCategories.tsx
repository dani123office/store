import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { HiPencilSquare, HiTrash, HiPlus, HiXMark, HiOutlinePhoto, HiOutlineMagnifyingGlass, HiArrowUpTray, HiCheck } from "react-icons/hi2";
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

  // Media Modal states
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [selectedMediaName, setSelectedMediaName] = useState<string | null>(null);
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaUploading, setMediaUploading] = useState(false);

  const fetchMediaList = async () => {
    setLoadingMedia(true);
    try {
      const res = await customFetch.get("/media");
      setMediaList(res.data || []);
    } catch {
      toast.error("Failed to load media library");
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    if (showMediaModal) {
      fetchMediaList();
    }
  }, [showMediaModal]);

  const handleModalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setMediaUploading(true);
    const loadToast = toast.loading("Uploading image to media library...");
    try {
      const res = await customFetch.post("/upload", fd);
      toast.success("Image uploaded successfully!");
      const mediaRes = await customFetch.get("/media");
      setMediaList(mediaRes.data || []);
      if (res.data && res.data.filename) {
        setSelectedMediaName(res.data.filename);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.file?.[0] || "Upload failed";
      toast.error(msg);
    } finally {
      setMediaUploading(false);
      toast.dismiss(loadToast);
    }
    e.target.value = "";
  };

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
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMediaName(form.cat_img || null);
                        setShowMediaModal(true);
                      }}
                      className="flex items-center gap-2 bg-[#f1f1f1] hover:bg-[#e5e5e5] text-sm font-medium px-4 py-2 rounded-lg text-[#202223] transition-colors w-fit"
                    >
                      <HiOutlinePhoto className="text-base" /> Select Image from Media
                    </button>
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

      {/* Media Selector Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMediaModal(false)} />
          <div className="relative bg-white w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Select Media</h3>
                <p className="text-xs text-gray-500">Choose an existing image or upload a new one to the store library</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            {/* Modal Controls (Search & Upload) */}
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
              <div className="relative w-full sm:max-w-xs">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search images by name..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white"
                />
              </div>

              <label className="flex items-center gap-2 bg-[#008060] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#006e52] cursor-pointer transition-colors shadow-sm w-full sm:w-auto justify-center">
                <HiArrowUpTray className="text-sm" />
                {mediaUploading ? "Uploading..." : "Upload New File"}
                <input type="file" accept="image/*" className="hidden" onChange={handleModalUpload} disabled={mediaUploading} />
              </label>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              {loadingMedia ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2c6ecb]" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {mediaList
                    .filter((item) => item.name.toLowerCase().includes(mediaSearch.toLowerCase()))
                    .map((item) => {
                      const isSelected = selectedMediaName === item.name;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedMediaName(item.name)}
                          onDoubleClick={() => {
                            setForm({ ...form, cat_img: item.name });
                            setImgError(false);
                            setShowMediaModal(false);
                          }}
                          className={`aspect-square bg-white rounded-lg overflow-hidden border-2 cursor-pointer transition-all relative flex items-center justify-center group shadow-sm ${
                            isSelected
                              ? "border-[#2c6ecb] ring-2 ring-[#2c6ecb]/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/assets/product image 1.jpg"; }}
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-[#2c6ecb] text-white rounded-full p-1 shadow-md">
                              <HiCheck className="text-[10px]" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] truncate p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.name}
                          </div>
                        </div>
                      );
                    })}
                  {mediaList.filter((item) => item.name.toLowerCase().includes(mediaSearch.toLowerCase())).length === 0 && (
                    <div className="col-span-full py-16 text-center text-sm text-gray-500">
                      No matching media items found in library.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedMediaName) {
                    setForm({ ...form, cat_img: selectedMediaName });
                    setImgError(false);
                    setShowMediaModal(false);
                  }
                }}
                disabled={!selectedMediaName}
                className="px-4 py-2 bg-[#2c6ecb] text-white text-sm font-medium rounded-lg hover:bg-[#1e5ab0] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
