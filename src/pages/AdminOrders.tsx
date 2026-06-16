import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import { formatDate } from "../utils/formatDate";

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await customFetch.get("/orders");
        setOrders(res.data.reverse());
      } catch (e) {
        console.error(e);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-light tracking-[0.15em] uppercase mb-8">Orders</h1>

      <div className="bg-white border border-[#E2E2E2] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f8f8f8]">
              <th className="text-left py-3 px-4 text-xs tracking-wider uppercase text-[#151515]/60">Order ID</th>
              <th className="text-left py-3 px-4 text-xs tracking-wider uppercase text-[#151515]/60">Date</th>
              <th className="text-left py-3 px-4 text-xs tracking-wider uppercase text-[#151515]/60">Customer</th>
              <th className="text-right py-3 px-4 text-xs tracking-wider uppercase text-[#151515]/60">Total</th>
              <th className="text-left py-3 px-4 text-xs tracking-wider uppercase text-[#151515]/60">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} className="border-t border-[#E2E2E2] hover:bg-[#f8f8f8]">
                <td className="py-3 px-4 font-medium">#{order.id}</td>
                <td className="py-3 px-4 text-[#151515]/60">{formatDate(order.orderDate)}</td>
                <td className="py-3 px-4">{order.data?.email || order.user?.email || "Guest"}</td>
                <td className="py-3 px-4 text-right">Rs.{(order.subtotal + 500 + order.subtotal / 5).toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className="text-xs tracking-wider uppercase bg-[#151515]/10 px-2 py-1">{order.orderStatus}</span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-sm text-[#151515]/50">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
