import { useState } from "react";
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
  const map: Record<Status, { bgRing: string; dot: string }> = {
    "Ready to Ship": { bgRing: "bg-amber-50 text-amber-800 ring-amber-600/20", dot: "bg-amber-500" },
    "In Progress": { bgRing: "bg-blue-50 text-blue-700 ring-blue-700/10", dot: "bg-blue-500" },
    "Transferred": { bgRing: "bg-green-50 text-green-700 ring-green-600/20", dot: "bg-green-500" },
    "Draft": { bgRing: "bg-gray-100 text-gray-700 ring-gray-600/10", dot: "bg-gray-400" },
    "Canceled": { bgRing: "bg-red-50 text-red-700 ring-red-600/10", dot: "bg-red-500" },
  };
  return map[status];
};

const formatArrivalDate = (dateStr: string) => {
  if (!dateStr || dateStr === "—") return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
};

const AdminTransfers = () => {
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
                <th className="text-left py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Transfer ID</th>
                <th className="text-left py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Origin</th>
                <th className="text-left py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Destination</th>
                <th className="text-left py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Status</th>
                <th className="text-right py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Received qty</th>
                <th className="text-left py-3 px-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Expected arrival</th>
                <th className="py-3 pr-5 w-24 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const badge = statusBadge(t.status);
                return (
                  <tr key={t.id} className="border-b border-[#e0e0e0] hover:bg-[#fafafa] transition-colors align-middle">
                    <td className="py-3 px-5 font-medium text-[#2c6ecb] align-middle">{t.id}</td>
                    <td className="py-3 px-5 text-[#202223] align-middle leading-relaxed whitespace-pre-line">{t.origin}</td>
                    <td className="py-3 px-5 text-[#202223] align-middle">{t.destination}</td>
                    <td className="py-3 px-5 align-middle">
                      <span className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${badge.bgRing}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right text-[#6d7175] align-middle">{t.received}</td>
                    <td className="py-3 px-5 text-[#6d7175] align-middle">{formatArrivalDate(t.expected)}</td>
                    <td className="py-3 pr-5 text-right align-middle">
                      <button
                        onClick={() => toast(`Transfer ${t.id} options`)}
                        className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                        title="Options"
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
