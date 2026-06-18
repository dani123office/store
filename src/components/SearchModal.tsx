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
  
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("zarka_recent_searches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, [isOpen]);

  // Focus input on open
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

  // Debounced Search API call
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await customFetch.get(`/products`);
        if (res.data) {
          const filtered = res.data.filter((p: Product) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filtered.slice(0, 6)); // limit to 6 results
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

  // Handle saving search term to localStorage
  const saveSearchTerm = (term: string) => {
    if (!term.trim()) return;
    const cleanTerm = term.trim();
    const updated = [cleanTerm, ...recentSearches.filter((t) => t !== cleanTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("zarka_recent_searches", JSON.stringify(updated));
  };

  // Keyboard navigation handler
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm transition-opacity animate-fade">
      <div className="min-h-screen bg-white py-8 px-5">
        <div className="max-w-4xl mx-auto">
          {/* Top Header Controls */}
          <div className="flex items-center justify-between border-b border-[#E2E2E2] pb-6 mb-8">
            <div className="flex items-center gap-3 flex-1">
              <HiOutlineMagnifyingGlass className="text-xl text-[#151515]/60" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for luxury suits, bridal, collections..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-lg md:text-xl font-light outline-none border-none placeholder:text-[#151515]/30 tracking-wide bg-transparent"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#f8f8f8] rounded-full text-[#151515]/60 hover:text-[#151515] transition-colors"
            >
              <HiXMark className="text-2xl" />
            </button>
          </div>

          {/* Results Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left Column: Recent Searches & Suggestions */}
            <div className="md:col-span-1 space-y-8">
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-[#151515]/50 tracking-[0.2em] uppercase mb-4">
                    Recent Searches
                  </h3>
                  <div className="space-y-2.5">
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(term)}
                        className="flex items-center gap-2.5 text-sm text-[#151515] hover:opacity-75 transition-opacity"
                      >
                        <HiClock className="text-[#151515]/40" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-semibold text-[#151515]/50 tracking-[0.2em] uppercase mb-4">
                  Suggested Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Unstitched", "Ready To Wear", "Bridals", "Jewellery"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        navigate(`/shop/${cat.toLowerCase().replace(/\s+/g, "-")}`);
                        onClose();
                      }}
                      className="text-xs bg-[#f8f8f8] border border-[#e8e8e8] px-4 py-2 hover:bg-[#151515] hover:text-white hover:border-[#151515] transition-all tracking-wider uppercase"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Search Results */}
            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold text-[#151515]/50 tracking-[0.2em] uppercase mb-4">
                Products {loading && "..."}
              </h3>

              {loading && results.length === 0 && (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex gap-4 items-center">
                      <div className="w-16 h-20 bg-gray-100 skeleton-shimmer"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-100 skeleton-shimmer w-3/4"></div>
                        <div className="h-4 bg-gray-100 skeleton-shimmer w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && query.trim() && results.length === 0 && (
                <p className="text-sm text-[#151515]/60 mt-4 font-light">
                  No products matched your search. Try adjusting your terms.
                </p>
              )}

              <div className="divide-y divide-[#E2E2E2]">
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
                        ? "bg-[#f8f8f8] px-4 -mx-4 border-l-2 border-[#151515]"
                        : "hover:bg-[#fafafa]"
                    }`}
                  >
                    <img
                      src={`/assets/${product.image}`}
                      alt={product.title}
                      className="w-16 h-20 object-cover object-center border border-[#e8e8e8]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#151515]/50 uppercase tracking-widest mb-1">
                        {product.category}
                      </p>
                      <h4 className="text-sm font-semibold text-[#151515] truncate tracking-wide font-serif">
                        {product.title}
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#151515] tracking-widest">
                        PKR {product.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {results.length > 0 && (
                <div className="pt-6 border-t border-[#E2E2E2] mt-4 text-center">
                  <button
                    onClick={() => {
                      saveSearchTerm(query);
                      navigate(`/shop?query=${encodeURIComponent(query)}`);
                      onClose();
                    }}
                    className="text-xs font-semibold tracking-[0.25em] uppercase hover:opacity-75 transition-opacity"
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
