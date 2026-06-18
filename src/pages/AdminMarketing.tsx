import { useEffect, useState } from "react";
import { HiPlus, HiTrash, HiOutlineMegaphone, HiXMark } from "react-icons/hi2";
import toast from "react-hot-toast";

interface Campaign {
  id: string;
  name: string;
  channel: string;
  status: "Active" | "Paused" | "Completed" | "Draft";
  budget: string;
  revenue: string;
}

const defaultCampaigns: Campaign[] = [
  { id: "1", name: "Summer Launch Newsletter", channel: "Email", status: "Active", budget: "Rs.5,000", revenue: "Rs.45,000" },
  { id: "2", name: "Instagram Festive Ads", channel: "Instagram", status: "Active", budget: "Rs.25,000", revenue: "Rs.180,000" },
  { id: "3", name: "Eid Collection SMS Promo", channel: "SMS", status: "Completed", budget: "Rs.8,000", revenue: "Rs.62,000" },
  { id: "4", name: "Winter Clearance Sneak Peek", channel: "Email", status: "Draft", budget: "Rs.0", revenue: "Rs.0" },
];

const AdminMarketing = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", channel: "Email", status: "Draft" as Campaign["status"], budget: "", revenue: "" });

  useEffect(() => {
    const stored = localStorage.getItem("zarka_campaigns");
    if (stored) {
      setCampaigns(JSON.parse(stored));
    } else {
      setCampaigns(defaultCampaigns);
      localStorage.setItem("zarka_campaigns", JSON.stringify(defaultCampaigns));
    }
  }, []);

  const saveToStorage = (updated: Campaign[]) => {
    setCampaigns(updated);
    localStorage.setItem("zarka_campaigns", JSON.stringify(updated));
  };

  const handleStatusChange = (id: string, newStatus: Campaign["status"]) => {
    const updated = campaigns.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
    saveToStorage(updated);
    toast.success("Campaign status updated");
  };

  const handleDelete = (id: string) => {
    const updated = campaigns.filter((c) => c.id !== id);
    saveToStorage(updated);
    toast.success("Campaign deleted");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const newCampaign: Campaign = {
      id: String(Date.now()),
      name: form.name,
      channel: form.channel,
      status: form.status,
      budget: form.budget ? `Rs.${Number(form.budget).toLocaleString()}` : "Rs.0",
      revenue: form.revenue ? `Rs.${Number(form.revenue).toLocaleString()}` : "Rs.0",
    };

    const updated = [newCampaign, ...campaigns];
    saveToStorage(updated);
    toast.success("Campaign created successfully");
    setShowForm(false);
    setForm({ name: "", channel: "Email", status: "Draft", budget: "", revenue: "" });
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#202223]">Marketing</h1>
          <p className="text-xs text-[#6d7175]">Create and monitor marketing campaigns.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#008060] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#006e52] transition-colors shadow-sm"
        >
          <HiPlus className="text-lg" />
          Create Campaign
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowForm(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
              <h2 className="text-base font-semibold text-[#202223]">Create Marketing Campaign</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6d7175] hover:text-[#202223]">
                <HiXMark className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Winter Flash Sale"
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#202223] mb-1">Channel</label>
                  <select
                    value={form.channel}
                    onChange={(e) => setForm({ ...form, channel: e.target.value })}
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white"
                  >
                    <option value="Email">Email</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="SMS">SMS</option>
                    <option value="Google Ads">Google Ads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#202223] mb-1">Initial Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Campaign["status"] })}
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#202223] mb-1">Budget (Rs.)</label>
                  <input
                    type="number"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    placeholder="e.g. 10000"
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#202223] mb-1">Revenue Generated (Rs.)</label>
                  <input
                    type="number"
                    value={form.revenue}
                    onChange={(e) => setForm({ ...form, revenue: e.target.value })}
                    placeholder="e.g. 50000"
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-[#008060] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#006e52] transition-colors">
                  Create Campaign
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-[#e0e0e0] text-sm font-medium px-6 py-2.5 rounded-lg text-[#6d7175] hover:bg-[#f1f1f1] transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fafafa] border-b border-[#e0e0e0]">
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Campaign</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Channel</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Status</th>
              <th className="text-right py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Budget</th>
              <th className="text-right py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Revenue</th>
              <th className="text-right py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-t border-[#e0e0e0] hover:bg-[#fafafa] transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#f1f8fe] flex items-center justify-center text-[#2c6ecb]">
                      <HiOutlineMegaphone className="text-base" />
                    </div>
                    <span className="font-medium text-[#202223]">{c.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-[#6d7175]">{c.channel}</td>
                <td className="py-3.5 px-5">
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value as Campaign["status"])}
                    className={`text-xs font-medium rounded-full px-2 py-0.5 outline-none border-0 cursor-pointer ${
                      c.status === "Active" ? "bg-[#f1f8f5] text-[#008060]" :
                      c.status === "Paused" ? "bg-[#fff5e6] text-[#b8860b]" :
                      c.status === "Completed" ? "bg-[#f1f1f1] text-[#6d7175]" :
                      "bg-[#f6f2fe] text-[#9c6ade]"
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </td>
                <td className="py-3.5 px-5 text-right font-medium text-[#202223]">{c.budget}</td>
                <td className="py-3.5 px-5 text-right font-medium text-[#008060]">{c.revenue}</td>
                <td className="py-3.5 px-5 text-right">
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-[#f1f1f1] rounded text-[#6d7175] hover:text-[#d72c0d] transition-colors">
                    <HiTrash className="text-base" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMarketing;
