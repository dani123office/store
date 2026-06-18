import { useParams, useOutletContext, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addProductToTheCart } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { Dropdown, ProductItem, QuantityInput } from "../components";
import { ThemeSettings } from "./HomeLayout";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { HiHeart, HiOutlineHeart, HiStar, HiCheckCircle } from "react-icons/hi2";
import WithNumberInputWrapper from "../utils/withNumberInputWrapper";
import { motion, AnimatePresence } from "framer-motion";

const colorsMap: { [key: string]: string } = {
  black: "#151515",
  red: "#dc2626",
  blue: "#2563eb",
  white: "#ffffff",
  rose: "#fda4af",
  green: "#16a34a",
};

const sizesList = ["XS", "S", "M", "L", "XL", "XXL"];

const SingleProduct = () => {
  const settings = useOutletContext<ThemeSettings>();
  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<string>("M");
  const [color, setColor] = useState<string>("black");
  const [quantity, setQuantity] = useState<number>(1);

  // Gallery states
  const [activeImage, setActiveImage] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Reviews states
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerCity, setReviewerCity] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const QuantityInputUpgrade = WithNumberInputWrapper(QuantityInput);
  
  const { wishlistItems } = useAppSelector((state) => state.wishlist);
  const isWishlisted = singleProduct ? wishlistItems.some((item) => item.id === singleProduct.id) : false;

  // Fetch product & reviews
  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const response = await customFetch.get(`/products/${params.id}`);
        const prod = response.data;
        setSingleProduct(prod);
        setActiveImage(prod.image);

        // Generate deterministically styled mock image gallery
        const mockGallery = [
          prod.image,
          "luxury fashion 7 1.png",
          "luxury fashion 7 2.png",
          "banner1.jpg",
        ];
        setAdditionalImages(mockGallery);
      } catch (e) {
        console.error(e);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await customFetch.get("/reviews");
        // filter reviews for this product
        const filtered = response.data.filter((r: any) => String(r.product_id) === String(params.id));
        setReviews(filtered);
      } catch (e) {
        console.error("Failed to load reviews", e);
      }
    };

    const fetchProducts = async () => {
      const response = await customFetch.get("/products");
      setProducts(response.data);
    };

    fetchSingleProduct();
    fetchReviews();
    fetchProducts();
  }, [params.id]);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (singleProduct) {
      dispatch(
        addProductToTheCart({
          id: singleProduct.id + size + color,
          image: singleProduct.image,
          title: singleProduct.title,
          category: singleProduct.category,
          price: singleProduct.price,
          quantity,
          size,
          color,
          popularity: singleProduct.popularity,
          stock: singleProduct.stock,
        })
      );
      toast.success("Added to Cart!");

      // Trigger flying cart animation
      const startX = e.clientX;
      const startY = e.clientY;
      const event = new CustomEvent("cart-fly", {
        detail: {
          image: singleProduct.image,
          startX: startX || window.innerWidth / 2,
          startY: startY || window.innerHeight / 2,
        },
      });
      window.dispatchEvent(event);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    setIsSubmittingReview(true);

    try {
      const payload = {
        product_id: params.id,
        rating: newRating,
        review: newReviewText,
        username: reviewerName || "Guest Reviewer",
        usercity: reviewerCity || "Lahore",
      };

      const res = await customFetch.post("/reviews", payload);
      setReviews([res.data, ...reviews]);
      setNewReviewText("");
      setReviewerName("");
      setReviewerCity("");
      setNewRating(5);
      toast.success("Thank you! Review submitted.");
    } catch {
      toast.error("Failed to post review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Zoom on Hover Calculations
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Determine variant availability (mocked out-of-stock sizes if stock <= 2)
  const isSizeDisabled = (sz: string) => {
    if (!singleProduct) return false;
    // Deteministic stock check simulation
    if (singleProduct.stock <= 2 && (sz === "XXL" || sz === "XS")) {
      return true;
    }
    return false;
  };

  // Review Summary statistics
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "5.0";

  return (
    <div className="max-w-screen-2xl mx-auto px-5 mt-10">
      {/* Breadcrumbs */}
      <nav className="text-xs text-[#151515]/60 tracking-wider uppercase mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-[#151515]">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#151515]">Shop</Link>
        <span>/</span>
        <span className="text-[#151515] font-semibold truncate max-w-[200px]">
          {singleProduct?.title || "Product details"}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails strip */}
          <div className="flex md:flex-col gap-3 flex-shrink-0 justify-center md:justify-start">
            {additionalImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-20 border-2 overflow-hidden flex-shrink-0 transition-all ${
                  activeImage === img ? "border-[#151515] scale-95" : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={img.startsWith("luxury") || img.startsWith("banner") ? `/assets/${img}` : `/assets/${img}`}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/64x80?text=Mock`; }}
                />
              </button>
            ))}
          </div>

          {/* Main Display Image Container with Hover Zoom */}
          <div
            className="flex-1 bg-[#f8f8f8] relative overflow-hidden cursor-zoom-in aspect-[3/4]"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {singleProduct && (
              <button
                onClick={() => {
                  dispatch(toggleWishlist(singleProduct));
                  if (isWishlisted) {
                    toast.error("Removed from wishlist");
                  } else {
                    toast.success("Added to wishlist");
                  }
                }}
                className="absolute top-4 right-4 z-20 p-3 rounded-full bg-white/90 shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300"
              >
                {isWishlisted ? (
                  <HiHeart className="text-red-500 text-xl" />
                ) : (
                  <HiOutlineHeart className="text-[#151515] text-xl hover:text-red-500 transition-colors" />
                )}
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={activeImage.startsWith("luxury") || activeImage.startsWith("banner") ? `/assets/${activeImage}` : `/assets/${activeImage}`}
                alt={singleProduct?.title}
                className="w-full h-full object-cover transition-transform duration-100"
                style={{
                  transform: isZoomed ? "scale(1.8)" : "scale(1)",
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/500x600?text=Mock`; }}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Product Details & Configurator */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-wider uppercase font-serif">
              {singleProduct?.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <HiStar key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-[#151515]/60 tracking-wider">
                {reviews.length} Verified Reviews
              </span>
            </div>
            <p className="text-xl font-semibold text-[#151515] mt-4 tracking-wider">
              PKR {singleProduct?.price.toLocaleString()}
            </p>
          </div>

          {/* Installment widget */}
          {settings?.installments?.enabled && singleProduct && (
            <div className="bg-[#f0e6ff] border border-[#d8c3ff] rounded-lg p-3.5 flex items-center gap-3 text-xs md:text-sm text-[#4b10b0] font-medium tracking-wide">
              <span className="bg-[#5c00e6] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
                {settings.installments.provider === "baadmay" ? "baadmay" : "installment"}
              </span>
              <span>
                Pay in {settings.installments.count || 3} Installments of{" "}
                <span className="font-bold">Rs.{Math.round(singleProduct.price / (settings.installments.count || 3)).toLocaleString()}</span>
              </span>
            </div>
          )}

          {/* Color Selection Swatches */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#151515]/70">
              Color: <span className="text-[#151515] uppercase font-bold">{color}</span>
            </h4>
            <div className="flex gap-2">
              {Object.keys(colorsMap).map((c) => {
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all relative ${
                      isSelected ? "ring-2 ring-offset-2 ring-[#151515]" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: colorsMap[c] }}
                    aria-label={`Select Color: ${c}`}
                  >
                    {isSelected && (
                      <span className={`w-2 h-2 rounded-full ${c === "white" ? "bg-black" : "bg-white"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection Pills */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-[#151515]/70">
              <span>Size: <span className="text-[#151515] font-bold">{size}</span></span>
              <span className="underline cursor-pointer">Size Guide</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizesList.map((sz) => {
                const isSelected = size === sz;
                const isDisabled = isSizeDisabled(sz);
                return (
                  <button
                    key={sz}
                    disabled={isDisabled}
                    onClick={() => setSize(sz)}
                    className={`min-w-12 h-10 px-3 flex items-center justify-center border text-xs font-semibold tracking-wider transition-all relative ${
                      isDisabled
                        ? "border-gray-200 text-gray-300 cursor-not-allowed line-through"
                        : isSelected
                        ? "bg-[#151515] text-white border-[#151515]"
                        : "bg-white text-[#151515]/70 border-gray-300 hover:border-[#151515]"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#151515]/70">Quantity</h4>
            <div className="w-32">
              <QuantityInputUpgrade
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
            </div>
          </div>

          {/* Add to Cart button */}
          <div className="pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#151515] text-white text-xs font-bold tracking-[0.2em] uppercase py-4 hover:bg-[#333] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#151515]"
            >
              Add to Cart
            </button>
          </div>

          <p className="text-xs text-[#151515]/50 tracking-wider text-center">
            Free shipping nationwide · Safe secure SSL Checkout
          </p>

          <div className="border-t border-[#E2E2E2] pt-6 space-y-4">
            <Dropdown dropdownTitle="Description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod ultrices ante,
              eget hendrerit massa tristique vel. Curabitur vel luctus justo.
            </Dropdown>
            <Dropdown dropdownTitle="Product Details">
              100% premium luxury fabric. Fully hand-embroidered, unstitched dress segment including dupattas, trouser fabric, and sleeves.
            </Dropdown>
            <Dropdown dropdownTitle="Delivery &amp; Return Details">
              Returns accepted within 14 days of delivery. Free shipping nationwide. International orders deliver within 10-15 business days.
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-24 border-t border-[#E2E2E2] pt-16">
        <h2 className="text-2xl font-light tracking-[0.15em] uppercase text-[#151515] font-serif mb-10 text-center">
          Customer Reviews
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Star Rating Breakdown Summary */}
          <div className="lg:col-span-4 bg-[#fafafa] border border-[#e8e8e8] p-6 rounded-lg h-fit">
            <div className="text-center pb-6 border-b border-[#e2e2e2] mb-6">
              <p className="text-5xl font-light font-serif text-[#151515] mb-2">{avgRating}</p>
              <div className="flex justify-center text-amber-500 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <HiStar key={s} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#151515]/60 tracking-wider">Based on {reviews.length} reviews</p>
            </div>

            {/* Simulated bar chart percentages */}
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
                const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-3 text-[#151515] font-medium">{stars}★</span>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="w-8 text-right text-gray-400 font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Review List & Submission Form */}
          <div className="lg:col-span-8 space-y-10">
            {/* Submit review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-white border border-[#e2e2e2] p-6 rounded-lg space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[#151515]">Write a Review</h3>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#151515]/70 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="block w-full py-2 px-3 border border-[#E2E2E2] text-sm"
                    placeholder="e.g. Ayesha Khan"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#151515]/70 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={reviewerCity}
                    onChange={(e) => setReviewerCity(e.target.value)}
                    className="block w-full py-2 px-3 border border-[#E2E2E2] text-sm"
                    placeholder="e.g. Islamabad"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#151515]/70 mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewRating(s)}
                      className={`text-2xl transition-colors ${s <= newRating ? "text-amber-500" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#151515]/70 mb-1">Review Body</label>
                <textarea
                  required
                  rows={3}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="block w-full py-2 px-3 border border-[#E2E2E2] text-sm outline-none focus:border-[#151515]"
                  placeholder="Share details of your experience with this dress..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="bg-[#151515] text-white text-xs font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>

            {/* List of Reviews */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-sm text-[#151515]/60 italic">No reviews yet for this product. Be the first to write one!</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="border-b border-[#e2e2e2] pb-6 space-y-2 animate-fade">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#151515]">{r.username}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded tracking-wide uppercase font-medium">{r.usercity}</span>
                        <span className="flex items-center gap-0.5 text-green-600 text-xs font-bold">
                          <HiCheckCircle className="text-sm" /> Verified Buyer
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(r.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>

                    <div className="flex text-amber-500 text-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>{star <= r.rating ? "★" : "☆"}</span>
                      ))}
                    </div>

                    <p className="text-sm text-[#151515]/80 leading-relaxed font-light">
                      {r.review}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="mt-24 mb-20">
        <h2 className="section-title mb-12 font-serif">You May Also Like</h2>
        <div className="collection-grid">
          {products.slice(0, 4).map((product: Product) => (
            <ProductItem
              key={product?.id}
              id={product?.id}
              image={product?.image}
              title={product?.title}
              category={product?.category}
              price={product?.price}
              popularity={product?.popularity}
              stock={product?.stock}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SingleProduct;
