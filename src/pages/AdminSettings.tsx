import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";

interface Store {
  id?: string;
  StoreName: string;
  StoreEmail: string;
  SenderEmail: string;
  StoreIndustry: string;
  LegalName: string;
  Phone: string;
  Streets: string;
  Apartment: string;
  City: string;
  ZipCode: string;
  Country: string;
  TimeZone: string;
  UnitSystem: string;
  WeightUnit: string;
  Currency: string;
  ShippingFee: string;
  FreeShippingThreshold: string;
}

const defaultStore: Store = {
  StoreName: "", StoreEmail: "", SenderEmail: "", StoreIndustry: "",
  LegalName: "", Phone: "", Streets: "", Apartment: "", City: "",
  ZipCode: "", Country: "", TimeZone: "", UnitSystem: "", WeightUnit: "", Currency: "",
  ShippingFee: "500", FreeShippingThreshold: "0",
};

const AdminSettings = () => {
  const [form, setForm] = useState<Store>(defaultStore);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await customFetch.get("/stores");
        if (res.data && res.data.length > 0) {
          const store = res.data[0];
          setForm({
            StoreName: store.StoreName || "",
            StoreEmail: store.StoreEmail || "",
            SenderEmail: store.SenderEmail || "",
            StoreIndustry: store.StoreIndustry || "",
            LegalName: store.LegalName || "",
            Phone: store.Phone || "",
            Streets: store.Streets || "",
            Apartment: store.Apartment || "",
            City: store.City || "",
            ZipCode: store.ZipCode || "",
            Country: store.Country || "",
            TimeZone: store.TimeZone || "",
            UnitSystem: store.UnitSystem || "",
            WeightUnit: store.WeightUnit || "",
            Currency: store.Currency || "",
            ShippingFee: store.ShippingFee?.toString() || "500",
            FreeShippingThreshold: store.FreeShippingThreshold?.toString() || "0",
          });
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchStore();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await customFetch.post("/stores", form);
      toast.success("Store settings saved");
    } catch { toast.error("Something went wrong"); }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <h1 className="text-xl font-semibold text-[#202223] mb-6">Settings</h1>
        <p className="text-sm text-[#6d7175]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-xl font-semibold text-[#202223] mb-5">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Store Information */}
        <div className="bg-white border border-[#e0e0e0] rounded-lg">
          <div className="px-6 py-4 border-b border-[#e0e0e0]">
            <h2 className="text-sm font-semibold text-[#202223]">Store Information</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Store Name</label>
                <input type="text" required value={form.StoreName}
                  onChange={(e) => setForm({ ...form, StoreName: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Store Industry</label>
                <input type="text" value={form.StoreIndustry}
                  onChange={(e) => setForm({ ...form, StoreIndustry: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Store Email</label>
                <input type="email" required value={form.StoreEmail}
                  onChange={(e) => setForm({ ...form, StoreEmail: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Sender Email</label>
                <input type="email" value={form.SenderEmail}
                  onChange={(e) => setForm({ ...form, SenderEmail: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Legal Name</label>
                <input type="text" value={form.LegalName}
                  onChange={(e) => setForm({ ...form, LegalName: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Phone</label>
                <input type="text" value={form.Phone}
                  onChange={(e) => setForm({ ...form, Phone: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white border border-[#e0e0e0] rounded-lg">
          <div className="px-6 py-4 border-b border-[#e0e0e0]">
            <h2 className="text-sm font-semibold text-[#202223]">Store Address</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1">Street Address</label>
              <input type="text" value={form.Streets}
                onChange={(e) => setForm({ ...form, Streets: e.target.value })}
                className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Apartment</label>
                <input type="text" value={form.Apartment}
                  onChange={(e) => setForm({ ...form, Apartment: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">City</label>
                <input type="text" value={form.City}
                  onChange={(e) => setForm({ ...form, City: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Zip Code</label>
                <input type="text" value={form.ZipCode}
                  onChange={(e) => setForm({ ...form, ZipCode: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Country</label>
                <input type="text" value={form.Country}
                  onChange={(e) => setForm({ ...form, Country: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Time Zone</label>
                <input type="text" value={form.TimeZone}
                  onChange={(e) => setForm({ ...form, TimeZone: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white border border-[#e0e0e0] rounded-lg">
          <div className="px-6 py-4 border-b border-[#e0e0e0]">
            <h2 className="text-sm font-semibold text-[#202223]">Shipping Settings</h2>
            <p className="text-xs text-[#6d7175] mt-0.5">Configure shipping fees for your store</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Shipping Fee (Rs.)</label>
                <input type="number" min="0" step="1" value={form.ShippingFee}
                  onChange={(e) => setForm({ ...form, ShippingFee: e.target.value })}
                  placeholder="e.g. 500"
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
                <p className="text-xs text-[#6d7175] mt-1">Flat shipping fee applied to every order</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Free Shipping Threshold (Rs.)</label>
                <input type="number" min="0" step="1" value={form.FreeShippingThreshold}
                  onChange={(e) => setForm({ ...form, FreeShippingThreshold: e.target.value })}
                  placeholder="e.g. 5000"
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
                <p className="text-xs text-[#6d7175] mt-1">Orders above this amount get free shipping. Set to 0 to disable.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Units & Currency */}
        <div className="bg-white border border-[#e0e0e0] rounded-lg">
          <div className="px-6 py-4 border-b border-[#e0e0e0]">
            <h2 className="text-sm font-semibold text-[#202223]">Units & Currency</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Unit System</label>
                <select value={form.UnitSystem}
                  onChange={(e) => setForm({ ...form, UnitSystem: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white"
                >
                  <option value="">Select</option>
                  <option value="metric">Metric</option>
                  <option value="imperial">Imperial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Weight Unit</label>
                <select value={form.WeightUnit}
                  onChange={(e) => setForm({ ...form, WeightUnit: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white"
                >
                  <option value="">Select</option>
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                  <option value="g">g</option>
                  <option value="oz">oz</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Currency</label>
                <select value={form.Currency}
                  onChange={(e) => setForm({ ...form, Currency: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white"
                >
                  <option value="">Select</option>
                  <option value="PKR">PKR (Rs.)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-1">
          <button type="submit"
            className="bg-[#008060] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#006e52] transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
