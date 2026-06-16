import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineDocumentArrowDown,
  HiPlus, HiOutlineInformationCircle,
  HiOutlineEllipsisVertical,
} from "react-icons/hi2";
import toast from "react-hot-toast";

type Status = "Ready to Ship" | "In Progress" | "Transferred" | "Draft" | "Canceled";
type Filter = "All" | "Draft" | "Ready to Ship" | "In Progress" | "Transferred" | "Canceled";

interface Transfer {
  id: string;
  origin: string;
  destination: string;
  status: Status;
  received: string;
  expected: string;
}

const initialTransfers: Transfer[] = [
  { id: "#T0001", origin: "Main Warehouse — NYC", destination: "Sunrise POS Store", status: "Ready to Ship", received: "—", expected: "Jun 20, 2026" },
  { id: "#T0002", origin: "Main Warehouse — NYC", destination: "Sunrise POS Store", status: "In Progress", received: "—", expected: "Jun 18, 2026" },
  { id: "#T0003", origin: "Main Warehouse — NYC", destination: "Sunrise POS Store", status: "Transferred", received: "10", expected: "Jun 15, 2026" },
  { id: "#T0004", origin: "Main Warehouse — NYC", destination: "Sunrise POS Store", status: "Ready to Ship", received: "—", expected: "Jun 22, 2026" },
  { id: "#T0005", origin: "Main Warehouse — NYC", destination: "Sunrise POS Store", status: "In Progress", received: "—", expected: "Jun 19, 2026" },
];

const statusBadge = (status: Status) => {
  const map: Record<Status, { bg: string; text: string; dot: string }> = {
    "Ready to Ship": { bg: "bg-[#fff5e6]", text: "text-[#b8860b]", dot: "bg-[#b8860b]" },
    "In Progress": { bg: "bg-[#f1f8fe]", text: "text-[#2c6ecb]", dot: "bg-[#2c6ecb]" },
    "Transferred": { bg: "bg-[#f1f1f1]", text: "text-[#6d7175]", dot: "bg-[#6d7175]" },
    "Draft": { bg: "bg-[#f6f2fe]", text: "text-[#9c6ade]", dot: "bg-[#9c6ade]" },
    "Canceled": { bg: "bg-[#fef1ee]", text: "text-[#d72c0d]", dot: "bg-[#d72c0d]" },
  };
  return map[status];
};

const AdminTransfers = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [data, setData] = useState<Transfer[]>(initialTransfers);

  const filters: Filter[] = ["All", "Draft", "Ready to Ship", "In Progress", "Transferred", "Canceled"];

  const filtered = data.filter((t) => {
    if (activeFilter === "All") return true;
    return t.status === activeFilter;
  });

  const handleCreateTransfer = () => {
    const newId = `#T000${data.length + 1}`;
    const transfer: Transfer = {
      id: newId,
      origin: "Main Warehouse — NYC",
      destination: "Sunrise POS Store",
      status: "Draft",
      received: "—",
      expected: "—",
    };
    setData((prev) => [transfer, ...prev]);
    setActiveFilter("All");
    toast.success(`Transfer ${newId} created as Draft`);
  };

  const handleReport = () => {
    toast.success("Transfers report downloaded");
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#202223]">Transfers</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6d7175] border border-[#e0e0e0] rounded-lg hover:bg-[#f1f1f1] transition-colors"
          >
            <HiOutlineDocumentArrowDown className="text-base" />
            Transfers report
          </button>
          <button
            onClick={handleCreateTransfer}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2c6ecb] rounded-lg hover:bg-[#1e5ab0] transition-colors"
          >
            <HiPlus className="text-lg" />
            Create transfer
          </button>
        </div>
      </div>

      {/* Sub-navigation filters */}
      <div className="flex items-center gap-1 mb-4 border-b border-[#e0e0e0]">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeFilter === f
                ? "border-[#2c6ecb] text-[#2c6ecb]"
                : "border-transparent text-[#6d7175] hover:text-[#202223] hover:border-[#d0d0d0]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e0e0e0]">
                <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase tracking-wider">Transfer ID</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase tracking-wider">Origin</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase tracking-wider">Destination</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-5 text-xs font-medium text-[#6d7175] uppercase tracking-wider">Received qty</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase tracking-wider">Expected arrival</th>
                <th className="py-3 pr-5 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const badge = statusBadge(t.status);
                return (
                  <tr key={t.id} className="border-b border-[#e0e0e0] hover:bg-[#fafafa] transition-colors">
                    <td className="py-3 px-5 font-medium text-[#2c6ecb]">{t.id}</td>
                    <td className="py-3 px-5 text-[#202223]">{t.origin}</td>
                    <td className="py-3 px-5 text-[#202223]">{t.destination}</td>
                    <td className="py-3 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right text-[#6d7175]">{t.received}</td>
                    <td className="py-3 px-5 text-[#6d7175]">{t.expected}</td>
                    <td className="py-3 pr-5">
                      <button
                        onClick={() => toast(`Transfer ${t.id} options`)}
                        className="p-1 text-[#6d7175] hover:text-[#202223] rounded hover:bg-[#f1f1f1] transition-colors"
                      >
                        <HiOutlineEllipsisVertical className="text-base" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-sm text-[#6d7175]">No transfers match this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom link */}
        <div className="px-5 py-3 border-t border-[#e0e0e0]">
          <button
            onClick={() => toast.success("Learn more about transfers — help docs opened")}
            className="inline-flex items-center gap-1.5 text-sm text-[#2c6ecb] hover:text-[#1e5ab0] font-medium transition-colors"
          >
            <HiOutlineInformationCircle className="text-base" />
            Learn more about transfers
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTransfers;
