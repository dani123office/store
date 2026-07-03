import { FaFacebookF, FaInstagram, FaTiktok, FaLinkedinIn, FaPinterestP, FaYoutube } from "react-icons/fa6";

const SocialMediaFooter = () => {
  return (
    <div className="border-t border-hairline py-8">
      <div className="max-w-screen-2xl mx-auto px-5 flex flex-col items-center gap-4">
        <p className="text-caption text-shade-50 tracking-tracked uppercase">Follow us</p>
        <div className="flex gap-5 text-shade-50">
          <FaFacebookF className="w-4 h-4 hover:text-ink transition-colors cursor-pointer" />
          <FaInstagram className="w-4 h-4 hover:text-ink transition-colors cursor-pointer" />
          <FaTiktok className="w-4 h-4 hover:text-ink transition-colors cursor-pointer" />
          <FaLinkedinIn className="w-4 h-4 hover:text-ink transition-colors cursor-pointer" />
          <FaPinterestP className="w-4 h-4 hover:text-ink transition-colors cursor-pointer" />
          <FaYoutube className="w-4 h-4 hover:text-ink transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFooter;