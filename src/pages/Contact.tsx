import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => (
  <main className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-28 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl text-foreground text-center mb-4"
        >
          Get in Touch
        </motion.h1>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
          Have a question or feedback? We'd love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold mb-1">Email</h3>
                <p className="text-muted-foreground text-sm">support@nor.in</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold mb-1">Phone</h3>
                <p className="text-muted-foreground text-sm">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold mb-1">Address</h3>
                <p className="text-muted-foreground text-sm">Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input placeholder="Your Name" className="bg-card border-border" />
            <Input type="email" placeholder="Your Email" className="bg-card border-border" />
            <Input placeholder="Subject" className="bg-card border-border" />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
            <Button className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </section>
    <Footer />
  </main>
);

export default Contact;
