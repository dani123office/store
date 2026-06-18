import CategoryItem from "./CategoryItem";
import { ThemeSettings } from "../pages/HomeLayout";

interface CategoriesSectionProps {
  themeSettings?: ThemeSettings;
}

const CategoriesSection = ({ themeSettings }: CategoriesSectionProps) => {
  const categories = [
    { title: "Special Edition", image: "luxury category 1.png", link: "special-edition" },
    { title: "Luxury Collection", image: "luxury category 2.png", link: "luxury-collection" },
    { title: "Summer Edition", image: "luxury category 3.png", link: "summer-edition" },
    { title: "Unique Collection", image: "luxury category 4.png", link: "unique-collection" },
  ];

  const title = themeSettings?.categories_section?.title || "Shop by Category";

  return (
    <section className="max-w-screen-2xl mx-auto px-5 mt-20 mb-20">
      <h2 className="section-title mb-10 font-serif">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
