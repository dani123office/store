import SocialMediaFooter from "./SocialMediaFooter";
import { Link } from "react-router-dom";

interface FooterProps {
  logoText?: string;
}

const Footer = ({ logoText }: FooterProps) => {
  return (
    <footer className="bg-[#151515] text-white">
      <div className="max-w-screen-2xl mx-auto px-5 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-light tracking-[0.25em] uppercase text-white font-serif block mb-4">
              {logoText || "ZARKA COUTURE"}
            </Link>
            <p className="text-xs text-white/50 tracking-wider leading-relaxed">
              Premium luxury designer wear. Elegance redefined for the modern woman.
            </p>
          </div>

          {/* Client Service */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase mb-5 text-white/90">Client Service</h3>
            <ul className="space-y-3 text-xs text-white/50 tracking-wider">
              <li className="hover:text-white transition-colors cursor-pointer">After-sale Service</li>
              <li className="hover:text-white transition-colors cursor-pointer">Free Insurance</li>
              <li className="hover:text-white transition-colors cursor-pointer">Shipping &amp; Returns</li>
              <li className="hover:text-white transition-colors cursor-pointer">FAQs</li>
              <li className="hover:text-white transition-colors cursor-pointer">Size Guide</li>
            </ul>
          </div>

          {/* Our Brand */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase mb-5 text-white/90">Our Brand</h3>
            <ul className="space-y-3 text-xs text-white/50 tracking-wider">
              <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
              <li className="hover:text-white transition-colors cursor-pointer">The Excellence</li>
              <li className="hover:text-white transition-colors cursor-pointer">International Awards</li>
              <li className="hover:text-white transition-colors cursor-pointer">Our Story</li>
              <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase mb-5 text-white/90">Quick Links</h3>
            <ul className="space-y-3 text-xs text-white/50 tracking-wider">
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/shop/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-[10px] text-white/40 tracking-wider uppercase">
            <span>We Accept</span>
            <div className="flex items-center gap-2">
              <span className="bg-white/10 px-3 py-1.5 rounded text-white/70 font-bold text-[10px]">VISA</span>
              <span className="bg-white/10 px-3 py-1.5 rounded text-white/70 font-bold text-[10px]">MC</span>
              <span className="bg-white/10 px-3 py-1.5 rounded text-white/70 font-bold text-[10px]">JCB</span>
              <span className="bg-white/10 px-3 py-1.5 rounded text-white/70 font-bold text-[10px]">COD</span>
              <span className="bg-white/10 px-3 py-1.5 rounded text-white/70 font-bold text-[10px]">EASYPAISA</span>
            </div>
          </div>

          <p className="text-[10px] text-white/30 tracking-wider">
            All rights reserved &copy; {new Date().getFullYear()} {logoText || "ZARKA COUTURE"}. Powered by Shopify-style CMS.
          </p>
        </div>
      </div>
      <SocialMediaFooter />
    </footer>
  );
};

export default Footer;
