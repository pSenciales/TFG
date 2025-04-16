"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

// Extend the props by adding the slideFrom property.
interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  slideFrom?: "top" | "bottom";
  sideOffset?: number;
}

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    { className, sideOffset = 2, slideFrom = "top", ...props },
    ref
  ) => {
    // Calculate the animations for the top and bottom sides based on the slideFrom prop.
    const bottomAnimation =
      slideFrom === "bottom"
        ? "data-[side=bottom]:slide-in-from-bottom-2"
        : "data-[side=bottom]:slide-in-from-top-2";
    const topAnimation =
      slideFrom === "bottom"
        ? "data-[side=top]:slide-in-from-top-2"
        : "data-[side=top]:slide-in-from-bottom-2";

    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            bottomAnimation,
            "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
            topAnimation,
            "origin-[--radix-tooltip-content-transform-origin]",
            className
          )}
          {...props}
        />
      </TooltipPrimitive.Portal>
    );
  }
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
