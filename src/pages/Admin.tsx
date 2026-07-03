import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiOutlineHome, HiOutlineShoppingBag, HiOutlineCube, HiOutlineUsers,
  HiOutlineTag, HiOutlineSquares2X2, HiOutlineGlobeAlt,
  HiOutlineChevronDown, HiOutlineBars3CenterLeft,
  HiOutlineCircleStack, HiOutlineClipboardDocument,
  HiOutlineMegaphone, HiXMark, HiBars3, HiArrowRightOnRectangle,
  HiOutlineMagnifyingGlass, HiOutlineBell, HiOutlinePhoto, HiOutlineAdjustmentsHorizontal
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
  { label: "Facebook Ads", icon: HiOutlineGlobeAlt, path: "/admin/facebook-ads" },
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
    <div className="min-h-screen bg-[#fbfbf5] flex admin-theme text-[#000000] antialiased">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-[#000000]/10 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#e4e4e7]
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
        flex flex-col
      `}>
        <div className="flex items-center justify-between px-5 h-14 border-b border-[#e4e4e7]">
          <Link to="/admin" className="text-xs font-bold tracking-[0.2em] uppercase text-[#000000]">
            ZARKA COUTURE
          </Link>
          <button className="lg:hidden text-[#52525b]" onClick={() => setSidebarOpen(false)}>
            <HiXMark className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto space-y-1 px-3">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            if (item.children) {
              const anyChildActive = item.children.some(child => isActive(child.path));
              return (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => setProductsOpen(!productsOpen)}
                    className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-medium rounded-full transition-all ${
                      anyChildActive
                        ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                        : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
                    }`}
                  >
                    <Icon className="text-base flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <HiOutlineChevronDown className={`text-xs transition-transform ${productsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {productsOpen && (
                    <div className="ml-2 mt-1 space-y-1 border-l border-[#e4e4e7] pl-3">
                      {item.children.map((child) => {
                        const C = child.icon;
                        const active = isActive(child.path);
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-1.5 text-xs rounded-full transition-all ${
                              active
                                ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                                : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
                            }`}
                          >
                            <C className="text-sm flex-shrink-0" />
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
                className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-medium rounded-full transition-all ${
                  active
                    ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                    : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
                }`}
              >
                <Icon className="text-base flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#e4e4e7] px-4 py-3">
          <div className="flex items-center gap-3 text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.1em] mb-2 px-2">
            Sales Channel
          </div>
          <div>
            <button
              onClick={() => setOnlineStoreOpen(!onlineStoreOpen)}
              className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-medium rounded-full transition-all ${
                location.pathname.startsWith("/admin/pages") ||
                location.pathname.startsWith("/admin/menus") ||
                location.pathname.startsWith("/admin/theme-editor") ||
                location.pathname.startsWith("/admin/nav") ||
                location.pathname.startsWith("/admin/media") ||
                location.pathname.startsWith("/admin/seo")
                  ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                  : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
              }`}
            >
              <HiOutlineGlobeAlt className="text-base flex-shrink-0" />
              <span className="flex-1 text-left">Online Store</span>
              <HiOutlineChevronDown className={`text-xs transition-transform ${onlineStoreOpen ? "rotate-180" : ""}`} />
            </button>
            {onlineStoreOpen && (
              <div className="ml-2 mt-1 space-y-1 border-l border-[#e4e4e7] pl-3">
                <Link
                  to="/admin/pages"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-1.5 text-xs rounded-full transition-all ${
                    location.pathname.startsWith("/admin/pages")
                      ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                      : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
                  }`}
                >
                  <HiOutlineCircleStack className="text-sm flex-shrink-0" />
                  Pages
                </Link>
                <Link
                  to="/admin/menus"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-1.5 text-xs rounded-full transition-all ${
                    location.pathname.startsWith("/admin/menus")
                      ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                      : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
                  }`}
                >
                  <HiOutlineBars3CenterLeft className="text-sm flex-shrink-0" />
                  Menus
                </Link>
                <Link
                  to="/admin/theme-editor"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-1.5 text-xs rounded-full transition-all ${
                    location.pathname.startsWith("/admin/theme-editor")
                      ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                      : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
                  }`}
                >
                  <HiOutlineGlobeAlt className="text-sm flex-shrink-0" />
                  Theme Editor
                </Link>
                <Link
                  to="/admin/nav"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-1.5 text-xs rounded-full transition-all ${
                    location.pathname.startsWith("/admin/nav")
                      ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                      : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
                  }`}
                >
                  <HiOutlineBars3CenterLeft className="text-sm flex-shrink-0" />
                  Navigation
                </Link>
                <Link
                  to="/admin/media"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-1.5 text-xs rounded-full transition-all ${
                    location.pathname.startsWith("/admin/media")
                      ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                      : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
                  }`}
                >
                  <HiOutlinePhoto className="text-sm flex-shrink-0" />
                  Media
                </Link>
                <Link
                  to="/admin/preferences"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-1.5 text-xs rounded-full transition-all ${
                    location.pathname.startsWith("/admin/preferences")
                      ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                      : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
                  }`}
                >
                  <HiOutlineAdjustmentsHorizontal className="text-sm flex-shrink-0" />
                  Preferences
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-[#e4e4e7] px-4 py-3">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-medium rounded-full transition-all ${
              location.pathname.startsWith("/admin/settings") ||
              location.pathname.startsWith("/admin/staff") ||
              location.pathname.startsWith("/admin/tax") ||
              location.pathname.startsWith("/admin/notifications")
                ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
            }`}
          >
            <HiOutlineGlobeAlt className="text-base flex-shrink-0" />
            <span className="flex-1 text-left">Settings</span>
            <HiOutlineChevronDown className={`text-xs transition-transform ${settingsOpen ? "rotate-180" : ""}`} />
          </button>
          {settingsOpen && (
            <div className="ml-2 mt-1 space-y-1 border-l border-[#e4e4e7] pl-3">
              <Link
                to="/admin/settings"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-1.5 text-xs rounded-full transition-all ${
                  location.pathname.startsWith("/admin/settings")
                    ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                    : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
                }`}
              >
                <HiOutlineCircleStack className="text-sm flex-shrink-0" />
                Store Settings
              </Link>
              <Link
                to="/admin/staff"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-1.5 text-xs rounded-full transition-all ${
                  location.pathname.startsWith("/admin/staff")
                    ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                    : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
                }`}
              >
                <HiOutlineUsers className="text-sm flex-shrink-0" />
                Staff Accounts
              </Link>
              <Link
                to="/admin/tax"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-1.5 text-xs rounded-full transition-all ${
                  location.pathname.startsWith("/admin/tax")
                    ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                    : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
                }`}
              >
                <HiOutlineTag className="text-sm flex-shrink-0" />
                Tax Settings
              </Link>
              <Link
                to="/admin/notifications"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-1.5 text-xs rounded-full transition-all ${
                  location.pathname.startsWith("/admin/notifications")
                    ? "bg-[#c1fbd4] text-[#000000] font-semibold"
                    : "text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000]"
                }`}
              >
                <HiOutlineBell className="text-sm flex-shrink-0" />
                Notifications
              </Link>
            </div>
          )}
        </div>

        <div className="border-t border-[#e4e4e7] p-4 bg-white mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#000000] flex items-center justify-center text-white text-xs font-semibold">
              {(user?.name?.[0] || user?.email?.[0] || "A").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#000000] truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-[#52525b] truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-[#52525b] hover:text-[#d72c0d] transition-colors" title="Logout">
              <HiArrowRightOnRectangle className="text-base" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-[#e4e4e7] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          {isAddProductPage ? (
            <>
              <div className="flex items-center gap-3">
                <button className="lg:hidden text-[#52525b]" onClick={() => setSidebarOpen(true)}>
                  <HiBars3 className="text-xl" />
                </button>
              </div>
              <span className="text-xs text-[#52525b] font-semibold">{isEditPage ? "Edit product" : "Unsaved product"}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => navigate("/admin/products")} className="px-5 py-2 text-[10px] uppercase font-bold text-[#000000] border border-[#000000] rounded-full hover:bg-[#fbfbf5] transition-all">
                  Discard
                </button>
                <button type="submit" form="add-product-form" className="px-6 py-2 text-[10px] uppercase font-bold text-[#ffffff] bg-[#000000] rounded-full hover:bg-[#3f3f46] transition-all shadow-sm">
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <button className="lg:hidden text-[#52525b]" onClick={() => setSidebarOpen(true)}>
                  <HiBars3 className="text-xl" />
                </button>
                <div className="hidden sm:flex items-center gap-2 text-xs text-[#a1a1aa] font-medium tracking-wide">
                  <span>Home</span>
                  <span>/</span>
                  <span className="text-[#000000] font-semibold capitalize">
                    {location.pathname === "/admin" ? "Dashboard" : location.pathname.split("/").pop()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-[#52525b] hover:text-[#000000] transition-colors">
                  <HiOutlineMagnifyingGlass className="text-lg" />
                </button>
                <button className="text-[#52525b] hover:text-[#000000] transition-colors relative">
                  <HiOutlineBell className="text-lg" />
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#d72c0d] rounded-full" />
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
