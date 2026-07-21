import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router-dom";
import customFetch from "../axios/custom";
import { formatDate } from "../utils/formatDate";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  const response = await customFetch(`orders/${id}`);
  return response.data;
};

const statusColors: Record<string, string> = {
  "Awaiting Verification": "bg-amber-50 text-amber-700 border-amber-200",
  "Processing": "bg-orange-50 text-orange-700 border-orange-200",
  "Shipped": "bg-blue-50 text-blue-700 border-blue-200",
  "Delivered": "bg-green-50 text-green-700 border-green-200",
  "Canceled": "bg-red-50 text-red-700 border-red-200",
};

const SingleOrderHistory = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const navigate = useNavigate();
  const singleOrder = useLoaderData() as Order;
  const [shippingFee, setShippingFee] = useState(500);
  const data = (singleOrder?.data || {}) as any;
  const isManual = data?.paymentType === "easypaisa";

  useEffect(() => {
    if (!user?.id) {
      toast.error("Please login to view this page");
      navigate("/login");
    } else if (singleOrder?.user && String(singleOrder.user.id) !== String(user.id)) {
      toast.error("Access denied. You are not authorized to view this order.");
      navigate("/order-history");
    }
  }, [user, singleOrder, navigate]);

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

  if (!singleOrder) {
    return (
      <div className="max-w-screen-xl mx-auto pt-24 px-5 text-center">
        <p className="text-body-md text-shade-50">Order not found.</p>
        <Link to="/order-history" className="text-ink underline mt-4 inline-block">Back to orders</Link>
      </div>
    );
  }

  const statusClass = statusColors[singleOrder.orderStatus] || "bg-gray-50 text-gray-700 border-gray-200";
  const total = (singleOrder.subtotal || 0) + shippingFee;

  const TimelineStep = ({ label, done, active, isLast }: { label: string; done: boolean; active?: boolean; isLast?: boolean }) => (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          done ? "bg-green-500 border-green-500" : active ? "border-amber-500 bg-amber-50" : "border-gray-300 bg-white"
        }`}>
          {done && <span className="text-white text-xs">✓</span>}
        </div>
        {!isLast && <div className={`w-0.5 h-8 ${done ? "bg-green-300" : "bg-gray-200"}`} />}
      </div>
      <div className="pb-2">
        <p className={`text-body-md font-medium ${done || active ? "text-ink" : "text-shade-40"}`}>{label}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto pt-24 px-5 pb-16">
      {/* Back link */}
      <Link
        to="/order-history"
        className="inline-flex items-center gap-1 text-caption uppercase tracking-tracked text-shade-50 hover:text-ink transition-colors mb-6"
      >
        <span>←</span> Back to Orders
      </Link>

      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-heading-section text-ink">Order #{singleOrder.id}</h1>
          <p className="text-body-md text-shade-50 mt-1">Placed on {formatDate(singleOrder.orderDate)}</p>
        </div>
        <span className={`text-caption uppercase tracking-tracked font-medium px-4 py-2 rounded-full border w-fit ${statusClass}`}>
          {singleOrder.orderStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Timeline + Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <div className="bg-canvas border border-hairline rounded-lg p-6">
            <h3 className="text-caption uppercase tracking-tracked font-semibold text-ink mb-5">Order Timeline</h3>
            <TimelineStep label="Order Placed" done={true} />
            {isManual && (
              <TimelineStep
                label="Payment Received — Awaiting Admin Verification"
                done={["Processing", "Shipped", "Delivered"].includes(singleOrder.orderStatus)}
                active={singleOrder.orderStatus === "Awaiting Verification"}
              />
            )}
            <TimelineStep
              label="Processing"
              done={["Shipped", "Delivered"].includes(singleOrder.orderStatus)}
              active={["Processing", "Awaiting Verification"].includes(singleOrder.orderStatus)}
            />
            <TimelineStep
              label="Shipped"
              done={singleOrder.orderStatus === "Delivered"}
              active={singleOrder.orderStatus === "Shipped"}
            />
            <TimelineStep
              label="Delivered"
              done={singleOrder.orderStatus === "Delivered"}
              active={false}
              isLast
            />
          </div>

          {/* Items */}
          <div className="bg-canvas border border-hairline rounded-lg p-6">
            <h3 className="text-caption uppercase tracking-tracked font-semibold text-ink mb-4">Items ({singleOrder.products?.length || 0})</h3>
            <div className="divide-y divide-hairline">
              {singleOrder.products?.map((product: any, idx: number) => (
                <div key={product.id || idx} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <img
                    src={product.image ? `/assets/${product.image}` : "/assets/product image 1.jpg"}
                    alt={product.title}
                    className="w-16 h-20 object-cover rounded border border-hairline flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/assets/product image 1.jpg"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md font-medium text-ink truncate">{product.title}</p>
                    <p className="text-caption text-shade-50 mt-0.5">
                      {product.color && `Color: ${product.color}`}{product.color && product.size ? " | " : ""}{product.size && `Size: ${product.size}`}
                    </p>
                    <p className="text-caption text-shade-50">Qty: {product.quantity}</p>
                  </div>
                  <p className="text-body-md text-ink font-medium whitespace-nowrap">Rs.{product.price?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Payment Status */}
          {isManual && (
            <div className={`rounded-lg border p-5 ${
              singleOrder.orderStatus === "Awaiting Verification"
                ? "bg-amber-50 border-amber-200"
                : ["Processing", "Shipped", "Delivered"].includes(singleOrder.orderStatus)
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
            }`}>
              <h3 className="text-caption uppercase tracking-tracked font-semibold text-ink mb-3">Payment Status</h3>
              <div className="space-y-2 text-body-md">
                <div className="flex justify-between">
                  <span className="text-shade-50">Method</span>
                  <span className="font-medium text-ink capitalize">{data.paymentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-shade-50">Sent To</span>
                  <span className="font-medium text-ink">{data.merchantName || "Zarka Usman"} ({data.merchantNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-shade-50">TID</span>
                  <span className="font-medium text-ink">{data.transactionId || "—"}</span>
                </div>
                {data.paymentScreenshot && (
                  <div>
                    <span className="text-shade-50 block mb-1">Screenshot</span>
                    <img
                      src={`/assets/${data.paymentScreenshot}`}
                      alt="Payment proof"
                      className="max-h-32 rounded border border-hairline cursor-pointer"
                      onClick={() => window.open(`/assets/${data.paymentScreenshot}`, "_blank")}
                    />
                  </div>
                )}
                <div className={`pt-2 border-t text-center font-medium ${
                  singleOrder.orderStatus === "Awaiting Verification"
                    ? "text-amber-700"
                    : "text-green-700"
                }`}>
                  {singleOrder.orderStatus === "Awaiting Verification"
                    ? "⏳ Awaiting Verification"
                    : "✓ Payment Verified"}
                </div>
              </div>
            </div>
          )}

          {/* Shipping Info */}
          <div className="bg-canvas border border-hairline rounded-lg p-5">
            <h3 className="text-caption uppercase tracking-tracked font-semibold text-ink mb-3">Shipping Address</h3>
            <div className="text-body-md text-ink space-y-1">
              <p className="font-medium">{data.firstName || ""} {data.lastName || ""}</p>
              <p className="text-shade-50">{data.address || "—"}{data.apartment ? `, ${data.apartment}` : ""}</p>
              <p className="text-shade-50">{data.city || ""}{data.region ? `, ${data.region}` : ""} {data.postalCode || ""}</p>
              <p className="text-shade-50">{data.country || ""}</p>
              <p className="text-shade-50 mt-2">📞 {data.phone || "—"}</p>
              <p className="text-shade-50">✉️ {data.email || data.emailAddress || singleOrder.user?.email || "—"}</p>
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-canvas border border-hairline rounded-lg p-5">
            <h3 className="text-caption uppercase tracking-tracked font-semibold text-ink mb-3">Order Total</h3>
            <div className="space-y-2 text-body-md">
              <div className="flex justify-between text-shade-50">
                <span>Subtotal</span>
                <span>Rs.{(singleOrder.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-shade-50">
                <span>Shipping</span>
                <span>Rs.{shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-ink border-t border-hairline pt-2 text-price-current">
                <span>Total</span>
                <span>Rs.{Math.round(total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-canvas-cream border border-hairline rounded-lg p-5 text-center">
            <p className="text-caption uppercase tracking-tracked text-shade-50 mb-2">Need Help?</p>
            <Link to="/contact" className="text-body-md text-ink underline hover:no-underline">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrderHistory;
