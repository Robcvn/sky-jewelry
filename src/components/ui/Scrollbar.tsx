"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "./shared";

type ScrollbarProps = {
  /** Scroll position from 0 to 1. */
  progress: number;
  overlay?: boolean;
  className?: string;
};

/** Figma "Scrollbar": a 1px track with a 44px thumb. Decorative, so hidden from screen readers. */
export function Scrollbar({ progress, overlay = false, className }: ScrollbarProps) {
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <div aria-hidden="true" className={cx("relative h-px w-full", overlay ? "bg-white-alpha-20" : "bg-black-alpha-10", className)}>
      <div
        className={cx("absolute inset-y-0 w-11", overlay ? "bg-secondary-gold" : "bg-primary-leather")}
        style={{ left: `calc((100% - 2.75rem) * ${clamped})` }}
      />
    </div>
  );
}

type ScrollAreaProps = {
  /** Accessible name for the scrolling region. */
  label: string;
  overlay?: boolean;
  className?: string;
  children: ReactNode;
};

/** A horizontal scroller that hides the native scrollbar and shows the Figma one below. */
export function ScrollArea({ label, overlay = false, className, children }: ScrollAreaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => {
      const max = node.scrollWidth - node.clientWidth;
      setProgress(max > 0 ? node.scrollLeft / max : 0);
    };
    update();
    node.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      node.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className={className}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <Scrollbar progress={progress} overlay={overlay} className="mt-space-4" />
    </div>
  );
}
