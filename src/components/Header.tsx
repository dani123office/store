import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineMagnifyingGlass, HiOutlineShoppingBag, HiBars3 } from "react-icons/hi2";
import SidebarMenu from "./SidebarMenu";

const navItems = [
  { label: "New Arrivals", path: "/shop/new-arrivals" },
  {
    label: "Unstitched",
    path: "/shop/unstitched",
  },
  {
    label: "Ready To Wear",
    path: "/shop/ready-to-wear",
  },
  { label: "Bridals", path: "/shop/bridals" },
  { label: "Jewellery", path: "/shop/jewellery" },
  { label: "Special Prices", path: "/shop/special-prices" },
];

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <>
      <header className="bg-white border-b border-[#E2E2E2]">
        <div className="max-w-screen-2xl mx-auto px-5">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu trigger */}
            <button
              className="lg:hidden text-2xl"
              onClick={() => setIsSidebarOpen(true)}
            >
              <HiBars3 />
            </button>

            {/* Logo */}
            <Link to="/" className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-[#151515] whitespace-nowrap">
              ZARKA COUTURE
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="nav-link"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Link to="/search" className="text-[#151515] hover:opacity-60 transition-opacity">
                <HiOutlineMagnifyingGlass className="text-xl" />
              </Link>
              <Link to="/login" className="text-[#151515] hover:opacity-60 transition-opacity">
                <HiOutlineUser className="text-xl" />
              </Link>
              <Link to="/cart" className="text-[#151515] hover:opacity-60 transition-opacity relative">
                <HiOutlineShoppingBag className="text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <SidebarMenu isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </>
  );
};

export default Header;
