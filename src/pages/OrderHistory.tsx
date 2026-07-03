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
        const storeRes = await customFetch.get("/stores");
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
      <h1 className="text-heading-section text-ink mb-10">Order History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-canvas border border-hairline">
          <thead>
            <tr className="bg-canvas-cream">
              <th className="py-3 px-4 border-b border-hairline text-left text-caption uppercase tracking-tracked text-shade-50">Order ID</th>
              <th className="py-3 px-4 border-b border-hairline text-left text-caption uppercase tracking-tracked text-shade-50">Date</th>
              <th className="py-3 px-4 border-b border-hairline text-left text-caption uppercase tracking-tracked text-shade-50">Total</th>
              <th className="py-3 px-4 border-b border-hairline text-left text-caption uppercase tracking-tracked text-shade-50">Status</th>
              <th className="py-3 px-4 border-b border-hairline text-left text-caption uppercase tracking-tracked text-shade-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-canvas-cream">
                <td className="py-3 px-4 border-b border-hairline text-body-md">#{order.id}</td>
                <td className="py-3 px-4 border-b border-hairline text-body-md text-shade-50">{formatDate(order.orderDate)}</td>
                <td className="py-3 px-4 border-b border-hairline text-body-md">Rs.{Math.round(order.subtotal + shippingFee).toLocaleString()}</td>
                <td className="py-3 px-4 border-b border-hairline">
                  <span className="text-caption uppercase tracking-tracked bg-shade-20 px-2 py-1 rounded-pill text-ink">{order.orderStatus}</span>
                </td>
                <td className="py-3 px-4 border-b border-hairline">
                  <Link
                    to={`/order-history/${order.id}`}
                    className="text-caption uppercase tracking-tracked underline underline-offset-2 hover:opacity-60"
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