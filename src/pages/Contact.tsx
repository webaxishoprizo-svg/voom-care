import React, { useState, useRef } from "react";
import emailjs from '@emailjs/browser';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, X, CheckCircle2, Loader2 } from "lucide-react";

const infoCards = [
  {
    icon: Mail,
    label: "EMAIL",
    value: "norperfume.in@gmail.com",
  },
  {
    icon: Phone,
    label: "PHONE",
    value: "+91 9544290206",
  },
  {
    icon: MapPin,
    label: "ADDRESS",
    value: "Door No:5/52 Kodibail, Mangalpady Gram Panchayth,, Uppala, Kasargod-671322, Kerala",
  },
  {
    icon: Clock,
    label: "SUPPORT HOURS",
    value: "Mon-Sat: 9:00 AM - 7:00 PM",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const form = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await emailjs.sendForm(
        'service_iir7u3h',
        'template_lfl0xrf',
        e.currentTarget as HTMLFormElement,
        'F_puGs2xOh1E7o8_D'
      );

      console.log('SUCCESS!', result.status, result.text);
      setShowSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Auto-close success modal after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err?.text || err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 glass-card rounded-2xl p-6 md:p-10"
            >
              <h2 className="font-display text-2xl text-foreground mb-8 text-white">Send us a message</h2>

              <form ref={form} className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase ml-1">Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="bg-background/50 border-border/50 h-12 focus:border-primary/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase ml-1">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@email.com"
                      className="bg-background/50 border-border/50 h-12 focus:border-primary/50 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase ml-1">Subject</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Order inquiry, product question, etc."
                    className="bg-background/50 border-border/50 h-12 focus:border-primary/50 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase ml-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us how we can help..."
                    rows={6}
                    className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none transition-colors text-white"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-medium ml-1">{error}</p>
                )}

                <Button
                  disabled={isLoading}
                  className="gradient-gold text-primary-foreground font-bold tracking-widest text-xs h-12 px-8 rounded-lg uppercase flex items-center gap-2 hover:opacity-90 transition-opacity min-w-[160px]"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </motion.div>

            {/* Info Cards */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {infoCards.map((card, index) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-6 flex items-start gap-4 hover:border-primary/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-background border border-border/50 flex items-center justify-center shrink-0">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">{card.label}</p>
                    <p className="text-foreground text-sm font-medium leading-relaxed">{card.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden h-[450px] border border-border/50 shadow-2xl"
          >
            {/* Dark styled Google Map iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.0827284646543!2d74.8942!3d12.7094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba36136d8d8d8d8%3A0x8d8d8d8d8d8d8d8d!2sUppala%2C%20Kerala!5e0!3m2!1sen!2sin!4v1712415000000!5m2!1sen!2sin"
              className="w-full h-full grayscale invert-[0.9] contrast-[1.2] opacity-80"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Map Overlay Info */}
            <div className="absolute top-8 left-8 glass-card backdrop-blur-md p-6 rounded-2xl max-w-xs shadow-2xl hidden md:block">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground font-display text-lg mb-2">Our Location</h3>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Door No:5/52 Kodibail, Mangalpady Gram Panchayth, Uppala, Kasargod-671322, Kerala
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-foreground uppercase">Open for drop-ins</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccess(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card border border-border/50 p-8 rounded-2xl max-w-md w-full shadow-2xl text-center"
            >
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl text-foreground mb-2 text-white">Thank You!</h3>
              <p className="text-muted-foreground text-sm">
                Thanks for contacting us. We'll get back to you shortly.
              </p>
              <Button
                onClick={() => setShowSuccess(false)}
                className="mt-8 w-full gradient-gold text-primary-foreground font-bold tracking-widest text-xs h-12 rounded-lg uppercase"
              >
                Close
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
};

export default Contact;
