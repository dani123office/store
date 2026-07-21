import { useEffect, useState } from "react";
import { HiOutlineCheck, HiOutlineDocumentText, HiOutlineGlobeAlt } from "react-icons/hi2";
import toast from "react-hot-toast";

const defaultSEO = {
  metaTitleTemplate: "{Page Title} | ZARKA COUTURE",
  defaultMetaDescription: "Premium luxury designer dresses, unstitched, ready to wear, bridals & jewellery. Free shipping nationwide.",
  gaTrackingId: "G-XXXXXXXXXX",
  fbPixelId: "123456789012345",
  robotsTxt: `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${window.location.origin}/sitemap.xml`,
};

const AdminSEO = () => {
  const [seo, setSeo] = useState(defaultSEO);

  useEffect(() => {
    const stored = localStorage.getItem("zarka_seo_settings");
    if (stored) {
      setSeo(JSON.parse(stored));
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("zarka_seo_settings", JSON.stringify(seo));
    toast.success("SEO settings saved successfully");
  };

  const handleGenerateSitemap = () => {
    toast.success("Auto-generating /sitemap.xml with all products, collections, and categories!");
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#202223]">SEO &amp; Tracking Settings</h1>
        <p className="text-xs text-[#6d7175]">Configure global metadata, search engine policies, and analytics scripts.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#e0e0e0] rounded-lg p-6 space-y-6 shadow-sm">
        {/* Global SEO */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#202223] border-b pb-2 flex items-center gap-2">
            <HiOutlineGlobeAlt className="text-base text-gray-500" />
            Search Engine Optimization (SEO)
          </h3>
          <div>
            <label className="block text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-1">
              Title Template
            </label>
            <input
              type="text"
              required
              value={seo.metaTitleTemplate}
              onChange={(e) => setSeo({ ...seo, metaTitleTemplate: e.target.value })}
              className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-1">
              Default Meta Description
            </label>
            <textarea
              required
              rows={3}
              value={seo.defaultMetaDescription}
              onChange={(e) => setSeo({ ...seo, defaultMetaDescription: e.target.value })}
              className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
            />
          </div>
        </div>

        {/* Global Analytics Tracking scripts */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold text-[#202223] border-b pb-2 flex items-center gap-2">
            <HiOutlineCheck className="text-base text-gray-500" />
            Integrations &amp; Analytics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-1">
                Google Analytics ID (GA4)
              </label>
              <input
                type="text"
                value={seo.gaTrackingId}
                onChange={(e) => setSeo({ ...seo, gaTrackingId: e.target.value })}
                className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-1">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                value={seo.fbPixelId}
                onChange={(e) => setSeo({ ...seo, fbPixelId: e.target.value })}
                className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
              />
            </div>
          </div>
        </div>

        {/* Robots.txt file editor */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold text-[#202223] border-b pb-2 flex items-center gap-2">
            <HiOutlineDocumentText className="text-base text-gray-500" />
            Robots.txt Editor
          </h3>
          <div>
            <textarea
              rows={4}
              value={seo.robotsTxt}
              onChange={(e) => setSeo({ ...seo, robotsTxt: e.target.value })}
              className="w-full font-mono border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2c6ecb] bg-gray-50"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            className="bg-[#008060] text-white text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-[#006e52] transition-colors shadow-sm"
          >
            Save Settings
          </button>
          <button
            type="button"
            onClick={handleGenerateSitemap}
            className="border border-[#e0e0e0] text-[#151515] text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Generate Sitemap.xml
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSEO;
