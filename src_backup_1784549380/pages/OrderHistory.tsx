import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import customFetch from "../axios/custom";
import { formatDate } from "../utils/formatDate";

export const loader = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return [];
    const response = await customFetch.get(`/orders?user_id=${user.id}`);
    return response.data;
  } catch {
    return [];
  }
};

const statusColors: Record<string, string> = {
  "Awaiting Verification": "bg-amber-50 text-amber-700 border-amber-200",
  "Processing": "bg-orange-50 text-orange-700 border-orange-200",
  "Shipped": "bg-blue-50 text-blue-700 border-blue-200",
  "Delivered": "bg-green-50 text-green-700 border-green-200",
  "Canceled": "bg-red-50 text-red-700 border-red-200",
};

const OrderHistory = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const orders = useLoaderData() as Order[];
  const navigate = useNavigate();
  const [shippingFee, setShippingFee] = useState(500);

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
      } catch {}
    };
    fetchSettings();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto pt-24 px-5 pb-16">
      <h1 className="text-heading-section text-ink mb-2">Order History</h1>
      <p className="text-body-md text-shade-50 mb-10">View all your past orders and their status.</p>

      {orders.length === 0 ? (
        <div className="text-center py-20 border border-hairline bg-canvas rounded-lg">
          <p className="text-body-md text-shade-50 mb-4">No orders yet</p>
          <Link
            to="/shop"
            className="inline-block bg-ink text-on-primary text-button-label uppercase tracking-tracked px-8 py-4 rounded-pill hover:bg-shade-60 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusClass = statusColors[order.orderStatus] || "bg-gray-50 text-gray-700 border-gray-200";
            const d = order.data as any;
  const isManual = d?.paymentType === "easypaisa";
            const itemCount = order.products?.length || 0;

            return (
              <Link
                key={order.id}
                to={`/order-history/${order.id}`}
                className="block bg-canvas border border-hairline rounded-lg hover:border-ink/30 hover:shadow-sm transition-all"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-heading-card text-ink">#{order.id}</span>
                      <span className={`text-caption uppercase tracking-tracked px-3 py-1 rounded-full border ${statusClass}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <span className="text-caption text-shade-50">{formatDate(order.orderDate)}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-md text-shade-50">
                      <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                      {isManual && (
                        <span className="flex items-center gap-1.5 text-amber-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          {d.paymentType}
                        </span>
                      )}
                      {d?.paymentType === "credit-card" && (
                        <span className="text-shade-40">Credit Card</span>
                      )}
                      {d?.paymentType === "cod" && (
                        <span className="text-shade-40">Cash on Delivery</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-price-current text-ink font-semibold">
                        Rs.{Math.round((order.subtotal || 0) + shippingFee).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress dots */}
                  <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-hairline">
                    <div className="flex items-center gap-1 text-caption text-shade-40">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Placed</span>
                    </div>
                    <span className="text-shade-20 mx-1">—</span>
                    <div className="flex items-center gap-1 text-caption text-shade-40">
                      <span className={`w-2 h-2 rounded-full ${
                        ["Awaiting Verification", "Processing", "Shipped", "Delivered"].includes(order.orderStatus)
                          ? "bg-amber-500"
                          : "bg-shade-20"
                      }`} />
                      <span>{isManual ? "Paid" : "Process"}</span>
                    </div>
                    <span className="text-shade-20 mx-1">—</span>
                    <div className="flex items-center gap-1 text-caption text-shade-40">
                      <span className={`w-2 h-2 rounded-full ${
                        ["Shipped", "Delivered"].includes(order.orderStatus)
                          ? "bg-blue-500"
                          : "bg-shade-20"
                      }`} />
                      <span>Ship</span>
                    </div>
                    <span className="text-shade-20 mx-1">—</span>
                    <div className="flex items-center gap-1 text-caption text-shade-40">
                      <span className={`w-2 h-2 rounded-full ${
                        order.orderStatus === "Delivered" ? "bg-green-500" : "bg-shade-20"
                      }`} />
                      <span>Deliver</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
