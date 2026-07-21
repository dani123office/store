import { FaFacebookF, FaInstagram, FaTiktok, FaPinterestP, FaYoutube } from "react-icons/fa6";
import { ThemeSettings } from "../pages/HomeLayout";

interface SocialMediaFooterProps {
  themeSettings?: ThemeSettings;
}

const SocialMediaFooter = ({ themeSettings }: SocialMediaFooterProps) => {
  const social = themeSettings?.footer;
  if (!social) return null;

  return (
    <div className="border-t border-hairline py-8">
      <div className="max-w-screen-2xl mx-auto px-5 flex flex-col items-center gap-4">
        <p className="text-caption text-shade-50 tracking-tracked uppercase">Follow us</p>
        <div className="flex gap-5 text-shade-50">
          {social.facebook_url && (
            <a href={social.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
              <FaFacebookF className="w-4 h-4" />
            </a>
          )}
          {social.instagram_url && (
            <a href={social.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
              <FaInstagram className="w-4 h-4" />
            </a>
          )}
          {social.tiktok_url && (
            <a href={social.tiktok_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
              <FaTiktok className="w-4 h-4" />
            </a>
          )}
          {social.pinterest_url && (
            <a href={social.pinterest_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
              <FaPinterestP className="w-4 h-4" />
            </a>
          )}
          {social.youtube_url && (
            <a href={social.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
              <FaYoutube className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFooter;