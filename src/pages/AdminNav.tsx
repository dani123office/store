import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { HiPencilSquare, HiTrash, HiPlus, HiXMark, HiOutlineArrowUp, HiOutlineArrowDown } from "react-icons/hi2";
import ConfirmModal from "../components/ConfirmModal";

interface NavItem {
  id: string;
  label: string;
  slug: string;
  sort_order: number;
}

const AdminNav = () => {
  const [items, setItems] = useState<NavItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<NavItem | null>(null);
  const [form, setForm] = useState({ label: "", slug: "" });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showSlugSuggestions, setShowSlugSuggestions] = useState(false);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

  const handleLabelChange = useCallback((label: string) => {
    setForm((prev) => ({
      ...prev,
      label,
      slug: editing ? prev.slug : slugify(label),
    }));
  }, [editing]);

  const fetchData = async () => {
    try {
      const res = await customFetch.get("/nav-items");
      setItems(res.data);
    } catch (e) {
      console.error("Nav items fetch failed", e);
      const stored = localStorage.getItem("zarka_nav_fallback");
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        const initial = [
          { id: "1", label: "New Arrivals", slug: "new-arrivals", sort_order: 1 },
          { id: "2", label: "Collections", slug: "collections", sort_order: 2 },
          { id: "3", label: "Unstitched", slug: "unstitched", sort_order: 3 },
          { id: "4", label: "Stitched", slug: "stitched", sort_order: 4 },
        ];
        setItems(initial);
        localStorage.setItem("zarka_nav_fallback", JSON.stringify(initial));
      }
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ label: "", slug: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: NavItem) => {
    setEditing(item);
    setForm({ label: item.label, slug: item.slug });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.label.trim() || !form.slug.trim()) {
      toast.error("Label and slug are required");
      return;
    }
    const payload = {
      label: form.label.trim(),
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      sort_order: editing ? editing.sort_order : items.length + 1,
    };
    try {
      if (editing) {
        await customFetch.put(`/nav-items/${editing.id}`, payload);
        toast.success("Nav item updated");
      } else {
        await customFetch.post("/nav-items", payload);
        toast.success("Nav item added");
      }
      resetForm();
      fetchData();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await customFetch.delete(`/nav-items/${deleteTarget.id}`);
      toast.success("Nav item deleted");
      setDeleteTarget(null);
      fetchData();
    } catch (e) {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const moveItem = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const arr = [...items];
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    arr.forEach((item, i) => (item.sort_order = i + 1));
    setItems(arr);
    try {
      await Promise.all(
        arr.map((item) => customFetch.put(`/nav-items/${item.id}`, { sort_order: item.sort_order }))
      );
    } catch (e) {
      toast.error("Failed to reorder");
      fetchData();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Auto-managed:</strong> Navigation items are now synced from{" "}
          <Link to="/admin/categories" className="underline font-medium hover:text-blue-600">Categories</Link>.
          Add or edit categories to update the navigation bar. Custom items below act as an override.
        </p>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#202223]">Navigation Items</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#2c6ecb] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1f5bb3] transition-colors"
        >
          <HiPlus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-[#e0e0e0] rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-[#202223]">{editing ? "Edit" : "Add"} Nav Item</h2>
            <button onClick={resetForm} className="text-[#6d7175] hover:text-[#202223]">
              <HiXMark className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1">Label</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="e.g. New Arrivals"
                className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm text-[#202223] outline-none focus:border-[#2c6ecb] bg-white"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-[#202223] mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                onFocus={() => setShowSlugSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSlugSuggestions(false), 200)}
                placeholder="e.g. new-arrivals"
                className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm text-[#202223] outline-none focus:border-[#2c6ecb] bg-white"
              />
              {showSlugSuggestions && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-[#e0e0e0] rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {items
                    .filter((i) => editing?.id !== i.id)
                    .map((i) => (
                      <button
                        key={i.id}
                        type="button"
                        onMouseDown={() => setForm((prev) => ({ ...prev, slug: i.slug }))}
                        className="w-full text-left px-3 py-2 text-sm text-[#202223] hover:bg-[#f1f8fe] transition-colors"
                      >
                        {i.slug} <span className="text-[#6d7175] text-xs ml-2">({i.label})</span>
                      </button>
                    ))}
                </div>
              )}
              <p className="text-xs text-[#6d7175] mt-1">URL path: /shop/&lt;slug&gt;</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="bg-[#2c6ecb] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#1f5bb3] transition-colors"
              >
                {editing ? "Update" : "Save"}
              </button>
              <button
                onClick={resetForm}
                className="text-[#6d7175] px-4 py-2 text-sm hover:text-[#202223] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#e0e0e0] rounded-xl overflow-hidden shadow-sm">
        {items.length === 0 ? (
          <div className="p-8 text-center text-[#6d7175] text-sm">No nav items yet. Click "Add Item" to create one.</div>
        ) : (
          <div className="divide-y divide-[#e0e0e0]">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                      className="text-[#6d7175] hover:text-[#202223] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <HiOutlineArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(index, "down")}
                      disabled={index === items.length - 1}
                      className="text-[#6d7175] hover:text-[#202223] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <HiOutlineArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#202223]">{item.label}</p>
                    <p className="text-xs text-[#6d7175]">/shop/{item.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-[#6d7175] hover:text-[#2c6ecb] transition-colors"
                  >
                    <HiPencilSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: item.id })}
                    className="p-2 text-[#6d7175] hover:text-red-500 transition-colors"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete nav item?"
        description="This will remove it from the navigation bar. Products assigned to this slug won't be affected."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default AdminNav;
