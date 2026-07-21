import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

const AboutUs = () => {
  return (
    <div className="bg-canvas text-ink">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-canvas-cream">
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
        <motion.div
          className="relative text-center px-6 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-script-lead text-ink/60 mb-3 font-serif italic">Our Story</p>
          <h1 className="text-display-hero text-ink mb-6" style={{ fontSize: "clamp(36px, 6vw, 72px)" }}>
            ZARKA COUTURE
          </h1>
          <p className="text-body-md text-shade-50 max-w-xl mx-auto leading-relaxed">
            Unstitched fabric, ready-to-wear, and accessories — crafted for the modern woman who values elegance, tradition, and self-expression.
          </p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="max-w-screen-lg mx-auto px-5 sm:px-8 py-huge">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <p className="text-script-lead text-primary/80 mb-2 font-serif italic">Our Mission</p>
            <h2 className="text-heading-section text-ink mb-6">Crafting Elegance for Every Woman</h2>
            <p className="text-body-md text-shade-50 leading-relaxed mb-4">
              At ZARKA COUTURE, we believe every woman deserves to feel extraordinary. Our mission is to blend the rich heritage of South Asian craftsmanship with contemporary design, delivering luxury fashion that's accessible and meaningful.
            </p>
            <p className="text-body-md text-shade-50 leading-relaxed">
              From hand-selected fabrics to intricate embroidery, every piece in our collection tells a story of dedication, artistry, and timeless beauty.
            </p>
          </motion.div>
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="relative aspect-[4/5] rounded-md overflow-hidden bg-canvas-cream"
          >
            <img
              src="/assets/luxury fashion 7 1.png"
              alt="ZARKA COUTURE craftsmanship"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/banner1.jpg";
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="bg-canvas-cream py-huge">
        <div className="max-w-screen-lg mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-script-lead text-primary/80 mb-2 font-serif italic">What Defines Us</p>
            <h2 className="text-heading-section text-ink mb-14">Our Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Premium Quality",
                desc: "We source only the finest fabrics and materials, ensuring each garment meets the highest standards of luxury craftsmanship.",
                icon: "✦",
              },
              {
                title: "Artisan Heritage",
                desc: "Our designs honor centuries of embroidery and textile traditions, brought to life by skilled artisans with generations of expertise.",
                icon: "◆",
              },
              {
                title: "Modern Elegance",
                desc: "We blend timeless silhouettes with contemporary trends, creating pieces that are as relevant today as they will be tomorrow.",
                icon: "❖",
              },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="bg-canvas p-8 rounded-md border border-hairline hover:shadow-lg transition-shadow duration-300"
              >
                <span className="text-3xl text-primary mb-5 block">{value.icon}</span>
                <h3 className="text-heading-md text-ink mb-3">{value.title}</h3>
                <p className="text-body-md text-shade-50 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Banner */}
      <section className="bg-surface-maroon text-on-primary py-huge">
        <div className="max-w-screen-md mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-script-lead text-white/60 mb-3 font-serif italic">Since 2020</p>
            <h2 className="text-heading-section text-white mb-6">A Legacy of Luxury</h2>
            <p className="text-body-md text-white/70 leading-relaxed mb-10 max-w-lg mx-auto">
              What began as a passion for beautiful fabrics has grown into a beloved brand trusted by thousands of women across Pakistan and beyond.
            </p>
            <Link
              to="/shop"
              className="inline-block border border-white text-white text-button-label uppercase tracking-tracked font-semibold px-10 py-4 rounded-pill hover:bg-white/10 transition-all duration-300"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-screen-md mx-auto px-5 sm:px-8 py-huge text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-heading-section text-ink mb-4">Get in Touch</h2>
          <p className="text-body-md text-shade-50 mb-8">
            Have questions or want to learn more about our collections? We'd love to hear from you.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-ink text-on-primary text-button-label uppercase tracking-tracked font-semibold px-10 py-4 rounded-pill hover:bg-shade-60 transition-colors duration-300"
          >
            Contact Us
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
