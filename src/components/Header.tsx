import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineMagnifyingGlass, HiOutlineShoppingBag, HiOutlineHeart, HiBars3 } from "react-icons/hi2";
import { useAppSelector } from "../hooks";
import SidebarMenu from "./SidebarMenu";
import SearchModal from "./SearchModal";
import { motion } from "framer-motion";
import customFetch from "../axios/custom";

const defaultNavItems = [
  { label: "New Arrivals", path: "/shop/new-arrivals" },
  { label: "Unstitched", path: "/shop/unstitched" },
  { label: "Ready To Wear", path: "/shop/ready-to-wear" },
  { label: "Bridals", path: "/shop/bridals" },
  { label: "Jewellery", path: "/shop/jewellery" },
  { label: "SALE", path: "/shop/special-prices", sale: true },
];

interface HeaderProps {
  logoText?: string;
}

const Header = ({ logoText }: HeaderProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navItems, setNavItems] = useState(defaultNavItems);
  const { wishlistItems } = useAppSelector((state) => state.wishlist);
  const { productsInCart } = useAppSelector((state) => state.cart);
  
  const cartItemsCount = productsInCart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const res = await customFetch.get("/nav-items");
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setNavItems(data.map((item: any) => ({
            label: item.label,
            path: `/shop/${item.slug}`,
            sale: item.label.toLowerCase().includes("sale") || item.label.toLowerCase().includes("special"),
          })));
        }
      } catch (e) {
        console.warn("Failed to fetch nav items, using defaults", e);
      }
    };
    fetchNavItems();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-canvas border-b border-hairline/60 transition-all duration-300">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu trigger */}
            <button
              className="lg:hidden text-xl text-ink"
              onClick={() => setIsSidebarOpen(true)}
            >
              <HiBars3 />
            </button>

            {/* Logo */}
            <Link to="/">
              <img src="/assets/zlogo.png" alt={logoText || "ZARKA COUTURE"} className="max-h-16 sm:max-h-[70px] w-auto object-contain" />
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`text-nav-label uppercase tracking-tracked font-medium hover:opacity-60 transition-opacity ${
                    item.sale ? "!text-primary" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-ink hover:opacity-60 transition-opacity p-1 focus:outline-none"
                aria-label="Search products"
              >
                <HiOutlineMagnifyingGlass className="text-lg" />
              </button>
              <Link to="/login" className="text-ink hover:opacity-60 transition-opacity p-1">
                <HiOutlineUser className="text-lg" />
              </Link>
              <Link to="/wishlist" className="text-ink hover:opacity-60 transition-opacity p-1 relative">
                <HiOutlineHeart className="text-lg" />
                {wishlistItems.length > 0 && (
                  <motion.span
                    key={wishlistItems.length}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: [0.6, 1.3, 0.9] }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute -top-1 -right-1 bg-ink text-on-primary text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {wishlistItems.length}
                  </motion.span>
                )}
              </Link>
              <Link id="header-cart-icon" to="/cart" className="text-ink hover:opacity-60 transition-opacity p-1 relative">
                <HiOutlineShoppingBag className="text-lg" />
                {cartItemsCount > 0 && (
                  <motion.span
                    key={cartItemsCount}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: [0.6, 1.3, 0.9] }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute -top-1 -right-1 bg-ink text-on-primary text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>
      <SidebarMenu isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;