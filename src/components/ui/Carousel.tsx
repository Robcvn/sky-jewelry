"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { IconButton } from "./IconButton";
import { Scrollbar, useScrollProgress } from "./Scrollbar";
import { cx } from "./shared";

type CarouselItem = { key: string; node: ReactNode };

type CarouselProps = {
  /** Accessible name for the scrolling list, e.g. "Best selling engagement rings". */
  label: string;
  items: CarouselItem[];
  /** Item width at each breakpoint. Desktop widths can use cqw (the carousel is a size container). */
  itemClassName: string;
  /**
   * "carousel" scrolls on desktop too, with previous and next buttons.
   * "grid" lays the items out in a static row from 1024px (pass the columns in gridClassName).
   */
  desktop?: "carousel" | "grid";
  gridClassName?: string;
  /** Top of the desktop arrows, as a CSS length, so they centre on the card images. */
  arrowTop?: string;
  /** Mobile scrollbar on a dark surface (Figma "Scrollbar - Overlay"). */
  overlay?: boolean;
  /**
   * Desktop room above and below the items for content that grows out of a card (the product card's hover
   * shell and its actions panel), which the scroller would otherwise clip. The extra space overlaps the
   * neighbouring sections without blocking clicks on them.
   */
  hoverRoom?: boolean;
  className?: string;
};

/**
 * Horizontal carousel from the Home frames.
 * - Mobile: swipe, with Figma's 1px scrollbar below. No dots (Figma shows none) and no arrows.
 * - Desktop "carousel": previous and next Icon Buttons on the content edges; each is shown only when
 *   there is more to see in that direction (Figma's resting state shows Next only).
 * The scroller is a focusable region, so arrow keys scroll it, and every card inside is reachable by Tab.
 * Smooth paging is turned off under reduced motion.
 */
export function Carousel({
  label,
  items,
  itemClassName,
  desktop = "carousel",
  gridClassName,
  arrowTop = "50%",
  overlay = false,
  hoverRoom = false,
  className,
}: CarouselProps) {
  const { ref, progress, scrollable, atStart, atEnd } = useScrollProgress<HTMLDivElement>();
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const lastPressed = useRef<"prev" | "next" | null>(null);

  // When the button you pressed disappears at an end, keep focus on the other one.
  useEffect(() => {
    if (lastPressed.current === "prev" && atStart) nextRef.current?.focus();
    if (lastPressed.current === "next" && atEnd) prevRef.current?.focus();
  }, [atStart, atEnd]);

  const page = (direction: -1 | 1) => {
    const node = ref.current;
    if (!node) return;
    lastPressed.current = direction < 0 ? "prev" : "next";
    const style = getComputedStyle(node);
    const amount = node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) + parseFloat(style.columnGap || "0");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollBy({ left: direction * amount, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow = "absolute z-10 hidden -translate-y-1/2 ui-desktop:block";

  return (
    <div className={cx("@container relative", className)}>
      <div
        ref={ref}
        role="region"
        aria-label={`${label}, carousel`}
        tabIndex={scrollable ? 0 : undefined}
        className={cx(
          "relative flex snap-x snap-mandatory scroll-px-(--grid-margin) gap-space-4 overflow-x-auto px-(--grid-margin) [scrollbar-width:none] focus-visible:-outline-offset-2 ui-desktop:gap-space-6 [&::-webkit-scrollbar]:hidden",
          desktop === "grid" && cx("ui-desktop:grid ui-desktop:overflow-visible", gridClassName),
          hoverRoom &&
            "ui-desktop:pointer-events-none ui-desktop:-mt-space-3 ui-desktop:-mb-36 ui-desktop:pt-space-3 ui-desktop:pb-36 ui-desktop:[&>*]:pointer-events-auto",
        )}
      >
        {items.map((item) => (
          <div key={item.key} className={cx("shrink-0 snap-start", itemClassName)}>
            {item.node}
          </div>
        ))}
      </div>

      {desktop === "carousel" ? (
        <>
          {!atStart ? (
            <span className={arrow} style={{ top: arrowTop, left: "calc(var(--grid-margin) - 1.75rem)" }}>
              <IconButton ref={prevRef} icon="chevron-left" size="lg" label={`Previous: ${label}`} onClick={() => page(-1)} />
            </span>
          ) : null}
          {!atEnd ? (
            <span className={arrow} style={{ top: arrowTop, right: "calc(var(--grid-margin) - 1.75rem)" }}>
              <IconButton ref={nextRef} icon="chevron-right" size="lg" label={`Next: ${label}`} onClick={() => page(1)} />
            </span>
          ) : null}
        </>
      ) : null}

      <div className="mt-space-6 px-(--grid-margin) ui-desktop:hidden">
        <Scrollbar progress={progress} overlay={overlay} />
      </div>
    </div>
  );
}
