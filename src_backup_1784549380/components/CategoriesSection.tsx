import { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import customFetch from "../axios/custom";
import { ThemeSettings } from "../pages/HomeLayout";

interface CategoriesSectionProps {
  themeSettings?: ThemeSettings;
}

const fallbackCategories = [
  { title: "New Arrivals", image: "product image 1.jpg", link: "new-arrivals" },
  { title: "Unstitched", image: "product image 3.jpg", link: "unstitched" },
  { title: "Ready To Wear", image: "product image 5.jpg", link: "ready-to-wear" },
  { title: "Bridals", image: "product image 7.jpg", link: "bridals" },
  { title: "Jewellery", image: "product image 9.jpg", link: "jewellery" },
  { title: "Special Prices", image: "product image 11.jpg", link: "special-prices" },
];

const imagePool = [
  "product image 1.jpg", "product image 3.jpg", "product image 5.jpg",
  "product image 7.jpg", "product image 9.jpg", "product image 11.jpg",
  "product image 13.jpg", "product image 15.jpg", "product image 17.jpg",
];

const CategoriesSection = ({ themeSettings }: CategoriesSectionProps) => {
  const [categories, setCategories] = useState(fallbackCategories);
  const title = themeSettings?.categories_section?.title || "Shop By Category";

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const res = await customFetch.get("/nav-items");
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data.map((item: any, idx: number) => ({
            title: item.label,
            image: imagePool[idx % imagePool.length],
            link: item.slug,
          })));
        }
      } catch {
        // use fallback
      }
    };
    fetchNavItems();
  }, []);

  return (
    <section className="max-w-screen-2xl mx-auto px-5 sm:px-8 mt-huge mb-huge">
      <h2 className="section-title mb-10">{title}</h2>
      <div className="horizontal-scroll-list">
        {categories.map((cat) => (
          <CategoryItem
            key={cat.link}
            categoryTitle={cat.title}
            image={cat.image}
            link={cat.link}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;