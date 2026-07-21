import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineMagnifyingGlass, HiOutlineShoppingBag, HiOutlineHeart, HiBars3 } from "react-icons/hi2";
import { useAppSelector } from "../hooks";
import SidebarMenu from "./SidebarMenu";
import SearchModal from "./SearchModal";
import { motion } from "framer-motion";
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

interface HeaderProps {
  logoText?: string;
}

const Header = ({ logoText }: HeaderProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItemType[]>(defaultNavItems);
  const { wishlistItems } = useAppSelector((state) => state.wishlist);
  const { productsInCart } = useAppSelector((state) => state.cart);
  
  const cartItemsCount = productsInCart.reduce((acc, item) => acc + item.quantity, 0);

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
        console.warn("Failed to fetch categories for nav, using defaults", e);
      }
    };
    fetchCategories();
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
                <div key={item.label} className="relative group py-2">
                  <Link
                    to={item.path}
                    className={`text-nav-label uppercase tracking-tracked font-medium hover:opacity-60 transition-opacity flex items-center gap-1 ${
                      item.sale ? "!text-primary" : "text-ink"
                    }`}
                  >
                    {item.label}
                    {item.subcategories && item.subcategories.length > 0 && (
                      <svg className="w-3 h-3 opacity-70 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                  {item.subcategories && item.subcategories.length > 0 && (
                    <div className="absolute left-0 mt-1 w-56 bg-white border border-[#e4e4e7]/60 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.02)] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2.5">
                      {item.subcategories.map((sub: any) => (
                        <Link
                          key={sub.subcat_id}
                          to={`/shop/${sub.handle || sub.subcat_title?.toLowerCase().replace(/\s+/g, "-")}`}
                          className="block px-5 py-2 text-[11px] font-semibold text-[#52525b] hover:bg-[#fbfbf5] hover:text-[#000000] transition-colors uppercase tracking-wider"
                        >
                          {sub.subcat_title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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