import SocialMediaFooter from "./SocialMediaFooter";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#151515] text-white mt-16">
      <div className="max-w-screen-2xl mx-auto px-5 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
          <div>
            <h3 className="text-lg font-medium tracking-wider uppercase mb-4">Client Service</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>After-sale Service</li>
              <li>Free Insurance</li>
              <li>Shipping & Returns</li>
              <li>FAQs</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium tracking-wider uppercase mb-4">Our Brand</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>The Company</li>
              <li>The Excellence</li>
              <li>International Awards</li>
              <li>Our Story</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Search</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 my-16">
          <Link to="/" className="text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-white">
            ZARKA COUTURE
          </Link>
          <p className="text-xs text-white/50 tracking-wider">
            All rights reserved &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
      <SocialMediaFooter />
    </footer>
  );
};

export default Footer;
