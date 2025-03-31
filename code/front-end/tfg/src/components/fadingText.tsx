import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";

type FadingTextProps = {
  texts: string[];
  interval?: number;
  className?: string;
  fadeDuration?: number;
};

export default function FadingText({
  texts,
  interval = 5000,
  className,
  fadeDuration = 0.3,
}: FadingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts, interval]);

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: fadeDuration }}
        >
          {texts[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
