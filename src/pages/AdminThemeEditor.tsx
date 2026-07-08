import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import {
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineComputerDesktop,
  HiOutlineDevicePhoneMobile,
  HiOutlineArrowPath,
  HiOutlinePhoto,
  HiXMark,
  HiCheck,
  HiArrowUpTray,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  btn_text: string;
  btn_link: string;
}

interface CollectionTab {
  label: string;
  category: string;
}

interface ThemeSettings {
  announcement: {
    text: string;
    bg_color: string;
    text_color: string;
    enabled: boolean;
  };
  logo_text: string;
  slides: Slide[];
  categories_section: {
    enabled: boolean;
    title: string;
  };
  featured_collections: {
    enabled: boolean;
    title: string;
    tabs: CollectionTab[];
  };
  trending_products: {
    enabled: boolean;
    title: string;
    limit: number;
  };
  whatsapp: {
    phone: string;
    enabled: boolean;
    message: string;
    position: "bottom-right" | "bottom-left";
  };
  installments: {
    enabled: boolean;
    provider: string;
    count: number;
  };
  promotional_section: {
    enabled: boolean;
    left_image: string;
    left_subtitle: string;
    left_title: string;
    left_btn_text: string;
    left_btn_link: string;
    right_image: string;
    right_subtitle: string;
    right_title: string;
    right_btn_text: string;
    right_btn_link: string;
  };
  instagram_gallery: {
    enabled: boolean;
    title: string;
    hashtag: string;
    items: {
      image: string;
      link: string;
    }[];
  };
  trust_bar: {
    enabled: boolean;
    items: {
      icon: string;
      title: string;
      subtitle: string;
    }[];
  };
  newsletter: {
    enabled: boolean;
    title: string;
    subtitle: string;
    button_text: string;
  };
  footer: {
    facebook_url: string;
    instagram_url: string;
    tiktok_url: string;
    pinterest_url: string;
    youtube_url: string;
    phone: string;
    email: string;
  };
}

const defaultThemeSettings: ThemeSettings = {
  announcement: {
    text: "Free Shipping Nationwide — For Queries: +923-111-111-975",
    bg_color: "#000000",
    text_color: "#ffffff",
    enabled: true,
  },
  logo_text: "ZARKA COUTURE",
  slides: [
    {
      id: "1",
      title: "SATORI 2026",
      subtitle: "STILLNESS & LUXURY",
      image: "banner1.jpg",
      btn_text: "LIVE NOW",
      btn_link: "/shop/luxury-collection",
    },
    {
      id: "2",
      title: "FESTIVE EID II 2026",
      subtitle: "NEW ARRIVALS",
      image: "banner.jpg",
      btn_text: "SHOP NOW",
      btn_link: "/shop/unstitched",
    },
  ],
  categories_section: {
    enabled: true,
    title: "Shop By Category",
  },
  featured_collections: {
    enabled: true,
    title: "Featured Collections",
    tabs: [
      { label: "ZSJ BASICS 2026", category: "special-edition" },
      { label: "FESTIVE EID II 2026", category: "luxury-collection" },
      { label: "PRET EID II 2026", category: "summer-edition" },
      { label: "SATORI 2026", category: "unique-collection" },
    ],
  },
  trending_products: {
    enabled: true,
    title: "Top Trending Products",
    limit: 5,
  },
  whatsapp: {
    phone: "+923173179230",
    enabled: true,
    message: "Hi, I would like to make an inquiry.",
    position: "bottom-right",
  },
  installments: {
    enabled: true,
    provider: "baadmay",
    count: 3,
  },
  promotional_section: {
    enabled: true,
    left_image: "luxury fashion 7 1.png",
    left_subtitle: "New Season",
    left_title: "New Arrivals",
    left_btn_text: "Discover Now",
    left_btn_link: "/shop/new-arrivals",
    right_image: "luxury fashion 7 2.png",
    right_subtitle: "Luxury Bridal",
    right_title: "Bridal Couture",
    right_btn_text: "Explore Collection",
    right_btn_link: "/shop/bridals",
  },
  instagram_gallery: {
    enabled: true,
    title: "Shop the Look",
    hashtag: "#ZarkaCouture",
    items: [
      { image: "product image 1.jpg", link: "/shop" },
      { image: "luxury fashion 7 1.png", link: "/shop" },
      { image: "product image 5.jpg", link: "/shop" },
      { image: "luxury fashion 7 2.png", link: "/shop" },
    ],
  },
  trust_bar: {
    enabled: true,
    items: [
      { icon: "truck", title: "Free Shipping", subtitle: "Nationwide delivery on all orders" },
      { icon: "arrow-path", title: "Easy Exchange", subtitle: "Hassle-free 7-day exchanges" },
      { icon: "sparkles", title: "Premium Fabric", subtitle: "100% authentic luxury segments" },
      { icon: "lock", title: "Secure Payments", subtitle: "COD & encrypted SSL payments" },
    ],
  },
  newsletter: {
    enabled: true,
    title: "Join the Zarka Club",
    subtitle: "Subscribe to receive updates, access to exclusive deals, and more.",
    button_text: "Subscribe",
  },
  footer: {
    facebook_url: "https://facebook.com",
    instagram_url: "https://instagram.com",
    tiktok_url: "https://tiktok.com",
    pinterest_url: "https://pinterest.com",
    youtube_url: "https://youtube.com",
    phone: "+923-111-111-975",
    email: "info@zarkacouture.com",
  },
};

