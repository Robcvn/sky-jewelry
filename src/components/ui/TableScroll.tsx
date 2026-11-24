"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "./shared";

/**
 * A wide table that scrolls sideways when the column is narrower (Task 29). While it scrolls it is a labelled region
 * (the table's caption) that takes keyboard focus, so arrow keys scroll it; its outline shows for keyboard focus only
 * (data-scroll-region: FocusModality and components.css, Task 28). When the table fits, it is a plain wrapper: no
 * landmark and no empty tab stop.
 */
export function TableScroll({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrolls, setScrolls] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => setScrolls(node.scrollWidth > node.clientWidth + 1);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    if (node.firstElementChild) observer.observe(node.firstElementChild);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role={scrolls ? "region" : undefined}
      aria-label={scrolls ? label : undefined}
      tabIndex={scrolls ? 0 : undefined}
      data-scroll-region={scrolls ? "" : undefined}
      className={cx("overflow-x-auto", className)}
    >
      {children}
    </div>
  );
}
