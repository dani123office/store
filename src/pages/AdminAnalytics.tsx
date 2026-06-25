import { useState } from "react";
import { HiOutlineCalendarDays, HiOutlineArrowUpRight, HiOutlineArrowDownRight } from "react-icons/hi2";

type DateRange = "today" | "7d" | "30d";

const AdminAnalytics = () => {
  const [range, setRange] = useState<DateRange>("7d");

  const data = {
    today: {
      sales: "Rs.0", salesDiff: "0.0%", salesUp: true,
      sessions: "0", sessionsDiff: "0.0%", sessionsUp: true,
      orders: "0", ordersDiff: "0.0%", ordersUp: true,
      conversion: "0.00%", conversionDiff: "0.00%", conversionUp: true,
      chartPoints: "20,95 40,95 60,95 80,95 100,95 120,95 140,95 160,95 180,95 200,95 220,95 240,95",
    },
    "7d": {
      sales: "Rs.0", salesDiff: "0.0%", salesUp: true,
      sessions: "0", sessionsDiff: "0.0%", sessionsUp: true,
      orders: "0", ordersDiff: "0.0%", ordersUp: true,
      conversion: "0.00%", conversionDiff: "0.00%", conversionUp: true,
      chartPoints: "20,95 40,95 60,95 80,95 100,95 120,95 140,95 160,95 180,95 200,95 220,95 240,95",
    },
    "30d": {
      sales: "Rs.0", salesDiff: "0.0%", salesUp: true,
      sessions: "0", sessionsDiff: "0.0%", sessionsUp: true,
      orders: "0", ordersDiff: "0.0%", ordersUp: true,
      conversion: "0.00%", conversionDiff: "0.00%", conversionUp: true,
      chartPoints: "20,95 40,95 60,95 80,95 100,95 120,95 140,95 160,95 180,95 200,95 220,95 240,95",
    },
  };

  const current = data[range];

  const cards = [
    { label: "Total Sales", value: current.sales, diff: current.salesDiff, up: current.salesUp },
    { label: "Online Store Sessions", value: current.sessions, diff: current.sessionsDiff, up: current.sessionsUp },
    { label: "Orders", value: current.orders, diff: current.ordersDiff, up: current.ordersUp },
    { label: "Conversion Rate", value: current.conversion, diff: current.conversionDiff, up: current.conversionUp },
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#202223]">Analytics</h1>
          <p className="text-xs text-[#6d7175]">Real-time and historical store metrics.</p>
        </div>
        <div className="flex items-center gap-2 border border-[#e0e0e0] bg-white rounded-lg p-1">
          {(["today", "7d", "30d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                range === r
                  ? "bg-[#2c6ecb] text-white"
                  : "text-[#6d7175] hover:text-[#202223] hover:bg-[#fafafa]"
              }`}
            >
              {r === "today" ? "Today" : r === "7d" ? "Last 7 Days" : "Last 30 Days"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-[#e0e0e0] rounded-lg p-5 shadow-sm">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-2">{card.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#202223]">{card.value}</span>
              <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${card.up ? "text-[#008060]" : "text-[#d72c0d]"}`}>
                {card.up ? <HiOutlineArrowUpRight /> : <HiOutlineArrowDownRight />}
                {card.diff}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e0e0e0] rounded-lg p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-[#202223]">Sales Trend over Time</h2>
            <HiOutlineCalendarDays className="text-[#6d7175] text-lg" />
          </div>
          <div className="h-64 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 260 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2c6ecb" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2c6ecb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="260" y2="20" stroke="#e0e0e0" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="50" x2="260" y2="50" stroke="#e0e0e0" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="80" x2="260" y2="80" stroke="#e0e0e0" strokeWidth="0.5" strokeDasharray="3,3" />
              
              {/* Path area */}
              <path
                d={`M 20,100 L ${current.chartPoints} L 240,100 Z`}
                fill="url(#chartGrad)"
              />
              {/* Path line */}
              <path
                d={`M ${current.chartPoints}`}
                fill="none"
                stroke="#2c6ecb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-[#6d7175] px-4">
              <span>Start</span>
              <span>Midpoint</span>
              <span>End</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e0e0e0] rounded-lg p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#202223] mb-4">Top Selling Products</h2>
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <p className="text-sm text-[#6d7175] font-medium">No sales data available yet</p>
            <p className="text-xs text-[#8c9196] mt-1">Start selling to see metrics here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
