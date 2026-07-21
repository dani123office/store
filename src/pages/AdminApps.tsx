import { useEffect, useState } from "react";
import { HiCheck, HiOutlineSquare3Stack3D, HiOutlineArrowUpRight, HiPlus, HiXMark, HiTrash } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import customFetch from "../axios/custom";

interface AppItem {
  id: string | number;
  name: string;
  category: string;
  description: string;
  installed?: boolean;
  developer: string;
  link?: string;
}

const AdminApps = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [storeId, setStoreId] = useState<string>("");
  const [installedAppIds, setInstalledAppIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState("All");

  // Custom App Modal States
  const [showModal, setShowModal] = useState(false);
  const [appName, setAppName] = useState("");
  const [appCat, setAppCat] = useState("Marketing");
  const [appDev, setAppDev] = useState("");
  const [appDesc, setAppDesc] = useState("");
  const [appLink, setAppLink] = useState("");
  const [savingApp, setSavingApp] = useState(false);

  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch available apps from DB
      const appsRes = await customFetch.get("/apps-list");
      const dbApps = Array.isArray(appsRes.data) ? appsRes.data : [];

      // 2. Fetch store config to find installed apps
      const storeRes = await customFetch.get("/stores");
      let installedIds: string[] = [];
      if (storeRes.data && storeRes.data.length > 0) {
        const store = storeRes.data[0];
        setStoreId(store.id || "1");
        const installedStr = store.installed_apps || "";
        installedIds = installedStr.split(",").map((s: string) => s.trim()).filter(Boolean);
        setInstalledAppIds(installedIds);
      }

      // Map install status to apps list
      const mappedApps = dbApps.map((app: any) => ({
        ...app,
        installed: installedIds.includes(String(app.id))
      }));

      const fbApp: AppItem = {
        id: "fb_sales_channel",
        name: "Facebook & Instagram Sales Channel",
        category: "Marketing",
        description: "Connect Facebook Ads Manager, set up your conversion pixel, and publish catalog ads.",
        installed: installedIds.includes("fb_sales_channel"),
        developer: "Meta & Zarka",
        link: "/admin/facebook-ads"
      };

      setApps([fbApp, ...mappedApps]);
    } catch (e) {
      console.error("Failed to load Apps Directory data", e);
      toast.error("Failed to load Apps Directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleInstall = async (appId: string | number) => {
    const stringId = String(appId);
    let nextInstalledIds = [...installedAppIds];
    const isCurrentlyInstalled = nextInstalledIds.includes(stringId);
    const targetApp = apps.find(a => String(a.id) === stringId);

    if (isCurrentlyInstalled) {
      nextInstalledIds = nextInstalledIds.filter(id => id !== stringId);
      toast.success(`${targetApp?.name || "App"} uninstalled successfully`);
    } else {
      nextInstalledIds.push(stringId);
      toast.success(`${targetApp?.name || "App"} installed successfully!`);
      // Special redirection for Pixel conversion tool
      if (stringId === "5" || targetApp?.name === "Pixel Conversion Booster") {
        setTimeout(() => {
          navigate("/admin/preferences");
        }, 1000);
      } else if (stringId === "fb_sales_channel" || targetApp?.name === "Facebook & Instagram Sales Channel") {
        setTimeout(() => {
          navigate("/admin/facebook-ads");
        }, 1000);
      }
    }

    setInstalledAppIds(nextInstalledIds);
    setApps(prev => prev.map(app => ({
      ...app,
      installed: nextInstalledIds.includes(String(app.id))
    })));

    try {
      const csv = nextInstalledIds.join(",");
      await customFetch.post("/stores", {
        id: storeId,
        installed_apps: csv
      });
    } catch (e) {
      console.error("Failed to sync installed app state to database", e);
      toast.error("Failed to save changes to store database");
    }
  };

  const handleOpenDetails = (app: AppItem) => {
    if (app.link) {
      navigate(app.link);
    } else if (String(app.id) === "5" || app.name === "Pixel Conversion Booster") {
      navigate("/admin/preferences");
    } else {
      toast(`App "${app.name}" is working in background. Configure settings inside store settings.`);
    }
  };

  const handleRegisterApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim() || !appDev.trim() || !appDesc.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSavingApp(true);
    try {
      const payload = {
        name: appName,
        category: appCat,
        developer: appDev,
        description: appDesc,
        link: appLink || ""
      };
      await customFetch.post("/apps-list", payload);
      toast.success(`${appName} registered in directory!`);
      setShowModal(false);
      
      // Reset form fields
      setAppName("");
      setAppDev("");
      setAppDesc("");
      setAppLink("");

      // Reload directory
      loadData();
    } catch (err: any) {
      console.error("Failed to register custom app", err);
      toast.error("Failed to register app");
    } finally {
      setSavingApp(false);
    }
  };

  const handleDeleteApp = async (appId: string | number) => {
    const stringId = String(appId);
    // Protect default seeded apps from being deleted for safety
    const defaultIds = ["1", "2", "3", "4", "5"];
    if (defaultIds.includes(stringId)) {
      toast.error("Default system apps cannot be deleted.");
      return;
    }

    try {
      await customFetch.delete(`/apps-list/${stringId}`);
      toast.success("Custom app deleted from directory");
      loadData();
    } catch {
      toast.error("Failed to delete app");
    }
  };

  const categories = ["All", "Customer Service", "Social Proof", "Marketing", "Shipping & Fulfillment", "Analytics"];

  const filteredApps = filterCat === "All"
    ? apps
    : apps.filter(app => app.category === filterCat);

  // Helper to determine category icon colors
  const getCatColors = (cat: string) => {
    switch (cat) {
      case "Customer Service": return "bg-[#eefcf7] text-[#008060]";
      case "Social Proof": return "bg-[#f5f1fe] text-[#7a5af8]";
      case "Marketing": return "bg-[#fef6ee] text-[#e67e22]";
      case "Shipping & Fulfillment": return "bg-[#f1f8fe] text-[#2c6ecb]";
      case "Analytics": return "bg-[#fbf1f1] text-[#d72c0d]";
      default: return "bg-[#f4f6f8] text-[#4f566b]";
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-[65vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2c6ecb]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 animate-fade-in">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-semibold text-[#202223]">Apps Directory</h1>
          <p className="text-xs text-[#6d7175]">Integrate third-party tools to extend store capabilities.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 bg-[#2c6ecb] hover:bg-[#1e5ab0] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors w-fit"
        >
          <HiPlus className="text-sm stroke-[3]" />
          Register Custom App
        </button>
      </div>

      {/* Categories Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-[#f1f1f1] scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              filterCat === cat
                ? "bg-[#2c6ecb] text-white"
                : "bg-white text-[#6d7175] border border-[#e0e0e0] hover:bg-[#fafafa]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      {filteredApps.length === 0 ? (
        <div className="bg-white border border-[#e0e0e0] rounded-lg p-16 text-center max-w-xl mx-auto mt-6">
          <HiOutlineSquare3Stack3D className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-sm font-semibold text-[#202223] mb-1">No apps found</h3>
          <p className="text-xs text-[#6d7175]">There are no integrations in the "{filterCat}" category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredApps.map((app) => (
            <div key={app.id} className="bg-white border border-[#e0e0e0] rounded-lg p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative group">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getCatColors(app.category)}`}>
                    <HiOutlineSquare3Stack3D className="text-2xl" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {app.installed && (
                      <span className="inline-flex items-center gap-1 bg-[#f1f8f5] text-[#008060] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        <HiCheck className="text-sm" />
                        Installed
                      </span>
                    )}
                    {/* Delete button for custom apps */}
                    {!["1", "2", "3", "4", "5"].includes(String(app.id)) && (
                      <button
                        onClick={() => handleDeleteApp(app.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-md transition-all"
                        title="Delete custom app"
                      >
                        <HiTrash className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>
                <h2 className="text-base font-bold text-[#202223]">{app.name}</h2>
                <p className="text-[10px] text-[#6d7175] mb-2 font-medium">By {app.developer} • {app.category}</p>
                <p className="text-xs text-[#6d7175] leading-relaxed mb-6">{app.description}</p>
              </div>
              <div className="flex items-center gap-3 border-t border-[#f8f9fa] pt-4">
                <button
                  onClick={() => handleToggleInstall(app.id)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors text-center ${
                    app.installed
                      ? "border border-[#e0e0e0] text-[#d72c0d] hover:bg-[#fef1ee]"
                      : "bg-[#2c6ecb] text-white hover:bg-[#1e5ab0]"
                  }`}
                >
                  {app.installed ? "Uninstall App" : "Install App"}
                </button>
                <button
                  onClick={() => handleOpenDetails(app)}
                  className="p-2 border border-[#e0e0e0] rounded-lg text-[#6d7175] hover:text-[#202223] hover:bg-gray-50 transition-colors"
                  title="Configure Integration"
                >
                  <HiOutlineArrowUpRight className="text-lg" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Custom App Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-[#e0e0e0] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#202223]">Register Custom App</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#6d7175] hover:text-[#202223] p-1 rounded-md transition-colors"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleRegisterApp} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#202223] mb-1">App Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WhatsApp Chat Widget"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2c6ecb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#202223] mb-1">Category *</label>
                  <select
                    value={appCat}
                    onChange={(e) => setAppCat(e.target.value)}
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2c6ecb] bg-white"
                  >
                    {categories.filter(c => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#202223] mb-1">Developer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WhatsAppInc"
                    value={appDev}
                    onChange={(e) => setAppDev(e.target.value)}
                    className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2c6ecb]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202223] mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summarize what this integration does..."
                  value={appDesc}
                  onChange={(e) => setAppDesc(e.target.value)}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2c6ecb] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202223] mb-1">Configuration Link / Admin Redirect Path (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. /admin/preferences"
                  value={appLink}
                  onChange={(e) => setAppLink(e.target.value)}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2c6ecb]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#e0e0e0]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#e0e0e0] text-xs font-semibold text-[#6d7175] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingApp}
                  className="px-4 py-2 bg-[#2c6ecb] hover:bg-[#1e5ab0] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:bg-gray-300"
                >
                  {savingApp ? "Registering..." : "Register App"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApps;
