import { useEffect, useState } from "react";
import { 
  HiOutlineMegaphone, HiOutlinePlus, HiOutlineArrowPath, 
  HiOutlineChartBar, HiOutlineCpuChip, HiOutlineShieldCheck, 
  HiOutlineUser, HiOutlineGlobeAlt, 
  HiOutlinePlay, HiOutlinePause, 
  HiOutlineTrash, HiOutlineSparkles, HiOutlineBookOpen,
  HiOutlineChevronRight
} from "react-icons/hi2";
import { FaFacebook } from "react-icons/fa";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";

// Interface for Pixel Log
interface PixelLog {
  id: string;
  event: string;
  data: any;
  timestamp: string;
  path: string;
}

// Interface for Campaign
interface AdCampaign {
  id: string;
  name: string;
  objective: string;
  status: "Active" | "Paused";
  budget: number;
  budgetType: "Daily" | "Lifetime";
  spend: number;
  reach: number;
  clicks: number;
  purchases: number;
  roas: number;
  productName: string;
  productImage: string;
  productPrice: number;
  targetInterests: string[];
}

const mockBusinessManagers = [
  { id: "bm_1", name: "Zarka Group Holding LLC (Primary)" },
  { id: "bm_2", name: "Zarka Couture Digital Agency" }
];

const mockAdAccounts = [
  { id: "act_92716382", name: "Zarka Couture PK Ads" },
  { id: "act_48261053", name: "Zarka Global Agency USD" }
];

const mockPages = [
  { id: "page_1092837", name: "Zarka Couture Official" },
  { id: "page_5819283", name: "Zarka Luxury Pret" }
];

const mockPixels = [
  { id: "123456789012345", name: "Zarka Master Web Pixel" },
  { id: "987654321098765", name: "Instagram Shop Pixel" }
];

const defaultCampaigns: AdCampaign[] = [
  {
    id: "camp_1",
    name: "RTW Summer Collection Sales",
    objective: "Conversions (Sales)",
    status: "Active",
    budget: 5000,
    budgetType: "Daily",
    spend: 45000,
    reach: 124000,
    clicks: 3480,
    purchases: 86,
    roas: 4.2,
    productName: "Summer Luxury Pret",
    productImage: "luxury fashion 7 1.png",
    productPrice: 12500,
    targetInterests: ["Fashion design", "Luxury goods", "Shopping"]
  },
  {
    id: "camp_2",
    name: "Bridals Couture Awareness Campaign",
    objective: "Traffic",
    status: "Active",
    budget: 15000,
    budgetType: "Lifetime",
    spend: 12000,
    reach: 85200,
    clicks: 4210,
    purchases: 12,
    roas: 1.8,
    productName: "Bridals & Formals",
    productImage: "banner1.jpg",
    productPrice: 185000,
    targetInterests: ["Weddings", "Bridal wear", "Pret-a-porter"]
  }
];

