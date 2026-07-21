import { Link } from "react-router-dom";

const CategoryItem = ({ categoryTitle, image, link }: { categoryTitle: string; image: string; link: string; }) => {
  return (
    <div className="relative group overflow-hidden aspect-[4/5] rounded-md">
      <Link to={`/shop/${link}`}>
        <img
          src={`/assets/${image}`}
          alt={categoryTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-md"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors rounded-md" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-white text-2xl font-bold tracking-tight leading-tight">
            {categoryTitle}
          </h3>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;