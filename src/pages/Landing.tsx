import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Banner, CategoriesSection, HomeCollectionSection, ProductItem } from "../components";
import { ThemeSettings } from "./HomeLayout";
import customFetch from "../axios/custom";

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

      {/* Featured Collections Tabbed Section */}
      {activeSettings.featured_collections?.enabled && (
        <HomeCollectionSection themeSettings={activeSettings} />
      )}

      {/* Full-width Promotional Image Split */}
      {activeSettings.promotional_section?.enabled && (
        <section className="mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
            <div className="relative overflow-hidden group">
              <img
                src={`/assets/${activeSettings.promotional_section.left_image}`}
                alt={activeSettings.promotional_section.left_title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
                <h3 className="text-sm tracking-[0.25em] uppercase font-light mb-3">{activeSettings.promotional_section.left_subtitle}</h3>
                <h2 className="text-3xl md:text-5xl font-light tracking-[0.12em] uppercase font-serif leading-tight">
                  {activeSettings.promotional_section.left_title}
                </h2>
                <Link
                  to={activeSettings.promotional_section.left_btn_link}
                  className="mt-6 border border-white text-white text-xs tracking-[0.2em] uppercase font-semibold px-10 py-3.5 hover:bg-white hover:text-[#151515] transition-all duration-300"
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
                <h3 className="text-sm tracking-[0.25em] uppercase font-light mb-3">{activeSettings.promotional_section.right_subtitle}</h3>
                <h2 className="text-3xl md:text-5xl font-light tracking-[0.12em] uppercase font-serif leading-tight">
                  {activeSettings.promotional_section.right_title}
                </h2>
                <Link
                  to={activeSettings.promotional_section.right_btn_link}
                  className="mt-6 border border-white text-white text-xs tracking-[0.2em] uppercase font-semibold px-10 py-3.5 hover:bg-white hover:text-[#151515] transition-all duration-300"
                >
                  {activeSettings.promotional_section.right_btn_text}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending Products Section */}
      {activeSettings.trending_products?.enabled && trendingProducts.length > 0 && (
        <section className="max-w-screen-2xl mx-auto px-5 mt-24">
          <h2 className="section-title mb-12 font-serif">
            {activeSettings.trending_products?.title || "Trending Now"}
          </h2>
          <div className="collection-grid">
            {trendingProducts.map((product: Product) => (
              <ProductItem
                key={product.id}
                id={product.id}
                image={product.image}
                title={product.title}
                category={product.category}
                price={product.price}
                popularity={product.popularity}
                stock={product.stock}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-block border border-[#151515] text-xs font-semibold tracking-[0.2em] uppercase text-[#151515] px-10 py-3.5 hover:bg-[#151515] hover:text-white transition-all duration-300"
            >
              View All Products
            </Link>
          </div>
        </section>
      )}

      {/* Categories Grid Section */}
      {activeSettings.categories_section?.enabled && (
        <CategoriesSection themeSettings={activeSettings} />
      )}

      {/* Newsletter / Email Signup Section */}
      <section className="bg-[#f8f6f3] mt-24 py-20">
        <div className="max-w-screen-md mx-auto px-5 text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] uppercase text-[#151515] font-serif mb-4">
            Stay Connected
          </h2>
          <p className="text-sm text-[#151515]/60 tracking-wider mb-8">
            Subscribe to our newsletter for exclusive access to new collections, private sales and more.
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
              className="flex-1 border border-[#c8c8c8] bg-white px-5 py-3.5 text-sm tracking-wider outline-none focus:border-[#151515] transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-[#151515] text-white text-xs tracking-[0.2em] uppercase font-semibold px-10 py-3.5 hover:bg-[#333] transition-colors"
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
