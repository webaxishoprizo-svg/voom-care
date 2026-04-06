import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

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

const Contact = () => (
  <main className="min-h-screen bg-background">
    <Navbar />

    <section className="pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 bg-card/30 border border-border/50 rounded-2xl p-6 md:p-10"
          >
            <h2 className="font-display text-2xl text-foreground mb-8">Send us a message</h2>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase ml-1">Name</label>
                  <Input placeholder="Your name" className="bg-background/50 border-border/50 h-12 focus:border-primary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase ml-1">Email</label>
                  <Input type="email" placeholder="you@email.com" className="bg-background/50 border-border/50 h-12 focus:border-primary/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase ml-1">Subject</label>
                <Input placeholder="Order inquiry, product question, etc." className="bg-background/50 border-border/50 h-12 focus:border-primary/50" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase ml-1">Message</label>
                <textarea
                  placeholder="Tell us how we can help..."
                  rows={6}
                  className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none transition-colors"
                />
              </div>

              <Button className="gradient-gold text-primary-foreground font-bold tracking-widest text-xs h-12 px-8 rounded-lg uppercase flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Send className="w-3.5 h-3.5" />
                Send Message
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
                className="bg-card/30 border border-border/50 rounded-2xl p-6 flex items-start gap-4 hover:border-primary/20 transition-colors"
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

          {/* Map Overlay Info (Matching screenshot) */}
          <div className="absolute top-8 left-8 bg-card/90 backdrop-blur-md border border-border/50 p-6 rounded-2xl max-w-xs shadow-2xl hidden md:block">
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

    <Footer />
  </main>
);

export default Contact;
