import { useState } from "react";
import { HiOutlineCalendarDays, HiOutlineArrowUpRight, HiOutlineArrowDownRight } from "react-icons/hi2";

type DateRange = "today" | "7d" | "30d";

const AdminAnalytics = () => {
  const [range, setRange] = useState<DateRange>("7d");

  const data = {
    today: {
      sales: "Rs.45,200", salesDiff: "+12.4%", salesUp: true,
      sessions: "1,240", sessionsDiff: "+8.1%", sessionsUp: true,
      orders: "18", ordersDiff: "-2.3%", ordersUp: false,
      conversion: "1.45%", conversionDiff: "+0.12%", conversionUp: true,
      chartPoints: "20,80 40,75 60,60 80,45 100,50 120,35 140,25 160,30 180,15 200,20 220,10 240,5",
    },
    "7d": {
      sales: "Rs.385,900", salesDiff: "+24.8%", salesUp: true,
      sessions: "8,920", sessionsDiff: "+15.3%", sessionsUp: true,
      orders: "142", ordersDiff: "+18.9%", ordersUp: true,
      conversion: "1.59%", conversionDiff: "+0.24%", conversionUp: true,
      chartPoints: "20,70 40,65 60,40 80,48 100,35 120,28 140,42 160,25 180,18 200,22 220,12 240,8",
    },
    "30d": {
      sales: "Rs.1,620,450", salesDiff: "+18.2%", salesUp: true,
      sessions: "35,400", sessionsDiff: "+11.5%", sessionsUp: true,
      orders: "580", ordersDiff: "+14.6%", ordersUp: true,
      conversion: "1.64%", conversionDiff: "+0.18%", conversionUp: true,
      chartPoints: "20,60 40,55 60,48 80,38 100,42 120,30 140,24 160,28 180,20 200,15 220,10 240,4",
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
          <div className="space-y-4">
            {[
              { title: "Zarka Couture Premium Silk Maxi", category: "Luxury Collection", sales: "Rs.98,000", units: 14 },
              { title: "Elegant Embroidered Lawn Suit", category: "Summer Edition", sales: "Rs.82,500", units: 11 },
              { title: "Luxury Organza Festive Kurta", category: "Luxury Collection", sales: "Rs.75,000", units: 8 },
              { title: "Limited Edition Handcrafted Shawl", category: "Special Edition", sales: "Rs.68,000", units: 5 },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between border-b border-[#fafafa] pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#202223] truncate">{p.title}</p>
                  <p className="text-[10px] text-[#6d7175]">{p.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-[#202223]">{p.sales}</p>
                  <p className="text-[10px] text-[#6d7175]">{p.units} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
