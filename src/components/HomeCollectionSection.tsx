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
    <section className="max-w-screen-2xl mx-auto px-5 sm:px-8 mt-huge">
      <h2 className="section-title mb-6">{title}</h2>

      {tabs.length > 0 && (
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-3 border-b border-hairline pb-3 mb-10 text-nav-label uppercase tracking-tracked text-shade-40">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTabIdx(idx)}
              className={`pb-2.5 transition-all duration-300 font-medium whitespace-nowrap ${
                idx === activeTabIdx
                  ? "border-b-2 border-ink text-ink font-semibold"
                  : "hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="min-h-[400px]">
        <ProductGridWrapper
          key={activeCategory}
          category={activeCategory === "all" ? undefined : activeCategory}
          limit={8}
        >
          <ProductGrid className="horizontal-scroll-list" />
        </ProductGridWrapper>
      </div>

      <div className="text-center mt-12">
        <Link
          to="/shop"
          className="inline-block border border-ink text-ink text-button-label uppercase tracking-tracked font-semibold px-10 py-4 rounded-pill hover:bg-ink hover:text-on-primary transition-all duration-300"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default HomeCollectionSection;