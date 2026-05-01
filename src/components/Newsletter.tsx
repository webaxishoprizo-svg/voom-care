import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call for demonstration if endpoint doesn't exist
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Welcome to the VOOM Private Circle.");
      setEmail("");
    } catch (error) {
      toast.error("Failed to join. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-32 px-4 bg-black/60 backdrop-blur-2xl border-t border-white/5 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
          The Private Circle
        </div>

        <h2 className="font-display text-5xl md:text-7xl text-foreground mb-6 italic">
          Elite <em>Circle.</em>
        </h2>

        <p className="text-muted-foreground text-sm md:text-lg mb-12 max-w-lg mx-auto tracking-wide font-light">
          First access to professional drops and signature editions.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
        >
          <div className="relative w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL ADDRESS"
              className="w-full h-14 bg-white/5 border border-white/10 rounded-full px-8 text-foreground placeholder:text-muted-foreground text-[10px] tracking-[0.3em] outline-none focus:border-primary/40 transition-all text-center sm:text-left backdrop-blur-md"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto h-14 px-12 rounded-full bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase text-[10px] hover:bg-primary/90 transition-all shrink-0 disabled:opacity-50 active:scale-95"
          >
            {isLoading ? "JOINING" : "JOIN"}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default Newsletter;
