import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiOutlineHome, HiOutlineShoppingBag, HiOutlineCube, HiOutlineUsers,
  HiOutlineTag, HiOutlineSquares2X2, HiOutlineGlobeAlt,
  HiOutlineChevronDown, HiOutlineBars3CenterLeft,
  HiOutlineCircleStack, HiOutlineClipboardDocument,
  HiOutlineMegaphone, HiXMark, HiBars3, HiArrowRightOnRectangle,
  HiOutlineMagnifyingGlass, HiOutlineBell, HiOutlinePhoto,
} from "react-icons/hi2";

interface SidebarChild {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface SidebarItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: SidebarChild[];
}

const sidebarLinks: SidebarItem[] = [
  { label: "Home", icon: HiOutlineHome, path: "/admin" },
  { label: "Orders", icon: HiOutlineShoppingBag, path: "/admin/orders" },
  {
    label: "Products", icon: HiOutlineCube,
    children: [
      { label: "All products", icon: HiOutlineCircleStack, path: "/admin/products" },
      { label: "Inventory", icon: HiOutlineClipboardDocument, path: "/admin/inventory" },
      { label: "Collections", icon: HiOutlineBars3CenterLeft, path: "/admin/collections" },
      { label: "Categories", icon: HiOutlineSquares2X2, path: "/admin/categories" },
      { label: "Subcategories", icon: HiOutlineSquares2X2, path: "/admin/subcategories" },
    ],
  },
  { label: "Customers", icon: HiOutlineUsers, path: "/admin/customers" },
  { label: "Analytics", icon: HiOutlineSquares2X2, path: "/admin/analytics" },
  { label: "Marketing", icon: HiOutlineMegaphone, path: "/admin/marketing" },
  { label: "Discounts", icon: HiOutlineTag, path: "/admin/discounts" },
  { label: "Apps", icon: HiOutlineSquares2X2, path: "/admin/apps" },
];

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(
    location.pathname.startsWith("/admin/products") ||
    location.pathname.startsWith("/admin/inventory") ||
    location.pathname.startsWith("/admin/collections") ||
    location.pathname.startsWith("/admin/categories") ||
    location.pathname.startsWith("/admin/subcategories")
  );
  const [onlineStoreOpen, setOnlineStoreOpen] = useState(
    location.pathname.startsWith("/admin/pages") ||
    location.pathname.startsWith("/admin/menus") ||
    location.pathname.startsWith("/admin/theme-editor") ||
    location.pathname.startsWith("/admin/nav") ||
    location.pathname.startsWith("/admin/media") ||
    location.pathname.startsWith("/admin/seo")
  );
  const [settingsOpen, setSettingsOpen] = useState(
    location.pathname.startsWith("/admin/settings") ||
    location.pathname.startsWith("/admin/staff") ||
    location.pathname.startsWith("/admin/tax") ||
    location.pathname.startsWith("/admin/notifications")
  );

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsedUser = JSON.parse(stored);
      if (parsedUser.role === "admin") {
        setUser(parsedUser);
      } else {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const isAddProductPage = location.pathname === "/admin/products/add" || location.pathname.startsWith("/admin/products/edit/");
  const isEditPage = location.pathname.startsWith("/admin/products/edit/");

  return (
    <div className="min-h-screen bg-[#f6f6f7] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#e0e0e0]
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
        flex flex-col
      `}>
        <div className="flex items-center justify-between px-5 h-14 border-b border-[#e0e0e0]">
          <Link to="/admin" className="text-sm font-semibold tracking-[0.1em] uppercase text-[#202223]">
            ZARKA COUTURE
          </Link>
          <button className="lg:hidden text-[#6d7175]" onClick={() => setSidebarOpen(false)}>
            <HiXMark className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto space-y-0.5 px-2">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            if (item.children) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setProductsOpen(!productsOpen)}
                    className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive(item.children[0].path)
                        ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                        : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
                    }`}
                  >
                    <Icon className="text-lg flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <HiOutlineChevronDown className={`text-sm transition-transform ${productsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {productsOpen && (
                    <div className="ml-1 mt-0.5 space-y-0.5 border-l-2 border-[#e0e0e0] pl-2">
                      {item.children.map((child) => {
                        const C = child.icon;
                        const active = isActive(child.path);
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              active
                                ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                                : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
                            }`}
                          >
                            <C className="text-base flex-shrink-0" />
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            const active = isActive(item.path!);
            return (
              <Link
                key={item.path}
                to={item.path!}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                  active
                    ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                    : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
                }`}
              >
                <Icon className="text-lg flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#e0e0e0] px-4 py-3">
          <div className="flex items-center gap-3 text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-2">
            Sales Channel
          </div>
          <div>
            <button
              onClick={() => setOnlineStoreOpen(!onlineStoreOpen)}
              className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors ${
              location.pathname.startsWith("/admin/pages") ||
              location.pathname.startsWith("/admin/menus") ||
              location.pathname.startsWith("/admin/theme-editor") ||
              location.pathname.startsWith("/admin/nav") ||
              location.pathname.startsWith("/admin/media") ||
              location.pathname.startsWith("/admin/seo")
                ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
              }`}
            >
              <HiOutlineGlobeAlt className="text-lg flex-shrink-0" />
              <span className="flex-1 text-left">Online Store</span>
              <HiOutlineChevronDown className={`text-sm transition-transform ${onlineStoreOpen ? "rotate-180" : ""}`} />
            </button>
            {onlineStoreOpen && (
              <div className="ml-1 mt-0.5 space-y-0.5 border-l-2 border-[#e0e0e0] pl-2">
                <Link
                  to="/admin/pages"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    location.pathname.startsWith("/admin/pages")
                      ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                      : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
                  }`}
                >
                  <HiOutlineCircleStack className="text-base flex-shrink-0" />
                  Pages
                </Link>
                <Link
                  to="/admin/menus"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    location.pathname.startsWith("/admin/menus")
                      ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                      : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
                  }`}
                >
                  <HiOutlineBars3CenterLeft className="text-base flex-shrink-0" />
                  Menus
                </Link>
                <Link
                  to="/admin/theme-editor"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    location.pathname.startsWith("/admin/theme-editor")
                      ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                      : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
                  }`}
                >
                  <HiOutlineGlobeAlt className="text-base flex-shrink-0" />
                  Theme Editor
                </Link>
                <Link
                  to="/admin/nav"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    location.pathname.startsWith("/admin/nav")
                      ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                      : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
                  }`}
                >
                  <HiOutlineBars3CenterLeft className="text-base flex-shrink-0" />
                  Navigation
                </Link>
                <Link
                  to="/admin/media"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    location.pathname.startsWith("/admin/media")
                      ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                      : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
                  }`}
                >
                  <HiOutlinePhoto className="text-base flex-shrink-0" />
                  Media
                </Link>
                <Link
                  to="/admin/seo"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    location.pathname.startsWith("/admin/seo")
                      ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                      : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
                  }`}
                >
                  <HiOutlineMagnifyingGlass className="text-base flex-shrink-0" />
                  SEO Manager
                </Link>
              </div>
            )}
            <Link
              to="/admin/facebook-ads"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 w-full px-3 py-2 mt-1 text-sm rounded-lg transition-colors ${
                location.pathname.startsWith("/admin/facebook-ads")
                  ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                  : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
              }`}
            >
              <HiOutlineMegaphone className="text-lg flex-shrink-0" />
              <span className="flex-1 text-left">Facebook &amp; Instagram</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-[#e0e0e0] px-4 py-3">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors ${
              location.pathname.startsWith("/admin/settings") ||
              location.pathname.startsWith("/admin/staff") ||
              location.pathname.startsWith("/admin/tax") ||
              location.pathname.startsWith("/admin/notifications")
                ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
            }`}
          >
            <HiOutlineGlobeAlt className="text-lg flex-shrink-0" />
            <span className="flex-1 text-left">Settings</span>
            <HiOutlineChevronDown className={`text-sm transition-transform ${settingsOpen ? "rotate-180" : ""}`} />
          </button>
          {settingsOpen && (
            <div className="ml-1 mt-0.5 space-y-0.5 border-l-2 border-[#e0e0e0] pl-2">
              <Link
                to="/admin/settings"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  location.pathname.startsWith("/admin/settings")
                    ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                    : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
                }`}
              >
                <HiOutlineCircleStack className="text-base flex-shrink-0" />
                Store Settings
              </Link>
              <Link
                to="/admin/staff"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  location.pathname.startsWith("/admin/staff")
                    ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                    : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
                }`}
              >
                <HiOutlineUsers className="text-base flex-shrink-0" />
                Staff Accounts
              </Link>
              <Link
                to="/admin/tax"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  location.pathname.startsWith("/admin/tax")
                    ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                    : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
                }`}
              >
                <HiOutlineTag className="text-base flex-shrink-0" />
                Tax Settings
              </Link>
              <Link
                to="/admin/notifications"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  location.pathname.startsWith("/admin/notifications")
                    ? "bg-[#f1f8fe] text-[#2c6ecb] font-medium"
                    : "text-[#6d7175] hover:bg-[#f1f1f1] hover:text-[#202223]"
                }`}
              >
                <HiOutlineBell className="text-base flex-shrink-0" />
                Notifications
              </Link>
            </div>
          )}
        </div>

        <div className="border-t border-[#e0e0e0] p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5c5f62] flex items-center justify-center text-white text-xs font-medium">
              {(user?.name?.[0] || user?.email?.[0] || "A").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#202223] truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-[#6d7175] truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-[#6d7175] hover:text-[#d72c0d] transition-colors" title="Logout">
              <HiArrowRightOnRectangle className="text-lg" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-[#e0e0e0] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          {isAddProductPage ? (
            <>
              <div className="flex items-center gap-3">
                <button className="lg:hidden text-[#6d7175]" onClick={() => setSidebarOpen(true)}>
                  <HiBars3 className="text-2xl" />
                </button>
              </div>
              <span className="text-sm text-[#6d7175] font-medium">{isEditPage ? "Edit product" : "Unsaved product"}</span>
              <div className="flex items-center gap-3">
                <button onClick={() => navigate("/admin/products")} className="px-4 py-1.5 text-sm font-medium text-[#6d7175] border border-[#e0e0e0] rounded-lg hover:bg-[#f1f1f1] transition-colors">
                  Discard
                </button>
                <button type="submit" form="add-product-form" className="px-4 py-1.5 text-sm font-medium text-white bg-[#2c6ecb] rounded-lg hover:bg-[#1e5ab0] transition-colors">
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <button className="lg:hidden text-[#6d7175]" onClick={() => setSidebarOpen(true)}>
                  <HiBars3 className="text-2xl" />
                </button>
                <div className="hidden sm:flex items-center gap-2 text-sm text-[#6d7175]">
                  <span>Home</span>
                  <span>/</span>
                  <span className="text-[#202223] font-medium capitalize">
                    {location.pathname === "/admin" ? "Dashboard" : location.pathname.split("/").pop()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-[#6d7175] hover:text-[#202223] transition-colors">
                  <HiOutlineMagnifyingGlass className="text-xl" />
                </button>
                <button className="text-[#6d7175] hover:text-[#202223] transition-colors relative">
                  <HiOutlineBell className="text-xl" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#d72c0d] rounded-full" />
                </button>
              </div>
            </>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;
