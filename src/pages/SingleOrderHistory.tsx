import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import customFetch from "../axios/custom";
import { nanoid } from "nanoid";
import { formatDate } from "../utils/formatDate";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  const response = await customFetch(`orders/${id}`);
  return response.data;
};

const SingleOrderHistory = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const navigate = useNavigate();
  const singleOrder = useLoaderData() as Order;
  const [shippingFee, setShippingFee] = useState<number>(500);

  useEffect(() => {
    if (!user?.id) {
      toast.error("Please login to view this page");
      navigate("/login");
    } else if (singleOrder?.user && singleOrder.user.id !== user.id) {
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
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto pt-20 px-5">
      <h1 className="text-heading-section text-ink mb-10">Order Details</h1>
      <div className="bg-canvas border border-hairline p-6 rounded-md">
        <div className="grid grid-cols-2 gap-4 mb-8 text-body-md">
          <div>
            <p className="text-caption uppercase tracking-tracked text-shade-50 mb-1">Order ID</p>
            <p className="font-medium text-ink">#{singleOrder.id}</p>
          </div>
          <div>
            <p className="text-caption uppercase tracking-tracked text-shade-50 mb-1">Date</p>
            <p className="font-medium text-ink">{formatDate(singleOrder.orderDate)}</p>
          </div>
          <div>
            <p className="text-caption uppercase tracking-tracked text-shade-50 mb-1">Status</p>
            <span className="text-caption uppercase tracking-tracked bg-shade-20 px-2 py-1 rounded-pill text-ink">{singleOrder.orderStatus}</span>
          </div>
        </div>

        <div className="border-t border-hairline pt-6 mb-8">
          <h3 className="text-caption uppercase tracking-tracked font-medium text-ink mb-4">Order Summary</h3>
          <div className="space-y-2 text-body-md">
            <div className="flex justify-between">
              <span className="text-shade-50">Subtotal</span>
              <span className="text-ink">Rs.{singleOrder.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-shade-50">Shipping</span>
              <span className="text-ink">Rs.{shippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-hairline pt-2 font-medium text-ink">
              <span>Total</span>
              <span>Rs.{Math.round(singleOrder.subtotal + shippingFee).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-hairline pt-6">
          <h3 className="text-caption uppercase tracking-tracked font-medium text-ink mb-4">Items</h3>
          <table className="w-full text-body-md">
            <thead>
              <tr className="bg-canvas-cream">
                <th className="py-3 px-4 text-left text-caption uppercase tracking-tracked text-shade-50">Product</th>
                <th className="py-3 px-4 text-center text-caption uppercase tracking-tracked text-shade-50">Qty</th>
                <th className="py-3 px-4 text-right text-caption uppercase tracking-tracked text-shade-50">Price</th>
              </tr>
            </thead>
            <tbody>
              {singleOrder.products.map((product) => (
                <tr key={nanoid()} className="border-t border-hairline">
                  <td className="py-3 px-4 text-ink">{product?.title}</td>
                  <td className="py-3 px-4 text-center text-shade-50">{product?.quantity}</td>
                  <td className="py-3 px-4 text-right text-ink">Rs.{product?.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SingleOrderHistory;