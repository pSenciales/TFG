import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export default function FadeIn({ children, className, duration = 0.3 }: FadeInProps) {
  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key="fade-in"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration }}
          className={cn("w-full h-full", className)}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
