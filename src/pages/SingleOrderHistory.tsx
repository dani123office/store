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
  const [taxRate, setTaxRate] = useState<number>(17);

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
    const fetchTax = async () => {
      try {
        const res = await customFetch.get("/taxes");
        if (res.data && res.data.length > 0) {
          setTaxRate(parseFloat(res.data[0].nonfood) || 17);
        }
      } catch (e) {
        console.error("Failed to load tax rate, fallback to 17%", e);
      }
    };
    fetchTax();
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto pt-20 px-5">
      <h1 className="text-2xl md:text-3xl font-light tracking-[0.15em] uppercase mb-10">
        Order Details
      </h1>
      <div className="bg-white border border-[#E2E2E2] p-6">
        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div>
            <p className="text-xs tracking-wider uppercase text-[#151515]/60 mb-1">Order ID</p>
            <p className="font-medium">#{singleOrder.id}</p>
          </div>
          <div>
            <p className="text-xs tracking-wider uppercase text-[#151515]/60 mb-1">Date</p>
            <p className="font-medium">{formatDate(singleOrder.orderDate)}</p>
          </div>
          <div>
            <p className="text-xs tracking-wider uppercase text-[#151515]/60 mb-1">Status</p>
            <span className="text-xs tracking-wider uppercase bg-[#151515]/10 px-2 py-1">{singleOrder.orderStatus}</span>
          </div>
        </div>

        <div className="border-t border-[#E2E2E2] pt-6 mb-8">
          <h3 className="text-sm tracking-wider uppercase font-medium mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#151515]/70">Subtotal</span>
              <span>Rs.{singleOrder.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#151515]/70">Shipping</span>
              <span>Rs.500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#151515]/70">GST ({taxRate}%)</span>
              <span>Rs.{Math.round(singleOrder.subtotal * (taxRate / 100)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-[#E2E2E2] pt-2 font-medium">
              <span>Total</span>
              <span>Rs.{Math.round(singleOrder.subtotal + 500 + (singleOrder.subtotal * (taxRate / 100))).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E2E2E2] pt-6">
          <h3 className="text-sm tracking-wider uppercase font-medium mb-4">Items</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8f8f8]">
                <th className="py-3 px-4 text-left text-xs tracking-wider uppercase text-[#151515]/60">Product</th>
                <th className="py-3 px-4 text-center text-xs tracking-wider uppercase text-[#151515]/60">Qty</th>
                <th className="py-3 px-4 text-right text-xs tracking-wider uppercase text-[#151515]/60">Price</th>
              </tr>
            </thead>
            <tbody>
              {singleOrder.products.map((product) => (
                <tr key={nanoid()} className="border-t border-[#E2E2E2]">
                  <td className="py-3 px-4">{product?.title}</td>
                  <td className="py-3 px-4 text-center text-[#151515]/70">{product?.quantity}</td>
                  <td className="py-3 px-4 text-right">Rs.{product?.price.toLocaleString()}</td>
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
