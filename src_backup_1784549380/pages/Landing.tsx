import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Banner, CategoriesSection, HomeCollectionSection } from "../components";
import { ThemeSettings } from "./HomeLayout";
import customFetch from "../axios/custom";
import { HiOutlineTruck, HiOutlineArrowPath, HiOutlineSparkles, HiOutlineLockClosed } from "react-icons/hi2";

const iconMap: Record<string, React.ComponentType<any>> = {
  "truck": HiOutlineTruck,
  "arrow-path": HiOutlineArrowPath,
  "sparkles": HiOutlineSparkles,
  "lock": HiOutlineLockClosed,
};

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
      {activeSettings.trust_bar?.enabled && (
        <section className="bg-canvas-cream border-y border-hairline py-8">
          <div className="max-w-screen-2xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {activeSettings.trust_bar.items.map((item, idx) => {
                const IconComponent = iconMap[item.icon] || HiOutlineTruck;
                return (
                  <div key={idx} className="flex items-center gap-4 justify-center sm:justify-start">
                    <IconComponent className="text-3xl text-primary flex-shrink-0" />
                    <div>
                      <h4 className="text-caption uppercase tracking-tracked font-bold text-ink">{item.title}</h4>
                      <p className="text-caption text-shade-50">{item.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Collections Tabbed Section */}
      {activeSettings.featured_collections?.enabled && (
        <HomeCollectionSection themeSettings={activeSettings} />
      )}

      {/* Full-width Promotional Image Split */}
      {activeSettings.promotional_section?.enabled && (
        <section className="mt-huge">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
            <div className="relative flex flex-col justify-end items-start p-10 md:p-16 overflow-hidden bg-canvas-cream group">
              <img
                src={activeSettings.promotional_section.left_image ? `/assets/${activeSettings.promotional_section.left_image}` : "/assets/luxury fashion 7 1.png"}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/luxury fashion 7 1.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="relative z-10 text-left max-w-md">
                <p className="text-script-lead text-white/95 mb-2">
                  {activeSettings.promotional_section.left_subtitle}
                </p>
                <h3 className="text-display-hero text-white mb-6">
                  {activeSettings.promotional_section.left_title}
                </h3>
                <Link
                  to={activeSettings.promotional_section.left_btn_link || "/shop"}
                  className="bg-white text-ink text-button-label uppercase tracking-tracked font-semibold px-10 py-4 rounded-pill hover:bg-shade-20 transition-all duration-300"
                >
                  {activeSettings.promotional_section.left_btn_text}
                </Link>
              </div>
            </div>
            
            <div className="relative flex flex-col justify-end items-start p-10 md:p-16 overflow-hidden bg-canvas-cream group border-t md:border-t-0 md:border-l border-hairline">
              <img
                src={activeSettings.promotional_section.right_image ? `/assets/${activeSettings.promotional_section.right_image}` : "/assets/luxury fashion 7 2.png"}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/luxury fashion 7 2.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="relative z-10 text-left max-w-md">
                <p className="text-script-lead text-white/95 mb-2">
                  {activeSettings.promotional_section.right_subtitle}
                </p>
                <h3 className="text-display-hero text-white mb-6">
                  {activeSettings.promotional_section.right_title}
                </h3>
                <Link
                  to={activeSettings.promotional_section.right_btn_link || "/shop"}
                  className="bg-white text-ink text-button-label uppercase tracking-tracked font-semibold px-10 py-4 rounded-pill hover:bg-shade-20 transition-all duration-300"
                >
                  {activeSettings.promotional_section.right_btn_text}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Maroon Bestsellers Band Section */}
      {activeSettings.trending_products?.enabled && trendingProducts.length > 0 && (
        <section className="bg-primary text-on-primary py-16 overflow-hidden relative">
          <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/3 text-center lg:text-left flex flex-col items-center lg:items-start max-w-md">
              <p className="text-script-lead text-on-primary/80 mb-2">
                Season's Finest / Bestsellers
              </p>
              <h2 className="text-display-hero text-on-primary mb-6">
                {activeSettings.trending_products?.title || "Bestsellers"}
              </h2>
              <Link
                to="/shop"
                className="inline-block border border-on-primary text-on-primary text-button-label uppercase tracking-tracked font-semibold px-10 py-4 rounded-pill hover:bg-white/10 transition-all duration-300"
              >
                View All
              </Link>
            </div>

            <div className="lg:w-2/3 w-full overflow-x-auto scrollbar-none pb-4">
              <div className="flex gap-6 min-w-max px-2">
                {trendingProducts.map((product) => {
                  const strikePrice = product.price * 2;
                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="flex flex-col items-center text-center group w-44 shrink-0"
                    >
                      <div className="w-40 h-40 rounded-full overflow-hidden border border-on-primary/30 group-hover:border-on-primary/75 transition-all duration-500 bg-canvas-cream">
                        <img
                          src={`/assets/${product.image}`}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assets/product image 1.jpg";
                          }}
                        />
                      </div>
                      <h3 className="text-body-md font-semibold text-on-primary mt-4 truncate w-full px-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-caption text-on-primary/60 line-through text-[11px]">
                          Rs.{(strikePrice||0).toLocaleString()}
                        </span>
                        <span className="text-caption font-bold text-on-primary text-[13px]">
                          Rs.{(product.price||0).toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid Section */}
      {activeSettings.categories_section?.enabled && (
        <CategoriesSection themeSettings={activeSettings} />
      )}

      {/* Instagram Lookbook Gallery */}
      {activeSettings.instagram_gallery?.enabled && (
        <section className="max-w-screen-2xl mx-auto px-5 sm:px-8 mt-huge">
          <div className="text-center mb-10">
            <p className="text-script-lead text-primary/80 font-serif italic mb-1">
              {activeSettings.instagram_gallery.hashtag}
            </p>
            <h2 className="text-heading-section text-ink">
              {activeSettings.instagram_gallery.title}
            </h2>
            <p className="text-body-md text-shade-50 mt-2">Tag us on Instagram to be featured in our lookbook gallery.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activeSettings.instagram_gallery.items.map((item, idx) => (
              <div key={idx} className="relative group overflow-hidden aspect-[3/4] rounded-md bg-canvas-cream">
                <img
                  src={item.image ? `/assets/${item.image}` : "/assets/product image 1.jpg"}
                  alt="Editorial Look"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/product image 1.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-300 flex items-center justify-center">
                  <Link
                    to={item.link || "/shop"}
                    className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-ink text-caption uppercase tracking-tracked font-semibold px-6 py-3 rounded-pill hover:bg-shade-20"
                  >
                    View Outfit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      {activeSettings.newsletter?.enabled && (
        <section className="bg-canvas-cream mt-huge py-huge">
          <div className="max-w-screen-md mx-auto px-5 text-center">
            <p className="text-script-lead text-ink/70 mb-2">Stay in Touch</p>
            <h2 className="text-heading-section text-ink mb-4">
              {activeSettings.newsletter.title}
            </h2>
            <p className="text-body-md text-shade-50 mb-8">
              {activeSettings.newsletter.subtitle}
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
                {activeSettings.newsletter.button_text}
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default Landing;