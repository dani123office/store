import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import customFetch from "../axios/custom";
import { formatDate } from "../utils/formatDate";

export const loader = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      return [];
    }
    const response = await customFetch.get(`/orders?user_id=${user.id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
};

const OrderHistory = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const orders = useLoaderData() as Order[];
  const navigate = useNavigate();
  const [taxRate, setTaxRate] = useState<number>(17);
  const [shippingFee, setShippingFee] = useState<number>(500);

  useEffect(() => {
    if (!user?.id) {
      toast.error("Please login to view this page");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [taxRes, storeRes] = await Promise.all([
          customFetch.get("/taxes"),
          customFetch.get("/stores"),
        ]);
        if (taxRes.data && taxRes.data.length > 0) {
          setTaxRate(parseFloat(taxRes.data[0].nonfood) || 17);
        }
        if (storeRes.data && storeRes.data.length > 0) {
          setShippingFee(parseFloat(storeRes.data[0].ShippingFee) || 500);
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto pt-20 px-5">
      <h1 className="text-2xl md:text-3xl font-light tracking-[0.15em] uppercase mb-10">
        Order History
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-[#E2E2E2]">
          <thead>
            <tr className="bg-[#f8f8f8]">
              <th className="py-3 px-4 border-b border-[#E2E2E2] text-left text-xs tracking-wider uppercase text-[#151515]/60">Order ID</th>
              <th className="py-3 px-4 border-b border-[#E2E2E2] text-left text-xs tracking-wider uppercase text-[#151515]/60">Date</th>
              <th className="py-3 px-4 border-b border-[#E2E2E2] text-left text-xs tracking-wider uppercase text-[#151515]/60">Total</th>
              <th className="py-3 px-4 border-b border-[#E2E2E2] text-left text-xs tracking-wider uppercase text-[#151515]/60">Status</th>
              <th className="py-3 px-4 border-b border-[#E2E2E2] text-left text-xs tracking-wider uppercase text-[#151515]/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#f8f8f8]">
                <td className="py-3 px-4 border-b border-[#E2E2E2] text-sm">#{order.id}</td>
                <td className="py-3 px-4 border-b border-[#E2E2E2] text-sm text-[#151515]/70">{formatDate(order.orderDate)}</td>
                <td className="py-3 px-4 border-b border-[#E2E2E2] text-sm">Rs.{Math.round(order.subtotal + shippingFee + (order.subtotal * (taxRate / 100))).toLocaleString()}</td>
                <td className="py-3 px-4 border-b border-[#E2E2E2]">
                  <span className="text-xs tracking-wider uppercase bg-[#151515]/10 px-2 py-1">{order.orderStatus}</span>
                </td>
                <td className="py-3 px-4 border-b border-[#E2E2E2]">
                  <Link
                    to={`/order-history/${order.id}`}
                    className="text-xs tracking-wider uppercase underline underline-offset-2 hover:opacity-60"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
