import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
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
    <section className="relative py-28 md:py-36 px-4 bg-black border-t border-white/5 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_75%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold tracking-[0.3em] uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          The Private Circle
        </div>

        <h2 className="font-display text-5xl md:text-7xl text-foreground mb-6 italic tracking-tight">
          Elite <em>Circle.</em>
        </h2>

        <p className="text-muted-foreground/80 text-sm md:text-base mb-10 max-w-md mx-auto tracking-wide font-light leading-relaxed">
          First access to professional drops and signature editions.
        </p>

        <form
          onSubmit={handleSubmit}
          className="group relative max-w-md mx-auto"
        >
          <div className="relative flex items-center w-full h-16 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-md transition-all duration-300 focus-within:border-primary/50 focus-within:bg-white/[0.05] focus-within:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              maxLength={255}
              className="flex-1 h-full bg-transparent pl-7 pr-2 text-foreground placeholder:text-muted-foreground/50 text-sm tracking-wide outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Join the Private Circle"
              className="mr-1.5 h-13 shrink-0 flex items-center gap-2 h-[52px] px-6 rounded-full bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase text-[10px] hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <p className="mt-5 text-[10px] tracking-[0.25em] uppercase text-muted-foreground/50">
            No spam · Unsubscribe anytime
          </p>
        </form>
      </motion.div>
    </section>
  );
};

export default Newsletter;
