import { useEffect, useState } from "react";
import { HiPlus, HiTrash, HiTag, HiXMark } from "react-icons/hi2";
import toast from "react-hot-toast";
import customFetch from "../axios/custom";

interface Discount {
  id: string;
  code: string;
  type: "Percentage" | "Fixed Amount";
  value: number;
  status: "Active" | "Expired";
  expiry_date?: string;
  expiryDate?: string;
}

const defaultDiscounts: Discount[] = [
  { id: "1", code: "WELCOME10", type: "Percentage", value: 10, status: "Active", expiryDate: "2026-12-31" },
  { id: "2", code: "EIDMUBARAK", type: "Fixed Amount", value: 1000, status: "Active", expiryDate: "2026-07-15" },
  { id: "3", code: "SUMMER50", type: "Percentage", value: 50, status: "Expired", expiryDate: "2026-06-01" },
];

const AdminDiscounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "Percentage" as Discount["type"], value: "", expiryDate: "" });

  const fetchDiscounts = async () => {
    try {
      const res = await customFetch.get("/db-coupons");
      setDiscounts((res.data || []) as Discount[]);
    } catch (e) {
      console.error("Failed to fetch coupons from backend, using fallback", e);
      const stored = localStorage.getItem("zarka_discounts");
      if (stored) {
        setDiscounts(JSON.parse(stored));
      } else {
        setDiscounts(defaultDiscounts);
        localStorage.setItem("zarka_discounts", JSON.stringify(defaultDiscounts));
      }
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const toggleStatus = async (id: string) => {
    try {
      await customFetch.put(`/db-coupons/${id}`);
      toast.success("Discount status updated");
      fetchDiscounts();
    } catch (e) {
      console.error("Backend toggle status failed, updating locally", e);
      const updated = discounts.map((d) => (d.id === id ? { ...d, status: d.status === "Active" ? ("Expired" as const) : ("Active" as const) } : d));
      setDiscounts(updated);
      localStorage.setItem("zarka_discounts", JSON.stringify(updated));
      toast.success("Discount status updated locally");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await customFetch.delete(`/db-coupons/${id}`);
      toast.success("Discount code deleted");
      fetchDiscounts();
    } catch (e) {
      console.error("Backend delete failed, updating locally", e);
      const updated = discounts.filter((d) => d.id !== id);
      setDiscounts(updated);
      localStorage.setItem("zarka_discounts", JSON.stringify(updated));
      toast.success("Discount code deleted locally");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.value) return;

    const newDiscountCode = form.code.toUpperCase().replace(/\s+/g, "");
    const newDiscountType = form.type;
    const newDiscountValue = Number(form.value);
    const newDiscountExpiry = form.expiryDate || null;

    try {
      await customFetch.post("/db-coupons", {
        code: newDiscountCode,
        type: newDiscountType,
        value: newDiscountValue,
        expiry_date: newDiscountExpiry,
      });
      toast.success("Discount code created");
      setShowForm(false);
      setForm({ code: "", type: "Percentage", value: "", expiryDate: "" });
      fetchDiscounts();
    } catch (e) {
      console.error("Backend create coupon failed, updating locally", e);
      const newDiscount: Discount = {
        id: String(Date.now()),
        code: newDiscountCode,
        type: newDiscountType,
        value: newDiscountValue,
        status: "Active",
        expiryDate: newDiscountExpiry || "No expiry",
      };
      const updated = [newDiscount, ...discounts];
      setDiscounts(updated);
      localStorage.setItem("zarka_discounts", JSON.stringify(updated));
      toast.success("Discount code created locally");
      setShowForm(false);
      setForm({ code: "", type: "Percentage", value: "", expiryDate: "" });
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#202223]">Discounts</h1>
          <p className="text-xs text-[#6d7175]">Manage coupon codes and discount promotions.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#008060] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#006e52] transition-colors shadow-sm"
        >
          <HiPlus className="text-lg" />
          Create Discount
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowForm(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
              <h2 className="text-base font-semibold text-[#202223]">Create Discount Code</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6d7175] hover:text-[#202223]">
                <HiXMark className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Discount Code</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. AUTUMN30"
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#202223] mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as Discount["type"] })}
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#202223] mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder={form.type === "Percentage" ? "e.g. 15" : "e.g. 500"}
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-[#008060] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#006e52] transition-colors">
                  Create Discount
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
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Code</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Type</th>
              <th className="text-right py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Value</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Expiry</th>
              <th className="text-center py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Status</th>
              <th className="text-right py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="border-t border-[#e0e0e0] hover:bg-[#fafafa] transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#f6f2fe] flex items-center justify-center text-[#9c6ade]">
                      <HiTag className="text-base" />
                    </div>
                    <span className="font-semibold tracking-wider text-[#202223]">{d.code}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-[#6d7175]">{d.type}</td>
                <td className="py-3.5 px-5 text-right font-medium text-[#202223]">
                  {d.type === "Percentage" ? `${d.value}%` : `Rs.${d.value.toLocaleString()}`}
                </td>
                <td className="py-3.5 px-5 text-[#6d7175]">{d.expiry_date || d.expiryDate || "No expiry"}</td>
                <td className="py-3.5 px-5 text-center">
                  <button
                    onClick={() => toggleStatus(d.id)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                      d.status === "Active" ? "bg-[#f1f8f5] text-[#008060] hover:bg-[#e1efe8]" : "bg-[#fef1ee] text-[#d72c0d] hover:bg-[#fae2df]"
                    }`}
                  >
                    {d.status}
                  </button>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button onClick={() => handleDelete(d.id)} className="p-1.5 hover:bg-[#f1f1f1] rounded text-[#6d7175] hover:text-[#d72c0d] transition-colors">
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

export default AdminDiscounts;
