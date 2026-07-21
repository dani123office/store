import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiXMark } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { setLoginStatus } from "../features/auth/authSlice";
import { store } from "../store";
import customFetch from "../axios/custom";

interface NavItemType {
  label: string;
  path: string;
  subcategories?: any[];
  sale?: boolean;
}

const defaultNavItems: NavItemType[] = [
  {
    label: "New Arrivals",
    path: "/shop/new-arrivals",
    subcategories: [
      { subcat_id: "na1", subcat_title: "Summer Collection", handle: "summer-collection" },
      { subcat_id: "na2", subcat_title: "Winter Collection", handle: "winter-collection" },
      { subcat_id: "na3", subcat_title: "Trendy Styles", handle: "trendy-styles" },
    ],
  },
  {
    label: "Collections",
    path: "/shop/collections",
    subcategories: [
      { subcat_id: "c1", subcat_title: "Bridal Collection", handle: "bridal-collection" },
      { subcat_id: "c2", subcat_title: "Luxury Collection", handle: "luxury-collection" },
      { subcat_id: "c3", subcat_title: "Pret Collection", handle: "pret-collection" },
      { subcat_id: "c4", subcat_title: "Signature Collection", handle: "signature-collection" },
    ],
  },
  {
    label: "Unstitched",
    path: "/shop/unstitched",
    subcategories: [
      { subcat_id: "u1", subcat_title: "Lawn", handle: "lawn" },
      { subcat_id: "u2", subcat_title: "Cotton", handle: "cotton" },
      { subcat_id: "u3", subcat_title: "Silk", handle: "silk" },
      { subcat_id: "u4", subcat_title: "Chiffon", handle: "chiffon" },
    ],
  },
  {
    label: "Stitched",
    path: "/shop/stitched",
    subcategories: [
      { subcat_id: "s1", subcat_title: "Ready to Wear", handle: "ready-to-wear" },
      { subcat_id: "s2", subcat_title: "Formal Wear", handle: "formal-wear" },
      { subcat_id: "s3", subcat_title: "Casual Wear", handle: "casual-wear" },
      { subcat_id: "s4", subcat_title: "Party Wear", handle: "party-wear" },
    ],
  },
];

const SidebarMenu = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (prev: boolean) => void;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [navItems, setNavItems] = useState<NavItemType[]>(defaultNavItems);
  const { loginStatus } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const logout = () => {
    toast.error("Logged out successfully");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("meta_connected");
    store.dispatch(setLoginStatus(false));
    navigate("/login");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await customFetch.get("/categories");
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setNavItems(data.map((item: any) => ({
            label: item.cat_title || item.title,
            path: `/shop/${item.handle || item.cat_title?.toLowerCase().replace(/\s+/g, "-")}`,
            subcategories: item.subcategories || [],
          })));
        }
      } catch (e) {
        console.warn("Failed to fetch categories for sidebar", e);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isSidebarOpen]);

  return (
    <>
      {(isSidebarOpen || isAnimating) && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-xs transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsSidebarOpen(false)}
          />
          <div
            className={
              isSidebarOpen
                ? "fixed top-0 left-0 w-72 z-50 h-full transition-transform duration-300 ease-in-out bg-canvas shadow-2xl transform translate-x-0"
                : "fixed top-0 left-0 w-72 z-50 h-full transition-transform duration-300 ease-in-out bg-canvas shadow-2xl transform -translate-x-full"
            }
          >
          <div className="flex justify-end mr-2 mt-2">
            <HiXMark
              className="text-2xl cursor-pointer text-ink"
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>
          <div className="flex justify-center mt-4 mb-8">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tighter text-primary"
              style={{ letterSpacing: "-1px" }}
            >
              ZARKA COUTURE
            </Link>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Link
              to="/"
              className="py-3 border-y border-hairline w-full block flex justify-center text-body-md uppercase tracking-tracked text-ink"
              onClick={() => setIsSidebarOpen(false)}
            >
              Home
            </Link>
            {navItems.map((item) => (
              <div key={item.label} className="w-full border-b border-hairline flex flex-col items-center">
                <Link
                  to={item.path}
                  className="py-3 w-full block flex justify-center text-body-md uppercase tracking-tracked font-medium text-ink hover:bg-canvas-cream transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.label}
                </Link>
                {item.subcategories && item.subcategories.length > 0 && (
                  <div className="flex flex-col items-center bg-[#fcfcf9] w-full py-1.5 border-t border-hairline/40">
                    {item.subcategories.map((sub: any) => (
                      <Link
                        key={sub.subcat_id}
                        to={`/shop/${sub.handle || sub.subcat_title?.toLowerCase().replace(/\s+/g, "-")}`}
                        className="py-2 text-[11px] font-semibold text-[#52525b] hover:text-[#000000] uppercase tracking-wider block"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        {sub.subcat_title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              to="/search"
              className="py-3 border-b border-hairline w-full block flex justify-center text-body-md uppercase tracking-tracked text-ink"
              onClick={() => setIsSidebarOpen(false)}
            >
              Search
            </Link>
            {loginStatus ? (
              <button
                onClick={logout}
                className="py-3 border-b border-hairline w-full block flex justify-center text-body-md uppercase tracking-tracked text-ink"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-3 border-b border-hairline w-full block flex justify-center text-body-md uppercase tracking-tracked text-ink"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="py-3 border-b border-hairline w-full block flex justify-center text-body-md uppercase tracking-tracked text-ink"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
            <Link
              to="/cart"
              className="py-3 border-b border-hairline w-full block flex justify-center text-body-md uppercase tracking-tracked text-ink"
              onClick={() => setIsSidebarOpen(false)}
            >
              Cart
            </Link>
          </div>
        </div>
        </>
      )}
    </>
  );
};

export default SidebarMenu;