const AdminThemeEditor = () => {
  const [store, setStore] = useState<any>(null);
  const [settings, setSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "announcement" | "slideshow" | "collections" | "whatsapp" | "installments" | "promotional" | "instagram" | "trust_bar" | "newsletter" | "footer">("general");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [categories, setCategories] = useState<{ id: number; cat_title: string }[]>([]);
  const [previewKey, setPreviewKey] = useState(0);

  // Media Modal states
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [selectedMediaName, setSelectedMediaName] = useState<string | null>(null);
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<
    | { type: "slide"; slideId: string }
    | { type: "promo"; side: "left" | "right" }
    | { type: "instagram"; index: number }
    | null
  >(null);

  const fetchMediaList = async () => {
    setLoadingMedia(true);
    try {
      const res = await customFetch.get("/media");
      setMediaList(res.data || []);
    } catch {
      toast.error("Failed to load media library");
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    if (showMediaModal) {
      fetchMediaList();
    }
  }, [showMediaModal]);

  const handleModalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setMediaUploading(true);
    const loadToast = toast.loading("Uploading image to media library...");
    try {
      const res = await customFetch.post("/upload", fd);
      toast.success("Image uploaded successfully!");
      // Refresh media list
      const mediaRes = await customFetch.get("/media");
      setMediaList(mediaRes.data || []);
      
      // Auto-select the newly uploaded image
      if (res.data && res.data.filename) {
        setSelectedMediaName(res.data.filename);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.file?.[0] || "Upload failed";
      toast.error(msg);
    } finally {
      setMediaUploading(false);
      toast.dismiss(loadToast);
    }
    e.target.value = "";
  };

  const handleSelectMedia = (filename: string) => {
    if (!mediaTarget) return;

    if (mediaTarget.type === "slide") {
      setSettings((prev) => ({
        ...prev,
        slides: prev.slides.map((s) =>
          s.id === mediaTarget.slideId ? { ...s, image: filename } : s
        ),
      }));
      toast.success("Slide image updated");
    } else if (mediaTarget.type === "promo") {
      setSettings((prev) => ({
        ...prev,
        promotional_section: {
          ...prev.promotional_section,
          [mediaTarget.side === "left" ? "left_image" : "right_image"]: filename,
        },
      }));
      toast.success("Promotional image updated");
    } else if (mediaTarget.type === "instagram") {
      setSettings((prev) => ({
        ...prev,
        instagram_gallery: {
          ...prev.instagram_gallery,
          items: prev.instagram_gallery.items.map((item: any, idx: number) =>
            idx === mediaTarget.index ? { ...item, image: filename } : item
          ),
        },
      }));
      toast.success("Lookbook image updated");
    }

    setShowMediaModal(false);
  };



  useEffect(() => {
    const runMigration = async () => {
      try {
        await customFetch.get("/db-migrate-custom");
      } catch {
      }
    };

    const fetchData = async () => {
      runMigration();
      try {
        const [storeRes, catRes] = await Promise.all([
          customFetch.get("/stores"),
          customFetch.get("/categories"),
        ]);

        if (catRes.data) {
          setCategories(catRes.data);
        }

        if (storeRes.data && storeRes.data.length > 0) {
          const storeData = storeRes.data[0];
          setStore(storeData);
          if (storeData.theme_settings) {
            try {
              const parsed = JSON.parse(storeData.theme_settings);
              // Merge with default settings to prevent issues if new keys are added
              setSettings({
                ...defaultThemeSettings,
                ...parsed,
                announcement: { ...defaultThemeSettings.announcement, ...(parsed.announcement || {}) },
                whatsapp: { ...defaultThemeSettings.whatsapp, ...(parsed.whatsapp || {}) },
                installments: { ...defaultThemeSettings.installments, ...(parsed.installments || {}) },
                featured_collections: { ...defaultThemeSettings.featured_collections, ...(parsed.featured_collections || {}) },
                trending_products: { ...defaultThemeSettings.trending_products, ...(parsed.trending_products || {}) },
                promotional_section: { ...defaultThemeSettings.promotional_section, ...(parsed.promotional_section || {}) },
              });
            } catch (e) {
              console.error("Failed to parse theme settings, using defaults", e);
              setSettings(defaultThemeSettings);
            }
          }
        }
      } catch (e: any) {
        console.error("Failed to load store settings from backend", e);
        const isConnectionError = e.code === "ERR_NETWORK" || e.message?.includes("Network Error") || e.message?.includes("refused") || e.message?.includes("Connection");
        if (isConnectionError) {
          setCategories([
            { id: 1, cat_title: "Unstitched" },
            { id: 2, cat_title: "Ready To Wear" },
            { id: 3, cat_title: "Bridals" },
            { id: 4, cat_title: "Jewellery" }
          ] as any);

          const localSettings = localStorage.getItem("zarka_theme_settings_fallback");
          if (localSettings) {
            setSettings(JSON.parse(localSettings));
          } else {
            setSettings(defaultThemeSettings);
          }
          setStore({ id: 1, name: "Zarka Couture Mock Store", theme_settings: JSON.stringify(settings) });
          toast.error("Offline Mode: Laravel backend server is not running on port 8000. Operating in offline LocalStorage fallback mode.", { duration: 6000 });
        } else {
          toast.error("Failed to load settings");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  const handleSave = async () => {
    if (!store) {
      toast.error("Store settings not loaded yet");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...store,
        theme_settings: JSON.stringify(settings),
      };
      await customFetch.post("/stores", payload);
      toast.success("Theme settings saved successfully!");
    } catch (e: any) {
      console.error("Save failed, writing to local backup", e);
      localStorage.setItem("zarka_theme_settings_fallback", JSON.stringify(settings));
      toast.success("Saved theme settings locally (Offline Fallback Mode)!");
    } finally {
      setSaving(false);
    }
  };



  const addSlide = () => {
    const newId = (settings.slides.length + 1).toString();
    const newSlide: Slide = {
      id: newId,
      title: "NEW SLIDE",
      subtitle: "LUXURY BRANDING",
      image: "banner1.jpg",
      btn_text: "SHOP NOW",
      btn_link: "/shop",
    };
    setSettings((prev) => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }));
    toast.success("Slide added");
  };

  const removeSlide = (id: string) => {
    if (settings.slides.length <= 1) {
      toast.error("You must keep at least one slide");
      return;
    }
    setSettings((prev) => ({
      ...prev,
      slides: prev.slides.filter((s) => s.id !== id),
    }));
    toast.success("Slide removed");
  };

  const updateSlideField = (id: string, field: keyof Slide, value: string) => {
    setSettings((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const updateCollectionTab = (index: number, field: keyof CollectionTab, value: string) => {
    setSettings((prev) => {
      const newTabs = [...prev.featured_collections.tabs];
      newTabs[index] = { ...newTabs[index], [field]: value };
      return {
        ...prev,
        featured_collections: {
          ...prev.featured_collections,
          tabs: newTabs,
        },
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center gap-2">
          <HiOutlineArrowPath className="text-3xl text-[#2c6ecb] animate-spin" />
          <p className="text-sm text-[#6d7175]">Loading Customizer Settings...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Customizer Subheader / Controls */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-[#e0e0e0] px-6 py-3 flex items-center justify-between z-20 shrink-0">
        <div>
          <h1 className="text-base font-semibold text-[#202223]">Store Theme Editor</h1>
          <p className="text-xs text-[#6d7175]">Customize Zara Shahjahan luxury UI sections in real-time</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Device Toggle */}
          <div className="flex items-center border border-[#e0e0e0] rounded-lg overflow-hidden bg-[#f6f6f7]">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`p-2 hover:bg-white transition-colors ${previewMode === "desktop" ? "bg-white text-[#2c6ecb]" : "text-[#6d7175]"}`}
              title="Desktop View"
            >
              <HiOutlineComputerDesktop className="text-lg" />
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`p-2 hover:bg-white transition-colors ${previewMode === "mobile" ? "bg-white text-[#2c6ecb]" : "text-[#6d7175]"}`}
              title="Mobile View"
            >
              <HiOutlineDevicePhoneMobile className="text-lg" />
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#008060] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#006e52] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Main Workspace Split Screen */}
      <div className="flex flex-1 overflow-hidden bg-[#f6f6f7]">
        {/* Left Side: Customize Form Panels */}
        <div className="w-80 md:w-96 bg-white border-r border-[#e0e0e0] flex flex-col h-full overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="flex flex-wrap border-b border-[#e0e0e0] text-xs font-medium text-[#6d7175] bg-[#fafbfb] shrink-0">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-3 border-b-2 whitespace-nowrap ${activeTab === "general" ? "border-[#2c6ecb] text-[#2c6ecb] bg-white font-semibold" : "border-transparent hover:text-[#202223]"}`}
            >
              General & Logo
            </button>
            <button
              onClick={() => setActiveTab("announcement")}
              className={`px-4 py-3 border-b-2 whitespace-nowrap ${activeTab === "announcement" ? "border-[#2c6ecb] text-[#2c6ecb] bg-white font-semibold" : "border-transparent hover:text-[#202223]"}`}
            >
              Announcement
            </button>
            <button
              onClick={() => setActiveTab("slideshow")}
              className={`px-4 py-3 border-b-2 whitespace-nowrap ${activeTab === "slideshow" ? "border-[#2c6ecb] text-[#2c6ecb] bg-white font-semibold" : "border-transparent hover:text-[#202223]"}`}
            >
              Slideshow
            </button>
            <button
              onClick={() => setActiveTab("collections")}
              className={`px-4 py-3 border-b-2 whitespace-nowrap ${activeTab === "collections" ? "border-[#2c6ecb] text-[#2c6ecb] bg-white font-semibold" : "border-transparent hover:text-[#202223]"}`}
            >
              Tabs
            </button>
            <button
              onClick={() => setActiveTab("whatsapp")}
              className={`px-4 py-3 border-b-2 whitespace-nowrap ${activeTab === "whatsapp" ? "border-[#2c6ecb] text-[#2c6ecb] bg-white font-semibold" : "border-transparent hover:text-[#202223]"}`}
            >
              WhatsApp
            </button>
            <button
              onClick={() => setActiveTab("promotional")}
              className={`px-4 py-3 border-b-2 whitespace-nowrap ${activeTab === "promotional" ? "border-[#2c6ecb] text-[#2c6ecb] bg-white font-semibold" : "border-transparent hover:text-[#202223]"}`}
            >
              Promotional
            </button>
            <button
              onClick={() => setActiveTab("instagram")}
              className={`px-4 py-3 border-b-2 whitespace-nowrap ${activeTab === "instagram" ? "border-[#2c6ecb] text-[#2c6ecb] bg-white font-semibold" : "border-transparent hover:text-[#202223]"}`}
            >
              Lookbook
            </button>
            <button
              onClick={() => setActiveTab("trust_bar")}
              className={`px-4 py-3 border-b-2 whitespace-nowrap ${activeTab === "trust_bar" ? "border-[#2c6ecb] text-[#2c6ecb] bg-white font-semibold" : "border-transparent hover:text-[#202223]"}`}
            >
              Trust Badges
            </button>
            <button
              onClick={() => setActiveTab("newsletter")}
              className={`px-4 py-3 border-b-2 whitespace-nowrap ${activeTab === "newsletter" ? "border-[#2c6ecb] text-[#2c6ecb] bg-white font-semibold" : "border-transparent hover:text-[#202223]"}`}
            >
              Newsletter
            </button>
            <button
              onClick={() => setActiveTab("footer")}
              className={`px-4 py-3 border-b-2 whitespace-nowrap ${activeTab === "footer" ? "border-[#2c6ecb] text-[#2c6ecb] bg-white font-semibold" : "border-transparent hover:text-[#202223]"}`}
            >
              Footer & Social
            </button>
          </div>

          {/* Tab Content Panel (Scrollable) */}
          <div className="flex-1 overflow-y-auto scrollbar-none p-5 space-y-6">
            {/* 1. General & Logo Settings */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#202223] border-b pb-2">General Theme Settings</h3>
                <div>
                  <label className="block text-xs font-semibold text-[#202223] mb-1">Header Logo / Store Brand Title</label>
                  <input
                    type="text"
                    value={settings.logo_text}
                    onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })}
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                  />
                  <p className="text-[11px] text-[#6d7175] mt-1">Displayed in serif luxury font at header center.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202223] mb-1">Categories Section Title</label>
                  <input
                    type="text"
                    value={settings.categories_section.title}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        categories_section: { ...settings.categories_section, title: e.target.value },
                      })
                    }
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="cat_sec_enabled"
                    checked={settings.categories_section.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        categories_section: { ...settings.categories_section, enabled: e.target.checked },
                      })
                    }
                    className="rounded text-[#2c6ecb] focus:ring-[#2c6ecb] border-[#e0e0e0]"
                  />
                  <label htmlFor="cat_sec_enabled" className="text-xs font-medium text-[#202223] cursor-pointer">
                    Enable Category Grid Section
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202223] mb-1 mt-4">Trending Products Title</label>
                  <input
                    type="text"
                    value={settings.trending_products.title}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        trending_products: { ...settings.trending_products, title: e.target.value },
                      })
                    }
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="trending_enabled"
                    checked={settings.trending_products.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        trending_products: { ...settings.trending_products, enabled: e.target.checked },
                      })
                    }
                    className="rounded text-[#2c6ecb] focus:ring-[#2c6ecb] border-[#e0e0e0]"
                  />
                  <label htmlFor="trending_enabled" className="text-xs font-medium text-[#202223] cursor-pointer">
                    Enable Trending Products Section
                  </label>
                </div>
              </div>
            )}

            {/* 2. Announcement Settings */}
            {activeTab === "announcement" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#202223] border-b pb-2">Announcement Bar</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ann_enabled"
                    checked={settings.announcement.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        announcement: { ...settings.announcement, enabled: e.target.checked },
                      })
                    }
                    className="rounded text-[#2c6ecb] focus:ring-[#2c6ecb] border-[#e0e0e0]"
                  />
                  <label htmlFor="ann_enabled" className="text-xs font-medium text-[#202223] cursor-pointer">
                    Show Announcement Bar
                  </label>
                </div>

                {settings.announcement.enabled && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#202223] mb-1">Announcement Message</label>
                      <textarea
                        value={settings.announcement.text}
                        rows={2}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            announcement: { ...settings.announcement, text: e.target.value },
                          })
                        }
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#202223] mb-1">Background Color</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={settings.announcement.bg_color}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                announcement: { ...settings.announcement, bg_color: e.target.value },
                              })
                            }
                            className="w-8 h-8 rounded cursor-pointer border border-[#e0e0e0]"
                          />
                          <input
                            type="text"
                            value={settings.announcement.bg_color}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                announcement: { ...settings.announcement, bg_color: e.target.value },
                              })
                            }
                            className="w-full border border-[#e0e0e0] rounded-lg px-2 py-1 text-xs outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#202223] mb-1">Text Color</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={settings.announcement.text_color}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                announcement: { ...settings.announcement, text_color: e.target.value },
                              })
                            }
                            className="w-8 h-8 rounded cursor-pointer border border-[#e0e0e0]"
                          />
                          <input
                            type="text"
                            value={settings.announcement.text_color}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                announcement: { ...settings.announcement, text_color: e.target.value },
                              })
                            }
                            className="w-full border border-[#e0e0e0] rounded-lg px-2 py-1 text-xs outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 3. Slideshow Banners Customizer */}
            {activeTab === "slideshow" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-semibold text-[#202223]">Slideshow Banners</h3>
                  <button
                    onClick={addSlide}
                    className="flex items-center gap-1 text-xs font-medium text-[#2c6ecb] hover:text-[#004b99] transition-colors"
                  >
                    <HiOutlinePlus className="text-sm" /> Add Slide
                  </button>
                </div>

                <div className="space-y-5">
                  {settings.slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className="border border-[#e0e0e0] rounded-xl p-4 bg-[#fafbfb] relative space-y-3 focus-within:border-neutral-500 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#6d7175]">SLIDE #{index + 1}</span>
                        <button
                          onClick={() => removeSlide(slide.id)}
                          className="text-[#d92c2c] hover:bg-[#ffe9e9] p-1 rounded transition-colors"
                          title="Delete Slide"
                        >
                          <HiOutlineTrash className="text-base" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#202223] mb-1">Banner Image</label>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 bg-gray-100 border rounded overflow-hidden flex items-center justify-center shrink-0">
                            <img
                              src={slide.image.startsWith("http") || slide.image.startsWith("/") ? slide.image : `/assets/${slide.image}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/assets/banner1.jpg";
                              }}
                            />
                          </div>
                          <div className="flex-1 flex flex-col gap-1">
                            <input
                              type="text"
                              placeholder="image_name.jpg"
                              value={slide.image}
                              onChange={(e) => updateSlideField(slide.id, "image", e.target.value)}
                              className="w-full border border-[#e0e0e0] rounded-lg px-2 py-1 text-xs outline-none focus:border-[#2c6ecb]"
                            />
                            {/* Media Selector trigger */}
                            <button
                              type="button"
                              onClick={() => {
                                setMediaTarget({ type: "slide", slideId: slide.id });
                                setShowMediaModal(true);
                              }}
                              className="flex items-center justify-center gap-1 cursor-pointer bg-white border border-[#e0e0e0] rounded px-2 py-1.5 text-[10px] font-semibold text-[#6d7175] hover:bg-gray-50 transition-colors w-full"
                            >
                              <HiOutlinePhoto className="text-xs" /> Select from Media
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#202223] mb-1">Title</label>
                          <input
                            type="text"
                            value={slide.title || ""}
                            onChange={(e) => updateSlideField(slide.id, "title", e.target.value)}
                            className="w-full border border-[#e0e0e0] rounded-lg px-2 py-1 text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#202223] mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={slide.subtitle || ""}
                            onChange={(e) => updateSlideField(slide.id, "subtitle", e.target.value)}
                            className="w-full border border-[#e0e0e0] rounded-lg px-2 py-1 text-xs outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#202223] mb-1">Button Text</label>
                          <input
                            type="text"
                            value={slide.btn_text || ""}
                            onChange={(e) => updateSlideField(slide.id, "btn_text", e.target.value)}
                            className="w-full border border-[#e0e0e0] rounded-lg px-2 py-1 text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#202223] mb-1">Link URL</label>
                          <input
                            type="text"
                            value={slide.btn_link || ""}
                            onChange={(e) => updateSlideField(slide.id, "btn_link", e.target.value)}
                            className="w-full border border-[#e0e0e0] rounded-lg px-2 py-1 text-xs outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Featured Collections Tabs */}
            {activeTab === "collections" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#202223] border-b pb-2">Featured Collections Tabs</h3>
                <div>
                  <label className="block text-xs font-semibold text-[#202223] mb-1">Section Header Title</label>
                  <input
                    type="text"
                    value={settings.featured_collections.title}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        featured_collections: { ...settings.featured_collections, title: e.target.value },
                      })
                    }
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                  />
                </div>

                <div className="space-y-4 mt-4">
                  {settings.featured_collections.tabs.map((tab, idx) => (
                    <div key={idx} className="border border-[#e0e0e0] rounded-xl p-3 bg-[#fafbfb] space-y-2">
                      <div className="text-[11px] font-bold text-[#6d7175]">TAB #{idx + 1}</div>
                      <div>
                        <label className="block text-[11px] text-[#202223] mb-0.5">Tab Name</label>
                        <input
                          type="text"
                          value={tab.label}
                          onChange={(e) => updateCollectionTab(idx, "label", e.target.value)}
                          className="w-full border border-[#e0e0e0] rounded-lg px-2 py-1 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#202223] mb-0.5">Category Filter Slug</label>
                        <select
                          value={tab.category}
                          onChange={(e) => updateCollectionTab(idx, "category", e.target.value)}
                          className="w-full border border-[#e0e0e0] rounded-lg px-2 py-1 text-xs outline-none bg-white"
                        >
                          <option key="all" value="all">Show All</option>
                          <option key="new-arrivals" value="new-arrivals">new-arrivals</option>
                          <option key="unstitched" value="unstitched">unstitched</option>
                          <option key="ready-to-wear" value="ready-to-wear">ready-to-wear</option>
                          <option key="bridals" value="bridals">bridals</option>
                          <option key="jewellery" value="jewellery">jewellery</option>
                          <option key="special-prices" value="special-prices">special-prices</option>
                          {categories.map((c, catIdx) => (
                            <option key={`dynamic-${(c as any).cat_id || c.id || catIdx}`} value={c.cat_title.toLowerCase().replace(/\s+/g, "-")}>
                              {c.cat_title} (Dynamic)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. WhatsApp Floating Widget */}
            {activeTab === "whatsapp" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#202223] border-b pb-2">WhatsApp Float Chat</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="wa_enabled"
                    checked={settings.whatsapp.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        whatsapp: { ...settings.whatsapp, enabled: e.target.checked },
                      })
                    }
                    className="rounded text-[#2c6ecb] focus:ring-[#2c6ecb] border-[#e0e0e0]"
                  />
                  <label htmlFor="wa_enabled" className="text-xs font-medium text-[#202223] cursor-pointer">
                    Enable WhatsApp Floating Widget
                  </label>
                </div>

                {settings.whatsapp.enabled && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#202223] mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        placeholder="+923XXXXXXXXX"
                        value={settings.whatsapp.phone}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            whatsapp: { ...settings.whatsapp, phone: e.target.value },
                          })
                        }
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#202223] mb-1">Default Msg Template</label>
                      <textarea
                        value={settings.whatsapp.message}
                        rows={2}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            whatsapp: { ...settings.whatsapp, message: e.target.value },
                          })
                        }
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#202223] mb-1">Screen Position</label>
                      <select
                        value={settings.whatsapp.position}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            whatsapp: {
                              ...settings.whatsapp,
                              position: e.target.value as "bottom-right" | "bottom-left",
                            },
                          })
                        }
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none bg-white"
                      >
                        <option value="bottom-right">Bottom Right Corner</option>
                        <option value="bottom-left">Bottom Left Corner</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 5. Promotional Split Section */}
            {activeTab === "promotional" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#202223] border-b pb-2">Promotional Split Section</h3>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="promo_enabled"
                    checked={settings.promotional_section.enabled}
                    onChange={(e) => setSettings({ ...settings, promotional_section: { ...settings.promotional_section, enabled: e.target.checked } })}
                    className="rounded text-[#2c6ecb] focus:ring-[#2c6ecb] border-[#e0e0e0]"
                  />
                  <label htmlFor="promo_enabled" className="text-xs font-medium text-[#202223] cursor-pointer">Enable Promotional Section</label>
                </div>

                {settings.promotional_section.enabled && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-semibold text-[#202223] uppercase tracking-wider">Left Panel</p>
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Image file</label>
                          <div className="flex flex-col gap-1">
                            <input type="text" value={settings.promotional_section.left_image}
                              onChange={(e) => setSettings({ ...settings, promotional_section: { ...settings.promotional_section, left_image: e.target.value } })}
                              className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setMediaTarget({ type: "promo", side: "left" });
                                setShowMediaModal(true);
                              }}
                              className="flex items-center justify-center gap-1 cursor-pointer bg-white border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs font-semibold text-[#6d7175] hover:bg-gray-50 transition-colors"
                            >
                              <HiOutlinePhoto className="text-sm" /> Select from Media
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Subtitle</label>
                          <input type="text" value={settings.promotional_section.left_subtitle}
                            onChange={(e) => setSettings({ ...settings, promotional_section: { ...settings.promotional_section, left_subtitle: e.target.value } })}
                            className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Title</label>
                          <input type="text" value={settings.promotional_section.left_title}
                            onChange={(e) => setSettings({ ...settings, promotional_section: { ...settings.promotional_section, left_title: e.target.value } })}
                            className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Button text</label>
                          <input type="text" value={settings.promotional_section.left_btn_text}
                            onChange={(e) => setSettings({ ...settings, promotional_section: { ...settings.promotional_section, left_btn_text: e.target.value } })}
                            className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Button link</label>
                          <input type="text" value={settings.promotional_section.left_btn_link}
                            onChange={(e) => setSettings({ ...settings, promotional_section: { ...settings.promotional_section, left_btn_link: e.target.value } })}
                            className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                          />
                        </div>
                      </div>
                      <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-semibold text-[#202223] uppercase tracking-wider">Right Panel</p>
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Image file</label>
                          <div className="flex flex-col gap-1">
                            <input type="text" value={settings.promotional_section.right_image}
                              onChange={(e) => setSettings({ ...settings, promotional_section: { ...settings.promotional_section, right_image: e.target.value } })}
                              className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setMediaTarget({ type: "promo", side: "right" });
                                setShowMediaModal(true);
                              }}
                              className="flex items-center justify-center gap-1 cursor-pointer bg-white border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs font-semibold text-[#6d7175] hover:bg-gray-50 transition-colors"
                            >
                              <HiOutlinePhoto className="text-sm" /> Select from Media
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Subtitle</label>
                          <input type="text" value={settings.promotional_section.right_subtitle}
                            onChange={(e) => setSettings({ ...settings, promotional_section: { ...settings.promotional_section, right_subtitle: e.target.value } })}
                            className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Title</label>
                          <input type="text" value={settings.promotional_section.right_title}
                            onChange={(e) => setSettings({ ...settings, promotional_section: { ...settings.promotional_section, right_title: e.target.value } })}
                            className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Button text</label>
                          <input type="text" value={settings.promotional_section.right_btn_text}
                            onChange={(e) => setSettings({ ...settings, promotional_section: { ...settings.promotional_section, right_btn_text: e.target.value } })}
                            className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#202223] mb-1">Button link</label>
                          <input type="text" value={settings.promotional_section.right_btn_link}
                            onChange={(e) => setSettings({ ...settings, promotional_section: { ...settings.promotional_section, right_btn_link: e.target.value } })}
                            className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Lookbook / Instagram Gallery */}
            {activeTab === "instagram" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#202223] border-b pb-2">Instagram Lookbook</h3>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="insta_enabled"
                    checked={settings.instagram_gallery?.enabled}
                    onChange={(e) => setSettings({ ...settings, instagram_gallery: { ...settings.instagram_gallery, enabled: e.target.checked } })}
                    className="rounded text-[#2c6ecb] focus:ring-[#2c6ecb] border-[#e0e0e0]"
                  />
                  <label htmlFor="insta_enabled" className="text-xs font-medium text-[#202223] cursor-pointer">Enable Lookbook Section</label>
                </div>
                {settings.instagram_gallery?.enabled && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-[#202223] mb-1">Section Title</label>
                      <input type="text" value={settings.instagram_gallery.title}
                        onChange={(e) => setSettings({ ...settings, instagram_gallery: { ...settings.instagram_gallery, title: e.target.value } })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#202223] mb-1">Hashtag / Subtext</label>
                      <input type="text" value={settings.instagram_gallery.hashtag}
                        onChange={(e) => setSettings({ ...settings, instagram_gallery: { ...settings.instagram_gallery, hashtag: e.target.value } })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-semibold text-[#202223]">Lookbook Images (4 items)</p>
                      {settings.instagram_gallery.items.map((item, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg space-y-2 border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Image {idx + 1}</p>
                          <div>
                            <label className="block text-xs text-[#202223] mb-1">Image file</label>
                            <div className="flex flex-col gap-1">
                              <input type="text" value={item.image}
                                onChange={(e) => {
                                  const items = [...settings.instagram_gallery.items];
                                  items[idx] = { ...items[idx], image: e.target.value };
                                  setSettings({ ...settings, instagram_gallery: { ...settings.instagram_gallery, items } });
                                }}
                                className="w-full border border-[#e0e0e0] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#2c6ecb]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaTarget({ type: "instagram", index: idx });
                                  setShowMediaModal(true);
                                }}
                                className="flex items-center justify-center gap-1 cursor-pointer bg-white border border-[#e0e0e0] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#6d7175] hover:bg-gray-50"
                              >
                                <HiOutlinePhoto className="text-sm" /> Choose Image
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-[#202223] mb-1">Redirect Link</label>
                            <input type="text" value={item.link}
                              onChange={(e) => {
                                  const items = [...settings.instagram_gallery.items];
                                  items[idx] = { ...items[idx], link: e.target.value };
                                  setSettings({ ...settings, instagram_gallery: { ...settings.instagram_gallery, items } });
                              }}
                              className="w-full border border-[#e0e0e0] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#2c6ecb]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Trust Badges Bar */}
            {activeTab === "trust_bar" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#202223] border-b pb-2">Trust Badges Bar</h3>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="trust_enabled"
                    checked={settings.trust_bar?.enabled}
                    onChange={(e) => setSettings({ ...settings, trust_bar: { ...settings.trust_bar, enabled: e.target.checked } })}
                    className="rounded text-[#2c6ecb] focus:ring-[#2c6ecb] border-[#e0e0e0]"
                  />
                  <label htmlFor="trust_enabled" className="text-xs font-medium text-[#202223] cursor-pointer">Enable Trust Badges Bar</label>
                </div>
                {settings.trust_bar?.enabled && (
                  <div className="space-y-4 pt-2">
                    {settings.trust_bar.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg space-y-2 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Badge {idx + 1}</p>
                        <div>
                          <label className="block text-xs text-[#202223] mb-1">Icon Style</label>
                          <select value={item.icon}
                            onChange={(e) => {
                              const items = [...settings.trust_bar.items];
                              items[idx] = { ...items[idx], icon: e.target.value };
                              setSettings({ ...settings, trust_bar: { ...settings.trust_bar, items } });
                            }}
                            className="w-full border border-[#e0e0e0] rounded-lg px-3 py-1.5 text-xs bg-white"
                          >
                            <option value="truck">Truck (Shipping)</option>
                            <option value="arrow-path">Arrow Path (Exchange/Return)</option>
                            <option value="sparkles">Sparkles (Quality/Premium)</option>
                            <option value="lock">Lock (Secure Payments)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-[#202223] mb-1">Title</label>
                          <input type="text" value={item.title}
                            onChange={(e) => {
                              const items = [...settings.trust_bar.items];
                              items[idx] = { ...items[idx], title: e.target.value };
                              setSettings({ ...settings, trust_bar: { ...settings.trust_bar, items } });
                            }}
                            className="w-full border border-[#e0e0e0] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#2c6ecb]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#202223] mb-1">Subtitle</label>
                          <input type="text" value={item.subtitle}
                            onChange={(e) => {
                              const items = [...settings.trust_bar.items];
                              items[idx] = { ...items[idx], subtitle: e.target.value };
                              setSettings({ ...settings, trust_bar: { ...settings.trust_bar, items } });
                            }}
                            className="w-full border border-[#e0e0e0] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#2c6ecb]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Newsletter Settings */}
            {activeTab === "newsletter" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#202223] border-b pb-2">Newsletter Box</h3>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="news_enabled"
                    checked={settings.newsletter?.enabled}
                    onChange={(e) => setSettings({ ...settings, newsletter: { ...settings.newsletter, enabled: e.target.checked } })}
                    className="rounded text-[#2c6ecb] focus:ring-[#2c6ecb] border-[#e0e0e0]"
                  />
                  <label htmlFor="news_enabled" className="text-xs font-medium text-[#202223] cursor-pointer">Enable Newsletter Section</label>
                </div>
                {settings.newsletter?.enabled && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-[#202223] mb-1">Title</label>
                      <input type="text" value={settings.newsletter.title}
                        onChange={(e) => setSettings({ ...settings, newsletter: { ...settings.newsletter, title: e.target.value } })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#202223] mb-1">Subtitle / Description</label>
                      <textarea value={settings.newsletter.subtitle} rows={3}
                        onChange={(e) => setSettings({ ...settings, newsletter: { ...settings.newsletter, subtitle: e.target.value } })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#202223] mb-1">Button Label</label>
                      <input type="text" value={settings.newsletter.button_text}
                        onChange={(e) => setSettings({ ...settings, newsletter: { ...settings.newsletter, button_text: e.target.value } })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Footer & Social Settings */}
            {activeTab === "footer" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#202223] border-b pb-2">Footer & Socials</h3>
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Social Links</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[#202223] mb-1">Instagram URL</label>
                      <input type="text" value={settings.footer?.instagram_url}
                        onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, instagram_url: e.target.value } })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#202223] mb-1">Facebook URL</label>
                      <input type="text" value={settings.footer?.facebook_url}
                        onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, facebook_url: e.target.value } })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#202223] mb-1">TikTok URL</label>
                      <input type="text" value={settings.footer?.tiktok_url}
                        onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, tiktok_url: e.target.value } })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#202223] mb-1">Pinterest URL</label>
                      <input type="text" value={settings.footer?.pinterest_url}
                        onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, pinterest_url: e.target.value } })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#202223] mb-1">YouTube URL</label>
                      <input type="text" value={settings.footer?.youtube_url}
                        onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, youtube_url: e.target.value } })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Contact Info</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[#202223] mb-1">Support Phone</label>
                      <input type="text" value={settings.footer?.phone}
                        onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, phone: e.target.value } })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#202223] mb-1">Support Email</label>
                      <input type="text" value={settings.footer?.email}
                        onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, email: e.target.value } })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Live Store Preview (iframe) */}
        <div className="flex-1 flex p-8 overflow-hidden">
          <div
            className={`bg-white shadow-2xl transition-all border border-[#e2e2e2] duration-300 relative flex flex-col ${
              previewMode === "desktop" ? "w-full max-w-4xl" : "w-[360px]"
            } max-h-full rounded-lg`}
          >
            {/* Window chrome */}
            <div className="bg-[#f0f0f1] px-4 py-2 border-b border-[#e2e2e2] flex items-center gap-2 shrink-0">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              <span className="text-[10px] text-gray-500 font-mono ml-4 truncate flex-1">
                {window.location.origin}/
              </span>
              <button
                onClick={() => setPreviewKey((k) => k + 1)}
                className="text-[10px] text-[#6d7175] hover:text-[#202223] flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                title="Refresh preview"
              >
                <HiOutlineArrowPath className="text-xs" /> Refresh
              </button>
            </div>

            <iframe
              key={previewKey}
              src={window.location.origin + "/"}
              className="w-full flex-1 border-0"
              title="Store Preview"
            />
          </div>
        </div>
      </div>

      {/* Media Selector Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMediaModal(false)} />
          <div className="relative bg-white w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-fade-in text-left">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Select Media</h3>
                <p className="text-xs text-gray-500">Choose an existing image or upload a new one to the store library</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            {/* Modal Controls (Search & Upload) */}
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
              <div className="relative w-full sm:max-w-xs">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search images by name..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white"
                />
              </div>

              <label className="flex items-center gap-2 bg-[#008060] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#006e52] cursor-pointer transition-colors shadow-sm w-full sm:w-auto justify-center">
                <HiArrowUpTray className="text-sm" />
                {mediaUploading ? "Uploading..." : "Upload New File"}
                <input type="file" accept="image/*" className="hidden" onChange={handleModalUpload} disabled={mediaUploading} />
              </label>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              {loadingMedia ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2c6ecb]" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {mediaList
                    .filter((item) => item.name.toLowerCase().includes(mediaSearch.toLowerCase()))
                    .map((item) => {
                      const isSelected = selectedMediaName === item.name;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedMediaName(item.name)}
                          onDoubleClick={() => {
                            handleSelectMedia(item.name);
                          }}
                          className={`aspect-square bg-white rounded-lg overflow-hidden border-2 cursor-pointer transition-all relative flex items-center justify-center group shadow-sm ${
                            isSelected
                              ? "border-[#2c6ecb] ring-2 ring-[#2c6ecb]/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/assets/product image 1.jpg"; }}
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-[#2c6ecb] text-white rounded-full p-1 shadow-md">
                              <HiCheck className="text-[10px]" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] truncate p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.name}
                          </div>
                        </div>
                      );
                    })}
                  {mediaList.filter((item) => item.name.toLowerCase().includes(mediaSearch.toLowerCase())).length === 0 && (
                    <div className="col-span-full py-16 text-center text-sm text-gray-500">
                      No matching media items found in library.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedMediaName) {
                    handleSelectMedia(selectedMediaName);
                  }
                }}
                disabled={!selectedMediaName}
                className="px-4 py-2 bg-[#2c6ecb] text-white text-sm font-medium rounded-lg hover:bg-[#1e5ab0] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Select Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminThemeEditor;
