"use client";

import { useCallback, type RefObject } from "react";

/** Movement (px) before a press becomes a drag; a smaller movement stays a click. */
const THRESHOLD = 5;

/**
 * Dragging a sideways scroller with a mouse (Task 26; an interaction Figma doesn't draw, see Deviations). Below 1024px
 * the carousels have no arrows and every scroller hides its scrollbar, so a plain mouse could not reach what is off
 * screen. Mouse only (pointerType "mouse"), at every width: touch and pen keep the browser's own scrolling, and the
 * desktop arrows, keyboard, Shift + wheel and trackpads are untouched.
 * - A drag starts after 5px; the row then follows the pointer 1:1 with scroll snapping off, no text selection, no
 *   native drag of links or images, and the grabbing cursor (data-drag-scroll="dragging", components.css).
 * - On release the row settles on the nearest snap point (instantly under reduced motion), then snapping returns.
 * - The click that ends a drag is swallowed; a press without movement still clicks.
 * - At rest the scroller shows the grab cursor while it can scroll (data-drag-scroll="ready").
 * Returns a callback ref for the scroller (it works for rows that mount later, such as an opened picker). Pass the
 * component's own ref object to have it filled too.
 */
export function useDragScroll<T extends HTMLElement>(ref?: RefObject<T | null>) {
  return useCallback(
    (node: T | null) => {
      if (ref) ref.current = node;
      if (!node) return;
      const detach = attachDragScroll(node);
      return () => {
        detach();
        if (ref) ref.current = null;
      };
    },
    [ref],
  );
}

function attachDragScroll(el: HTMLElement) {
  let press: { id: number; x: number; left: number; dragging: boolean; focused: Element | null } | null = null;
  let swallowClick = false;
  let settleTimer: number | undefined;

  const scrollable = () => el.scrollWidth - el.clientWidth > 1;
  const markReady = () => {
    if (el.dataset.dragScroll === "dragging") return;
    if (scrollable()) el.dataset.dragScroll = "ready";
    else delete el.dataset.dragScroll;
  };

  /** The nearest snap position to the current scroll, from the children's scroll-snap-align. */
  const snapTarget = () => {
    const max = el.scrollWidth - el.clientWidth;
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const padStart = parseFloat(style.scrollPaddingLeft) || 0;
    const padEnd = parseFloat(style.scrollPaddingRight) || 0;
    const targets: number[] = [];
    for (const child of el.children) {
      const align = getComputedStyle(child).scrollSnapAlign.split(" ").pop();
      if (!align || align === "none") continue;
      const r = child.getBoundingClientRect();
      const left = r.left - box.left + el.scrollLeft;
      if (align === "start") targets.push(left - padStart);
      else if (align === "end") targets.push(left + r.width - el.clientWidth + padEnd);
      else targets.push(left + r.width / 2 - el.clientWidth / 2);
    }
    if (!targets.length) return null;
    const clamped = [...targets.map((t) => Math.min(max, Math.max(0, t))), 0, max];
    return clamped.reduce((best, t) => (Math.abs(t - el.scrollLeft) < Math.abs(best - el.scrollLeft) ? t : best));
  };

  const restoreSnap = () => {
    el.style.scrollSnapType = "";
    el.style.scrollBehavior = "";
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !scrollable()) return;
    // A control that must never start a drag (the size guide's carat toggle).
    if (event.target instanceof Element && event.target.closest("[data-no-drag-scroll]")) return;
    window.clearTimeout(settleTimer);
    press = {
      id: event.pointerId,
      x: event.clientX,
      left: el.scrollLeft,
      dragging: false,
      // What had focus before the press: the press itself may focus a link or the row (Task 28).
      focused: document.activeElement,
    };
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!press || event.pointerId !== press.id) return;
    const dx = event.clientX - press.x;
    if (!press.dragging) {
      if (Math.abs(dx) < THRESHOLD) return;
      press.dragging = true;
      el.setPointerCapture(event.pointerId);
      el.dataset.dragScroll = "dragging";
      el.style.scrollSnapType = "none";
      el.style.scrollBehavior = "auto";
      window.getSelection()?.removeAllRanges();
    }
    event.preventDefault();
    el.scrollLeft = press.left - dx;
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!press || event.pointerId !== press.id) return;
    const dragged = press.dragging;
    const focusedBefore = press.focused;
    press = null;
    if (!dragged) return;
    // Blur whatever the press focused inside the row (a card's link, the row itself), so nothing stays raised.
    const focusedNow = document.activeElement;
    if (focusedNow !== focusedBefore && focusedNow instanceof HTMLElement && el.contains(focusedNow)) focusedNow.blur();
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    swallowClick = event.type === "pointerup";
    window.setTimeout(() => (swallowClick = false), 0);
    el.dataset.dragScroll = "ready";
    const target = snapTarget();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (target === null || Math.abs(target - el.scrollLeft) < 1) {
      restoreSnap();
      return;
    }
    el.scrollTo({ left: target, behavior: reduce ? "auto" : "smooth" });
    if (reduce) restoreSnap();
    else {
      // Snapping returns once the row has settled (scrollend, or a fallback where it isn't supported).
      const done = () => {
        window.clearTimeout(settleTimer);
        el.removeEventListener("scrollend", done);
        restoreSnap();
      };
      el.addEventListener("scrollend", done);
      settleTimer = window.setTimeout(done, 600);
    }
  };

  const onClick = (event: MouseEvent) => {
    if (!swallowClick) return;
    swallowClick = false;
    event.preventDefault();
    event.stopPropagation();
  };
  // Links and images inside would start the browser's own drag before the 5px threshold is reached.
  const onDragStart = (event: DragEvent) => {
    if (press) event.preventDefault();
  };
  const onSelectStart = (event: Event) => {
    if (press?.dragging) event.preventDefault();
  };

  markReady();
  const observer = new ResizeObserver(markReady);
  observer.observe(el);
  for (const child of el.children) observer.observe(child);
  el.addEventListener("pointerenter", markReady);
  el.addEventListener("pointerdown", onPointerDown);
  el.addEventListener("pointermove", onPointerMove);
  el.addEventListener("pointerup", onPointerUp);
  el.addEventListener("pointercancel", onPointerUp);
  el.addEventListener("click", onClick, true);
  el.addEventListener("dragstart", onDragStart);
  el.addEventListener("selectstart", onSelectStart);
  return () => {
    window.clearTimeout(settleTimer);
    observer.disconnect();
    el.removeEventListener("pointerenter", markReady);
    el.removeEventListener("pointerdown", onPointerDown);
    el.removeEventListener("pointermove", onPointerMove);
    el.removeEventListener("pointerup", onPointerUp);
    el.removeEventListener("pointercancel", onPointerUp);
    el.removeEventListener("click", onClick, true);
    el.removeEventListener("dragstart", onDragStart);
    el.removeEventListener("selectstart", onSelectStart);
    restoreSnap();
    delete el.dataset.dragScroll;
  };
}
