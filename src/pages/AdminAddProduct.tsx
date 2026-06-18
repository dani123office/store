import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import {
  HiOutlineChevronDown, HiOutlineCalendarDays, HiOutlineGlobeAlt,
  HiOutlinePhoto, HiArrowUpTray,
} from "react-icons/hi2";

type ToolbarButton = "bold" | "italic" | "underline" | "list" | "align" | "link" | "image" | "video" | "html";

const AdminAddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState("");
  const [vendor, setVendor] = useState("");
  const [collectionSearch, setCollectionSearch] = useState("");
  const [tags, setTags] = useState("");
  const [activeToolbar, setActiveToolbar] = useState<Set<ToolbarButton>>(new Set());
  const [uploadedImage, setUploadedImage] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categories, setCategories] = useState<{ id: string; cat_title: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await customFetch.get("/categories");
        setCategories(res.data);
      } catch (e) {
        console.error("Failed to load categories:", e);
      }
    };
    fetchCategories();

    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await customFetch.get(`/products/${id}`);
        const p = res.data;
        setTitle(p.title || "");
        setDescription(p.description || "");
        setProductType(p.category || "");
        setPrice(String(p.price ?? ""));
        setStock(String(p.stock ?? ""));
        setUploadedImage(p.image || "");
      } catch {
        toast.error("Failed to load product");
        navigate("/admin/products");
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const toggleToolbar = (btn: ToolbarButton) => {
    setActiveToolbar((prev) => {
      const next = new Set(prev);
      if (next.has(btn)) next.delete(btn);
      else next.add(btn);
      return next;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await customFetch.post("/upload", fd);
      setUploadedImage(res.data.filename);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    }
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const payload = {
      title,
      description,
      category: productType || "uncategorized",
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      image: uploadedImage || "product image 1.jpg",
      popularity: 1,
    };
    try {
      if (isEdit) {
        await customFetch.put(`/products/${id}`, payload);
        toast.success("Product updated");
      } else {
        await customFetch.post("/products", payload);
        toast.success("Product added");
      }
      navigate("/admin/products");
    } catch {
      toast.error(isEdit ? "Failed to update product" : "Failed to save product");
    }
  };

  const toolbarBtn = (btn: ToolbarButton, label: string | React.ReactNode) => {
    const active = activeToolbar.has(btn);
    return (
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); toggleToolbar(btn); }}
        className={`w-7 h-7 flex items-center justify-center rounded text-sm transition-colors ${
          active
            ? "bg-[#2c6ecb] text-white"
            : "text-[#6d7175] hover:bg-[#e5e5e5] hover:text-[#202223]"
        }`}
        title={btn.charAt(0).toUpperCase() + btn.slice(1)}
      >
        {label}
      </button>
    );
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await customFetch.post("/upload", fd);
      setUploadedImage(res.data.filename);
      toast.success("Image uploaded");
    } catch { toast.error("Upload failed"); }
  };

  return (
    <div className="flex-1 flex">
      <form id="add-product-form" className="contents" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <div className="flex-1 p-4 lg:p-6 max-w-3xl overflow-auto">
        <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-[#6d7175] hover:text-[#2c6ecb] transition-colors mb-2">
          <HiOutlineChevronDown className="text-xs rotate-90" />
          Products
        </Link>

        <h1 className="text-2xl font-semibold text-[#202223] mb-6">{isEdit ? "Edit product" : "Add product"}</h1>

        {/* Main Details Card */}
        <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden mb-4">
          <div className="border-b border-[#e0e0e0] px-5 py-3">
            <h2 className="text-base font-semibold text-[#202223]">Main details</h2>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1.5">Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Short sleeve t-shirt"
                className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm text-[#202223] outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] transition-colors placeholder:text-[#b0b3b5]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1.5">Price (Rs.)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1.5">Stock</label>
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1.5">Description</label>
              <div className="border border-[#e0e0e0] rounded-lg overflow-hidden focus-within:border-[#2c6ecb] focus-within:ring-1 focus-within:ring-[#2c6ecb] transition-colors">
                <div className="flex items-center gap-0.5 px-2 py-1.5 bg-[#fafafa] border-b border-[#e0e0e0] flex-wrap">
                  {toolbarBtn("bold", <span className="font-bold">B</span>)}
                  {toolbarBtn("italic", <em className="italic">I</em>)}
                  {toolbarBtn("underline", <span className="underline">U</span>)}
                  <span className="w-px h-5 bg-[#e0e0e0] mx-1" />
                  {toolbarBtn("list",
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  )}
                  {toolbarBtn("align",
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" /></svg>
                  )}
                  <span className="w-px h-5 bg-[#e0e0e0] mx-1" />
                  {toolbarBtn("link",
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  )}
                  {toolbarBtn("image", <HiOutlinePhoto className="text-base" />)}
                  {toolbarBtn("video",
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )}
                  <span className="w-px h-5 bg-[#e0e0e0] mx-1" />
                  {toolbarBtn("html", <span className="font-mono text-xs">&lt;&gt;</span>)}
                </div>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  rows={8} placeholder="Enter product description..."
                  className="w-full px-3 py-2 text-sm text-[#202223] outline-none resize-none placeholder:text-[#b0b3b5]" />
              </div>
            </div>
          </div>
        </div>

        {/* Media Card */}
        <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden mb-4">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#e0e0e0]">
            <h2 className="text-base font-semibold text-[#202223]">Media</h2>
            <button type="button" className="text-sm text-[#2c6ecb] hover:text-[#1e5ab0] font-medium transition-colors"
              onClick={() => { const url = prompt("Enter media URL:"); if (url) toast.success("Media added from URL"); }}>
              Add media from URL
            </button>
          </div>
          <div className="p-5">
            <div className="border-2 border-dashed border-[#e0e0e0] rounded-lg py-10 flex flex-col items-center justify-center gap-3 hover:border-[#2c6ecb] transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              {uploadedImage ? (
                <img src={`/assets/${uploadedImage}`} alt="Uploaded" className="max-h-32 rounded"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/120?text=No+Image"; }}
                />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-[#f1f8fe] flex items-center justify-center">
                    <HiArrowUpTray className="text-lg text-[#2c6ecb]" />
                  </div>
                  <button type="button" className="px-4 py-1.5 text-sm font-medium text-[#2c6ecb] border border-[#2c6ecb] rounded-lg hover:bg-[#f1f8fe] transition-colors">
                    Add file
                  </button>
                  <p className="text-xs text-[#6d7175]">or drop files to upload</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <aside className="hidden lg:block w-80 bg-white border-l border-[#e0e0e0] overflow-y-auto flex-shrink-0">
        <div className="p-5 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-3">Product availability</h3>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-[#202223]">Available on 1 of 1 channels and apps</span>
              <button type="button" className="text-[#2c6ecb] hover:text-[#1e5ab0] font-medium transition-colors">Manage</button>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 bg-[#f6f6f7] rounded-lg">
              <HiOutlineGlobeAlt className="text-lg text-[#6d7175]" />
              <span className="text-sm text-[#202223] font-medium">Online Store</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 ml-1">
              <HiOutlineCalendarDays className="text-sm text-[#6d7175]" />
              <span className="text-xs text-[#6d7175]">Will be published after saving</span>
            </div>
          </div>

          <hr className="border-[#e0e0e0]" />

          <div>
            <h3 className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider mb-3">Organization</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Product type</label>
                <select value={productType} onChange={(e) => setProductType(e.target.value)}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm text-[#202223] outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white appearance-none animate-fade-in"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236d7175' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 8px center", backgroundRepeat: "no-repeat", backgroundSize: "16px 16px" }}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => {
                    const slug = cat.cat_title.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <option key={cat.id} value={slug}>
                        {cat.cat_title}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Vendor</label>
                <select value={vendor} onChange={(e) => setVendor(e.target.value)}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm text-[#202223] outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white appearance-none"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236d7175' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 8px center", backgroundRepeat: "no-repeat", backgroundSize: "16px 16px" }}
                >
                  <option value="" disabled hidden>e.g. Nike</option>
                  <option value="nike">Nike</option>
                  <option value="adidas">Adidas</option>
                  <option value="zara">Zara</option>
                  <option value="h&m">H&amp;M</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Collections</label>
                <input type="text" value={collectionSearch} onChange={(e) => setCollectionSearch(e.target.value)}
                  placeholder="Search for collections"
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] placeholder:text-[#b0b3b5]" />
                <p className="text-xs text-[#6d7175] mt-1.5">Add this product to a collection so it's easy to find in your store.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Tags</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                  placeholder="Vintage, cotton, summer"
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] placeholder:text-[#b0b3b5]" />
              </div>
            </div>
          </div>
        </div>
      </aside>
      </form>
    </div>
  );
};

export default AdminAddProduct;
