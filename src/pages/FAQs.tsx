import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi2";
import { Link } from "react-router-dom";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQCategory {
  category: string;
  icon: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    category: "Orders & Payments",
    icon: "🛍",
    items: [
      {
        question: "How do I place an order?",
        answer: (
          <p>
            Simply browse our collections, add items to your cart, and proceed to checkout. You can also order via WhatsApp by messaging us with the product details.
          </p>
        ),
      },
      {
        question: "What payment methods do you accept?",
        answer: (
          <ul className="space-y-2">
            <li className="flex items-start gap-2"><span className="text-primary">•</span> Cash on Delivery (COD) — available nationwide</li>
            <li className="flex items-start gap-2"><span className="text-primary">•</span> Bank Transfer / Online Banking</li>
            <li className="flex items-start gap-2"><span className="text-primary">•</span> EasyPaisa / JazzCash</li>
            <li className="flex items-start gap-2"><span className="text-primary">•</span> Visa / MasterCard / JCB</li>
          </ul>
        ),
      },
      {
        question: "Can I modify or cancel my order after placing it?",
        answer: (
          <p>
            You can modify or cancel your order within <strong>2 hours</strong> of placing it by contacting us on WhatsApp. Once the order has been dispatched, cancellation is not possible.
          </p>
        ),
      },
      {
        question: "Do you offer Cash on Delivery?",
        answer: <p>Yes! COD is available for all domestic orders across Pakistan at no extra charge.</p>,
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    icon: "🚚",
    items: [
      {
        question: "How long does delivery take?",
        answer: (
          <p>
            Standard delivery takes 2–5 business days within Pakistan. International orders take 7–14 business days. See our{" "}
            <Link to="/shipping-returns" className="text-primary underline hover:text-primary-dark">Shipping & Returns</Link>{" "}
            page for full details.
          </p>
        ),
      },
      {
        question: "Do you offer free shipping?",
        answer: <p>Yes! We offer <strong>free shipping</strong> on all domestic orders — no minimum order required.</p>,
      },
      {
        question: "How can I track my order?",
        answer: (
          <p>
            Once your order is dispatched, you'll receive an SMS and email with a tracking link. You can also check your order status in the{" "}
            <Link to="/order-history" className="text-primary underline hover:text-primary-dark">Order History</Link>{" "}
            section.
          </p>
        ),
      },
    ],
  },
  {
    category: "Products & Sizing",
    icon: "👗",
    items: [
      {
        question: "Are the colors accurate in the photos?",
        answer: (
          <p>
            We strive for accuracy, but slight variations may occur due to screen settings and lighting during photography. The actual product may look slightly different from the image.
          </p>
        ),
      },
      {
        question: "How do I find my size?",
        answer: (
          <p>
            Please refer to our detailed{" "}
            <Link to="/size-guide" className="text-primary underline hover:text-primary-dark">Size Guide</Link>{" "}
            page for measurement charts and instructions.
          </p>
        ),
      },
      {
        question: "Can I get a custom size?",
        answer: (
          <p>
            Yes! We offer custom stitching for select products. Please contact us via WhatsApp with your measurements and we'll guide you through the process.
          </p>
        ),
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    icon: "🔄",
    items: [
      {
        question: "What is your return policy?",
        answer: (
          <p>
            Items can be returned within <strong>7 days</strong> of delivery. They must be unworn, unwashed, and in original condition with tags. Sale items and custom orders are non-returnable. See our{" "}
            <Link to="/shipping-returns" className="text-primary underline hover:text-primary-dark">full policy</Link>.
          </p>
        ),
      },
      {
        question: "How long do refunds take?",
        answer: (
          <p>
            Refunds are processed within 5–7 business days after we receive and inspect the returned item.
          </p>
        ),
      },
      {
        question: "Can I exchange an item for a different size?",
        answer: (
          <p>
            Absolutely! Contact us within 7 days of delivery with your order number, and we'll arrange an exchange.
          </p>
        ),
      },
    ],
  },
];

const FAQs = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const currentFAQs = faqData[activeCategory].items;

  return (
    <div className="bg-canvas text-ink">
      {/* Hero */}
      <section className="bg-canvas-cream py-huge">
        <div className="max-w-screen-md mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-script-lead text-ink/60 mb-2 font-serif italic">Help Center</p>
            <h1 className="text-heading-section text-ink mb-4" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
              Frequently Asked Questions
            </h1>
            <p className="text-body-md text-shade-50 max-w-lg mx-auto">
              Find answers to the most common questions about orders, shipping, sizing, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs + Accordion */}
      <section className="max-w-screen-md mx-auto px-5 sm:px-8 py-huge">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {faqData.map((cat, i) => (
            <button
              key={cat.category}
              onClick={() => { setActiveCategory(i); setOpenIndex(0); }}
              className={`px-5 py-2.5 rounded-pill text-product-title font-semibold transition-all duration-300 border ${
                activeCategory === i
                  ? "bg-ink text-on-primary border-ink"
                  : "bg-canvas text-shade-50 border-hairline hover:border-ink hover:text-ink"
              }`}
            >
              <span className="mr-1.5">{cat.icon}</span>
              {cat.category}
            </button>
          ))}
        </div>

        {/* Questions */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-hairline"
        >
          {currentFAQs.map((item, i) => (
            <div key={item.question} className="border-b border-hairline">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group focus:outline-none"
              >
                <span className="text-heading-md text-ink group-hover:text-primary transition-colors pr-4">
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-shade-40 text-xl flex-shrink-0"
                >
                  <HiChevronDown />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 text-body-md text-shade-50 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Still have questions */}
        <div className="mt-16 text-center">
          <p className="text-body-md text-shade-50 mb-4">Still have questions?</p>
          <Link
            to="/contact"
            className="inline-block bg-ink text-on-primary text-button-label uppercase tracking-tracked font-semibold px-10 py-4 rounded-pill hover:bg-shade-60 transition-colors duration-300"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FAQs;
