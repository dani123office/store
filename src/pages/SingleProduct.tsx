import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addProductToTheCart } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { Dropdown, ProductItem, QuantityInput } from "../components";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { trackFbEvent } from "../utils/fbPixel";
import { HiHeart, HiOutlineHeart, HiStar, HiCheckCircle } from "react-icons/hi2";
import WithNumberInputWrapper from "../utils/withNumberInputWrapper";
import { motion, AnimatePresence } from "framer-motion";

const colorsMap: { [key: string]: string } = {
  black: "#1a1a1a",
  red: "#dc2626",
  blue: "#2563eb",
  white: "#ffffff",
  rose: "#fda4af",
  green: "#16a34a",
};

const SingleProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<string>("M");
  const [color, setColor] = useState<string>("black");
  const [quantity, setQuantity] = useState<number>(1);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  const [activeImage, setActiveImage] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

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
  const isOutOfStock = singleProduct ? Number(singleProduct.stock) <= 0 : false;

  const originalPrice = singleProduct ? singleProduct.price * 2 : 0;
  const discountPercent = singleProduct ? Math.round((1 - singleProduct.price / originalPrice) * 100) : 0;

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const response = await customFetch.get(`/products/${params.id}`);
        const prod = response.data;
        setSingleProduct(prod);
        setActiveImage(prod.image);

        trackFbEvent("ViewContent", {
          content_ids: [prod.id],
          content_name: prod.title,
          content_category: prod.category,
          value: Number(prod.price),
          currency: "PKR",
          content_type: "product"
        });

        try {
          const imgRes = await customFetch.get("/product-images");
          const realImg = imgRes.data.find((img: any) => String(img.pro_id) === String(prod.id));
          if (realImg) {
            const gallery = [
              prod.image,
              realImg.pro_img2,
              realImg.pro_img3,
              realImg.pro_img4,
              realImg.pro_img5
            ].filter(Boolean);
            setAdditionalImages(gallery);
          } else {
            setAdditionalImages([
              prod.image,
              "luxury fashion 7 1.png",
              "luxury fashion 7 2.png",
              "banner1.jpg"
            ]);
          }
        } catch {
          setAdditionalImages([
            prod.image,
            "luxury fashion 7 1.png",
            "luxury fashion 7 2.png",
            "banner1.jpg"
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await customFetch.get("/reviews");
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

  useEffect(() => {
    if (!singleProduct) return;

    const colorsList: string[] = [];
    const relColors = singleProduct.colors as any;
    if (relColors) {
      if (relColors.color1) colorsList.push(relColors.color1);
      if (relColors.color2) colorsList.push(relColors.color2);
      if (relColors.color3) colorsList.push(relColors.color3);
      if (relColors.color4) colorsList.push(relColors.color4);
      if (relColors.color5) colorsList.push(relColors.color5);
      if (relColors.color6) colorsList.push(relColors.color6);
    }
    const finalColors = colorsList.filter(Boolean).length > 0 ? colorsList.filter(Boolean) : ["black", "red", "blue", "white", "rose", "green"];
    setAvailableColors(finalColors);
    if (!finalColors.includes(color)) {
      setColor(finalColors[0]);
    }

    const sizesList: string[] = [];
    const relSizes = singleProduct.sizes as any;
    if (relSizes) {
      if (relSizes.size1) sizesList.push(relSizes.size1);
      if (relSizes.size2) sizesList.push(relSizes.size2);
      if (relSizes.size3) sizesList.push(relSizes.size3);
      if (relSizes.size4) sizesList.push(relSizes.size4);
      if (relSizes.size5) sizesList.push(relSizes.size5);
      if (relSizes.size6) sizesList.push(relSizes.size6);
    }
    const finalSizes = sizesList.filter(Boolean).length > 0 ? sizesList.filter(Boolean) : ["XS", "S", "M", "L", "XL", "XXL"];
    setAvailableSizes(finalSizes);
    if (!finalSizes.includes(size)) {
      setSize(finalSizes[0]);
    }

    const gallery = [singleProduct.image];
    const relImg = (singleProduct.additional_images || (singleProduct as any).additionalImages) as any;
    if (relImg) {
      if (relImg.pro_img2) gallery.push(relImg.pro_img2);
      if (relImg.pro_img3) gallery.push(relImg.pro_img3);
      if (relImg.pro_img4) gallery.push(relImg.pro_img4);
      if (relImg.pro_img5) gallery.push(relImg.pro_img5);
    }
    if (gallery.filter(Boolean).length > 1) {
      setAdditionalImages(gallery.filter(Boolean));
    }
  }, [singleProduct]);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (singleProduct) {
      if (Number(singleProduct.stock) <= 0) {
        toast.error("This product is currently out of stock.");
        return;
      }
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

      trackFbEvent("AddToCart", {
        content_ids: [singleProduct.id],
        content_name: singleProduct.title,
        content_category: singleProduct.category,
        value: Number(singleProduct.price),
        currency: "PKR",
        content_type: "product",
        quantity
      });

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
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        product_id: params.id,
        rating: newRating,
        review: newReviewText,
        username: reviewerName || user.name || "Guest Reviewer",
        usercity: reviewerCity || "Lahore",
        user_id: user.id || null,
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const isSizeDisabled = (sz: string) => {
    if (!singleProduct) return false;
    if (singleProduct.stock <= 2 && (sz === "XXL" || sz === "XS")) {
      return true;
    }
    return false;
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "5.0";

  // In-stock indicator
  const inStock = singleProduct && Number(singleProduct.stock) > 0;

  return (
    <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 mt-10">
      {/* Breadcrumbs */}
      <nav className="text-caption text-link-slate tracking-tracked-wide uppercase mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-ink">Home</Link>
        <span className="text-shade-30">&gt;</span>
        <Link to="/shop" className="hover:text-ink">Shop</Link>
        <span className="text-shade-30">&gt;</span>
        <span className="text-ink font-semibold truncate max-w-[200px]">
          {singleProduct?.title || "Product details"}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 flex-shrink-0 justify-center md:justify-start">
            {additionalImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-20 border-2 overflow-hidden flex-shrink-0 transition-all rounded-sm ${
                  activeImage === img ? "border-ink scale-95" : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={img ? `/assets/${img}` : "/assets/product image 1.jpg"}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/assets/product image 1.jpg"; }}
                />
              </button>
            ))}
          </div>

          <div
            className="flex-1 bg-canvas-cream relative overflow-hidden cursor-zoom-in aspect-[3/4] rounded-md"
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
                className="absolute top-4 right-4 z-20 p-3 rounded-full bg-white/90 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300"
              >
                {isWishlisted ? (
                  <HiHeart className="text-red-500 text-xl" />
                ) : (
                  <HiOutlineHeart className="text-ink text-xl hover:text-red-500 transition-colors" />
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
                src={activeImage ? `/assets/${activeImage}` : "/assets/product image 1.jpg"}
                alt={singleProduct?.title}
                className="w-full h-full object-cover transition-transform duration-100"
                style={{
                  transform: isZoomed ? "scale(1.8)" : "scale(1)",
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
                onError={(e) => { (e.target as HTMLImageElement).src = "/assets/product image 1.jpg"; }}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            {/* Category caption */}
            <p className="text-product-caption text-shade-50 uppercase tracking-tracked-wide mb-1">
              {singleProduct?.category}
            </p>
            <h1 className="text-heading-md text-ink leading-tight">
              {singleProduct?.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <HiStar key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-caption text-shade-50 tracking-tracked-wide">
                {reviews.length} Verified Reviews
              </span>
            </div>
            {/* Price row: strike + current + badge */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-price-strike text-price-strike line-through">
                PKR {originalPrice.toLocaleString()}
              </span>
              <span className="text-price-current text-ink">
                PKR {singleProduct?.price.toLocaleString()}
              </span>
              {discountPercent >= 30 && (
                <span className="bg-primary text-on-primary text-caption uppercase tracking-tracked font-medium px-2.5 py-0.5 rounded-pill">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            {/* In Stock indicator */}
            {inStock && (
              <p className="text-caption text-success-green mt-1 tracking-tracked-wide">In Stock</p>
            )}
          </div>

          {/* Color Selection Swatches */}
          <div className="space-y-3">
            <h4 className="text-caption uppercase tracking-tracked text-shade-50">
              Color: <span className="text-ink uppercase font-semibold">{color}</span>
            </h4>
            <div className="flex gap-2">
              {availableColors.map((c) => {
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all relative ${
                      isSelected ? "ring-2 ring-offset-2 ring-ink" : "border-shade-30"
                    }`}
                    style={{ backgroundColor: colorsMap[c.toLowerCase()] || c }}
                    aria-label={`Select Color: ${c}`}
                  >
                    {isSelected && (
                      <span className={`w-2 h-2 rounded-full ${c.toLowerCase() === "white" || c.toLowerCase() === "#ffffff" ? "bg-ink" : "bg-white"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection Pills */}
          <div className="space-y-3">
            <div className="flex justify-between text-caption uppercase tracking-tracked text-shade-50">
              <span>Size: <span className="text-ink font-semibold">{size}</span></span>
              <span className="underline cursor-pointer hover:text-ink">Size Guide</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((sz) => {
                const isSelected = size === sz;
                const isDisabled = isSizeDisabled(sz);
                return (
                  <button
                    key={sz}
                    disabled={isDisabled}
                    onClick={() => setSize(sz)}
                    className={`min-w-12 h-10 px-3 flex items-center justify-center text-caption font-medium tracking-tracked-wide transition-all relative rounded-sm ${
                      isDisabled
                        ? "border border-shade-20 text-shade-30 cursor-not-allowed line-through"
                        : isSelected
                        ? "bg-ink text-on-primary border-ink"
                        : "bg-canvas text-shade-50 border border-hairline hover:border-ink"
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
            <h4 className="text-caption uppercase tracking-tracked text-shade-50">Quantity</h4>
            <div className="w-32">
              <QuantityInputUpgrade
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
            </div>
          </div>

          {/* Add to Cart button — pill */}
          <div className="pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full text-button-label uppercase tracking-tracked py-4 transition-all focus:outline-none rounded-pill ${
                isOutOfStock
                  ? "bg-shade-20 text-shade-40 cursor-not-allowed"
                  : "bg-ink text-on-primary hover:bg-shade-60"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Bag"}
            </button>
          </div>

          <p className="text-caption text-shade-50 tracking-tracked-wide text-center">
            Free shipping nationwide · Safe secure SSL Checkout
          </p>

          <div className="border-t border-hairline pt-6 space-y-4">
            <Dropdown dropdownTitle="Description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod ultrices ante,
              eget hendrerit massa tristique vel. Curabitur vel luctus justo.
            </Dropdown>
            <Dropdown dropdownTitle="Product Details">
              100% premium quality fabric. Fully hand-embroidered, unstitched dress segment including dupattas, trouser fabric, and sleeves.
            </Dropdown>
            <Dropdown dropdownTitle="Delivery &amp; Return Details">
              Returns accepted within 14 days of delivery. Free shipping nationwide. International orders deliver within 10-15 business days.
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-huge border-t border-hairline pt-16">
        <h2 className="text-heading-section text-ink mb-10 text-center">
          Customer Reviews
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 bg-canvas-cream border border-hairline p-6 rounded-md h-fit">
            <div className="text-center pb-6 border-b border-hairline mb-6">
              <p className="text-5xl font-light font-script text-ink mb-2">{avgRating}</p>
              <div className="flex justify-center text-amber-500 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <HiStar key={s} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-caption text-shade-50 tracking-tracked-wide">Based on {reviews.length} reviews</p>
            </div>

            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
                const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-caption">
                    <span className="w-3 text-ink font-medium">{stars}*</span>
                    <div className="flex-1 bg-shade-20 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="w-8 text-right text-shade-40 font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <form onSubmit={handleReviewSubmit} className="bg-canvas border border-hairline p-6 rounded-md space-y-4">
              <h3 className="text-caption uppercase tracking-tracked font-semibold text-ink">Write a Review</h3>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="block w-full py-2 px-3 border border-hairline text-body-md"
                    placeholder="e.g. Ayesha Khan"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={reviewerCity}
                    onChange={(e) => setReviewerCity(e.target.value)}
                    className="block w-full py-2 px-3 border border-hairline text-body-md"
                    placeholder="e.g. Islamabad"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewRating(s)}
                      className={`text-2xl transition-colors ${s <= newRating ? "text-amber-500" : "text-shade-30"}`}
                    >
                      *
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Review Body</label>
                <textarea
                  required
                  rows={3}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="block w-full py-2 px-3 border border-hairline text-body-md outline-none focus:border-ink"
                  placeholder="Share details of your experience with this dress..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="bg-ink text-on-primary text-button-label uppercase tracking-tracked px-6 py-3 rounded-pill hover:bg-shade-60 transition-colors disabled:opacity-50"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>

            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-body-md text-shade-50 italic">No reviews yet for this product. Be the first to write one!</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="border-b border-hairline pb-6 space-y-2 animate-fade">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-body-md font-semibold text-ink">{r.username}</span>
                        <span className="text-caption bg-shade-20 text-shade-50 px-2 py-0.5 rounded-pill tracking-tracked-wide uppercase font-medium">{r.usercity}</span>
                        <span className="flex items-center gap-0.5 text-success-green text-caption font-bold">
                          <HiCheckCircle className="text-sm" /> Verified Buyer
                        </span>
                      </div>
                      <span className="text-caption text-shade-40">{new Date(r.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>

                    <div className="flex text-amber-500 text-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>{star <= r.rating ? "*" : ""}</span>
                      ))}
                    </div>

                    <p className="text-body-md text-ink/80 leading-relaxed font-light">
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
      <section className="mt-huge mb-20">
        <h2 className="section-title mb-10">You May Also Like</h2>
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