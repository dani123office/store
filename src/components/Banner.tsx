import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ThemeSettings } from "../pages/HomeLayout";

interface BannerProps {
  themeSettings?: ThemeSettings;
}

const Banner = ({ themeSettings }: BannerProps) => {
  const slides = themeSettings?.slides || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || slides.length <= 1) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const onImageLoad = useCallback((url: string) => {
    setLoadedImages((prev) => {
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="hero-banner w-full flex flex-col justify-end items-center pb-16 md:pb-24 bg-gray-900 h-[85vh] md:h-[calc(100vh-120px)]">
        <h2 className="text-white text-center text-4xl md:text-6xl font-light tracking-[0.15em] uppercase font-serif">
          Luxury Designer Dresses
        </h2>
      </div>
    );
  }

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative w-full h-[85vh] md:h-[calc(100vh-120px)] overflow-hidden bg-gray-900 select-none"
    >
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        const imageUrl = slide.image.startsWith("http") || slide.image.startsWith("/")
          ? slide.image
          : `/assets/${slide.image}`;
        const loaded = loadedImages.has(imageUrl);

        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col justify-end items-center pb-20 md:pb-28 ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div
              className={`absolute inset-0 transition-[transform] duration-[10000ms] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
            >
              <img
                src={imageUrl}
                alt=""
                onLoad={() => onImageLoad(imageUrl)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/banner1.jpg";
                  onImageLoad(imageUrl);
                }}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 100%)`,
                }}
              />
            </div>

            <div className="relative z-20 px-8 py-10 md:px-16 md:py-14 text-center flex flex-col items-center max-w-2xl space-y-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl mx-5 animate-fade-in">
              <h3 className="text-white/90 text-xs md:text-sm tracking-[0.25em] font-light uppercase animate-fade-in">
                {slide.subtitle}
              </h3>
              <h2 className="text-white text-center text-3xl md:text-5xl font-light tracking-[0.18em] uppercase leading-tight font-serif">
                {slide.title}
              </h2>
              <div className="flex justify-center items-center gap-4 pt-2 flex-col sm:flex-row">
                <Link
                  to={slide.btn_link || "/shop"}
                  className="bg-white text-[#151515] text-xs tracking-[0.2em] uppercase font-semibold px-10 py-3.5 hover:bg-[#e6e6e6] transition-all duration-300 shadow-md"
                >
                  {slide.btn_text || "Shop Now"}
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
