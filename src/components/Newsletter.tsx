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
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Welcome to the VOOM Private Circle.");
        setEmail("");
      } else {
        toast.error(data.message || "Failed to join. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-12 md:py-16 px-4 bg-background border-t border-white/5 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-semibold tracking-[0.3em] uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          The Private Circle
        </div>

        <h2 className="font-display text-4xl md:text-6xl text-foreground mb-6 italic tracking-tight leading-[1.05]">
          Voom <em>Circle.</em>
        </h2>

        <p className="text-muted-foreground/80 text-sm md:text-base mb-10 max-w-md mx-auto leading-relaxed">
          First access to professional drops and signature editions.
        </p>

        <form
          onSubmit={handleSubmit}
          className="group relative max-w-md mx-auto"
        >
          <div className="relative flex items-center w-full bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-md transition-all duration-300 focus-within:border-primary/50 focus-within:bg-white/[0.05] p-[6px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              maxLength={255}
              className="flex-1 h-[44px] bg-transparent pl-4 pr-2 text-foreground placeholder:text-muted-foreground/50 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Join the Private Circle"
              className="shrink-0 flex items-center gap-2 h-[44px] px-5 rounded-full bg-primary text-primary-foreground font-semibold tracking-[0.2em] uppercase text-[10px] hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95"
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
