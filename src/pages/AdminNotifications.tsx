import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { HiPencilSquare, HiTrash, HiPlus, HiXMark } from "react-icons/hi2";
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
    <div>
      <div className="flex items-center justify-between mb-6">
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

      <div className="mb-4">
        <input type="text" placeholder="Search notifications..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
        />
      </div>

      <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fafafa]">
              <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Title</th>
              <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Description</th>
              <th className="text-right py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t border-[#e0e0e0] hover:bg-[#fafafa]">
                <td className="py-3 px-5 font-medium text-[#202223]">{item.title}</td>
                <td className="py-3 px-5 text-[#6d7175] max-w-md truncate">{item.description}</td>
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
          <p className="text-sm text-[#6d7175] p-6 text-center">No notifications found.</p>
        )}
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
