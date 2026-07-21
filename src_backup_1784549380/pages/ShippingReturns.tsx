import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi2";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem = ({ title, children, isOpen, onToggle }: AccordionItemProps) => (
  <div className="border-b border-hairline">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-5 text-left group focus:outline-none"
    >
      <span className="text-heading-md text-ink group-hover:text-primary transition-colors">{title}</span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-shade-40 text-xl flex-shrink-0 ml-4"
      >
        <HiChevronDown />
      </motion.span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden"
        >
          <div className="pb-6 text-body-md text-shade-50 leading-relaxed">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ShippingReturns = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const shippingSections = [
    {
      title: "Delivery Areas & Timelines",
      content: (
        <>
          <p className="mb-4">We deliver across Pakistan and offer international shipping to select countries.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="py-3 pr-4 text-ink font-semibold text-product-title">Region</th>
                  <th className="py-3 pr-4 text-ink font-semibold text-product-title">Standard Delivery</th>
                  <th className="py-3 text-ink font-semibold text-product-title">Express Delivery</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-hairline/50">
                  <td className="py-3 pr-4">Major Cities (Karachi, Lahore, Islamabad)</td>
                  <td className="py-3 pr-4">2–4 Business Days</td>
                  <td className="py-3">Next Day</td>
                </tr>
                <tr className="border-b border-hairline/50">
                  <td className="py-3 pr-4">Other Cities</td>
                  <td className="py-3 pr-4">3–5 Business Days</td>
                  <td className="py-3">2–3 Business Days</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">International</td>
                  <td className="py-3 pr-4">7–14 Business Days</td>
                  <td className="py-3">5–7 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      title: "Shipping Charges",
      content: (
        <>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong>Free Shipping</strong> on all domestic orders — no minimum order required.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong>International Shipping</strong> charges are calculated at checkout based on weight and destination.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong>Express Delivery</strong> surcharge: PKR 250 for domestic orders.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Order Tracking",
      content: (
        <p>
          Once your order ships, you will receive an SMS and email with your tracking number and a link to track your parcel in real-time. You can also view your order status from the{" "}
          <a href="/order-history" className="text-primary underline hover:text-primary-dark transition-colors">
            Order History
          </a>{" "}
          section of your account.
        </p>
      ),
    },
    {
      title: "Return Policy",
      content: (
        <>
          <p className="mb-4">
            We want you to love your purchase. If you're not completely satisfied, you may return or exchange items within <strong>7 days</strong> of delivery.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Items must be <strong>unworn, unwashed</strong>, and in original condition with tags attached.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Sale items and customized orders are <strong>non-returnable</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Return shipping costs are the customer's responsibility unless the item is defective.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Exchange Process",
      content: (
        <>
          <ol className="space-y-3 list-decimal list-inside">
            <li>Contact us via WhatsApp or email within 7 days of receiving your order.</li>
            <li>Share your order number and reason for exchange.</li>
            <li>Ship the item back to us in its original packaging.</li>
            <li>Once received and inspected, we'll dispatch the exchange item within 2–3 business days.</li>
          </ol>
        </>
      ),
    },
    {
      title: "Refund Policy",
      content: (
        <p>
          Refunds are processed within <strong>5–7 business days</strong> after we receive and inspect the returned item. The refund will be credited to your original payment method. For COD orders, refunds are issued via bank transfer — our team will contact you for your account details.
        </p>
      ),
    },
  ];

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
            <p className="text-script-lead text-ink/60 mb-2 font-serif italic">Policies</p>
            <h1 className="text-heading-section text-ink mb-4" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
              Shipping & Returns
            </h1>
            <p className="text-body-md text-shade-50 max-w-lg mx-auto">
              Everything you need to know about delivery, returns, and exchanges at ZARKA COUTURE.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Accordion Content */}
      <section className="max-w-screen-md mx-auto px-5 sm:px-8 py-huge">
        <div className="border-t border-hairline">
          {shippingSections.map((section, i) => (
            <AccordionItem
              key={section.title}
              title={section.title}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            >
              {section.content}
            </AccordionItem>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ShippingReturns;
