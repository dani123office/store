import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ScrollToTop } from "../components";
import customFetch from "../axios/custom";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  btn_text: string;
  btn_link: string;
}

interface CollectionTab {
  label: string;
  category: string;
}

export interface ThemeSettings {
  announcement: {
    text: string;
    bg_color: string;
    text_color: string;
    enabled: boolean;
  };
  logo_text: string;
  slides: Slide[];
  categories_section: {
    enabled: boolean;
    title: string;
  };
  featured_collections: {
    enabled: boolean;
    title: string;
    tabs: CollectionTab[];
  };
  trending_products: {
    enabled: boolean;
    title: string;
    limit: number;
  };
  whatsapp: {
    phone: string;
    enabled: boolean;
    message: string;
    position: "bottom-right" | "bottom-left";
  };
  installments: {
    enabled: boolean;
    provider: string;
    count: number;
  };
  promotional_section: {
    enabled: boolean;
    left_image: string;
    left_subtitle: string;
    left_title: string;
    left_btn_text: string;
    left_btn_link: string;
    right_image: string;
    right_subtitle: string;
    right_title: string;
    right_btn_text: string;
    right_btn_link: string;
  };
}

export const defaultThemeSettings: ThemeSettings = {
  announcement: {
    text: "Free Shipping Nationwide — For Queries: +923-111-111-975",
    bg_color: "#000000",
    text_color: "#ffffff",
    enabled: true,
  },
  logo_text: "ZARKA COUTURE",
  slides: [
    {
      id: "1",
      title: "SATORI 2026",
      subtitle: "STILLNESS & LUXURY",
      image: "banner1.jpg",
      btn_text: "LIVE NOW",
      btn_link: "/shop/luxury-collection",
    },
    {
      id: "2",
      title: "FESTIVE EID II 2026",
      subtitle: "NEW ARRIVALS",
      image: "banner.jpg",
      btn_text: "SHOP NOW",
      btn_link: "/shop/unstitched",
    },
  ],
  categories_section: {
    enabled: true,
    title: "Shop By Category",
  },
  featured_collections: {
    enabled: true,
    title: "Featured Collections",
    tabs: [
      { label: "ZSJ BASICS 2026", category: "special-edition" },
      { label: "FESTIVE EID II 2026", category: "luxury-collection" },
      { label: "PRET EID II 2026", category: "summer-edition" },
      { label: "SATORI 2026", category: "unique-collection" },
    ],
  },
  trending_products: {
    enabled: true,
    title: "Top Trending Products",
    limit: 5,
  },
  whatsapp: {
    phone: "+923173179230",
    enabled: true,
    message: "Hi, I would like to make an inquiry.",
    position: "bottom-right",
  },
  installments: {
    enabled: true,
    provider: "baadmay",
    count: 3,
  },
  promotional_section: {
    enabled: true,
    left_image: "luxury fashion 7 1.png",
    left_subtitle: "New Season",
    left_title: "New Arrivals",
    left_btn_text: "Discover Now",
    left_btn_link: "/shop/new-arrivals",
    right_image: "luxury fashion 7 2.png",
    right_subtitle: "Luxury Bridal",
    right_title: "Bridal Couture",
    right_btn_text: "Explore Collection",
    right_btn_link: "/shop/bridals",
  },
};

