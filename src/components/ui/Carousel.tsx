"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { IconButton } from "./IconButton";
import { Scrollbar, useScrollProgress } from "./Scrollbar";
import { cx } from "./shared";
import { useDragScroll } from "./useDragScroll";

type CarouselItem = { key: string; node: ReactNode };
type Box = { left: number; right: number; top: number; bottom: number };
const EMPTY: Box = { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity };
/** What hides an arrow: a hovered card over it, a card holding focus over it, or nothing. */
type CoveredBy = false | "hover" | "focus";
type Covered = { prev: CoveredBy; next: CoveredBy };

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
  const dragRef = useDragScroll(ref);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const lastPressed = useRef<"prev" | "next" | null>(null);

  // When the button you pressed disappears at an end, keep focus on the other one. Only when the pressed button had
  // focus (a keyboard press, or a click in a browser that focuses buttons); the moved focus is focus-visible only
  // after a keyboard press, so it never keeps an arrow showing for a mouse user (see covered below).
  useEffect(() => {
    if (lastPressed.current === "prev" && atStart) nextRef.current?.focus();
    if (lastPressed.current === "next" && atEnd) prevRef.current?.focus();
  }, [atStart, atEnd]);

  const page = (direction: -1 | 1) => {
    const node = ref.current;
    if (!node) return;
    const pressed = direction < 0 ? prevRef.current : nextRef.current;
    lastPressed.current = pressed && document.activeElement === pressed ? (direction < 0 ? "prev" : "next") : null;
    const style = getComputedStyle(node);
    const amount = node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) + parseFloat(style.columnGap || "0");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollBy({ left: direction * amount, behavior: reduce ? "auto" : "smooth" });
  };

  // With hoverRoom, a hovered or focused product card rises above the arrows (z-20, with its 8px shell). An arrow the
  // card's box (with its shell and actions panel, [data-hover-shell]) overlaps is hidden while that lasts: opacity 0
  // and no pointer events, still in the tab order.
  // - The card under the pointer always hides the arrow it overlaps, whichever arrow and wherever focus is (Task 27:
  //   after a click at the end of the row, focus sits on Previous and used to keep it showing).
  // - A card holding keyboard focus (focus inside while the last input was the keyboard) hides the arrow it overlaps too; an arrow shows through that only while it has
  //   keyboard focus itself (focus-visible).
  const prevWrap = useRef<HTMLSpanElement>(null);
  const nextWrap = useRef<HTMLSpanElement>(null);
  const hovered = useRef<HTMLElement | null>(null);
  const [covered, setCovered] = useState<Covered>({ prev: false, next: false });
  const itemOf = useCallback(
    (target: EventTarget | null) => {
      const scroller = ref.current;
      if (!scroller || !(target instanceof Node)) return null;
      return ([...scroller.children] as HTMLElement[]).find((item) => item.contains(target)) ?? null;
    },
    [ref],
  );
  const measure = useCallback(() => {
    if (!hoverRoom) return;
    requestAnimationFrame(() => {
      const boxOf = (card: HTMLElement | null) =>
        card
          ? [card, ...card.querySelectorAll<HTMLElement>("[data-hover-shell]")]
              .map((el) => el.getBoundingClientRect())
              .filter((r) => r.width > 0 && r.height > 0)
              .reduce<Box>((u, r) => ({ left: Math.min(u.left, r.left), right: Math.max(u.right, r.right), top: Math.min(u.top, r.top), bottom: Math.max(u.bottom, r.bottom) }), EMPTY)
          : null;
      const hoverBox = boxOf(hovered.current);
      // Only keyboard focus raises a card (Task 28, the same rule as the card's CSS): focus a mouse press leaves
      // behind doesn't count.
      const focusBox = boxOf(document.documentElement.dataset.input === "keyboard" ? itemOf(document.activeElement) : null);
      const hits = (wrap: HTMLSpanElement | null, b: Box | null) => {
        const a = wrap?.getBoundingClientRect();
        return Boolean(a && a.width && b && b.left < a.right && b.right > a.left && b.top < a.bottom && b.bottom > a.top);
      };
      const side = (wrap: HTMLSpanElement | null): CoveredBy => (hits(wrap, hoverBox) ? "hover" : hits(wrap, focusBox) ? "focus" : false);
      const next = { prev: side(prevWrap.current), next: side(nextWrap.current) };
      setCovered((current) => (current.prev === next.prev && current.next === next.next ? current : next));
    });
  }, [hoverRoom, itemOf]);
  useEffect(() => {
    const scroller = ref.current;
    if (!hoverRoom || !scroller) return;
    scroller.addEventListener("scroll", measure, { passive: true });
    return () => scroller.removeEventListener("scroll", measure);
  }, [hoverRoom, measure, ref]);
  const onPointerOver = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    hovered.current = itemOf(event.target);
    measure();
  };
  const onPointerOut = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    hovered.current = itemOf(event.relatedTarget);
    measure();
  };
  const onFocusChange = (event: FocusEvent) => {
    if (event.type === "blur" && hovered.current && !hovered.current.matches(":hover")) hovered.current = null;
    measure();
  };

  const arrow = "absolute z-10 hidden -translate-y-1/2 ui-desktop:block";
  const hidden = (by: CoveredBy) =>
    by &&
    cx(
      "pointer-events-none opacity-0",
      by === "focus" && "has-[:focus-visible]:pointer-events-auto has-[:focus-visible]:opacity-100",
    );

  return (
    <div className={cx("@container relative", className)}>
      <div
        ref={dragRef}
        {...(hoverRoom ? { onPointerOver, onPointerOut, onFocus: onFocusChange, onBlur: onFocusChange } : {})}
        role="region"
        aria-label={`${label}, carousel`}
        tabIndex={scrollable ? 0 : undefined}
        data-scroll-region
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
            <span ref={prevWrap} className={cx(arrow, hoverRoom && "ui-transition", hidden(covered.prev))} style={{ top: arrowTop, left: "calc(var(--grid-margin) - 1.75rem)" }}>
              <IconButton ref={prevRef} icon="chevron-left" size="lg" label={`Previous: ${label}`} onClick={() => page(-1)} />
            </span>
          ) : null}
          {!atEnd ? (
            <span ref={nextWrap} className={cx(arrow, hoverRoom && "ui-transition", hidden(covered.next))} style={{ top: arrowTop, right: "calc(var(--grid-margin) - 1.75rem)" }}>
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
