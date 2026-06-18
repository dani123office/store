import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import {
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineArrowUpTray,
  HiOutlineComputerDesktop,
  HiOutlineDevicePhoneMobile,
  HiOutlineArrowPath,
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
};

const AdminThemeEditor = () => {
  const [store, setStore] = useState<any>(null);
  const [settings, setSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "announcement" | "slideshow" | "collections" | "whatsapp" | "installments">("general");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [categories, setCategories] = useState<{ id: number; cat_title: string }[]>([]);

  // Simulated active slideshow index in preview
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);

  useEffect(() => {
    // Auto-migrate database table when loading Theme Editor
    const runMigration = async () => {
      try {
        await customFetch.get("/db-migrate-custom");
      } catch (e) {
        console.error("Migration failed or route not active yet", e);
      }
    };

    const fetchData = async () => {
      await runMigration();
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

  // Set interval to rotate preview slideshow
  useEffect(() => {
    if (settings.slides.length <= 1) return;
    const interval = setInterval(() => {
      setPreviewSlideIdx((prev) => (prev + 1) % settings.slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [settings.slides]);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    const uploadToast = toast.loading("Uploading image...");
    try {
      const res = await customFetch.post("/upload", fd);
      if (res.data && res.data.filename) {
        setSettings((prev) => ({
          ...prev,
          slides: prev.slides.map((s) =>
            s.id === slideId ? { ...s, image: res.data.filename } : s
          ),
        }));
        toast.success("Image uploaded successfully!", { id: uploadToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed", { id: uploadToast });
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
    setPreviewSlideIdx(settings.slides.length);
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
    setPreviewSlideIdx(0);
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

  const activeSlide = settings.slides[previewSlideIdx] || settings.slides[0] || null;

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] -m-6 overflow-hidden">
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
          <div className="flex border-b border-[#e0e0e0] text-xs font-medium text-[#6d7175] overflow-x-auto bg-[#fafbfb] shrink-0">
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
              onClick={() => setActiveTab("installments")}
              className={`px-4 py-3 border-b-2 whitespace-nowrap ${activeTab === "installments" ? "border-[#2c6ecb] text-[#2c6ecb] bg-white font-semibold" : "border-transparent hover:text-[#202223]"}`}
            >
              Installments
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
                      onFocus={() => setPreviewSlideIdx(index)}
                      onClick={() => setPreviewSlideIdx(index)}
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
                            {/* Upload trigger */}
                            <label className="flex items-center justify-center gap-1 cursor-pointer bg-white border border-[#e0e0e0] rounded px-2 py-1 text-[10px] font-semibold text-[#6d7175] hover:bg-gray-50 transition-colors">
                              <HiOutlineArrowUpTray className="text-xs" /> Upload Custom Image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, slide.id)}
                                className="hidden"
                              />
                            </label>
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
                          <option value="all">Show All</option>
                          <option value="new-arrivals">new-arrivals</option>
                          <option value="unstitched">unstitched</option>
                          <option value="ready-to-wear">ready-to-wear</option>
                          <option value="bridals">bridals</option>
                          <option value="jewellery">jewellery</option>
                          <option value="special-prices">special-prices</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.cat_title.toLowerCase().replace(/\s+/g, "-")}>
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

            {/* 6. Installments Payments Indicator */}
            {activeTab === "installments" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#202223] border-b pb-2">Baadmay Installments Indicator</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inst_enabled"
                    checked={settings.installments.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        installments: { ...settings.installments, enabled: e.target.checked },
                      })
                    }
                    className="rounded text-[#2c6ecb] focus:ring-[#2c6ecb] border-[#e0e0e0]"
                  />
                  <label htmlFor="inst_enabled" className="text-xs font-medium text-[#202223] cursor-pointer">
                    Enable Installment indicator on Product Pages
                  </label>
                </div>

                {settings.installments.enabled && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#202223] mb-1">Payment Provider Brand</label>
                      <select
                        value={settings.installments.provider}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            installments: { ...settings.installments, provider: e.target.value },
                          })
                        }
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none bg-white"
                      >
                        <option value="baadmay">Baadmay (Pay in 3 Installments)</option>
                        <option value="alfa-mall">Alfa Mall</option>
                        <option value="kalpay">Kalpay</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#202223] mb-1">Installments Duration (Months)</label>
                      <input
                        type="number"
                        min={2}
                        max={12}
                        value={settings.installments.count}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            installments: { ...settings.installments, count: parseInt(e.target.value) || 3 },
                          })
                        }
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb]"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Simulated Live Preview */}
        <div className="flex-1 flex justify-center items-center p-8 overflow-y-auto">
          <div
            className={`bg-white shadow-2xl transition-all border border-[#e2e2e2] duration-300 relative flex flex-col ${
              previewMode === "desktop" ? "w-full max-w-4xl aspect-[16/10]" : "w-[360px] h-[640px]"
            } overflow-y-auto rounded-lg`}
          >
            {/* Simulation Header */}
            <div className="bg-[#f0f0f1] px-4 py-2 border-b border-[#e2e2e2] flex items-center gap-2 shrink-0">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              <span className="text-[10px] text-gray-500 font-mono ml-4 truncate">
                http://www.yourstore.com/
              </span>
            </div>

            {/* Announcement bar preview */}
            {settings.announcement.enabled && (
              <div
                style={{
                  backgroundColor: settings.announcement.bg_color,
                  color: settings.announcement.text_color,
                }}
                className="text-center py-2 text-[10px] tracking-wider uppercase select-none font-semibold shrink-0 transition-all"
              >
                {settings.announcement.text || "Announcement message..."}
              </div>
            )}

            {/* Simulated Navigation Header */}
            <div className="border-b border-[#E2E2E2] py-3 px-4 bg-white shrink-0 flex items-center justify-between gap-2">
              <div className="font-serif text-[10px] sm:text-xs font-bold tracking-widest shrink-0 uppercase truncate max-w-[120px]">
                {settings.logo_text || "ZARKA COUTURE"}
              </div>
              <nav className="hidden md:flex items-center gap-x-2 text-[8px] font-medium tracking-tighter text-[#151515]/80 uppercase font-sans shrink-0">
                <span>NEW ARRIVALS</span>
                <span>UNSTITCHED</span>
                <span>READY TO WEAR</span>
                <span>BRIDALS</span>
              </nav>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-600 shrink-0">
                <span>🔍</span>
                <span>👤</span>
                <span>👜 (0)</span>
              </div>
            </div>

            {/* Simulated Banner Slideshow */}
            {activeSlide && (
              <div className="relative flex-1 min-h-[300px] flex flex-col justify-end pb-8 px-8 overflow-hidden select-none bg-gray-150">
                <img
                  src={
                    activeSlide.image.startsWith("http") || activeSlide.image.startsWith("/")
                      ? activeSlide.image
                      : `/assets/${activeSlide.image}`
                  }
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.8] transition-all duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/banner1.jpg";
                  }}
                />
                <div className="relative z-10 text-center text-white space-y-1">
                  <h4 className="text-[10px] tracking-[0.2em] font-sans font-light text-white/90">
                    {activeSlide.subtitle}
                  </h4>
                  <h2 className="text-xl md:text-3xl font-light tracking-[0.15em] font-serif uppercase">
                    {activeSlide.title}
                  </h2>
                  <div className="pt-2">
                    <button className="bg-white text-black px-6 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-white/80 transition-all">
                      {activeSlide.btn_text}
                    </button>
                  </div>
                </div>

                {/* Slideshow dots */}
                {settings.slides.length > 1 && (
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {settings.slides.map((_, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          i === previewSlideIdx ? "bg-white scale-125" : "bg-white/50"
                        }`}
                      ></span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Simulated Collections section */}
            {settings.featured_collections.enabled && (
              <div className="py-6 px-4 bg-white text-center shrink-0">
                <h3 className="text-xs font-serif tracking-[0.2em] uppercase mb-4 text-[#151515]">
                  {settings.featured_collections.title}
                </h3>
                <div className="flex justify-center gap-4 border-b border-gray-100 pb-2 mb-4 text-[9px] text-gray-500 uppercase overflow-x-auto">
                  {settings.featured_collections.tabs.map((tab, idx) => (
                    <span
                      key={idx}
                      className={`pb-1 cursor-pointer font-medium tracking-wider whitespace-nowrap ${
                        idx === 0 ? "border-b border-black text-black font-semibold" : ""
                      }`}
                    >
                      {tab.label}
                    </span>
                  ))}
                </div>
                {/* Simulated product items */}
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-left space-y-1">
                      <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
                        <img
                          src={`/assets/product image ${i}.jpg`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assets/luxury category 1.png";
                          }}
                        />
                      </div>
                      <div className="text-[8px] font-bold truncate">Premium Collection Wear</div>
                      <div className="text-[8px] text-gray-600">Rs.4,500</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simulated WhatsApp Floating Widget */}
            {settings.whatsapp.enabled && (
              <div
                className={`absolute ${
                  settings.whatsapp.position === "bottom-right" ? "right-4" : "left-4"
                } bottom-4 z-20 bg-[#25d366] text-white p-2.5 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#20ba5a] transition-all`}
                title="Simulated WhatsApp button"
              >
                {/* WhatsApp logo */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 2c-5.514 0-10 4.486-10 10 0 1.767.46 3.427 1.267 4.887L2 22l5.312-1.393c1.408.767 3.003 1.2 4.719 1.2 5.514 0 10-4.486 10-10s-4.486-10-10-10zm.067 18.067c-1.59 0-3.093-.413-4.407-1.127l-.316-.173-3.279.86.877-3.193-.19-.306c-.767-1.247-1.173-2.693-1.173-4.193 0-4.413 3.587-8 8-8s8 3.587 8 8-3.587 8-8 8z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminThemeEditor;
