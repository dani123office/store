import { useState } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import ProductGridWrapper from "./ProductGridWrapper";
import { ThemeSettings } from "../pages/HomeLayout";

interface HomeCollectionSectionProps {
  themeSettings: ThemeSettings;
}

const HomeCollectionSection = ({ themeSettings }: HomeCollectionSectionProps) => {
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const title = themeSettings.featured_collections?.title || "Featured Collections";
  const tabs = themeSettings.featured_collections?.tabs || [];

  const activeTab = tabs[activeTabIdx];
  const activeCategory = activeTab?.category || "all";

  return (
    <section className="max-w-screen-2xl mx-auto px-5 mt-24">
      {/* Title */}
      <h2 className="section-title mb-6 font-serif">{title}</h2>

      {/* Tabs Navigation */}
      {tabs.length > 0 && (
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-3 border-b border-[#E2E2E2] pb-3 mb-10 text-xs md:text-sm tracking-[0.18em] uppercase text-[#151515]/50 font-sans">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTabIdx(idx)}
              className={`pb-2.5 transition-all duration-300 font-medium whitespace-nowrap ${
                idx === activeTabIdx
                  ? "border-b-2 border-[#151515] text-[#151515] font-semibold"
                  : "hover:text-[#151515]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Dynamic Products Grid */}
      <div className="min-h-[400px]">
        <ProductGridWrapper
          key={activeCategory} // Force re-render on category tab switch
          category={activeCategory === "all" ? undefined : activeCategory}
          limit={8}
        >
          <ProductGrid />
        </ProductGridWrapper>
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <Link
          to="/shop"
          className="inline-block border border-[#151515] text-xs font-semibold tracking-[0.2em] uppercase text-[#151515] px-10 py-3.5 hover:bg-[#151515] hover:text-white transition-all duration-300"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default HomeCollectionSection;
