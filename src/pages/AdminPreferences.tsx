import { useEffect, useState } from "react";
import { 
  HiOutlineGlobeAlt, HiOutlineCheckCircle,
  HiOutlineLockClosed, HiOutlineDocumentText, HiOutlineSparkles,
  HiOutlineAdjustmentsHorizontal
} from "react-icons/hi2";
import { FaFacebook } from "react-icons/fa";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";

interface PreferenceSettings {
  metaTitleTemplate: string;
  defaultMetaDescription: string;
  gaTrackingId: string;
  fbPixelId: string;
  robotsTxt: string;
  limitEuropeTracking: boolean;
  limitCaliforniaSale: boolean;
}

const defaultSEO: PreferenceSettings = {
  metaTitleTemplate: "{Page Title} | ZARKA COUTURE",
  defaultMetaDescription: "Premium luxury designer dresses, unstitched, ready to wear, bridals & jewellery. Free shipping nationwide.",
  gaTrackingId: "G-XXXXXXXXXX",
  fbPixelId: "", // starts empty
  robotsTxt: `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${window.location.origin}/sitemap.xml`,
  limitEuropeTracking: false,
  limitCaliforniaSale: false,
};

const AdminPreferences = () => {
  const [settings, setSettings] = useState<PreferenceSettings>(defaultSEO);
  const [storeId, setStoreId] = useState<string>("1");
  const [loading, setLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [tempPixelId, setTempPixelId] = useState("");

  // Load from Laravel Database /stores
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await customFetch.get("/stores");
        if (res.data && res.data.length > 0) {
          const store = res.data[0];
          setStoreId(store.id || "1");
          
          let parsedSettings = defaultSEO;
          if (store.seo_settings) {
            try {
              parsedSettings = { ...defaultSEO, ...JSON.parse(store.seo_settings) };
            } catch (err) {
              console.error("Failed to parse seo_settings JSON", err);
            }
          } else {
            // Check localStorage fallback
            const storedLocal = localStorage.getItem("zarka_seo_settings");
            if (storedLocal) {
              parsedSettings = { ...defaultSEO, ...JSON.parse(storedLocal) };
            }
          }

          // Keep in sync with the stores direct fb_pixel_id column
          if (store.fb_pixel_id) {
            parsedSettings.fbPixelId = store.fb_pixel_id;
          }

          setSettings(parsedSettings);
          setTempPixelId(parsedSettings.fbPixelId);
        }
      } catch (e) {
        console.error("Failed to load preferences from database", e);
        toast.error("Failed to load preferences from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const handleSave = async (updatedSettings: PreferenceSettings) => {
    setSettings(updatedSettings);
    
    // Save to localStorage for storefront fallback
    localStorage.setItem("zarka_seo_settings", JSON.stringify(updatedSettings));

    // Save to Laravel Database
    try {
      await customFetch.post("/stores", {
        id: storeId,
        fb_pixel_id: updatedSettings.fbPixelId,
        fb_connected: updatedSettings.fbPixelId ? 1 : 0,
        seo_settings: JSON.stringify(updatedSettings)
      });
      toast.success("Preferences saved successfully!");
    } catch (e) {
      console.error("Failed to save preferences to server", e);
      toast.error("Failed to save settings to server.");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(settings);
  };

  const handleOpenSetup = () => {
    setTempPixelId(settings.fbPixelId);
    setShowSetupModal(true);
  };

  const handleSavePixelId = () => {
    if (!tempPixelId.trim()) {
      toast.error("Please enter a valid Facebook Pixel ID.");
      return;
    }
    const updated = { ...settings, fbPixelId: tempPixelId.trim() };
    handleSave(updated);
    setShowSetupModal(false);
  };

  const handleDisconnectPixel = () => {
    if (window.confirm("Are you sure you want to disconnect Facebook Pixel tracking?")) {
      const updated = { ...settings, fbPixelId: "" };
      handleSave(updated);
      setTempPixelId("");
      toast.success("Facebook Pixel disconnected.");
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <h1 className="text-xl font-semibold text-[#202223] mb-6">Preferences</h1>
        <p className="text-sm text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5 border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#202223]">Preferences</h1>
          <p className="text-xs text-[#6d7175] mt-1">Configure search engine listings, Google Analytics, and Facebook Pixel tracking details.</p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Search Engine Listing Card */}
        <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 bg-gray-50/50 border-r border-gray-100 space-y-2">
            <h3 className="text-sm font-bold text-[#202223] uppercase tracking-wider flex items-center gap-2">
              <HiOutlineGlobeAlt className="text-lg text-gray-500" />
              Search engine listing
            </h3>
            <p className="text-xs text-[#6d7175] leading-relaxed">
              Define the global title template and default meta description representing Zarka Couture on Google and Bing search feeds.
            </p>
          </div>
          <div className="p-6 md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-1">
                Homepage Title Template
              </label>
              <input
                type="text"
                required
                value={settings.metaTitleTemplate}
                onChange={(e) => setSettings({ ...settings, metaTitleTemplate: e.target.value })}
                className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-1">
                Homepage Meta Description
              </label>
              <textarea
                required
                rows={3}
                value={settings.defaultMetaDescription}
                onChange={(e) => setSettings({ ...settings, defaultMetaDescription: e.target.value })}
                className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
              />
            </div>
          </div>
        </div>

        {/* Google Analytics Card */}
        <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 bg-gray-50/50 border-r border-gray-100 space-y-2">
            <h3 className="text-sm font-bold text-[#202223] uppercase tracking-wider flex items-center gap-2">
              <HiOutlineAdjustmentsHorizontal className="text-lg text-gray-500" />
              Google Analytics
            </h3>
            <p className="text-xs text-[#6d7175] leading-relaxed">
              Track visitor volumes, page conversions, and web performance using your GA4 tracking ID.
            </p>
          </div>
          <div className="p-6 md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-1">
                Google Analytics Measurement ID (GA4)
              </label>
              <input
                type="text"
                value={settings.gaTrackingId}
                onChange={(e) => setSettings({ ...settings, gaTrackingId: e.target.value })}
                className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                placeholder="e.g. G-XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Facebook Pixel Connection Card (Shopify Style) */}
        <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 bg-gray-50/50 border-r border-gray-100 space-y-2">
            <h3 className="text-sm font-bold text-[#202223] uppercase tracking-wider flex items-center gap-2">
              <FaFacebook className="text-lg text-[#1877f2]" />
              Facebook Pixel
            </h3>
            <p className="text-xs text-[#6d7175] leading-relaxed">
              Connect your conversion pixel to feed purchase conversion values, add-to-carts, and views directly to Meta Ads Manager.
            </p>
          </div>
          <div className="p-6 md:col-span-2 space-y-5">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-800">Connect Conversion Pixel</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Facebook Pixel tracks customer behavior on your online store. This data improves your marketing abilities, including retargeting ads.{" "}
                <a 
                  href="https://www.facebook.com/business/help/952192354843755" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#2c6ecb] hover:underline"
                >
                  Learn more about Facebook Pixel.
                </a>
              </p>
            </div>

            {settings.fbPixelId ? (
              <div className="border border-green-200 bg-green-50/30 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                    <HiOutlineCheckCircle className="text-xl" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Connected Pixel ID</span>
                    <span className="block text-sm font-mono font-bold text-gray-800">{settings.fbPixelId}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleOpenSetup}
                    className="border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Change ID
                  </button>
                  <button
                    type="button"
                    onClick={handleDisconnectPixel}
                    className="border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={handleOpenSetup}
                  className="bg-[#1877f2] hover:bg-[#156cd4] text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-all hover:scale-[1.01] flex items-center gap-2"
                >
                  <FaFacebook className="text-base" />
                  Set up Facebook
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Customer Privacy Card */}
        <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 bg-gray-50/50 border-r border-gray-100 space-y-2">
            <h3 className="text-sm font-bold text-[#202223] uppercase tracking-wider flex items-center gap-2">
              <HiOutlineLockClosed className="text-lg text-gray-500" />
              Customer privacy
            </h3>
            <p className="text-xs text-[#6d7175] leading-relaxed">
              Give your customers control over their data. Enable data restrictions to comply with international regulations.
            </p>
          </div>
          <div className="p-6 md:col-span-2 space-y-5">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-800">Compliance &amp; Data Restrictions</h4>
              <p className="text-xs text-gray-500">
                While cookies and tracking help optimize campaigns, some regions require consent policies before capturing analytics.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.limitEuropeTracking}
                  onChange={(e) => setSettings({ ...settings, limitEuropeTracking: e.target.checked })}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-gray-700">Limit tracking for customers in Europe</span>
                  <span className="block text-[11px] text-gray-400 mt-0.5 leading-normal">
                    Under the European Union's General Data Protection Regulation (GDPR), customers must give consent before their data is tracked.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.limitCaliforniaSale}
                  onChange={(e) => setSettings({ ...settings, limitCaliforniaSale: e.target.checked })}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-gray-700">Limit the third-party sale of your California customers' data</span>
                  <span className="block text-[11px] text-gray-400 mt-0.5 leading-normal">
                    Under the California Consumer Privacy Act (CCPA), customers can opt-out of the sale of their data.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Robots.txt Card */}
        <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 bg-gray-50/50 border-r border-gray-100 space-y-2">
            <h3 className="text-sm font-bold text-[#202223] uppercase tracking-wider flex items-center gap-2">
              <HiOutlineDocumentText className="text-lg text-gray-500" />
              Robots.txt Editor
            </h3>
            <p className="text-xs text-[#6d7175] leading-relaxed">
              Manage search bot crawling paths and indexes. Modify carefully to avoid blocking listing access.
            </p>
          </div>
          <div className="p-6 md:col-span-2 space-y-4">
            <div>
              <textarea
                rows={4}
                value={settings.robotsTxt}
                onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
                className="w-full font-mono border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Save Footer */}
        <div className="flex justify-end gap-3 border-t pt-5">
          <button
            type="submit"
            className="bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-md transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>

      {/* SETUP Facebook PIXEL ID MODAL */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full flex flex-col">
            <div className="px-6 py-4 bg-[#1877f2] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaFacebook className="text-xl" />
                <span className="font-bold text-sm">Configure Facebook Pixel</span>
              </div>
              <button 
                onClick={() => setShowSetupModal(false)}
                className="text-white/85 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123456789012345"
                  value={tempPixelId}
                  onChange={(e) => setTempPixelId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 font-mono"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[11px] text-blue-800 flex gap-2">
                <HiOutlineSparkles className="text-base flex-shrink-0 text-blue-500 mt-0.5" />
                <span>
                  Adding a Pixel ID will dynamically inject the Meta tracking snippet to capture e-commerce events (PageViews, AddToCarts, Purchases) on storefront pages.
                </span>
              </div>

              <div className="pt-2 border-t flex justify-end gap-2">
                <button
                  onClick={() => setShowSetupModal(false)}
                  className="border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePixelId}
                  className="bg-[#1877f2] hover:bg-[#156cd4] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg"
                >
                  Connect Pixel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPreferences;
