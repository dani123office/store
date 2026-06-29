import { useEffect, useState } from "react";
import { HiCheck, HiOutlineSquare3Stack3D, HiOutlineArrowUpRight } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import customFetch from "../axios/custom";

interface AppItem {
  id: string;
  name: string;
  category: string;
  description: string;
  installed: boolean;
  developer: string;
}

const defaultApps: AppItem[] = [
  { id: "1", name: "Zarka Inbox", category: "Customer Service", description: "Real-time customer chat and support messages.", installed: true, developer: "Zarka Couture" },
  { id: "2", name: "Judge.me Product Reviews", category: "Social Proof", description: "Collect and display product reviews and ratings.", installed: false, developer: "Judge.me" },
  { id: "3", name: "Mailchimp Email Marketing", category: "Marketing", description: "Sync customer lists and build automated campaigns.", installed: false, developer: "Mailchimp" },
  { id: "4", name: "ShipRocket Delivery Integration", category: "Shipping & Fulfillment", description: "Fulfill orders with reliable local couriers.", installed: true, developer: "ShipRocket" },
  { id: "5", name: "Pixel Conversion Booster", category: "Analytics", description: "Advanced Facebook Pixel and analytics tracking.", installed: false, developer: "PixelInc" },
];

const AdminApps = () => {
  const [apps, setApps] = useState<AppItem[]>(defaultApps);
  const [storeId, setStoreId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstalledApps = async () => {
      try {
        const res = await customFetch.get("/stores");
        if (res.data && res.data.length > 0) {
          const store = res.data[0];
          setStoreId(store.id || "1");
          const installedStr = store.installed_apps || "1,4"; // default installed apps
          const installedIds = installedStr.split(",").map((s: string) => s.trim());
          
          const updatedApps = defaultApps.map(app => ({
            ...app,
            installed: installedIds.includes(app.id)
          }));
          setApps(updatedApps);
        }
      } catch (e) {
        console.error("Failed to load store installed apps, fallback to defaults", e);
        setApps(defaultApps);
      }
    };
    fetchInstalledApps();
  }, []);

  const handleToggleInstall = async (id: string) => {
    const updated = apps.map((app) => {
      if (app.id === id) {
        const nextInstalled = !app.installed;
        if (nextInstalled) {
          toast.success(`${app.name} installed successfully!`);
          if (id === "5") {
            setTimeout(() => {
              navigate("/admin/facebook-ads");
            }, 1000);
          }
        } else {
          toast.success(`${app.name} uninstalled successfully.`);
        }
        return { ...app, installed: nextInstalled };
      }
      return app;
    });

    setApps(updated);

    try {
      const installedIds = updated.filter(a => a.installed).map(a => a.id).join(",");
      await customFetch.post("/stores", {
        id: storeId,
        installed_apps: installedIds
      });
    } catch (e) {
      console.error("Failed to save installed apps to database", e);
    }
  };

  const handleOpenDetails = (app: AppItem) => {
    if (app.id === "5") {
      navigate("/admin/facebook-ads");
    } else {
      toast(`Opening details for ${app.name}`);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#202223]">Apps Directory</h1>
        <p className="text-xs text-[#6d7175]">Integrate third-party integrations to extend store capabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map((app) => (
          <div key={app.id} className="bg-white border border-[#e0e0e0] rounded-lg p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-[#f1f8fe] flex items-center justify-center text-[#2c6ecb] flex-shrink-0">
                  <HiOutlineSquare3Stack3D className="text-2xl" />
                </div>
                {app.installed && (
                  <span className="inline-flex items-center gap-1 bg-[#f1f8f5] text-[#008060] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    <HiCheck className="text-sm" />
                    Installed
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-[#202223]">{app.name}</h2>
              <p className="text-[10px] text-[#6d7175] mb-2">By {app.developer} • {app.category}</p>
              <p className="text-sm text-[#6d7175] leading-relaxed mb-6">{app.description}</p>
            </div>
            <div className="flex items-center gap-3 border-t border-[#fafafa] pt-4">
              <button
                onClick={() => handleToggleInstall(app.id)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors text-center ${
                  app.installed
                    ? "border border-[#e0e0e0] text-[#d72c0d] hover:bg-[#fef1ee]"
                    : "bg-[#2c6ecb] text-white hover:bg-[#1e5ab0]"
                }`}
              >
                {app.installed ? "Uninstall App" : "Install App"}
              </button>
              <button
                onClick={() => handleOpenDetails(app)}
                className="p-2 border border-[#e0e0e0] rounded-lg text-[#6d7175] hover:text-[#202223] hover:bg-[#f1f1f1] transition-colors"
                title="View App Details"
              >
                <HiOutlineArrowUpRight className="text-lg" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminApps;
