import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import { HiOutlineCube, HiOutlineShoppingBag, HiOutlineUsers, HiOutlineCurrencyDollar } from "react-icons/hi2";
import { formatDate } from "../utils/formatDate";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          customFetch.get("/products"),
          customFetch.get("/orders"),
          customFetch.get("/users"),
        ]);
        const orders = ordersRes.data;
        const revenue = orders.reduce((sum: number, o: any) => sum + (o.subtotal || 0) + 500 + (o.subtotal || 0) / 5, 0);
        setStats({
          products: productsRes.data.length,
          orders: orders.length,
          users: usersRes.data.length,
          revenue,
        });
        setRecentOrders(orders.slice(-5).reverse());
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Products", value: stats.products, icon: HiOutlineCube, color: "#2c6ecb", bg: "#f1f8fe" },
    { label: "Total Orders", value: stats.orders, icon: HiOutlineShoppingBag, color: "#008060", bg: "#f1f8f5" },
    { label: "Total Customers", value: stats.users, icon: HiOutlineUsers, color: "#9c6ade", bg: "#f6f2fe" },
    { label: "Total Revenue", value: `Rs.${stats.revenue.toLocaleString()}`, icon: HiOutlineCurrencyDollar, color: "#d72c0d", bg: "#fef1ee" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#202223] mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-[#e0e0e0] rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                  <Icon className="text-lg" style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-2xl font-semibold text-[#202223]">{card.value}</p>
              <p className="text-sm text-[#6d7175] mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-[#e0e0e0] rounded-lg">
        <div className="px-5 py-4 border-b border-[#e0e0e0]">
          <h2 className="text-sm font-semibold text-[#202223]">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-[#6d7175] p-6">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fafafa]">
                  <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase tracking-wider">Order</th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase tracking-wider">Customer</th>
                  <th className="text-right py-3 px-5 text-xs font-medium text-[#6d7175] uppercase tracking-wider">Total</th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-t border-[#e0e0e0] hover:bg-[#fafafa]">
                    <td className="py-3 px-5 font-medium text-[#2c6ecb]">#{order.id}</td>
                    <td className="py-3 px-5 text-[#6d7175]">{formatDate(order.orderDate)}</td>
                    <td className="py-3 px-5 text-[#202223]">{order.data?.email || order.user?.email || "Guest"}</td>
                    <td className="py-3 px-5 text-right font-medium">Rs.{(order.subtotal + 500 + order.subtotal / 5).toLocaleString()}</td>
                    <td className="py-3 px-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.orderStatus === "Processing" ? "bg-[#fff5e6] text-[#b8860b]" :
                        order.orderStatus === "Shipped" ? "bg-[#f1f8fe] text-[#2c6ecb]" :
                        order.orderStatus === "Delivered" ? "bg-[#f1f8f5] text-[#008060]" :
                        "bg-[#f1f1f1] text-[#6d7175]"
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
