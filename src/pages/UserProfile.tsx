import { useEffect, useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import customFetch from "../axios/custom";
import { checkUserProfileFormData } from "../utils/checkUserProfileFormData";
import { setLoginStatus } from "../features/auth/authSlice";
import { store } from "../store";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineClipboardDocumentList,
  HiOutlineArrowRightOnRectangle,
  HiOutlinePencilSquare,
  HiOutlineChevronRight,
  HiOutlineMapPin,
} from "react-icons/hi2";

interface Order {
  id: number;
  order_id?: string;
  total?: string | number;
  status?: string;
  created_at?: string;
}

const tabs = [
  { id: "profile", label: "Profile", icon: HiOutlineUser },
  { id: "orders", label: "Orders", icon: HiOutlineClipboardDocumentList },
  { id: "wishlist", label: "Wishlist", icon: HiOutlineHeart },
  { id: "addresses", label: "Addresses", icon: HiOutlineMapPin },
];

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [activeTab, setActiveTab] = useState("profile");
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", lastname: "", email: "", password: "" });

  const logout = () => {
    toast.error("Logged out successfully");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("meta_connected");
    store.dispatch(setLoginStatus(false));
    navigate("/login");
  };

  const handleAuthError = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    store.dispatch(setLoginStatus(false));
    toast.error("Session expired. Please login again.");
    navigate("/login");
  };

  const fetchUser = async (userId: number | string) => {
    try {
      const response = await customFetch(`/users/${userId}`);
      const u = response.data;
      setUser(u);
      setForm({ name: u.name || "", lastname: u.lastname || "", email: u.email || "", password: "" });
    } catch (err: any) {
      if (err?.response?.status === 401) {
        handleAuthError();
      } else {
        toast.error("Failed to load profile");
      }
    }
  };

  const fetchRecentOrders = async (userId: number | string) => {
    try {
      const res = await customFetch.get(`/orders`, { params: { user_id: userId, limit: 3 } });
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setRecentOrders(data.slice(0, 3));
    } catch {
      setRecentOrders([]);
    }
  };

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkUserProfileFormData(form)) return;

    const payload: Record<string, string> = { name: form.name, lastname: form.lastname, email: form.email };
    if (form.password.trim()) payload.password = form.password;

    const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
    if (!userId) {
      toast.error("Please login to view this page");
      navigate("/login");
      return;
    }

    setSaving(true);
    try {
      await customFetch.put(`/users/${userId}`, payload);
      toast.success("Profile updated successfully");
      setEditing(false);
      setForm((prev) => ({ ...prev, password: "" }));
      fetchUser(userId);
    } catch {
      toast.error("Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
    if (!userId) {
      toast.error("Please login to view this page");
      navigate("/login");
    } else {
      fetchUser(userId);
      fetchRecentOrders(userId);
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="max-w-screen-xl mx-auto mt-24 px-5 flex items-center justify-center min-h-[400px]">
        <div className="text-body-md tracking-tracked-wide uppercase text-shade-50 animate-pulse">
          Loading Account...
        </div>
      </div>
    );
  }

  const initials = `${(user.name || "")[0] || ""}${(user.lastname || "")[0] || ""}`.toUpperCase() || "U";

  const handleEditClick = () => {
    setForm({ name: user.name || "", lastname: user.lastname || "", email: user.email || "", password: "" });
    setEditing(true);
  };

  return (
    <div className="max-w-screen-xl mx-auto mt-24 px-5 pb-16">
      <h1 className="text-heading-section text-ink mb-10 text-center">My Account</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-canvas border border-hairline rounded-lg p-6 mb-6 text-center">
            <div className="w-16 h-16 rounded-full bg-ink text-on-primary flex items-center justify-center text-xl font-bold mx-auto mb-3">
              {initials}
            </div>
            <p className="text-body-md text-ink font-medium">{user.name} {user.lastname}</p>
            <p className="text-caption text-shade-50 mt-0.5">{user.email}</p>
          </div>

          <nav className="hidden lg:block space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-body-md transition-colors ${
                    activeTab === tab.id
                      ? "bg-ink text-on-primary"
                      : "text-ink hover:bg-canvas-cream"
                  }`}
                >
                  <Icon className="text-lg" />
                  {tab.label}
                </button>
              );
            })}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-body-md text-shade-50 hover:text-ink hover:bg-canvas-cream transition-colors"
            >
              <HiOutlineArrowRightOnRectangle className="text-lg" />
              Logout
            </button>
          </nav>

          {/* Mobile tabs */}
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-pill whitespace-nowrap text-caption uppercase tracking-tracked font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-ink text-on-primary"
                      : "bg-canvas border border-hairline text-ink"
                  }`}
                >
                  <Icon className="text-base" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-heading-card text-ink">Profile Details</h2>
                {!editing && (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-2 text-caption uppercase tracking-tracked text-shade-50 hover:text-ink transition-colors"
                  >
                    <HiOutlinePencilSquare className="text-lg" />
                    Edit
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={updateUser} className="bg-canvas border border-hairline rounded-lg p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-caption uppercase tracking-tracked text-shade-50">First Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="bg-canvas border border-hairline text-body-md py-3 px-4 w-full outline-none focus:border-ink transition-colors"
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-caption uppercase tracking-tracked text-shade-50">Last Name</label>
                      <input
                        type="text"
                        value={form.lastname}
                        onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                        className="bg-canvas border border-hairline text-body-md py-3 px-4 w-full outline-none focus:border-ink transition-colors"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-caption uppercase tracking-tracked text-shade-50">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-canvas border border-hairline text-body-md py-3 px-4 w-full outline-none focus:border-ink transition-colors"
                      placeholder="Email address"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-caption uppercase tracking-tracked text-shade-50">New Password (optional)</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="bg-canvas border border-hairline text-body-md py-3 px-4 w-full outline-none focus:border-ink transition-colors"
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" text={saving ? "Saving..." : "Save Changes"} mode="black" disabled={saving} />
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="text-center text-button-label uppercase tracking-tracked font-medium border border-ink py-3 px-8 rounded-pill hover:bg-ink hover:text-on-primary transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-canvas border border-hairline rounded-lg divide-y divide-hairline">
                  <div className="flex items-center justify-between px-6 py-4">
                    <span className="text-caption uppercase tracking-tracked text-shade-50">First Name</span>
                    <span className="text-body-md text-ink">{user.name || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between px-6 py-4">
                    <span className="text-caption uppercase tracking-tracked text-shade-50">Last Name</span>
                    <span className="text-body-md text-ink">{user.lastname || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between px-6 py-4">
                    <span className="text-caption uppercase tracking-tracked text-shade-50">Email</span>
                    <span className="text-body-md text-ink">{user.email || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between px-6 py-4">
                    <span className="text-caption uppercase tracking-tracked text-shade-50">Password</span>
                    <span className="text-body-md text-shade-50">••••••••</span>
                  </div>
                </div>
              )}

              {/* Recent Orders Summary */}
              <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-heading-card text-ink">Recent Orders</h2>
                  <Link
                    to="/order-history"
                    className="flex items-center gap-1 text-caption uppercase tracking-tracked text-shade-50 hover:text-ink transition-colors"
                  >
                    View All <HiOutlineChevronRight />
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="bg-canvas border border-hairline rounded-lg px-6 py-10 text-center">
                    <HiOutlineShoppingBag className="text-3xl text-shade-40 mx-auto mb-3" />
                    <p className="text-body-md text-shade-50">No orders yet</p>
                    <Link
                      to="/shop"
                      className="inline-block mt-4 text-caption uppercase tracking-tracked text-ink underline hover:no-underline"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="bg-canvas border border-hairline rounded-lg divide-y divide-hairline">
                    {recentOrders.map((order) => (
                      <Link
                        key={order.id}
                        to={`/order-history/${order.id}`}
                        className="flex items-center justify-between px-6 py-4 hover:bg-canvas-cream transition-colors"
                      >
                        <div>
                          <p className="text-body-md text-ink font-medium">
                            Order #{order.order_id || order.id}
                          </p>
                          <p className="text-caption text-shade-50 mt-0.5">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-price-current text-ink">
                            {order.total ? `Rs. ${Number(order.total).toLocaleString()}` : ""}
                          </span>
                          {order.status && (
                            <span className="text-caption uppercase tracking-tracked text-primary font-medium">
                              {order.status}
                            </span>
                          )}
                          <HiOutlineChevronRight className="text-shade-40" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Links */}
              <div className="mt-10">
                <h2 className="text-heading-card text-ink mb-4">Quick Links</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    to="/order-history"
                    className="flex items-center gap-4 bg-canvas border border-hairline rounded-lg px-6 py-5 hover:bg-canvas-cream transition-colors"
                  >
                    <HiOutlineClipboardDocumentList className="text-2xl text-shade-40" />
                    <div>
                      <p className="text-body-md text-ink font-medium">Order History</p>
                      <p className="text-caption text-shade-50">View all your orders</p>
                    </div>
                    <HiOutlineChevronRight className="ml-auto text-shade-40" />
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-4 bg-canvas border border-hairline rounded-lg px-6 py-5 hover:bg-canvas-cream transition-colors"
                  >
                    <HiOutlineHeart className="text-2xl text-shade-40" />
                    <div>
                      <p className="text-body-md text-ink font-medium">Wishlist</p>
                      <p className="text-caption text-shade-50">Your saved items</p>
                    </div>
                    <HiOutlineChevronRight className="ml-auto text-shade-40" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-heading-card text-ink mb-6">Order History</h2>
              <Link
                to="/order-history"
                className="flex items-center justify-between bg-canvas border border-hairline rounded-lg px-6 py-5 hover:bg-canvas-cream transition-colors"
              >
                <div className="flex items-center gap-4">
                  <HiOutlineClipboardDocumentList className="text-2xl text-shade-40" />
                  <div>
                    <p className="text-body-md text-ink font-medium">View Full Order History</p>
                    <p className="text-caption text-shade-50">See all your past orders</p>
                  </div>
                </div>
                <HiOutlineChevronRight className="text-shade-40" />
              </Link>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div>
              <h2 className="text-heading-card text-ink mb-6">Wishlist</h2>
              <Link
                to="/wishlist"
                className="flex items-center justify-between bg-canvas border border-hairline rounded-lg px-6 py-5 hover:bg-canvas-cream transition-colors"
              >
                <div className="flex items-center gap-4">
                  <HiOutlineHeart className="text-2xl text-shade-40" />
                  <div>
                    <p className="text-body-md text-ink font-medium">View Wishlist</p>
                    <p className="text-caption text-shade-50">Items you've saved</p>
                  </div>
                </div>
                <HiOutlineChevronRight className="text-shade-40" />
              </Link>
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <h2 className="text-heading-card text-ink mb-6">Saved Addresses</h2>
              <div className="bg-canvas border border-hairline rounded-lg px-6 py-12 text-center">
                <HiOutlineMapPin className="text-3xl text-shade-40 mx-auto mb-3" />
                <p className="text-body-md text-shade-50">No saved addresses yet</p>
                <p className="text-caption text-shade-40 mt-1">
                  Add an address during checkout and it will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
