import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  width?: "fit-content" | "100%";
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export const Reveal = ({
  children,
  className,
  width = "100%",
  delay = 0,
  duration = 0.6,
  yOffset = 24
}: RevealProps) => {
  return (
    <div
      className={cn(className)}
      style={{ position: "relative", width, overflow: "visible", contentVisibility: "auto", containIntrinsicSize: "1px 600px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: yOffset }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
