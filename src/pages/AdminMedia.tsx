import { useEffect, useState } from "react";
import { HiTrash, HiOutlineDocumentDuplicate, HiOutlineCloudArrowUp, HiCheck } from "react-icons/hi2";
import toast from "react-hot-toast";
import customFetch from "../axios/custom";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
}

const AdminMedia = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    try {
      const res = await customFetch.get("/media");
      setMediaList(res.data);
    } catch (e) {
      console.error("Failed to fetch media", e);
      toast.error("Failed to load media library");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = (item: MediaItem) => {
    const fullUrl = window.location.origin + item.url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    const item = mediaList.find((m) => m.id === id);
    if (!item) return;

    if (
      item.name.includes("banner") ||
      item.name.includes("luxury") ||
      item.name === "1.jpg" ||
      item.name.startsWith("product image")
    ) {
      toast.error("System assets cannot be deleted.");
      return;
    }

    try {
      await customFetch.delete(`/media/${item.name}`);
      toast.success("Image deleted successfully");
      fetchMedia();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete image");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      // Call Laravel Upload API
      await customFetch.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Image uploaded successfully!");
      fetchMedia();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.file?.[0] || "Upload failed. Make sure backend is running.";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#202223]">Media Library</h1>
          <p className="text-xs text-[#6d7175]">Upload and manage assets for banners, pages, and products.</p>
        </div>
        
        {/* Upload Button */}
        <label className="flex items-center gap-2 bg-[#008060] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#006e52] cursor-pointer transition-colors shadow-sm">
          <HiOutlineCloudArrowUp className="text-lg" />
          {uploading ? "Uploading..." : "Upload New Image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Drag & Drop simulated area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-[#fafafa] hover:bg-gray-50/50 transition-colors">
        <HiOutlineCloudArrowUp className="text-4xl text-gray-400 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-[#202223]">Drag and drop images here</h3>
        <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG, JPEG up to 5MB</p>
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaList.map((item) => (
          <div key={item.id} className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden group hover:shadow-sm transition-all relative flex flex-col justify-between">
            <div className="aspect-square bg-[#f8f8f8] relative overflow-hidden flex items-center justify-center">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "/assets/product image 1.jpg"; }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleCopyUrl(item)}
                  className="p-2 bg-white rounded-full text-[#151515] hover:scale-110 active:scale-95 transition-transform"
                  title="Copy URL"
                >
                  {copiedId === item.id ? <HiCheck className="text-green-600" /> : <HiOutlineDocumentDuplicate />}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-white rounded-full text-[#dc2626] hover:scale-110 active:scale-95 transition-transform"
                  title="Delete image"
                >
                  <HiTrash />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold text-[#202223] truncate" title={item.name}>
                {item.name}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{item.size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMedia;
