import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeSettings } from "../pages/HomeLayout";

interface BannerProps {
  themeSettings?: ThemeSettings;
}

const Banner = ({ themeSettings }: BannerProps) => {
  const slides = themeSettings?.slides || [];
  const [activeIndex, setActiveIndex] = useState(0);

  // Automatic transition every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="hero-banner w-full flex flex-col justify-end items-center pb-16 md:pb-24 bg-gray-900 min-h-[600px]">
        <h2 className="text-white text-center text-4xl md:text-6xl font-light tracking-[0.15em] uppercase font-serif">
          Luxury Designer Dresses
        </h2>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[85vh] min-h-[550px] overflow-hidden bg-black select-none">
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        const imageUrl = slide.image.startsWith("http") || slide.image.startsWith("/")
          ? slide.image
          : `/assets/${slide.image}`;

        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col justify-end items-center pb-20 md:pb-28 ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 100%), url("${imageUrl}")`,
              }}
            />

            {/* Slide Content */}
            <div className="relative z-20 px-5 text-center flex flex-col items-center max-w-3xl space-y-4">
              <h3 className="text-white/90 text-sm md:text-base tracking-[0.2em] font-light uppercase animate-fade-in">
                {slide.subtitle}
              </h3>
              <h2 className="text-white text-center text-4xl md:text-6xl font-light tracking-[0.15em] uppercase leading-tight font-serif">
                {slide.title}
              </h2>
              <div className="flex justify-center items-center gap-4 pt-4 flex-col sm:flex-row">
                <Link
                  to={slide.btn_link || "/shop"}
                  className="bg-white text-[#151515] text-xs md:text-sm tracking-[0.2em] uppercase font-semibold px-10 py-3.5 hover:bg-[#e6e6e6] transition-all duration-300 shadow-md"
                >
                  {slide.btn_text || "Shop Now"}
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide Navigation Dots */}
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
