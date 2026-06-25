import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiXMark } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { setLoginStatus } from "../features/auth/authSlice";
import { store } from "../store";
import customFetch from "../axios/custom";

const defaultNavItems = [
  { label: "New Arrivals", path: "/shop/new-arrivals" },
  { label: "Unstitched", path: "/shop/unstitched" },
  { label: "Ready To Wear", path: "/shop/ready-to-wear" },
  { label: "Bridals", path: "/shop/bridals" },
  { label: "Jewellery", path: "/shop/jewellery" },
  { label: "Special Prices", path: "/shop/special-prices" },
];

const SidebarMenu = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (prev: boolean) => void;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [navItems, setNavItems] = useState(defaultNavItems);
  const { loginStatus } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const logout = () => {
    toast.error("Logged out successfully");
    localStorage.removeItem("user");
    store.dispatch(setLoginStatus(false));
    navigate("/login");
  };

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const res = await customFetch.get("/nav-items");
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setNavItems(data.map((item: any) => ({
            label: item.label,
            path: `/shop/${item.slug}`,
          })));
        }
      } catch (e) {
        console.warn("Failed to fetch nav items for sidebar", e);
      }
    };
    fetchNavItems();
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
            className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsSidebarOpen(false)}
          />
          <div
            className={
              isSidebarOpen
                ? "fixed top-0 left-0 w-72 z-50 h-full transition-transform duration-300 ease-in-out bg-white shadow-2xl transform translate-x-0"
                : "fixed top-0 left-0 w-72 z-50 h-full transition-transform duration-300 ease-in-out bg-white shadow-2xl transform -translate-x-full"
            }
          >
          <div className="flex justify-end mr-2 mt-2">
            <HiXMark
              className="text-2xl cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>
          <div className="flex justify-center mt-4 mb-8">
            <Link
              to="/"
              className="text-xl font-light tracking-[0.2em] uppercase font-serif"
            >
              ZARKA COUTURE
            </Link>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Link
              to="/"
              className="py-3 border-y border-[#E2E2E2] w-full block flex justify-center text-sm tracking-wider uppercase"
              onClick={() => setIsSidebarOpen(false)}
            >
              Home
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="py-3 border-b border-[#E2E2E2] w-full block flex justify-center text-sm tracking-wider uppercase font-medium text-[#151515] hover:bg-gray-50 transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/search"
              className="py-3 border-b border-[#E2E2E2] w-full block flex justify-center text-sm tracking-wider uppercase"
              onClick={() => setIsSidebarOpen(false)}
            >
              Search
            </Link>
            {loginStatus ? (
              <button
                onClick={logout}
                className="py-3 border-b border-[#E2E2E2] w-full block flex justify-center text-sm tracking-wider uppercase"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-3 border-b border-[#E2E2E2] w-full block flex justify-center text-sm tracking-wider uppercase"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="py-3 border-b border-[#E2E2E2] w-full block flex justify-center text-sm tracking-wider uppercase"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
            <Link
              to="/cart"
              className="py-3 border-b border-[#E2E2E2] w-full block flex justify-center text-sm tracking-wider uppercase"
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