const HomeLayout = () => {
  const [settings, setSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const location = useLocation();
  const [flyingItems, setFlyingItems] = useState<Array<{ id: number; image: string; startX: number; startY: number }>>([]);

  useEffect(() => {
    const handleCartFly = (e: Event) => {
      const customEvent = e as CustomEvent<{ image: string; startX: number; startY: number }>;
      const { image, startX, startY } = customEvent.detail;
      setFlyingItems((prev) => [...prev, { id: Date.now() + Math.random(), image, startX, startY }]);
    };

    window.addEventListener("cart-fly", handleCartFly);
    return () => window.removeEventListener("cart-fly", handleCartFly);
  }, []);

  useEffect(() => {
    // Load SEO settings from localStorage
    const seoStored = localStorage.getItem("zarka_seo_settings");
    const seo = seoStored ? JSON.parse(seoStored) : {
      metaTitleTemplate: "{Page Title} | ZARKA COUTURE",
      defaultMetaDescription: "Premium luxury designer dresses, unstitched, ready to wear, bridals & jewellery. Free shipping nationwide.",
      gaTrackingId: "G-XXXXXXXXXX",
      fbPixelId: "123456789012345",
    };

    // Determine Page Title
    let pageTitle = "Home";
    const path = location.pathname;
    if (path.startsWith("/product/")) {
      pageTitle = "Product Details";
    } else if (path === "/shop") {
      pageTitle = "Shop Collection";
    } else if (path === "/cart") {
      pageTitle = "Your Shopping Cart";
    } else if (path === "/checkout") {
      pageTitle = "Secure Checkout";
    } else if (path === "/wishlist") {
      pageTitle = "Your Wishlist";
    } else if (path.startsWith("/admin")) {
      pageTitle = "Admin Dashboard";
    } else {
      const segment = path.split("/").pop();
      if (segment) {
        pageTitle = segment.charAt(0).toUpperCase() + segment.slice(1);
      }
    }

    // Set Document Title
    const formattedTitle = seo.metaTitleTemplate.replace("{Page Title}", pageTitle);
    document.title = formattedTitle;

    // Set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.defaultMetaDescription);

    // Google Analytics Script Injection
    if (seo.gaTrackingId && seo.gaTrackingId !== "G-XXXXXXXXXX") {
      const gaScriptId = "zarka-ga-script";
      if (!document.getElementById(gaScriptId)) {
        const script1 = document.createElement("script");
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${seo.gaTrackingId}`;
        script1.id = gaScriptId;
        document.head.appendChild(script1);

        const script2 = document.createElement("script");
        script2.id = gaScriptId + "-init";
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${seo.gaTrackingId}');
        `;
        document.head.appendChild(script2);
      }
    }

    // Facebook Pixel Script Injection
    if (seo.fbPixelId && seo.fbPixelId !== "123456789012345") {
      const fbScriptId = "zarka-fb-pixel";
      if (!document.getElementById(fbScriptId)) {
        const script = document.createElement("script");
        script.id = fbScriptId;
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${seo.fbPixelId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(script);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        customFetch.get("/db-migrate-custom").catch(() => {});
        customFetch.get("/db-migrate-custom-v2").catch(() => {});
        const res = await customFetch.get("/stores");
        if (res.data && res.data.length > 0) {
          const store = res.data[0];
          if (store.theme_settings) {
            const parsed = JSON.parse(store.theme_settings);
            setSettings({
              ...defaultThemeSettings,
              ...parsed,
              announcement: { ...defaultThemeSettings.announcement, ...(parsed.announcement || {}) },
              whatsapp: { ...defaultThemeSettings.whatsapp, ...(parsed.whatsapp || {}) },
              installments: { ...defaultThemeSettings.installments, ...(parsed.installments || {}) },
              featured_collections: { ...defaultThemeSettings.featured_collections, ...(parsed.featured_collections || {}) },
              trending_products: { ...defaultThemeSettings.trending_products, ...(parsed.trending_products || {}) },
            });
            return;
          }
        }
        // Fallback to local storage if store settings are not in the database response
        const fallback = localStorage.getItem("zarka_theme_settings_fallback");
        if (fallback) {
          setSettings(JSON.parse(fallback));
        }
      } catch (e) {
        console.error("Failed to load store settings on frontend layout", e);
        const fallback = localStorage.getItem("zarka_theme_settings_fallback");
        if (fallback) {
          setSettings(JSON.parse(fallback));
        }
      }
    };
    fetchSettings();
  }, []);

  const wa = settings.whatsapp;
  const whatsappUrl = `https://wa.me/${wa.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    wa.message
  )}`;

  return (
    <>
      <ScrollToTop />
      {settings.announcement.enabled && (
        <div
          className="announcement-bar transition-all duration-300"
          style={{
            backgroundColor: settings.announcement.bg_color,
            color: settings.announcement.text_color,
          }}
        >
          {settings.announcement.text}
        </div>
      )}
      <Header logoText={settings.logo_text} />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Outlet context={settings} />
        </motion.div>
      </AnimatePresence>
      <Footer logoText={settings.logo_text} />

      {/* Floating WhatsApp Button */}
      {wa.enabled && wa.phone && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed z-50 bg-[#25d366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center whatsapp-bounce`}
          style={{
            bottom: "24px",
            right: wa.position === "bottom-right" ? "24px" : "auto",
            left: wa.position === "bottom-left" ? "24px" : "auto",
          }}
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.453 5.438 1.454 5.761 0 10.447-4.686 10.45-10.45.002-2.791-1.085-5.413-3.061-7.393C17.45 1.787 14.832.7 12.04.7 6.279.7 1.59 5.387 1.587 11.149c-.001 1.942.505 3.84 1.467 5.437l-.963 3.518 3.556-.931zm13.136-7.37c-.3-.15-1.771-.875-2.04-.972-.27-.1-.466-.15-.66.15-.194.3-.75.94-.919 1.135-.168.19-.337.21-.637.06-.3-.15-1.264-.467-2.41-1.488-.891-.795-1.493-1.778-1.668-2.078-.175-.3-.019-.461.13-.61.135-.133.3-.349.45-.523.15-.174.2-.291.3-.485.1-.194.05-.364-.025-.515-.075-.15-.66-1.59-.905-2.18-.24-.578-.48-.5-.66-.51-.17-.008-.365-.01-.56-.01-.195 0-.514.073-.78.365-.268.291-1.025 1.002-1.025 2.444 0 1.442 1.049 2.839 1.196 3.033.147.194 2.062 3.149 4.996 4.413.698.301 1.243.481 1.668.616.7.223 1.338.192 1.843.117.563-.083 1.771-.725 2.02-1.425.25-.7.25-1.299.175-1.425-.076-.127-.27-.2-.57-.35z" />
          </svg>
        </a>
      )}

      {/* Flying Cart Overlay Elements */}
      <AnimatePresence>
        {flyingItems.map((item) => {
          const cartIcon = document.getElementById("header-cart-icon");
          const rect = cartIcon?.getBoundingClientRect();
          const targetX = rect ? rect.left + rect.width / 2 : window.innerWidth - 80;
          const targetY = rect ? rect.top + rect.height / 2 : 40;

          return (
            <motion.div
              key={item.id}
              initial={{
                position: "fixed",
                left: item.startX - 24,
                top: item.startY - 24,
                width: 48,
                height: 48,
                borderRadius: "9999px",
                border: "2px solid #151515",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                zIndex: 9999,
                overflow: "hidden",
                pointerEvents: "none",
                backgroundColor: "#ffffff",
              }}
              animate={{
                left: [item.startX - 24, item.startX + (targetX - item.startX) * 0.4, targetX - 12],
                top: [item.startY - 24, item.startY - 120, targetY - 12],
                scale: [1, 0.8, 0.15],
                opacity: [1, 0.9, 0.2],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.85,
                ease: [0.25, 1, 0.5, 1],
              }}
              onAnimationComplete={() => {
                setFlyingItems((prev) => prev.filter((i) => i.id !== item.id));
              }}
            >
              <img
                src={`/assets/${item.image}`}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "/assets/product image 1.jpg"; }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </>
  );
};

export default HomeLayout;
