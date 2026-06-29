import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import { formatDate } from "../utils/formatDate";
import { HiXMark, HiTrash } from "react-icons/hi2";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [shippingFee, setShippingFee] = useState<number>(500);
  const [taxRate, setTaxRate] = useState<number>(17);

  // Fulfillment inputs
  const [carrierInput, setCarrierInput] = useState("");
  const [trackingInput, setTrackingInput] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await customFetch.get("/orders");
      setOrders(res.data.reverse());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
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

  // Sync inputs with selected order
  useEffect(() => {
    if (selectedOrder) {
      setCarrierInput(selectedOrder.data?.carrier || "");
      setTrackingInput(selectedOrder.data?.tracking_number || "");
    } else {
      setCarrierInput("");
      setTrackingInput("");
    }
  }, [selectedOrder]);

  const handleStatusChange = async (order: any, newStatus: string) => {
    setUpdating(true);
    try {
      const payload = {
        ...order,
        orderStatus: newStatus,
      };
      const res = await customFetch.put(`/orders/${order.id}`, payload);
      toast.success(`Order status updated to ${newStatus}`);
      setSelectedOrder(res.data);
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleFulfillmentUpdate = async (carrier: string, trackingNumber: string) => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const updatedData = {
        ...selectedOrder.data,
        carrier,
        tracking_number: trackingNumber,
      };
      const payload = {
        ...selectedOrder,
        data: updatedData,
      };
      const res = await customFetch.put(`/orders/${selectedOrder.id}`, payload);
      toast.success("Fulfillment details updated");
      setSelectedOrder(res.data);
      fetchOrders();
    } catch {
      toast.error("Failed to update fulfillment");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await customFetch.delete(`/orders/${deleteTarget}`);
      toast.success("Order deleted successfully");
      setSelectedOrder(null);
      setDeleteTarget(null);
      fetchOrders();
    } catch {
      toast.error("Failed to delete order");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-xl font-semibold text-[#202223] mb-6">Orders</h1>

      <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fafafa] border-b border-[#e0e0e0]">
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Order ID</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Date</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Customer</th>
              <th className="text-right py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase">Total</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#6d7175] uppercase w-36">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="border-t border-[#e0e0e0] hover:bg-[#f8f8f8] cursor-pointer transition-colors"
              >
                <td className="py-4 px-5 font-semibold text-[#2c6ecb]">#{order.id}</td>
                <td className="py-4 px-5 text-[#6d7175]">{formatDate(order.orderDate)}</td>
                <td className="py-4 px-5 text-[#202223]">
                  {order.data?.email || order.user?.email || "Guest"}
                </td>
                <td className="py-4 px-5 text-right font-semibold text-[#202223]">
                  Rs.{Math.round(order.subtotal + shippingFee + order.subtotal * (taxRate / 100)).toLocaleString()}
                </td>
                <td className="py-4 px-5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.orderStatus === "Processing" ? "bg-[#fff5e6] text-[#b8860b]" :
                    order.orderStatus === "Shipped" ? "bg-[#f1f8fe] text-[#2c6ecb]" :
                    order.orderStatus === "Delivered" ? "bg-[#f1f8f5] text-[#008060]" :
                    order.orderStatus === "Canceled" ? "bg-[#fef1ee] text-[#d72c0d]" :
                    "bg-[#f1f1f1] text-[#6d7175]"
                  }`}>
                    {order.orderStatus}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-[#6d7175]">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={() => setSelectedOrder(null)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-xl overflow-y-auto flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0] flex-shrink-0">
              <div>
                <h2 className="text-base font-semibold text-[#202223]">Order #{selectedOrder.id}</h2>
                <p className="text-xs text-[#6d7175]">{formatDate(selectedOrder.orderDate)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-[#6d7175] hover:text-[#202223]">
                <HiXMark className="text-xl" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {/* Status Section */}
              <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-4 flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={selectedOrder.orderStatus}
                    disabled={updating}
                    onChange={(e) => handleStatusChange(selectedOrder, e.target.value)}
                    className="border border-[#e0e0e0] rounded-lg px-2.5 py-1 text-sm outline-none bg-white focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>
                <button
                  onClick={() => setDeleteTarget(selectedOrder.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e0e0e0] hover:border-[#d72c0d] hover:bg-[#fef1ee] text-xs font-medium text-[#d72c0d] rounded-lg transition-colors"
                >
                  <HiTrash className="text-sm" />
                  Delete Order
                </button>
              </div>

              {/* Fulfillment & Tracking Inputs */}
              <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Fulfillment & Tracking</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#6d7175] mb-1">Carrier</label>
                    <input
                      type="text"
                      placeholder="e.g. DHL, FedEx"
                      value={carrierInput}
                      onChange={(e) => setCarrierInput(e.target.value)}
                      className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-1 text-sm outline-none bg-white focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6d7175] mb-1">Tracking Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 12345678"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      className="w-full border border-[#e0e0e0] rounded-lg px-2.5 py-1 text-sm outline-none bg-white focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFulfillmentUpdate(carrierInput, trackingInput)}
                  disabled={updating}
                  className="w-full bg-[#151515] hover:bg-[#2c2c2c] text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Tracking Info"}
                </button>
              </div>

              {/* Visual Fulfillment Timeline */}
              <div className="bg-white border border-[#e0e0e0] rounded-lg p-4">
                <h3 className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-4">Fulfillment Timeline</h3>
                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e0e0e0]">
                  {/* Step 1: Placed */}
                  <div className="relative">
                    <div className="absolute -left-[20px] top-1 w-[12px] h-[12px] rounded-full border-2 border-green-600 bg-green-600 shadow" />
                    <div>
                      <p className="text-sm font-semibold text-[#202223]">Order Placed</p>
                      <p className="text-xs text-[#6d7175]">{formatDate(selectedOrder.orderDate)}</p>
                    </div>
                  </div>

                  {/* Step 2: Processing */}
                  <div className="relative">
                    <div className={`absolute -left-[20px] top-1 w-[12px] h-[12px] rounded-full border-2 bg-white shadow ${
                      ["Processing", "Shipped", "Delivered"].includes(selectedOrder.orderStatus)
                        ? "border-green-600 bg-green-600"
                        : "border-gray-300"
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-[#202223]">Processing</p>
                      <p className="text-xs text-[#6d7175]">
                        {["Processing", "Shipped", "Delivered"].includes(selectedOrder.orderStatus)
                          ? "Order has been confirmed and is being packed."
                          : "Awaiting confirmation."}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="relative">
                    <div className={`absolute -left-[20px] top-1 w-[12px] h-[12px] rounded-full border-2 bg-white shadow ${
                      ["Shipped", "Delivered"].includes(selectedOrder.orderStatus)
                        ? "border-green-600 bg-green-600"
                        : "border-gray-300"
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-[#202223]">Shipped</p>
                      <p className="text-xs text-[#6d7175]">
                        {["Shipped", "Delivered"].includes(selectedOrder.orderStatus) ? (
                          <>
                            Shipped via <span className="font-semibold">{selectedOrder.data?.carrier || "Standard Carrier"}</span>
                            {selectedOrder.data?.tracking_number && (
                              <> (Tracking #: <span className="font-mono text-[#2c6ecb] font-semibold">{selectedOrder.data.tracking_number}</span>)</>
                            )}
                          </>
                        ) : (
                          "Not yet shipped."
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="relative">
                    <div className={`absolute -left-[20px] top-1 w-[12px] h-[12px] rounded-full border-2 bg-white shadow ${
                      selectedOrder.orderStatus === "Delivered"
                        ? "border-green-600 bg-green-600"
                        : "border-gray-300"
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-[#202223]">Delivered</p>
                      <p className="text-xs text-[#6d7175]">
                        {selectedOrder.orderStatus === "Delivered"
                          ? "Order has been successfully delivered."
                          : "Awaiting delivery."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-3">Customer Details</h3>
                <div className="bg-white border border-[#e0e0e0] rounded-lg p-4 space-y-2 text-sm text-[#202223]">
                  <p><span className="font-medium text-[#6d7175]">Email:</span> {selectedOrder.data?.email || selectedOrder.user?.email || "Guest"}</p>
                  <p><span className="font-medium text-[#6d7175]">Name:</span> {selectedOrder.data?.firstname || "—"} {selectedOrder.data?.lastname || ""}</p>
                  <p><span className="font-medium text-[#6d7175]">Phone:</span> {selectedOrder.data?.phone || "—"}</p>
                  <div className="pt-2 border-t border-[#f0f0f0]">
                    <p className="font-medium text-[#6d7175] mb-1">Shipping Address</p>
                    <p className="text-[#202223] leading-relaxed">
                      {selectedOrder.data?.address || "—"}, {selectedOrder.data?.apartment || ""}<br />
                      {selectedOrder.data?.city || ""}, {selectedOrder.data?.postalCode || ""}<br />
                      {selectedOrder.data?.country || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items list */}
              <div>
                <h3 className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-3">Items</h3>
                <div className="border border-[#e0e0e0] rounded-lg overflow-hidden divide-y divide-[#e0e0e0]">
                  {selectedOrder.products?.map((item: any) => (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-[#fafafa] transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={`/assets/${item.image}`}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded border border-[#e0e0e0]"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/assets/product image 1.jpg"; }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#202223]">{item.title}</p>
                          <p className="text-xs text-[#6d7175]">Size: {item.size || "M"} | Color: {item.color || "Default"}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium text-[#202223]">Rs.{item.price?.toLocaleString()}</p>
                        <p className="text-xs text-[#6d7175]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <h3 className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-3">Financial Summary</h3>
                <div className="bg-white border border-[#e0e0e0] rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-[#202223]">
                    <span>Subtotal ({selectedOrder.products?.length || 0} items)</span>
                    <span>Rs.{selectedOrder.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#202223]">
                    <span>Shipping</span>
                    <span>Rs.{shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#202223]">
                    <span>Tax (GST {taxRate}%)</span>
                    <span>Rs.{Math.round(selectedOrder.subtotal * (taxRate / 100)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#202223] pt-2 border-t border-[#f0f0f0]">
                    <span>Total</span>
                    <span>Rs.{Math.round(selectedOrder.subtotal + shippingFee + selectedOrder.subtotal * (taxRate / 100)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminOrders;
