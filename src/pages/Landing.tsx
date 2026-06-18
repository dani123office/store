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
      <section className="mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
          <div className="relative overflow-hidden group">
            <img
              src="/assets/luxury fashion 7 1.png"
              alt="New Arrivals"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
              <h3 className="text-sm tracking-[0.25em] uppercase font-light mb-3">New Season</h3>
              <h2 className="text-3xl md:text-5xl font-light tracking-[0.12em] uppercase font-serif leading-tight">
                New Arrivals
              </h2>
              <Link
                to="/shop/new-arrivals"
                className="mt-6 border border-white text-white text-xs tracking-[0.2em] uppercase font-semibold px-10 py-3.5 hover:bg-white hover:text-[#151515] transition-all duration-300"
              >
                Discover Now
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden group">
            <img
              src="/assets/luxury fashion 7 2.png"
              alt="Bridals Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
              <h3 className="text-sm tracking-[0.25em] uppercase font-light mb-3">Luxury Bridal</h3>
              <h2 className="text-3xl md:text-5xl font-light tracking-[0.12em] uppercase font-serif leading-tight">
                Bridal Couture
              </h2>
              <Link
                to="/shop/bridals"
                className="mt-6 border border-white text-white text-xs tracking-[0.2em] uppercase font-semibold px-10 py-3.5 hover:bg-white hover:text-[#151515] transition-all duration-300"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

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
