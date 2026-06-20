import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";

interface Tax {
  id?: string;
  digital: number | string;
  food: number | string;
  nonfood: number | string;
}

const AdminTax = () => {
  const [form, setForm] = useState<Tax>({ digital: "", food: "", nonfood: "" });
  const [taxId, setTaxId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTax = async () => {
      try {
        const res = await customFetch.get("/taxes");
        if (res.data && res.data.length > 0) {
          const tax = res.data[0];
          setTaxId(tax.id);
          setForm({
            digital: tax.digital ?? "",
            food: tax.food ?? "",
            nonfood: tax.nonfood ?? "",
          });
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchTax();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (taxId) {
        await customFetch.put(`/taxes/${taxId}`, form);
      } else {
        await customFetch.post("/taxes", form);
      }
      toast.success("Tax settings updated");
    } catch { toast.error("Something went wrong"); }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <h1 className="text-xl font-semibold text-[#202223] mb-6">Tax Settings</h1>
        <p className="text-sm text-[#6d7175]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-xl font-semibold text-[#202223] mb-5">Tax Settings</h1>

      <div className="bg-white border border-[#e0e0e0] rounded-lg max-w-2xl">
        <div className="px-6 py-4 border-b border-[#e0e0e0]">
          <h2 className="text-sm font-semibold text-[#202223]">Tax Rates</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#202223] mb-1">Digital Goods (%)</label>
            <input type="number" required min="0" step="0.01" value={form.digital}
              onChange={(e) => setForm({ ...form, digital: e.target.value })}
              className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#202223] mb-1">Food (%)</label>
            <input type="number" required min="0" step="0.01" value={form.food}
              onChange={(e) => setForm({ ...form, food: e.target.value })}
              className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#202223] mb-1">Non-Food (%)</label>
            <input type="number" required min="0" step="0.01" value={form.nonfood}
              onChange={(e) => setForm({ ...form, nonfood: e.target.value })}
              className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
            />
          </div>
          <div className="pt-2">
            <button type="submit"
              className="bg-[#008060] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#006e52] transition-colors"
            >
              Save Tax Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTax;
