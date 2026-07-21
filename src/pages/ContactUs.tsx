import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin, HiOutlineClock } from "react-icons/hi2";

const contactInfo = [
  {
    icon: <HiOutlinePhone className="text-2xl" />,
    label: "Phone",
    value: "0301 5158089",
    link: "tel:+923015158089",
  },
  {
    icon: <HiOutlineEnvelope className="text-2xl" />,
    label: "Email",
    value: "info@zarkacouture.com",
    link: "mailto:info@zarkacouture.com",
  },
  {
    icon: <HiOutlineMapPin className="text-2xl" />,
    label: "Address",
    value: "20 Street, 20 Gulshan-E-Khudadad Main Blvd, Naseerabad, Rawalpindi, 44000",
    link: null,
  },
  {
    icon: <HiOutlineClock className="text-2xl" />,
    label: "Hours",
    value: "Mon – Sat: 10 AM – 8 PM",
    link: null,
  },
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending (frontend-only)
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1200);
  };

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
            <p className="text-script-lead text-ink/60 mb-2 font-serif italic">Get in Touch</p>
            <h1 className="text-heading-section text-ink mb-4" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
              Contact Us
            </h1>
            <p className="text-body-md text-shade-50 max-w-lg mx-auto">
              We'd love to hear from you. Whether you have a question about our products, need sizing help, or want to check on an order — we're here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="max-w-screen-lg mx-auto px-5 sm:px-8 py-huge">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-heading-md text-ink mb-8">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-canvas-cream flex items-center justify-center text-ink">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-product-caption text-shade-40 uppercase tracking-tracked mb-1">{info.label}</p>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-body-md text-ink hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-body-md text-ink">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-10 p-6 bg-canvas-cream rounded-md border border-hairline">
              <p className="text-heading-md text-ink mb-2">Quick Response via WhatsApp</p>
              <p className="text-body-md text-shade-50 mb-4">
                For the fastest response, reach us directly on WhatsApp.
              </p>
              <a
                href="https://wa.me/923173179230?text=Hi%2C%20I%20would%20like%20to%20make%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25d366] text-white text-button-label uppercase tracking-tracked font-semibold px-6 py-3 rounded-pill hover:bg-[#20ba5a] transition-colors duration-300"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.453 5.438 1.454 5.761 0 10.447-4.686 10.45-10.45.002-2.791-1.085-5.413-3.061-7.393C17.45 1.787 14.832.7 12.04.7 6.279.7 1.59 5.387 1.587 11.149c-.001 1.942.505 3.84 1.467 5.437l-.963 3.518 3.556-.931z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-heading-md text-ink mb-8">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-product-caption text-shade-50 uppercase tracking-tracked mb-2">
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-hairline bg-canvas px-4 py-3 text-body-md outline-none focus:border-ink transition-colors rounded-sm"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-product-caption text-shade-50 uppercase tracking-tracked mb-2">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-hairline bg-canvas px-4 py-3 text-body-md outline-none focus:border-ink transition-colors rounded-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-product-caption text-shade-50 uppercase tracking-tracked mb-2">
                  Subject *
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full border border-hairline bg-canvas px-4 py-3 text-body-md outline-none focus:border-ink transition-colors rounded-sm"
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="sizing">Sizing Help</option>
                  <option value="return">Returns & Exchanges</option>
                  <option value="custom">Custom Stitching</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-product-caption text-shade-50 uppercase tracking-tracked mb-2">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full border border-hairline bg-canvas px-4 py-3 text-body-md outline-none focus:border-ink transition-colors rounded-sm resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-ink text-on-primary text-button-label uppercase tracking-tracked font-semibold px-10 py-4 rounded-pill hover:bg-shade-60 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
