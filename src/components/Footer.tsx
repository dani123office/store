import SocialMediaFooter from "./SocialMediaFooter";
import { Link } from "react-router-dom";
import { ThemeSettings } from "../pages/HomeLayout";

interface FooterProps {
  themeSettings?: ThemeSettings;
}

const Footer = ({ themeSettings }: FooterProps) => {
  const logoText = themeSettings?.logo_text || "ZARKA COUTURE";
  const contactPhone = themeSettings?.footer?.phone || "+923-111-111-975";
  const contactEmail = themeSettings?.footer?.email || "info@zarkacouture.com";
  return (
    <footer className="bg-canvas text-ink border-t border-hairline">
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="block mb-4">
               <img src="/assets/zlogo.png" alt="ZARKA COUTURE" className="max-h-24 w-auto object-contain" />
            </Link>
            <p className="text-caption text-shade-50 leading-relaxed mb-4">
              Unstitched fabric, ready-to-wear, and accessories — crafted for the modern woman.
            </p>
            <div className="text-[11px] text-shade-40 space-y-1">
              <p>T: {contactPhone}</p>
              <p>E: {contactEmail}</p>
            </div>
          </div>

          {/* Client Service */}
          <div>
            <h3 className="text-nav-label uppercase tracking-tracked font-medium text-ink mb-5">Client Service</h3>
            <ul className="space-y-3 text-caption text-shade-50">
              <li><Link to="/shipping-returns" className="hover:text-ink transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/faqs" className="hover:text-ink transition-colors">FAQs</Link></li>
              <li><Link to="/size-guide" className="hover:text-ink transition-colors">Size Guide</Link></li>
              <li><Link to="/contact" className="hover:text-ink transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Our Brand */}
          <div>
            <h3 className="text-nav-label uppercase tracking-tracked font-medium text-ink mb-5">Our Brand</h3>
            <ul className="space-y-3 text-caption text-shade-50">
              <li><Link to="/about" className="hover:text-ink transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-nav-label uppercase tracking-tracked font-medium text-ink mb-5">Quick Links</h3>
            <ul className="space-y-3 text-caption text-shade-50">
              <li><Link to="/shop" className="hover:text-ink transition-colors">Shop</Link></li>
              <li><Link to="/shop/new-arrivals" className="hover:text-ink transition-colors">New Arrivals</Link></li>
              <li><Link to="/cart" className="hover:text-ink transition-colors">Cart</Link></li>
              <li><Link to="/login" className="hover:text-ink transition-colors">My Account</Link></li>
              <li><Link to="/admin" className="hover:text-ink transition-colors">Admin Panel</Link></li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-hairline mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-caption text-shade-40 uppercase tracking-tracked">
            <span>We Accept</span>
            <div className="flex items-center gap-2">
              <span className="bg-shade-20 px-3 py-1.5 rounded-pill text-ink font-bold text-[10px]">VISA</span>
              <span className="bg-shade-20 px-3 py-1.5 rounded-pill text-ink font-bold text-[10px]">MC</span>
              <span className="bg-shade-20 px-3 py-1.5 rounded-pill text-ink font-bold text-[10px]">JCB</span>
              <span className="bg-shade-20 px-3 py-1.5 rounded-pill text-ink font-bold text-[10px]">COD</span>
              <span className="bg-shade-20 px-3 py-1.5 rounded-pill text-ink font-bold text-[10px]">EASYPAISA</span>
            </div>
          </div>

          <p className="text-caption text-shade-40 tracking-tracked">
            All rights reserved &copy; {new Date().getFullYear()} {logoText || "ZARKA COUTURE"}.
          </p>
        </div>
      </div>
      <SocialMediaFooter themeSettings={themeSettings} />
    </footer>
  );
};

export default Footer;