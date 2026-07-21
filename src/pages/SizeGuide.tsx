import { useState } from "react";
import { motion } from "framer-motion";

interface SizeCategory {
  label: string;
  headers: string[];
  rows: string[][];
  note?: string;
}

const sizeData: SizeCategory[] = [
  {
    label: "Ready To Wear — Tops & Shirts",
    headers: ["Size", "Chest (in)", "Waist (in)", "Hip (in)", "Shoulder (in)", "Length (in)"],
    rows: [
      ["XS", "32", "26", "34", "13.5", "26"],
      ["S", "34", "28", "36", "14", "27"],
      ["M", "36", "30", "38", "14.5", "28"],
      ["L", "38", "32", "40", "15", "29"],
      ["XL", "40", "34", "42", "15.5", "30"],
    ],
    note: "Measurements may vary by ±0.5 inches due to handmade craftsmanship.",
  },
  {
    label: "Ready To Wear — Trousers",
    headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)", "Outseam (in)"],
    rows: [
      ["XS", "26", "34", "28", "38"],
      ["S", "28", "36", "29", "39"],
      ["M", "30", "38", "29", "39.5"],
      ["L", "32", "40", "30", "40"],
      ["XL", "34", "42", "30", "40.5"],
    ],
  },
  {
    label: "Unstitched Fabric",
    headers: ["Component", "Length (meters)", "Width (inches)"],
    rows: [
      ["Shirt / Kameez", "2.5 – 3.0", "44 – 45"],
      ["Trouser / Shalwar", "2.0 – 2.5", "44 – 45"],
      ["Dupatta (Chiffon)", "2.25 – 2.5", "30 – 36"],
      ["Dupatta (Net/Organza)", "2.5", "36 – 44"],
    ],
    note: "Fabric lengths are approximate. Custom stitching is available — contact us for details.",
  },
  {
    label: "Bridal Wear",
    headers: ["Size", "Bust (in)", "Waist (in)", "Hip (in)", "Sleeve (in)"],
    rows: [
      ["S", "34", "28", "36", "22"],
      ["M", "36", "30", "38", "23"],
      ["L", "38", "32", "40", "23.5"],
      ["XL", "40", "34", "42", "24"],
      ["XXL", "42", "36", "44", "24.5"],
    ],
    note: "Bridal orders are made-to-measure. Please share your exact measurements for a perfect fit.",
  },
];

const measurementTips = [
  {
    part: "Chest / Bust",
    instruction: "Measure around the fullest part of your bust, keeping the tape level and snug but not tight.",
  },
  {
    part: "Waist",
    instruction: "Measure around your natural waistline (the narrowest part of your torso), above the belly button.",
  },
  {
    part: "Hips",
    instruction: "Measure around the fullest part of your hips, keeping the tape parallel to the floor.",
  },
  {
    part: "Shoulder",
    instruction: "Measure from the edge of one shoulder to the other across the back.",
  },
  {
    part: "Sleeve",
    instruction: "Measure from the shoulder seam down to the desired sleeve length (wrist for full length).",
  },
];

const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState(0);

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
            <p className="text-script-lead text-ink/60 mb-2 font-serif italic">Find Your Fit</p>
            <h1 className="text-heading-section text-ink mb-4" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
              Size Guide
            </h1>
            <p className="text-body-md text-shade-50 max-w-lg mx-auto">
              Use our detailed size charts and measuring tips to find the perfect fit for every ZARKA COUTURE piece.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Size Tables */}
      <section className="max-w-screen-lg mx-auto px-5 sm:px-8 py-huge">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {sizeData.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-2.5 rounded-pill text-product-title font-semibold transition-all duration-300 border ${
                activeTab === i
                  ? "bg-ink text-on-primary border-ink"
                  : "bg-canvas text-shade-50 border-hairline hover:border-ink hover:text-ink"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Active Table */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="overflow-x-auto border border-hairline rounded-md">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-canvas-cream">
                  {sizeData[activeTab].headers.map((header) => (
                    <th
                      key={header}
                      className="py-4 px-5 text-product-title font-semibold text-ink whitespace-nowrap border-b border-hairline"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeData[activeTab].rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`border-b border-hairline/50 ${
                      rowIndex % 2 === 0 ? "bg-canvas" : "bg-canvas-cream/40"
                    } hover:bg-canvas-cream transition-colors`}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`py-3.5 px-5 text-body-md whitespace-nowrap ${
                          cellIndex === 0 ? "font-semibold text-ink" : "text-shade-50"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sizeData[activeTab].note && (
            <p className="mt-4 text-product-caption text-shade-40 italic">
              * {sizeData[activeTab].note}
            </p>
          )}
        </motion.div>
      </section>

      {/* How to Measure */}
      <section className="bg-canvas-cream py-huge">
        <div className="max-w-screen-md mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-script-lead text-primary/80 mb-2 font-serif italic">How to Measure</p>
            <h2 className="text-heading-section text-ink">Measuring Tips</h2>
          </motion.div>

          <div className="space-y-6">
            {measurementTips.map((tip, i) => (
              <motion.div
                key={tip.part}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-start gap-5 bg-canvas p-5 rounded-md border border-hairline"
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-ink text-on-primary flex items-center justify-center text-product-title font-bold">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-heading-md text-ink mb-1">{tip.part}</h3>
                  <p className="text-body-md text-shade-50">{tip.instruction}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-body-md text-shade-50 mb-1">Need help with sizing?</p>
            <p className="text-body-md text-shade-50">
              Contact us on WhatsApp and we'll help you find the perfect fit.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SizeGuide;
