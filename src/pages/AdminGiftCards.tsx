import { useEffect, useState } from "react";
import { HiPlus, HiTrash, HiGift, HiXMark } from "react-icons/hi2";
import toast from "react-hot-toast";

interface GiftCard {
  id: string;
  code: string;
  initialValue: number;
  balance: number;
  status: "Active" | "Deactivated" | "Expired";
  customerEmail: string;
  expiryDate: string;
}

const defaultGiftCards: GiftCard[] = [
  { id: "1", code: "ZARKA-GIFT-89F1", initialValue: 5000, balance: 5000, status: "Active", customerEmail: "customer1@gmail.com", expiryDate: "2027-06-30" },
  { id: "2", code: "ZARKA-GIFT-30A5", initialValue: 10000, balance: 3500, status: "Active", customerEmail: "customer2@gmail.com", expiryDate: "2027-01-01" },
  { id: "3", code: "ZARKA-GIFT-9912", initialValue: 2000, balance: 0, status: "Expired", customerEmail: "customer3@gmail.com", expiryDate: "2026-05-15" },
];

const AdminGiftCards = () => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ initialValue: "", customerEmail: "", expiryDate: "" });

  useEffect(() => {
    const stored = localStorage.getItem("zarka_giftcards");
    if (stored) {
      setGiftCards(JSON.parse(stored));
    } else {
      setGiftCards(defaultGiftCards);
      localStorage.setItem("zarka_giftcards", JSON.stringify(defaultGiftCards));
    }
  }, []);

  const saveToStorage = (updated: GiftCard[]) => {
    setGiftCards(updated);
    localStorage.setItem("zarka_giftcards", JSON.stringify(updated));
  };

  const generateGiftCardCode = () => {
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const randomHex2 = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    return `ZARKA-GIFT-${randomHex}-${randomHex2}`;
  };

  const handleToggleStatus = (id: string) => {
    const updated = giftCards.map((g) => {
      if (g.id === id) {
        const nextStatus = g.status === "Active" ? "Deactivated" as const : "Active" as const;
        toast.success(`Gift card ${g.code} ${nextStatus === "Active" ? "activated" : "deactivated"}`);
        return { ...g, status: nextStatus };
      }
      return g;
    });
    saveToStorage(updated);
  };

  const handleDelete = (id: string) => {
    const updated = giftCards.filter((g) => g.id !== id);
    saveToStorage(updated);
    toast.success("Gift card deleted");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.initialValue) return;

    const val = Number(form.initialValue);
    const newCard: GiftCard = {
      id: String(Date.now()),
      code: generateGiftCardCode(),
      initialValue: val,
      balance: val,
      status: "Active",
      customerEmail: form.customerEmail || "Not assigned",
      expiryDate: form.expiryDate || "No expiry",
    };

    const updated = [newCard, ...giftCards];
    saveToStorage(updated);
    toast.success("Gift card generated");
    setShowForm(false);
    setForm({ initialValue: "", customerEmail: "", expiryDate: "" });
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#202223]">Gift Cards</h1>
          <p className="text-xs text-[#6d7175]">Issue and track digital gift cards for customers.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#008060] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#006e52] transition-colors shadow-sm"
        >
          <HiPlus className="text-lg" />
          Issue Gift Card
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowForm(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
              <h2 className="text-base font-semibold text-[#202223]">Issue Gift Card</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6d7175] hover:text-[#202223]">
                <HiXMark className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Gift Card Value (Rs.)</label>
                <input
                  type="number"
                  required
                  value={form.initialValue}
                  onChange={(e) => setForm({ ...form, initialValue: e.target.value })}
                  placeholder="e.g. 5000"
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Recipient Customer Email (Optional)</label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  placeholder="e.g. buyer@gmail.com"
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
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
                  Issue Card
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
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Card Code</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Customer</th>
              <th className="text-right py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Initial Value</th>
              <th className="text-right py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Balance</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Expiry</th>
              <th className="text-center py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Status</th>
              <th className="text-right py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {giftCards.map((g) => (
              <tr key={g.id} className="border-t border-[#e0e0e0] hover:bg-[#fafafa] transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#f1f8f5] flex items-center justify-center text-[#008060]">
                      <HiGift className="text-base" />
                    </div>
                    <span className="font-mono tracking-wider font-semibold text-[#202223]">{g.code}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-[#6d7175] max-w-[150px] truncate">{g.customerEmail}</td>
                <td className="py-3.5 px-5 text-right font-medium text-[#6d7175]">Rs.{g.initialValue.toLocaleString()}</td>
                <td className="py-3.5 px-5 text-right font-semibold text-[#202223]">Rs.{g.balance.toLocaleString()}</td>
                <td className="py-3.5 px-5 text-[#6d7175]">{g.expiryDate}</td>
                <td className="py-3.5 px-5 text-center">
                  <button
                    onClick={() => handleToggleStatus(g.id)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                      g.status === "Active" ? "bg-[#f1f8f5] text-[#008060] hover:bg-[#e1efe8]" :
                      g.status === "Deactivated" ? "bg-[#fff5e6] text-[#b8860b] hover:bg-[#ffeecb]" :
                      "bg-[#fef1ee] text-[#d72c0d]"
                    }`}
                    disabled={g.status === "Expired"}
                  >
                    {g.status}
                  </button>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button onClick={() => handleDelete(g.id)} className="p-1.5 hover:bg-[#f1f1f1] rounded text-[#6d7175] hover:text-[#d72c0d] transition-colors">
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

export default AdminGiftCards;
