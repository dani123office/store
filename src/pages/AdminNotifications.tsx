import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { HiPencilSquare, HiTrash, HiPlus, HiXMark, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import ConfirmModal from "../components/ConfirmModal";

interface Notification {
  id: string;
  title: string;
  description: string;
}

const AdminNotifications = () => {
  const [items, setItems] = useState<Notification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Notification | null>(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await customFetch.get("/notifications");
      setItems(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: Notification) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description || "" });
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await customFetch.delete(`/notifications/${deleteTarget.id}`);
      toast.success("Notification deleted");
      fetchData();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await customFetch.put(`/notifications/${editing.id}`, form);
        toast.success("Notification updated");
      } else {
        await customFetch.post("/notifications", form);
        toast.success("Notification added");
      }
      resetForm();
      fetchData();
    } catch { toast.error("Something went wrong"); }
  };

  const filtered = items.filter((n) =>
    n.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-[#202223]">Notifications</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#008060] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#006e52] transition-colors"
        >
          <HiPlus className="text-lg" />
          Add Notification
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={resetForm} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
              <h2 className="text-base font-semibold text-[#202223]">
                {editing ? "Edit Notification" : "Add Notification"}
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
                  placeholder="Enter the notification content here..."
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] resize-y"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="bg-[#008060] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#006e52] transition-colors"
                >
                  {editing ? "Update" : "Add Notification"}
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
              <input type="text" placeholder="Search notifications..." value={search}
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e0e0e0]">
                <th className="text-left py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Title</th>
                <th className="text-left py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Description</th>
                <th className="text-right py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-[#e0e0e0] hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 pl-5 pr-5 font-medium text-[#202223]">{item.title}</td>
                  <td className="py-3 pl-5 pr-5 text-[#6d7175] max-w-md truncate">{item.description}</td>
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
                  <td colSpan={3} className="py-16 text-center text-sm text-[#6d7175]">No notifications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete notification"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminNotifications;