const AdminFacebookAds = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "campaigns" | "debugger">("dashboard");
  const [connected, setConnected] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: OAuth, 2: BM/AdAccount, 3: Page/Pixel, 4: Finish

  // Meta Credentials State
  const [selectedBM, setSelectedBM] = useState(mockBusinessManagers[0].id);
  const [selectedAdAccount, setSelectedAdAccount] = useState(mockAdAccounts[0].id);
  const [selectedPage, setSelectedPage] = useState(mockPages[0].id);
  const [selectedPixel, setSelectedPixel] = useState(mockPixels[0].id);
  const [dataSharing, setDataSharing] = useState<"Standard" | "Enhanced" | "Maximum">("Maximum");

  // Campaigns & Store Products
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showCreateAdForm, setShowCreateAdForm] = useState(false);
  const [isPublishingAd, setIsPublishingAd] = useState(false);
  const [publishingStep, setPublishingStep] = useState(0);

  // New Ad Form State
  const [adName, setAdName] = useState("");
  const [adObjective, setAdObjective] = useState("Conversions (Sales)");
  const [adBudgetType, setAdBudgetType] = useState<"Daily" | "Lifetime">("Daily");
  const [adBudget, setAdBudget] = useState(2000);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [adPrimaryText, setAdPrimaryText] = useState("Discover the brand new collection from Zarka Couture. Exquisite craftmanship, premium luxury, designed for your elegant moments.");
  const [adAudienceRegion, setAdAudienceRegion] = useState("Pakistan");
  const [adAudienceInterests, setAdAudienceInterests] = useState("Fashion, Shopping, Luxury lifestyle");
  const [previewPlatform, setPreviewPlatform] = useState<"facebook-mobile" | "facebook-desktop" | "instagram">("facebook-mobile");

  // Live Debugger State
  const [pixelLogs, setPixelLogs] = useState<PixelLog[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isSimulatingJourney, setIsSimulatingJourney] = useState(false);

  // Load configuration from local storage
  useEffect(() => {
    // 1. Connection settings
    const isMetaConnected = localStorage.getItem("meta_connected") === "true";
    setConnected(isMetaConnected);
    if (isMetaConnected) {
      setSelectedBM(localStorage.getItem("meta_bm") || mockBusinessManagers[0].id);
      setSelectedAdAccount(localStorage.getItem("meta_ad_account") || mockAdAccounts[0].id);
      setSelectedPage(localStorage.getItem("meta_page") || mockPages[0].id);
      setSelectedPixel(localStorage.getItem("meta_pixel") || mockPixels[0].id);
      setDataSharing((localStorage.getItem("meta_sharing") as any) || "Maximum");
    }

    // 2. Campaigns
    const storedCamps = localStorage.getItem("meta_campaigns");
    if (storedCamps) {
      setCampaigns(JSON.parse(storedCamps));
    } else {
      setCampaigns(defaultCampaigns);
      localStorage.setItem("meta_campaigns", JSON.stringify(defaultCampaigns));
    }

    // 3. Products
    const fetchProducts = async () => {
      try {
        const res = await customFetch.get("/products");
        if (Array.isArray(res.data)) {
          setProducts(res.data);
          if (res.data.length > 0) {
            setSelectedProductId(res.data[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to load products for catalog ad builder", e);
      }
    };
    fetchProducts();

    // 4. Debugger event listener
    const handlePixelEvent = (e: Event) => {
      const customEvent = e as CustomEvent<PixelLog>;
      setPixelLogs((prev) => [customEvent.detail, ...prev].slice(0, 100));
    };

    window.addEventListener("zarka-pixel-event", handlePixelEvent);

    // Initial load of logs from localStorage
    const savedLogs = localStorage.getItem("zarka_pixel_logs");
    if (savedLogs) {
      setPixelLogs(JSON.parse(savedLogs));
    }

    return () => {
      window.removeEventListener("zarka-pixel-event", handlePixelEvent);
    };
  }, []);

  const saveConnectionState = (isConnected: boolean) => {
    setConnected(isConnected);
    localStorage.setItem("meta_connected", String(isConnected));
    if (isConnected) {
      localStorage.setItem("meta_bm", selectedBM);
      localStorage.setItem("meta_ad_account", selectedAdAccount);
      localStorage.setItem("meta_page", selectedPage);
      localStorage.setItem("meta_pixel", selectedPixel);
      localStorage.setItem("meta_sharing", dataSharing);

      // Sync with Zarka SEO settings so Pixel is instantly active in HomeLayout storefront script injection!
      const seoStored = localStorage.getItem("zarka_seo_settings");
      const seoSettings = seoStored ? JSON.parse(seoStored) : {
        metaTitleTemplate: "{Page Title} | ZARKA COUTURE",
        defaultMetaDescription: "Premium luxury designer dresses, unstitched, ready to wear, bridals & jewellery. Free shipping nationwide.",
        gaTrackingId: "G-XXXXXXXXXX",
      };
      seoSettings.fbPixelId = selectedPixel;
      localStorage.setItem("zarka_seo_settings", JSON.stringify(seoSettings));
    } else {
      localStorage.removeItem("meta_bm");
      localStorage.removeItem("meta_ad_account");
      localStorage.removeItem("meta_page");
      localStorage.removeItem("meta_pixel");
      localStorage.removeItem("meta_sharing");

      // Disable/reset Pixel ID in SEO settings
      const seoStored = localStorage.getItem("zarka_seo_settings");
      if (seoStored) {
        const seoSettings = JSON.parse(seoStored);
        seoSettings.fbPixelId = "123456789012345"; // fallback/disabled placeholder
        localStorage.setItem("zarka_seo_settings", JSON.stringify(seoSettings));
      }
    }
  };

  const handleStartConnection = () => {
    setModalStep(1);
    setShowConnectModal(true);
  };

  const handleOAuthConnect = () => {
    setModalStep(2); // Proceed to BM & Ad account selection
    toast.success("Log in verified! Connecting to Facebook Business Account.");
  };

  const handleSaveAssets = () => {
    setModalStep(3); // Proceed to Page & Pixel selection
  };

  const handleFinishConnection = () => {
    saveConnectionState(true);
    setShowConnectModal(false);
    toast.success("Meta Ads & Pixel Channel connected successfully! Pixel is now tracking live.");
  };

  const handleDisconnect = () => {
    if (window.confirm("Are you sure you want to disconnect Meta Ads Manager and disable Facebook Pixel tracking?")) {
      saveConnectionState(false);
      toast.success("Disconnected from Meta Account.");
    }
  };

  const handleToggleCampaignStatus = (id: string) => {
    const updated = campaigns.map((camp) => {
      if (camp.id === id) {
        const newStatus = camp.status === "Active" ? "Paused" : "Active";
        toast.success(`Campaign "${camp.name}" is now ${newStatus.toLowerCase()}.`);
        return { ...camp, status: newStatus as "Active" | "Paused" };
      }
      return camp;
    });
    setCampaigns(updated);
    localStorage.setItem("meta_campaigns", JSON.stringify(updated));
  };

  const handleDeleteCampaign = (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      const updated = campaigns.filter((c) => c.id !== id);
      setCampaigns(updated);
      localStorage.setItem("meta_campaigns", JSON.stringify(updated));
      toast.success("Campaign deleted successfully.");
    }
  };

  const handlePublishCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adName.trim() || !selectedProductId) {
      toast.error("Please fill in the campaign name and select a product.");
      return;
    }

    const selectedProduct = products.find((p) => String(p.id) === String(selectedProductId));
    if (!selectedProduct) return;

    setIsPublishingAd(true);
    setPublishingStep(1);

    // Simulated publishing step timeline
    setTimeout(() => {
      setPublishingStep(2);
      setTimeout(() => {
        setPublishingStep(3);
        setTimeout(() => {
          setPublishingStep(4);
          setTimeout(() => {
            const newCampaign: AdCampaign = {
              id: "camp_" + Date.now(),
              name: adName,
              objective: adObjective,
              status: "Active",
              budget: adBudget,
              budgetType: adBudgetType,
              spend: 0,
              reach: 0,
              clicks: 0,
              purchases: 0,
              roas: 0,
              productName: selectedProduct.title,
              productImage: selectedProduct.image,
              productPrice: parseFloat(selectedProduct.price),
              targetInterests: adAudienceInterests.split(",").map((i) => i.trim())
            };

            const updated = [newCampaign, ...campaigns];
            setCampaigns(updated);
            localStorage.setItem("meta_campaigns", JSON.stringify(updated));

            setIsPublishingAd(false);
            setShowCreateAdForm(false);
            // Reset form
            setAdName("");
            setAdBudget(2000);
            setAdPrimaryText("Discover the brand new collection from Zarka Couture. Exquisite craftmanship, premium luxury, designed for your elegant moments.");
            setAdAudienceInterests("Fashion, Shopping, Luxury lifestyle");
            
            toast.success("Dynamic catalog campaign published successfully to Meta Ads Manager!");
            setActiveTab("campaigns");
          }, 1200);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  // Helper to simulate storefront customer journey and show events in debugger
  const handleSimulateJourney = () => {
    if (isSimulatingJourney) return;
    setIsSimulatingJourney(true);
    setActiveTab("debugger");
    toast.success("Simulating customer journey in a sandbox environment...");

    const mockProduct = products[0] || { id: "1", title: "Luxury Pret Summer Dress", price: 12000, category: "Ready to Wear" };

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Define pixel event dispatcher helper
    const fireSimulatedEvent = (eventName: string, data?: any) => {
      const path = eventName === "PageView" ? "/" :
                   eventName === "ViewContent" ? `/product/${mockProduct.id}` :
                   eventName === "AddToCart" ? `/product/${mockProduct.id}` :
                   eventName === "InitiateCheckout" ? "/checkout" : "/order-confirmation";

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newLog: PixelLog = {
        id: String(Date.now() + Math.random()),
        event: eventName,
        data: data || {},
        timestamp,
        path
      };

      setPixelLogs((prev) => [newLog, ...prev].slice(0, 100));
      // Save to localStorage too
      try {
        const existing = localStorage.getItem("zarka_pixel_logs");
        const logs = existing ? JSON.parse(existing) : [];
        logs.unshift(newLog);
        localStorage.setItem("zarka_pixel_logs", JSON.stringify(logs.slice(0, 100)));
      } catch (e) {}
    };

    // Run journey async
    (async () => {
      // 1. PageView (Home)
      fireSimulatedEvent("PageView");
      await delay(1500);

      // 2. ViewContent (Product Details)
      fireSimulatedEvent("ViewContent", {
        content_ids: [mockProduct.id],
        content_name: mockProduct.title,
        content_category: mockProduct.category || "Fashion",
        value: parseFloat(mockProduct.price),
        currency: "PKR",
        content_type: "product"
      });
      await delay(2000);

      // 3. AddToCart
      fireSimulatedEvent("AddToCart", {
        content_ids: [mockProduct.id],
        content_name: mockProduct.title,
        content_category: mockProduct.category || "Fashion",
        value: parseFloat(mockProduct.price),
        currency: "PKR",
        content_type: "product",
        quantity: 1
      });
      await delay(2000);

      // 4. InitiateCheckout
      fireSimulatedEvent("InitiateCheckout", {
        num_items: 1,
        value: parseFloat(mockProduct.price),
        currency: "PKR",
        contents: [{ id: mockProduct.id, quantity: 1, price: parseFloat(mockProduct.price) }]
      });
      await delay(2500);

      // 5. Purchase
      fireSimulatedEvent("Purchase", {
        content_ids: [mockProduct.id],
        value: parseFloat(mockProduct.price),
        currency: "PKR",
        num_items: 1,
        content_type: "product",
        contents: [{ id: mockProduct.id, quantity: 1, price: parseFloat(mockProduct.price) }]
      });

      setIsSimulatingJourney(false);
      toast.success("Customer journey simulation complete! All events recorded.");
    })();
  };

  const handleClearLogs = () => {
    localStorage.removeItem("zarka_pixel_logs");
    setPixelLogs([]);
    toast.success("Live Pixel logs cleared.");
  };

  // Find currently selected product for ad preview
  const currentAdProduct = products.find((p) => String(p.id) === String(selectedProductId)) || products[0];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e0e0e0] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#1877f2] text-white">
              <FaFacebook className="text-xl" />
            </span>
            <h1 className="text-xl font-bold text-[#202223]">Facebook &amp; Instagram Sales Channel</h1>
          </div>
          <p className="text-xs text-[#6d7175] mt-1">Connect Facebook Ads Manager, set up your conversion pixel, and publish catalog ads.</p>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <div className="flex items-center gap-2 bg-[#f1f8f5] text-[#008060] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#d3ecd8]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008060] animate-pulse" />
              Connected &amp; Tracking
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              Disconnected
            </div>
          )}
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "dashboard"
              ? "border-[#2c6ecb] text-[#2c6ecb]"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <HiOutlineShieldCheck className="text-lg" />
          Dashboard &amp; Settings
        </button>
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "campaigns"
              ? "border-[#2c6ecb] text-[#2c6ecb]"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <HiOutlineMegaphone className="text-lg" />
          Campaign Manager
        </button>
        <button
          onClick={() => setActiveTab("debugger")}
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "debugger"
              ? "border-[#2c6ecb] text-[#2c6ecb]"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <HiOutlineCpuChip className="text-lg" />
          Pixel Event Debugger
          {pixelLogs.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {pixelLogs.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: DASHBOARD & SETTINGS */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Connection Banner */}
            {!connected ? (
              <div className="bg-gradient-to-r from-[#1877f2]/10 to-[#8a3ab9]/10 border border-[#1877f2]/20 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 scale-150">
                  <FaFacebook size={250} />
                </div>
                <div className="max-w-xl space-y-4">
                  <span className="inline-flex items-center gap-1.5 bg-[#1877f2]/15 text-[#1877f2] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Meta Ads Sales Channel
                  </span>
                  <h2 className="text-xl font-bold text-[#202223] font-serif leading-tight">
                    Grow your store with automated Facebook &amp; Instagram Advertising
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Connect your Meta Ad Account and page to dynamically synchronize your product catalog, launch retargeting ads, and automatically track customer actions with Meta Pixel (Facebook Pixel) and Conversions API.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleStartConnection}
                      className="bg-[#1877f2] hover:bg-[#156cd4] text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-md transition-all flex items-center gap-2 hover:scale-[1.01]"
                    >
                      <FaFacebook className="text-lg" />
                      Connect Meta Account
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#e0e0e0] rounded-xl p-6 space-y-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#202223] border-b pb-3 uppercase tracking-wider flex items-center gap-2">
                  <HiOutlineShieldCheck className="text-lg text-green-600" />
                  Meta Integration Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Account detail columns */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-[#1877f2]">
                        <HiOutlineUser className="text-xl" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Meta Account</p>
                        <p className="text-sm font-semibold text-gray-800">RT International Admin</p>
                        <p className="text-xs text-gray-500">rt.admin@rt-international.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg text-[#8a3ab9]">
                        <HiOutlineGlobeAlt className="text-xl" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Connected Facebook Page</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {mockPages.find(p => p.id === selectedPage)?.name || "Zarka Couture"}
                        </p>
                        <p className="text-xs text-gray-500">ID: {selectedPage}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                        <HiOutlineChartBar className="text-xl" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Active Ad Account</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {mockAdAccounts.find(a => a.id === selectedAdAccount)?.name || "Zarka Couture PK Ads"}
                        </p>
                        <p className="text-xs text-gray-500">ID: {selectedAdAccount}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <HiOutlineShieldCheck className="text-xl" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Meta Web Pixel ID</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {mockPixels.find(p => p.id === selectedPixel)?.name || "Zarka Master Web Pixel"}
                        </p>
                        <p className="text-xs font-mono text-gray-500">{selectedPixel}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-5 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Connected Business Manager: <span className="font-semibold text-gray-700">{mockBusinessManagers.find(bm => bm.id === selectedBM)?.name}</span>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Disconnect Meta Account
                  </button>
                </div>
              </div>
            )}

            {/* Conversions API / Pixel Data Sharing Settings */}
            <div className="bg-white border border-[#e0e0e0] rounded-xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#202223] uppercase tracking-wider flex items-center gap-2">
                    <HiOutlineShieldCheck className="text-lg text-[#1877f2]" />
                    Customer Data Sharing settings
                  </h3>
                  <p className="text-xs text-[#6d7175] mt-0.5">Control how pixel data is sent to Meta servers.</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Conversions API (CAPI) Active
                </span>
              </div>

              {/* Data Sharing Level Selector */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Standard */}
                <div 
                  onClick={() => connected && setDataSharing("Standard")}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    !connected ? "opacity-60 cursor-not-allowed" : ""
                  } ${
                    dataSharing === "Standard" 
                      ? "border-blue-500 bg-blue-50/20 shadow-sm" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-800">Standard</span>
                    <input 
                      type="radio" 
                      disabled={!connected}
                      checked={dataSharing === "Standard"} 
                      onChange={() => {}}
                      className="text-blue-600" 
                    />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Uses only browser-based Facebook Pixel tracking. Blocked by ad-blockers and Safari ITP.
                  </p>
                </div>

                {/* Enhanced */}
                <div 
                  onClick={() => connected && setDataSharing("Enhanced")}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    !connected ? "opacity-60 cursor-not-allowed" : ""
                  } ${
                    dataSharing === "Enhanced" 
                      ? "border-blue-500 bg-blue-50/20 shadow-sm" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-800">Enhanced</span>
                    <input 
                      type="radio" 
                      disabled={!connected}
                      checked={dataSharing === "Enhanced"} 
                      onChange={() => {}}
                      className="text-blue-600" 
                    />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Combines browser pixel with basic server-side Conversions API logs to capture up to 85% of events.
                  </p>
                </div>

                {/* Maximum */}
                <div 
                  onClick={() => connected && setDataSharing("Maximum")}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    !connected ? "opacity-60 cursor-not-allowed" : ""
                  } ${
                    dataSharing === "Maximum" 
                      ? "border-blue-500 bg-blue-50/20 shadow-sm" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                      Maximum
                      <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1 rounded">Shopify standard</span>
                    </span>
                    <input 
                      type="radio" 
                      disabled={!connected}
                      checked={dataSharing === "Maximum"} 
                      onChange={() => {}}
                      className="text-blue-600" 
                    />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Uses Facebook Advanced Matching. Sends secure customer identifiers (hashed email/phone) server-to-server to capture 99% of events and maximize ROAS.
                  </p>
                </div>
              </div>

              {connected && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-xs text-amber-800">
                  <HiOutlineSparkles className="text-lg flex-shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-bold">Recommendation:</span> Keeping your sharing level at <span className="font-bold">Maximum</span> provides the Meta algorithms with superior event deduplication and matching parameters, lowering your Cost-per-Acquisition (CPA) by up to 22%.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information & Help */}
          <div className="space-y-6">
            {/* Quick Stats Summary */}
            {connected && (
              <div className="bg-white border border-[#e0e0e0] rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pixel Health Monitor</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    Active Pixel Status
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-700">{selectedPixel}</span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Match Quality Score</span>
                  <span className="font-semibold text-green-600 flex items-center gap-0.5">
                    Excellent (9.2/10)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Total Pixel events (24h)</span>
                  <span className="font-semibold text-gray-800">1,248 events</span>
                </div>
                <button
                  onClick={handleSimulateJourney}
                  className="w-full bg-[#1877f2]/10 hover:bg-[#1877f2]/15 text-[#1877f2] text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <HiOutlinePlay className="text-base" />
                  Simulate E-Commerce Journey
                </button>
              </div>
            )}

            {/* Knowledge Base */}
            <div className="bg-white border border-[#e0e0e0] rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <HiOutlineBookOpen className="text-base text-gray-500" />
                Meta Ads Best Practices
              </h4>
              <ul className="space-y-3 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong className="text-gray-800">Catalogs Sync:</strong> Keep your product collection inventory and images synchronized in Meta Commerce Manager for dynamic ads.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong className="text-gray-800">Advanced Matching:</strong> Make sure customers fill out email and phone fields on Checkout to allow Meta to connect browsers to users.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong className="text-gray-800">ROAS Tracking:</strong> Define campaign budgets according to product profit margins to hit at least 3x positive ROAS.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CAMPAIGN MANAGER */}
      {activeTab === "campaigns" && (
        <div className="space-y-6">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-gray-400">Total Spend</p>
              <h4 className="text-lg font-bold text-gray-800 mt-1">Rs.57,000</h4>
              <p className="text-[10px] text-green-600 mt-1 flex items-center gap-0.5">
                <span>+12.4% vs last week</span>
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-gray-400">Reach</p>
              <h4 className="text-lg font-bold text-gray-800 mt-1">209.2K</h4>
              <p className="text-[10px] text-green-600 mt-1">People targeted</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-gray-400">Link Clicks</p>
              <h4 className="text-lg font-bold text-gray-800 mt-1">7,690</h4>
              <p className="text-[10px] text-gray-500 mt-1">Average CPC: Rs.7.4</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-gray-400">CTR (Link)</p>
              <h4 className="text-lg font-bold text-gray-800 mt-1">3.68%</h4>
              <p className="text-[10px] text-green-600 mt-1">Excellent performance</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-gray-400">Purchases</p>
              <h4 className="text-lg font-bold text-green-700 mt-1">98</h4>
              <p className="text-[10px] text-gray-500 mt-1">Cost/purchase: Rs.580</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-gray-400">Account ROAS</p>
              <h4 className="text-lg font-bold text-blue-700 mt-1">3.72x</h4>
              <p className="text-[10px] text-green-600 mt-1">Meta Ads standard</p>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#202223] uppercase tracking-wider">Ad Campaigns</h3>
              <p className="text-xs text-[#6d7175] mt-0.5">Create catalog-driven campaigns synced directly to Facebook Ads Manager.</p>
            </div>
            {connected && !showCreateAdForm && (
              <button
                onClick={() => setShowCreateAdForm(true)}
                className="bg-[#008060] hover:bg-[#006e52] text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <HiOutlinePlus className="text-base" />
                Create Catalog Ad
              </button>
            )}
          </div>

          {/* Create Campaign Panel */}
          {showCreateAdForm && connected && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column: Form */}
              <form onSubmit={handlePublishCampaign} className="p-6 border-r border-gray-100 space-y-5">
                <div className="flex items-center justify-between border-b pb-3 mb-2">
                  <h3 className="text-base font-bold text-gray-800">New Meta Catalog Campaign</h3>
                  <button 
                    type="button"
                    onClick={() => setShowCreateAdForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                      Campaign Name
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Summer Collection RTW conversions" 
                      value={adName}
                      onChange={(e) => setAdName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Campaign Objective
                      </label>
                      <select 
                        value={adObjective}
                        onChange={(e) => setAdObjective(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="Conversions (Sales)">Conversions (Sales)</option>
                        <option value="Traffic">Traffic</option>
                        <option value="Leads">Leads</option>
                        <option value="Brand Awareness">Brand Awareness</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Catalog Product Focus
                      </label>
                      <select 
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} - Rs.{p.price}
                          </option>
                        ))}
                        {products.length === 0 && (
                          <option value="">No products found</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Budget Type
                      </label>
                      <select 
                        value={adBudgetType}
                        onChange={(e) => setAdBudgetType(e.target.value as any)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="Daily">Daily Budget</option>
                        <option value="Lifetime">Lifetime Budget</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Amount (Rs.)
                      </label>
                      <input 
                        type="number" 
                        required
                        value={adBudget}
                        onChange={(e) => setAdBudget(Number(e.target.value))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                      Ad Primary Copy
                    </label>
                    <textarea 
                      rows={3}
                      value={adPrimaryText}
                      onChange={(e) => setAdPrimaryText(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Target Location
                      </label>
                      <input 
                        type="text" 
                        value={adAudienceRegion}
                        onChange={(e) => setAdAudienceRegion(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Detailed Targeting (Interests)
                      </label>
                      <input 
                        type="text" 
                        value={adAudienceInterests}
                        onChange={(e) => setAdAudienceInterests(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="submit"
                    className="bg-[#1877f2] hover:bg-[#156cd4] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center gap-2"
                  >
                    Publish to Meta Ads Manager
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowCreateAdForm(false)}
                    className="border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* Right Column: Live Placement Preview */}
              <div className="bg-gray-50 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Placement Live Preview</h4>
                    <div className="flex bg-gray-200 p-0.5 rounded-lg text-[10px] font-semibold text-gray-600">
                      <button 
                        onClick={() => setPreviewPlatform("facebook-mobile")}
                        className={`px-2 py-1 rounded ${previewPlatform === "facebook-mobile" ? "bg-white text-[#1877f2] shadow" : ""}`}
                      >
                        FB Mobile
                      </button>
                      <button 
                        onClick={() => setPreviewPlatform("facebook-desktop")}
                        className={`px-2 py-1 rounded ${previewPlatform === "facebook-desktop" ? "bg-white text-[#1877f2] shadow" : ""}`}
                      >
                        FB Desktop
                      </button>
                      <button 
                        onClick={() => setPreviewPlatform("instagram")}
                        className={`px-2 py-1 rounded ${previewPlatform === "instagram" ? "bg-white text-[#8a3ab9] shadow" : ""}`}
                      >
                        Instagram Feed
                      </button>
                    </div>
                  </div>

                  {/* Visual Render Card */}
                  {currentAdProduct ? (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-sm mx-auto">
                      {/* Ad Header */}
                      <div className="p-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1877f2]/10 border flex items-center justify-center font-bold text-[#1877f2] text-xs font-serif">
                          Z
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-gray-800">Zarka Couture</h5>
                          <span className="text-[9px] text-gray-400 flex items-center gap-1">
                            Sponsored • {previewPlatform === "instagram" ? "Instagram" : "Facebook"}
                          </span>
                        </div>
                      </div>

                      {/* Primary Text */}
                      <p className="px-3 pb-3 text-[11px] text-gray-700 leading-relaxed">
                        {adPrimaryText}
                      </p>

                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden border-y border-gray-100">
                        {currentAdProduct.image ? (
                          <img 
                            src={
                              currentAdProduct.image.startsWith("http") 
                                ? currentAdProduct.image 
                                : `/assets/${currentAdProduct.image}`
                            } 
                            alt={currentAdProduct.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <HiOutlineMegaphone size={50} className="text-gray-300" />
                        )}
                        
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          Catalog Ad
                        </div>
                      </div>

                      {/* Ad Footer Bar */}
                      <div className="p-3 bg-gray-50 flex items-center justify-between border-t border-gray-100">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase tracking-wider text-gray-400">zarkaboutique.com</span>
                          <h6 className="text-[11px] font-bold text-gray-800 truncate max-w-[200px]">
                            {currentAdProduct.title}
                          </h6>
                          <p className="text-xs font-bold text-[#008060]">
                            Rs.{Number(currentAdProduct.price).toLocaleString()}
                          </p>
                        </div>
                        <button 
                          type="button"
                          className="bg-gray-200 hover:bg-gray-300 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded text-gray-700 transition-colors"
                        >
                          Shop Now
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 text-gray-400 text-xs">
                      Select a product to view the dynamically generated ad placement creative preview.
                    </div>
                  )}
                </div>

                <div className="mt-4 text-[10px] text-gray-400 flex items-start gap-1">
                  <HiOutlineSparkles className="text-sm flex-shrink-0 text-blue-500 mt-0.5" />
                  <span>
                    This preview is generated dynamically from your store catalog. When published, Meta will display this product (or a multi-product carousel) tailored to users matching your interests selection.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Publishing Loading Screen Modal overlay */}
          {isPublishingAd && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1877f2] flex items-center justify-center mx-auto border border-blue-100">
                  <HiOutlineArrowPath className="text-3xl animate-spin" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-800">Publishing Campaign to Meta</h3>
                  <p className="text-xs text-gray-400">Synchronizing assets and settings with Meta Ads Manager API.</p>
                </div>

                <div className="text-left space-y-2 max-w-xs mx-auto border border-gray-100 p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">1. Verifying ad account credentials</span>
                    <span className="font-bold text-green-600">✓ Done</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">2. Syncing product catalog metadata</span>
                    <span className={publishingStep >= 2 ? "font-bold text-green-600" : "font-bold text-gray-300"}>
                      {publishingStep >= 2 ? "✓ Done" : "Processing..."}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">3. Creating Ad Creative & preview assets</span>
                    <span className={publishingStep >= 3 ? "font-bold text-green-600" : "font-bold text-gray-300"}>
                      {publishingStep >= 3 ? "✓ Done" : publishingStep === 2 ? "Processing..." : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">4. Registering tracking pixel triggers</span>
                    <span className={publishingStep >= 4 ? "font-bold text-green-600" : "font-bold text-gray-300"}>
                      {publishingStep >= 4 ? "✓ Done" : publishingStep === 3 ? "Processing..." : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Listing */}
          <div className="bg-white border border-[#e0e0e0] rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-[#e0e0e0] bg-[#fafafa]">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Active Ad Accounts Campaign Registry</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[#e0e0e0] bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-5">Campaign</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Objective</th>
                    <th className="py-3 px-5 text-right">Spend (Rs.)</th>
                    <th className="py-3 px-5 text-right">Budget (Rs.)</th>
                    <th className="py-3 px-5 text-right">Link Clicks</th>
                    <th className="py-3 px-5 text-right">Purchases</th>
                    <th className="py-3 px-5 text-right text-blue-700">ROAS</th>
                    <th className="py-3 px-5 text-right w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-t border-[#e0e0e0] hover:bg-gray-50/50 transition-colors">
                      {/* Name */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded border overflow-hidden bg-gray-100 flex-shrink-0">
                            {c.productImage ? (
                              <img 
                                src={c.productImage.startsWith("http") ? c.productImage : `/assets/${c.productImage}`} 
                                alt={c.productName} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <HiOutlineMegaphone className="w-full h-full p-2 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-[#202223] text-xs block leading-normal">{c.name}</span>
                            <span className="text-[10px] text-gray-400">Target product: {c.productName}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => handleToggleCampaignStatus(c.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors border ${
                            c.status === "Active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-50 text-gray-400 border-gray-200"
                          }`}
                          title="Toggle Campaign Status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${c.status === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
                          {c.status}
                        </button>
                      </td>

                      {/* Objective */}
                      <td className="py-4 px-5 text-xs text-gray-500">{c.objective}</td>

                      {/* Spend */}
                      <td className="py-4 px-5 text-right font-medium text-gray-700 text-xs">
                        Rs.{c.spend.toLocaleString()}
                      </td>

                      {/* Budget */}
                      <td className="py-4 px-5 text-right font-medium text-gray-700 text-xs">
                        <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider">{c.budgetType}</span>
                        Rs.{c.budget.toLocaleString()}
                      </td>

                      {/* Clicks */}
                      <td className="py-4 px-5 text-right text-gray-500 text-xs">{c.clicks.toLocaleString()}</td>

                      {/* Purchases */}
                      <td className="py-4 px-5 text-right text-green-700 font-bold text-xs">{c.purchases.toLocaleString()}</td>

                      {/* ROAS */}
                      <td className="py-4 px-5 text-right text-blue-700 font-bold text-xs">
                        {c.roas > 0 ? `${c.roas}x` : "-"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleCampaignStatus(c.id)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"
                            title={c.status === "Active" ? "Pause Campaign" : "Resume Campaign"}
                          >
                            {c.status === "Active" ? <HiOutlinePause className="text-base" /> : <HiOutlinePlay className="text-base" />}
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(c.id)}
                            className="p-1.5 hover:bg-red-50 rounded text-red-500 transition-colors"
                            title="Delete Campaign"
                          >
                            <HiOutlineTrash className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {campaigns.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-xs text-gray-400">
                        No campaigns found. Connect your Meta Ad Account and click &quot;Create Catalog Ad&quot; to launch your first retargeting campaign.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PIXEL EVENT DEBUGGER */}
      {activeTab === "debugger" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e0e0e0] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#202223] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  Live Event Monitor sandbox
                </h3>
                <p className="text-xs text-[#6d7175] mt-0.5">Displays real-time logs of customer activities tracking on your store.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateJourney}
                  disabled={isSimulatingJourney}
                  className="bg-[#1877f2] hover:bg-[#156cd4] disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  <HiOutlinePlay className="text-base" />
                  {isSimulatingJourney ? "Simulating Journey..." : "Simulate Customer Journey"}
                </button>
                <button
                  onClick={handleClearLogs}
                  className="border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="space-y-4">
              {pixelLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors overflow-hidden"
                >
                  {/* Event Summary Bar */}
                  <div 
                    onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      {/* Event badge color */}
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        log.event === "PageView" ? "bg-gray-200 text-gray-700" :
                        log.event === "ViewContent" ? "bg-blue-100 text-blue-800" :
                        log.event === "AddToCart" ? "bg-amber-100 text-amber-800" :
                        log.event === "InitiateCheckout" ? "bg-purple-100 text-purple-800" :
                        log.event === "Purchase" ? "bg-green-100 text-green-800" :
                        "bg-teal-100 text-teal-800"
                      }`}>
                        {log.event}
                      </span>
                      
                      <div className="text-xs">
                        <span className="font-semibold text-gray-700">{log.path}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{log.timestamp}</span>
                      <HiOutlineChevronRight className={`transform transition-transform text-gray-500 font-bold ${
                        expandedLogId === log.id ? "rotate-90" : ""
                      }`} />
                    </div>
                  </div>

                  {/* Expanded JSON details */}
                  {expandedLogId === log.id && (
                    <div className="bg-gray-950 text-emerald-400 font-mono text-[11px] p-4 border-t border-gray-100 overflow-x-auto leading-relaxed max-h-60">
                      <pre>{JSON.stringify(log.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}

              {pixelLogs.length === 0 && (
                <div className="text-center py-12 border border-dashed rounded-xl bg-gray-50">
                  <HiOutlineCpuChip className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-xs text-gray-500">No events captured yet.</p>
                  <p className="text-[10px] text-gray-400 mt-1">Browse the store in another tab, or click &quot;Simulate Customer Journey&quot; above to watch events fire in real time!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONNECTION WIZARD MODAL */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-xl w-full flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#1877f2] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaFacebook className="text-xl" />
                <span className="font-bold text-sm">Meta Business Integration</span>
              </div>
              <button 
                onClick={() => setShowConnectModal(false)}
                className="text-white/80 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 space-y-6">
              {/* STEP 1: LOGIN OAUTH */}
              {modalStep === 1 && (
                <div className="text-center space-y-6 py-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1877f2] flex items-center justify-center mx-auto border border-blue-100">
                    <FaFacebook className="text-3xl" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-gray-800">Log in to Facebook</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                      Zarka Couture needs permissions to manage your campaigns, catalog products, and receive pixel signals from your store.
                    </p>
                  </div>
                  <button
                    onClick={handleOAuthConnect}
                    className="bg-[#1877f2] hover:bg-[#156cd4] text-white text-xs font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto w-full max-w-xs transition-colors"
                  >
                    Continue as RT International
                  </button>
                </div>
              )}

              {/* STEP 2: BUSINESS MANAGER & AD ACCOUNT SELECT */}
              {modalStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-gray-800">Select Business Assets</h3>
                    <p className="text-xs text-gray-400">Choose the Business Manager and Ad Account to link with your store.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Business Manager
                      </label>
                      <select
                        value={selectedBM}
                        onChange={(e) => setSelectedBM(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                      >
                        {mockBusinessManagers.map((bm) => (
                          <option key={bm.id} value={bm.id}>{bm.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Meta Ad Account
                      </label>
                      <select
                        value={selectedAdAccount}
                        onChange={(e) => setSelectedAdAccount(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                      >
                        {mockAdAccounts.map((act) => (
                          <option key={act.id} value={act.id}>{act.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <button
                      onClick={handleSaveAssets}
                      className="bg-[#1877f2] hover:bg-[#156cd4] text-white text-xs font-semibold px-6 py-2.5 rounded-lg"
                    >
                      Next: Connect Page &amp; Pixel
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: FB PAGE & PIXEL SELECT */}
              {modalStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-gray-800">Connect Facebook Page &amp; Pixel</h3>
                    <p className="text-xs text-gray-400">Select which storefront page and tracking pixel should be activated.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Facebook Page
                      </label>
                      <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                      >
                        {mockPages.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Facebook Pixel ID
                      </label>
                      <select
                        value={selectedPixel}
                        onChange={(e) => setSelectedPixel(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                      >
                        {mockPixels.map((px) => (
                          <option key={px.id} value={px.id}>{px.name} ({px.id})</option>
                        ))}
                      </select>
                      <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        <HiOutlinePlus className="text-xs text-blue-500" />
                        <span>Can&apos;t find your Pixel? Meta will automatically generate a new pixel during connection.</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <button
                      onClick={handleFinishConnection}
                      className="bg-[#1877f2] hover:bg-[#156cd4] text-white text-xs font-semibold px-6 py-2.5 rounded-lg"
                    >
                      Complete Connection Setup
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFacebookAds;
