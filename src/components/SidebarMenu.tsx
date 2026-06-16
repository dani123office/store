import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiXMark } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { setLoginStatus } from "../features/auth/authSlice";
import { store } from "../store";

const SidebarMenu = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (prev: boolean) => void;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { loginStatus } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const logout = () => {
    toast.error("Logged out successfully");
    localStorage.removeItem("user");
    store.dispatch(setLoginStatus(false));
    navigate("/login");
  };

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
        <div
          className={
            isSidebarOpen
              ? "fixed top-0 left-0 w-72 z-50 h-full transition-transform duration-300 ease-in-out bg-white shadow-lg transform translate-x-0"
              : "fixed top-0 left-0 w-72 z-50 h-full transition-transform duration-300 ease-in-out bg-white shadow-lg transform -translate-x-full"
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
              className="text-xl font-light tracking-[0.15em] uppercase"
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
            <Link
              to="/shop"
              className="py-3 border-b border-[#E2E2E2] w-full block flex justify-center text-sm tracking-wider uppercase"
              onClick={() => setIsSidebarOpen(false)}
            >
              Shop
            </Link>
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
      )}
    </>
  );
};

export default SidebarMenu;
