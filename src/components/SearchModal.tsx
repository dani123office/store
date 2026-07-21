import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiXMark, HiOutlineMagnifyingGlass, HiClock } from "react-icons/hi2";
import customFetch from "../axios/custom";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await customFetch.get("/categories");
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setSuggestedCategories(data.map((item: any) => item.cat_title || item.title));
        }
      } catch {
        setSuggestedCategories(["Unstitched", "Ready To Wear", "Bridals", "Jewellery"]);
      }
    };
    if (isOpen) fetchCategories();
  }, [isOpen]);

  useEffect(() => {
    const stored = localStorage.getItem("zarka_recent_searches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await customFetch.get(`/products`);
        if (res.data?.data) {
          const filtered = res.data.data.filter((p: Product) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filtered.slice(0, 6));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setActiveIndex(-1);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const saveSearchTerm = (term: string) => {
    if (!term.trim()) return;
    const cleanTerm = term.trim();
    const updated = [cleanTerm, ...recentSearches.filter((t) => t !== cleanTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("zarka_recent_searches", JSON.stringify(updated));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        results.length > 0 ? (prev - 1 + results.length) % results.length : -1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        saveSearchTerm(query);
        navigate(`/product/${results[activeIndex].id}`);
        onClose();
      } else if (query.trim()) {
        saveSearchTerm(query);
        navigate(`/shop?query=${encodeURIComponent(query)}`);
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/40 backdrop-blur-sm transition-opacity animate-fade">
      <div className="min-h-screen bg-canvas py-8 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-hairline pb-6 mb-8">
            <div className="flex items-center gap-3 flex-1">
              <HiOutlineMagnifyingGlass className="text-xl text-shade-50" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for unstitched, bridal, collections..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-lg md:text-xl font-light outline-none border-none placeholder:text-shade-30 tracking-tracked-wide bg-transparent text-ink"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-canvas-cream rounded-full text-shade-50 hover:text-ink transition-colors"
            >
              <HiXMark className="text-2xl" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-1 space-y-8">
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-caption uppercase tracking-tracked text-shade-50 mb-4">
                    Recent Searches
                  </h3>
                  <div className="space-y-2.5">
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(term)}
                        className="flex items-center gap-2.5 text-body-md text-ink hover:opacity-75 transition-opacity"
                      >
                        <HiClock className="text-shade-40" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-caption uppercase tracking-tracked text-shade-50 mb-4">
                  Suggested Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        navigate(`/shop/${cat.toLowerCase().replace(/\s+/g, "-")}`);
                        onClose();
                      }}
                      className="text-caption bg-canvas-cream border border-hairline px-4 py-2 rounded-pill hover:bg-ink hover:text-on-primary hover:border-ink transition-all tracking-tracked uppercase font-medium"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-caption uppercase tracking-tracked text-shade-50 mb-4">
                Products {loading && "..."}
              </h3>

              {loading && results.length === 0 && (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex gap-4 items-center">
                      <div className="w-16 h-20 bg-shade-20 skeleton-shimmer rounded-sm"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-shade-20 skeleton-shimmer w-3/4"></div>
                        <div className="h-4 bg-shade-20 skeleton-shimmer w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && query.trim() && results.length === 0 && (
                <p className="text-body-md text-shade-50 mt-4 font-light">
                  No products matched your search. Try adjusting your terms.
                </p>
              )}

              <div className="divide-y divide-hairline">
                {results.map((product, index) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => {
                      saveSearchTerm(query);
                      onClose();
                    }}
                    className={`flex gap-5 py-4 items-center transition-all ${
                      activeIndex === index
                        ? "bg-canvas-cream px-4 -mx-4 border-l-2 border-ink"
                        : "hover:bg-canvas-cream"
                    }`}
                  >
                    <img
                      src={`/assets/${product.image}`}
                      alt={product.title}
                      className="w-16 h-20 object-cover object-center border border-hairline rounded-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-caption text-shade-50 uppercase tracking-tracked-wide mb-1">
                        {product.category}
                      </p>
                      <h4 className="text-product-title text-ink truncate">
                        {product.title}
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="text-price-current text-ink">
                        PKR {product.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {results.length > 0 && (
                <div className="pt-6 border-t border-hairline mt-4 text-center">
                  <button
                    onClick={() => {
                      saveSearchTerm(query);
                      navigate(`/shop?query=${encodeURIComponent(query)}`);
                      onClose();
                    }}
                    className="text-button-label uppercase tracking-tracked text-ink hover:opacity-75 transition-opacity"
                  >
                    View All Matching Products &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;