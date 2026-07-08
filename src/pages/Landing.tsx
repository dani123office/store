import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Banner, CategoriesSection, HomeCollectionSection } from "../components";
import { ThemeSettings } from "./HomeLayout";
import customFetch from "../axios/custom";
import { HiOutlineTruck, HiOutlineArrowPath, HiOutlineSparkles, HiOutlineLockClosed } from "react-icons/hi2";

const Landing = () => {
  const settings = useOutletContext<ThemeSettings>();
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  const activeSettings = settings || {
    categories_section: { enabled: true, title: "Shop By Category" },
    featured_collections: { enabled: true, title: "Featured Collections", tabs: [] },
    trending_products: { enabled: true, title: "Top Trending Products", limit: 5 },
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
  };

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await customFetch.get("/products");
        if (res.data) {
          const sorted = [...res.data].sort(
            (a: Product, b: Product) => b.popularity - a.popularity
          );
          const limit = activeSettings.trending_products?.limit || 5;
          setTrendingProducts(sorted.slice(0, limit));
        }
      } catch (e) {
        console.error("Failed to load trending products", e);
      }
    };
    fetchTrending();
  }, []);

  return (
    <>
      <Banner themeSettings={activeSettings} />

      {/* Trust Badges Bar */}
      <section className="bg-canvas-cream border-y border-hairline py-8">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <HiOutlineTruck className="text-3xl text-primary flex-shrink-0" />
              <div>
                <h4 className="text-caption uppercase tracking-tracked font-bold text-ink">Free Shipping</h4>
                <p className="text-caption text-shade-50">Nationwide delivery on all orders</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <HiOutlineArrowPath className="text-3xl text-primary flex-shrink-0" />
              <div>
                <h4 className="text-caption uppercase tracking-tracked font-bold text-ink">Easy Exchange</h4>
                <p className="text-caption text-shade-50">Hassle-free 7-day exchanges</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <HiOutlineSparkles className="text-3xl text-primary flex-shrink-0" />
              <div>
                <h4 className="text-caption uppercase tracking-tracked font-bold text-ink">Premium Fabric</h4>
                <p className="text-caption text-shade-50">100% authentic luxury segments</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <HiOutlineLockClosed className="text-3xl text-primary flex-shrink-0" />
              <div>
                <h4 className="text-caption uppercase tracking-tracked font-bold text-ink">Secure Payments</h4>
                <p className="text-caption text-shade-50">COD & encrypted SSL payments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Tabbed Section */}
      {activeSettings.featured_collections?.enabled && (
        <HomeCollectionSection themeSettings={activeSettings} />
      )}

      {/* Full-width Promotional Image Split */}
      {activeSettings.promotional_section?.enabled && (
        <section className="mt-huge">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
            <div className="relative overflow-hidden group">
              <img
                src={`/assets/${activeSettings.promotional_section.left_image}`}
                alt={activeSettings.promotional_section.left_title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
                <p className="text-script-lead text-white/90 mb-2">{activeSettings.promotional_section.left_subtitle}</p>
                <h2 className="text-display-hero text-white">
                  {activeSettings.promotional_section.left_title}
                </h2>
                <Link
                  to={activeSettings.promotional_section.left_btn_link}
                  className="mt-6 bg-white text-ink text-button-label uppercase tracking-tracked font-semibold px-10 py-4 rounded-pill hover:bg-shade-20 transition-all duration-300"
                >
                  {activeSettings.promotional_section.left_btn_text}
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden group">
              <img
                src={`/assets/${activeSettings.promotional_section.right_image}`}
                alt={activeSettings.promotional_section.right_title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
                <p className="text-script-lead text-white/90 mb-2">{activeSettings.promotional_section.right_subtitle}</p>
                <h2 className="text-display-hero text-white">
                  {activeSettings.promotional_section.right_title}
                </h2>
                <Link
                  to={activeSettings.promotional_section.right_btn_link}
                  className="mt-6 bg-white text-ink text-button-label uppercase tracking-tracked font-semibold px-10 py-4 rounded-pill hover:bg-shade-20 transition-all duration-300"
                >
                  {activeSettings.promotional_section.right_btn_text}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Maroon Bestsellers Band — editorial circular portraits */}
      {activeSettings.trending_products?.enabled && trendingProducts.length > 0 && (
        <section className="bg-surface-maroon text-on-primary mt-huge py-huge px-5 sm:px-8">
          <div className="max-w-screen-2xl mx-auto text-center">
            <p className="text-script-lead text-white/70 mb-2">Season's Finest</p>
            <h2 className="text-heading-section text-white mb-12">
              {activeSettings.trending_products?.title || "Bestsellers"}
            </h2>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {trendingProducts.slice(0, 4).map((product: Product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-surface-maroon-elevated transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={`/assets/${product.image}`}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-product-title text-white/90">{product.title}</span>
                  <span className="text-price-current text-white">PKR {product.price.toLocaleString()}</span>
                </Link>
              ))}
            </div>
            <div className="mt-12">
              <Link
                to="/shop"
                className="inline-block border border-on-primary text-on-primary text-button-label uppercase tracking-tracked font-semibold px-10 py-4 rounded-pill hover:bg-white/10 transition-all duration-300"
              >
                View All
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid Section */}
      {activeSettings.categories_section?.enabled && (
        <CategoriesSection themeSettings={activeSettings} />
      )}

      {/* Instagram Lookbook Gallery */}
      <section className="max-w-screen-2xl mx-auto px-5 sm:px-8 mt-huge">
        <div className="text-center mb-10">
          <p className="text-script-lead text-primary/80 font-serif italic mb-1">#ZarkaCouture</p>
          <h2 className="text-heading-section text-ink">Shop the Look</h2>
          <p className="text-body-md text-shade-50 mt-2">Tag us on Instagram to be featured in our lookbook gallery.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { img: "product image 1.jpg", link: "/shop" },
            { img: "luxury fashion 7 1.png", link: "/shop" },
            { img: "product image 5.jpg", link: "/shop" },
            { img: "luxury fashion 7 2.png", link: "/shop" },
          ].map((item, idx) => (
            <div key={idx} className="relative group overflow-hidden aspect-[3/4] rounded-md bg-canvas-cream">
              <img
                src={`/assets/${item.img}`}
                alt="Editorial Look"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/banner.jpg";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-300 flex items-center justify-center">
                <Link
                  to={item.link}
                  className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-ink text-caption uppercase tracking-tracked font-semibold px-6 py-3 rounded-pill hover:bg-shade-20"
                >
                  View Outfit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-canvas-cream mt-huge py-huge">
        <div className="max-w-screen-md mx-auto px-5 text-center">
          <p className="text-script-lead text-ink/70 mb-2">Stay in Touch</p>
          <h2 className="text-heading-section text-ink mb-4">
            Join Our Newsletter
          </h2>
          <p className="text-body-md text-shade-50 mb-8">
            Subscribe for exclusive access to new collections, private sales and more.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector("input");
              if (input) input.value = "";
            }}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 border border-hairline bg-canvas px-5 py-3.5 text-body-md outline-none focus:border-ink transition-colors rounded-pill"
              required
            />
            <button
              type="submit"
              className="bg-ink text-on-primary text-button-label uppercase tracking-tracked font-semibold px-10 py-3.5 rounded-pill hover:bg-shade-60 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Landing;