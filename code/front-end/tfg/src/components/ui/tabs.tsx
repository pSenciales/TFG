"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";


type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  setView: (view: string) => void;
  setContext: (context: string) => void;
  setContent: (content: string) => void;
  setUrl: (url: string) => void;
  setSource: (url: string) => void;
  loading: boolean;
}

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  setView,
  setContext,
  setContent,
  setUrl,
  setSource,
  loading
}: TabsProps) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setContent("");
    setContext("");
    setUrl("");
    setSource("")
    setView(newTabs[0].value);
    setActive(newTabs[0]);
  };

  return (
    <div className="mx-2">
      <div
        className={cn(
          "flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full ",
          containerClassName
        )}
      >
        <div className="border-2 rounded-full border-gray-200">
          {propTabs.map((tab, idx) => (
            <button
              key={tab.title}
              onClick={() => {
                moveSelectedTabToTop(idx);
              }}
              className={cn("relative px-4 py-2 rounded-full", tabClassName)}
              style={{
                transformStyle: "preserve-3d",
              }}
              disabled={loading}
            >
              {active.value === tab.value && (
                <motion.div
                  layoutId="clickedbutton"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  className={cn(
                    "absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full",
                    activeTabClassName
                  )}
                />
              )}
              <span className="relative block text-black dark:text-white">
                {tab.title}
              </span>
            </button>
          ))}

        </div>
      </div>
      <FadeInDiv active={active} className={cn("mt-2", contentClassName)} />
    </div>
  );
};

export const FadeInDiv = ({
  active,
  className,
}: {
  active: { value: string; content?: string | React.ReactNode };
  className?: string;
}) => {
  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={cn("w-full h-full", className)}
        >
          {active.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};