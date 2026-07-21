import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { HiPencilSquare, HiTrash, HiPlus, HiXMark, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import ConfirmModal from "../components/ConfirmModal";

interface Page {
  id: string;
  title: string;
  description: string;
  SEOtitle: string;
  SEOdescription: string;
  SEOurl: string;
  visibility: boolean | number | string;
}

const AdminPages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Page | null>(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", SEOtitle: "", SEOdescription: "", SEOurl: "", visibility: false,
  });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await customFetch.get("/c-pages");
      setPages(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", SEOtitle: "", SEOdescription: "", SEOurl: "", visibility: false });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: Page) => {
    setEditing(item);
    setForm({
      title: item.title, description: item.description || "",
      SEOtitle: item.SEOtitle || "", SEOdescription: item.SEOdescription || "",
      SEOurl: item.SEOurl || "",
      visibility: item.visibility === true || item.visibility === 1 || item.visibility === "1",
    });
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await customFetch.delete(`/c-pages/${deleteTarget.id}`);
      toast.success("Page deleted");
      fetchData();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await customFetch.put(`/c-pages/${editing.id}`, form);
        toast.success("Page updated");
      } else {
        await customFetch.post("/c-pages", form);
        toast.success("Page added");
      }
      resetForm();
      fetchData();
    } catch { toast.error("Something went wrong"); }
  };

  const filtered = pages.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-[#202223]">CMS Pages</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#008060] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#006e52] transition-colors"
        >
          <HiPlus className="text-lg" />
          Add Page
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={resetForm} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
              <h2 className="text-base font-semibold text-[#202223]">
                {editing ? "Edit Page" : "Add Page"}
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
                <label className="block text-sm font-medium text-[#202223] mb-1">Description</label>
                <textarea required value={form.description} rows={8}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter the page content here..."
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">SEO URL</label>
                <input type="text" value={form.SEOurl}
                  onChange={(e) => setForm({ ...form, SEOurl: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
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
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <button type="button"
                    onClick={() => setForm({ ...form, visibility: !form.visibility })}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      form.visibility ? "bg-[#008060]" : "bg-[#e0e0e0]"
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      form.visibility ? "translate-x-4" : ""
                    }`} />
                  </button>
                  <span className="text-sm font-medium text-[#202223]">Visible</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="bg-[#008060] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#006e52] transition-colors"
                >
                  {editing ? "Update" : "Add Page"}
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
              <input type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pages..."
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e0e0e0]">
                <th className="text-left py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Title</th>
                <th className="text-left py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">SEO URL</th>
                <th className="text-center py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Visible</th>
                <th className="text-right py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-[#e0e0e0] hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 pl-5 pr-5 font-medium text-[#202223]">{item.title}</td>
                  <td className="py-3 pl-5 pr-5 text-[#6d7175]">{item.SEOurl || "—"}</td>
                  <td className="py-3 pl-5 pr-5 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.visibility ? "bg-[#f1f8f5] text-[#008060]" : "bg-[#fef1ee] text-[#d72c0d]"
                    }`}>
                      {item.visibility ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-3 pl-5 pr-5 text-right">
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-sm text-[#6d7175]">No pages found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete page"
        description="Are you sure you want to delete this page? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminPages;
