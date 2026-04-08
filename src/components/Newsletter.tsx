import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();

    // ✅ Validation
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmed,
        }),
      });

      // ✅ Safe Response Handling
      const rawText = await response.text();
      console.log("RAW API RESPONSE:", rawText);

      let result;
      try {
        result = JSON.parse(rawText);
      } catch (e) {
        console.error("PARSE ERROR:", e);
        throw new Error("Invalid server response");
      }

      console.log("PARSED JSON:", result);

      if (result.success) {
        toast.success("Thank you for subscribing!");
        setEmail("");
      } else {
        throw new Error(result.message || "Subscription failed");
      }
    } catch (error: any) {
      console.error("Newsletter Error:", error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto text-center"
      >
        <p className="text-xs tracking-wider uppercase text-primary mb-2">
          Stay Updated
        </p>

        <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3">
          Join the NOR Community
        </h2>

        <p className="text-muted-foreground text-sm mb-8">
          Subscribe for exclusive launches, offers & fragrance stories.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-0 border border-border rounded-full overflow-hidden pl-5 pr-1.5 py-1.5 bg-card"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            maxLength={255}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default Newsletter