import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import {
  HiOutlineChevronDown, HiOutlineCalendarDays, HiOutlineGlobeAlt,
  HiOutlinePhoto, HiArrowUpTray, HiXMark, HiCheck, HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

type ToolbarButton = "bold" | "italic" | "underline" | "list" | "align" | "link" | "image" | "video" | "html";

const standardSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const AdminAddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [selectedSubcatId, setSelectedSubcatId] = useState<string>("");
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<number[]>([]);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [allCollections, setAllCollections] = useState<any[]>([]);
  const [tags, setTags] = useState("");
  const [activeToolbar, setActiveToolbar] = useState<Set<ToolbarButton>>(new Set());
  const [uploadedImage, setUploadedImage] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Product configurations (Colors, Sizes, Extra Images)
  const [productColors, setProductColors] = useState<string[]>([]);
  const [productSizes, setProductSizes] = useState<string[]>([]);
  const [extraImages, setExtraImages] = useState<string[]>(["", "", "", ""]); // 4 slots for pro_img2 - pro_img5
  const [customColorInput, setCustomColorInput] = useState("");

  // Media Modal states
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [targetImageSlot, setTargetImageSlot] = useState<number | null>(null); // null = primary, 0-3 = extra images
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [selectedMediaName, setSelectedMediaName] = useState<string | null>(null);
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaUploading, setMediaUploading] = useState(false);

  const fetchMediaList = async () => {
    setLoadingMedia(true);
    try {
      const res = await customFetch.get("/media");
      setMediaList(res.data || []);
    } catch {
      console.warn("Media library unavailable (auth required)");
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

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const [catRes, subRes, collRes] = await Promise.all([
          customFetch.get("/categories"),
          customFetch.get("/sub-categories"),
          customFetch.get("/collections"),
        ]);
        setCategories(catRes.data || []);
        setSubcategories(subRes.data || []);
        setAllCollections(collRes.data || []);
      } catch (e) {
        console.error("Failed to load organization data:", e);
      }
    };
    fetchOrgData();

    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await customFetch.get(`/products/${id}`);
        const p = res.data;
        setTitle(p.title || "");
        setDescription(p.description || "");
        setSelectedCatId(p.category_id ? String(p.category_id) : "");
        setSelectedSubcatId(p.subcategory_id ? String(p.subcategory_id) : "");
        setPrice(String(p.price ?? ""));
        setStock(String(p.stock ?? ""));
        setUploadedImage(p.image || "");
        if (Array.isArray(p.collections)) {
          setSelectedCollectionIds(p.collections.map((c: any) => c.id));
        }

        // Load colors
        const colorsList = [];
        if (p.colors) {
          if (p.colors.color1) colorsList.push(p.colors.color1);
          if (p.colors.color2) colorsList.push(p.colors.color2);
          if (p.colors.color3) colorsList.push(p.colors.color3);
          if (p.colors.color4) colorsList.push(p.colors.color4);
          if (p.colors.color5) colorsList.push(p.colors.color5);
          if (p.colors.color6) colorsList.push(p.colors.color6);
        }
        setProductColors(colorsList.filter(Boolean));

        // Load sizes
        const sizesList = [];
        if (p.sizes) {
          if (p.sizes.size1) sizesList.push(p.sizes.size1);
          if (p.sizes.size2) sizesList.push(p.sizes.size2);
          if (p.sizes.size3) sizesList.push(p.sizes.size3);
          if (p.sizes.size4) sizesList.push(p.sizes.size4);
          if (p.sizes.size5) sizesList.push(p.sizes.size5);
          if (p.sizes.size6) sizesList.push(p.sizes.size6);
        }
        setProductSizes(sizesList.filter(Boolean));

        // Load additional images
        const extraImgs = ["", "", "", ""];
        const imgRel = p.additional_images || p.additionalImages;
        if (imgRel) {
          if (imgRel.pro_img2) extraImgs[0] = imgRel.pro_img2;
          if (imgRel.pro_img3) extraImgs[1] = imgRel.pro_img3;
          if (imgRel.pro_img4) extraImgs[2] = imgRel.pro_img4;
          if (imgRel.pro_img5) extraImgs[3] = imgRel.pro_img5;
        }
        setExtraImages(extraImgs);

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

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const selectedCat = categories.find((c: any) => String(c.cat_id) === selectedCatId);
    const catSlug = selectedCat ? selectedCat.cat_title.toLowerCase().replace(/\s+/g, "-") : "uncategorized";

    const payload = {
      title,
      description,
      category: catSlug,
      category_id: selectedCatId ? Number(selectedCatId) : null,
      subcategory_id: selectedSubcatId ? Number(selectedSubcatId) : null,
      collection_ids: selectedCollectionIds,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      image: uploadedImage || "product image 1.jpg",
      popularity: 1,
      colors: productColors,
      sizes: productSizes,
      additional_images: extraImages.filter(Boolean),
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
    } catch (err: any) { toast.error(err?.response?.data?.message || err?.response?.data?.errors?.file?.[0] || "Upload failed"); }
  };

  const handleAddCustomColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customColorInput.trim()) return;
    if (productColors.length >= 6) {
      toast.error("You can add up to 6 colors maximum.");
      return;
    }
    if (productColors.includes(customColorInput.trim())) {
      toast.error("Color already added.");
      return;
    }
    setProductColors([...productColors, customColorInput.trim()]);
    setCustomColorInput("");
  };

  const toggleSize = (sz: string) => {
    if (productSizes.includes(sz)) {
      setProductSizes(productSizes.filter((s) => s !== sz));
    } else {
      if (productSizes.length >= 6) {
        toast.error("You can select up to 6 sizes maximum.");
        return;
      }
      setProductSizes([...productSizes, sz]);
    }
  };

  return (
    <div className="flex-1 flex">
      <form id="add-product-form" className="contents" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <div className="flex-1 p-4 lg:p-6 max-w-3xl overflow-auto space-y-6">
        <div>
          <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-[#6d7175] hover:text-[#2c6ecb] transition-colors mb-2">
            <HiOutlineChevronDown className="text-xs rotate-90" />
            Products
          </Link>
          <h1 className="text-2xl font-semibold text-[#202223]">{isEdit ? "Edit product" : "Add product"}</h1>
        </div>

        {/* Main Details Card */}
        <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
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
        <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden animate-fade-in">
          <div className="px-5 py-3 border-b border-[#e0e0e0]">
            <h2 className="text-base font-semibold text-[#202223]">Product Media & Gallery</h2>
            <p className="text-xs text-[#6d7175] mt-0.5">Manage the primary cover image and up to 4 additional gallery thumbnails.</p>
          </div>
          <div className="p-5 space-y-6">
            {/* Primary Cover Image */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6d7175] mb-2">Primary Cover Image *</label>
              <div className="border-2 border-dashed border-[#e0e0e0] rounded-lg p-4 flex flex-col items-center justify-center gap-3 hover:border-[#2c6ecb] transition-all duration-300 cursor-pointer min-h-[140px] relative group overflow-hidden"
                onClick={() => {
                  setTargetImageSlot(null);
                  setShowMediaModal(true);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {uploadedImage ? (
                  <>
                    <img src={uploadedImage.startsWith("http") ? uploadedImage : `/assets/${uploadedImage}`} alt="Uploaded Cover" className="max-h-36 rounded shadow-sm transition-transform duration-300 group-hover:scale-95"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/assets/product image 1.jpg"; }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="text-white text-xs font-semibold px-3 py-1.5 bg-black/60 rounded-md border border-white/20">Change Cover</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedImage("");
                        }}
                        className="text-white text-xs font-semibold px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-[#f1f8fe] flex items-center justify-center transition-transform group-hover:scale-110">
                      <HiOutlinePhoto className="text-lg text-[#2c6ecb]" />
                    </div>
                    <button type="button" className="px-4 py-1.5 text-sm font-medium text-[#2c6ecb] border border-[#2c6ecb] rounded-lg hover:bg-[#f1f8fe] transition-colors">
                      Choose Cover Image
                    </button>
                    <p className="text-xs text-[#6d7175]">or drag file here</p>
                  </>
                )}
              </div>
            </div>

            {/* Extra Gallery Thumbnails */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6d7175] mb-2">Gallery Images (Maximum 4)</label>
              <div className="grid grid-cols-4 gap-4">
                {extraImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setTargetImageSlot(idx);
                      setShowMediaModal(true);
                    }}
                    className="aspect-[4/5] bg-gray-50 border border-dashed border-[#e0e0e0] rounded-lg hover:border-[#2c6ecb] transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group"
                  >
                    {img ? (
                      <>
                        <img src={img.startsWith("http") ? img : `/assets/${img}`} alt={`Gallery ${idx + 2}`} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/assets/product image 1.jpg"; }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const copy = [...extraImages];
                              copy[idx] = "";
                              setExtraImages(copy);
                            }}
                            className="bg-red-600 text-white rounded p-1 hover:bg-red-700 shadow-md"
                          >
                            <HiXMark className="text-base" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <HiOutlinePhoto className="text-gray-400 text-lg mb-1" />
                        <span className="text-[9px] text-[#6d7175] font-semibold uppercase tracking-wider">Slot {idx + 2}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Colors & Sizes Configurators */}
        <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e0e0e0]">
            <h2 className="text-base font-semibold text-[#202223]">Colors & Sizes Variants</h2>
            <p className="text-xs text-[#6d7175] mt-0.5">Customize the product color swatches and size selector options.</p>
          </div>
          <div className="p-5 space-y-6">
            
            {/* Color Swatches Options */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6d7175]">Product Colors ({productColors.length}/6)</label>
              
              {/* Added Colors List */}
              {productColors.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-[#e0e0e0]">
                  {productColors.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#e0e0e0] rounded-full shadow-sm text-xs font-medium text-[#202223]">
                      <span className="w-2.5 h-2.5 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                      <span className="capitalize">{color}</span>
                      <button
                        type="button"
                        onClick={() => setProductColors(productColors.filter((_, i) => i !== idx))}
                        className="text-gray-400 hover:text-red-600 ml-1 transition-colors"
                      >
                        <HiXMark className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No custom colors specified. Fallback default colors will be used.</p>
              )}

              {/* Add Custom Color Input */}
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="e.g. Lavender, #b57edc"
                  value={customColorInput}
                  onChange={(e) => setCustomColorInput(e.target.value)}
                  className="flex-1 border border-[#e0e0e0] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
                <button
                  type="button"
                  onClick={handleAddCustomColor}
                  className="px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-wider"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Size Checklist Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6d7175]">Product Sizes ({productSizes.length}/6)</label>
              <div className="flex flex-wrap gap-3">
                {standardSizes.map((sz) => {
                  const isChecked = productSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`w-12 h-10 flex items-center justify-center border text-xs font-semibold rounded-lg tracking-wider transition-all ${
                        isChecked
                          ? "bg-[#2c6ecb] text-white border-[#2c6ecb] shadow-sm"
                          : "bg-white text-[#6d7175] border-gray-200 hover:border-gray-300 hover:text-[#202223]"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Click to select size options. If none are selected, default standard sizes (XS - XXL) will load.</p>
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
                <label className="block text-sm font-medium text-[#202223] mb-1">Category *</label>
                <select value={selectedCatId} onChange={(e) => {
                  setSelectedCatId(e.target.value);
                  setSelectedSubcatId("");
                }}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm text-[#202223] outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white appearance-none"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236d7175' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 8px center", backgroundRepeat: "no-repeat", backgroundSize: "16px 16px" }}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => (
                    <option key={cat.cat_id} value={cat.cat_id}>{cat.cat_title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Subcategory</label>
                <select value={selectedSubcatId} onChange={(e) => setSelectedSubcatId(e.target.value)}
                  disabled={!selectedCatId}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm text-[#202223] outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white appearance-none disabled:bg-gray-50 disabled:text-gray-400"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236d7175' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 8px center", backgroundRepeat: "no-repeat", backgroundSize: "16px 16px" }}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories
                    .filter((sub: any) => String(sub.cat_id) === selectedCatId)
                    .map((sub: any) => (
                      <option key={sub.subcat_id} value={sub.subcat_id}>{sub.subcat_title}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#202223] mb-2">Collections</label>
                {allCollections.length > 0 ? (
                  <div className="border border-[#e0e0e0] rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                    {allCollections.map((col: any) => {
                      const isChecked = selectedCollectionIds.includes(col.id);
                      return (
                        <label key={col.id} className="flex items-center gap-2 text-sm text-[#202223] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCollectionIds([...selectedCollectionIds, col.id]);
                              } else {
                                setSelectedCollectionIds(selectedCollectionIds.filter((id) => id !== col.id));
                              }
                            }}
                            className="rounded border-gray-300 text-[#2c6ecb] focus:ring-[#2c6ecb] w-4 h-4"
                          />
                          <span>{col.title}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-[#6d7175]">No collections available</p>
                )}
                <p className="text-xs text-[#6d7175] mt-1.5">Add this product to collections so it's easy to find on the website.</p>
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

      {/* Media Selector Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMediaModal(false)} />
          <div className="relative bg-white w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-fade-in">
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
                            if (targetImageSlot === null) {
                              setUploadedImage(item.name);
                            } else {
                              const copy = [...extraImages];
                              copy[targetImageSlot] = item.name;
                              setExtraImages(copy);
                            }
                            setShowMediaModal(false);
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
                    if (targetImageSlot === null) {
                      setUploadedImage(selectedMediaName);
                    } else {
                      const copy = [...extraImages];
                      copy[targetImageSlot] = selectedMediaName;
                      setExtraImages(copy);
                    }
                    setShowMediaModal(false);
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

export default AdminAddProduct;
