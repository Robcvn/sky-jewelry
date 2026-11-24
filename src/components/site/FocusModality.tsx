"use client";

import { useEffect } from "react";

/**
 * Tracks the last input, keyboard or pointer, as data-input on <html> (Task 28). Product cards rise and show their
 * panel for focus inside them only while it is "keyboard" (components.css: keyboard-focus-within, card-keyboard-focus),
 * so focus a mouse press or a drag leaves behind never holds a card up.
 *
 * Also records how each focusable sideways scroller ([data-scroll-region]: the carousels, swiping galleries, ScrollArea and
 * the like) got focus, as data-focus-by="keyboard" or "pointer" (Task 28). components.css hides the region's outline
 * when a pointer focused it, so a tap or click inside never outlines the whole row. iOS Safari focuses the region on a
 * tap and counts it as :focus-visible, so :focus-visible alone can't tell. Tab still shows the outline, and arrow keys
 * scroll as before. Links, buttons and swatches inside keep their own focus styles. Renders nothing.
 */
export function FocusModality() {
  useEffect(() => {
    let last: "keyboard" | "pointer" = "keyboard";
    const root = document.documentElement;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      last = "keyboard";
      root.dataset.input = last;
    };
    const onPointer = () => {
      last = "pointer";
      root.dataset.input = last;
    };
    const onFocus = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.hasAttribute("data-scroll-region")) target.dataset.focusBy = last;
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointer, true);
    document.addEventListener("mousedown", onPointer, true);
    document.addEventListener("touchstart", onPointer, { capture: true, passive: true });
    document.addEventListener("focusin", onFocus, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onPointer, true);
      document.removeEventListener("mousedown", onPointer, true);
      document.removeEventListener("touchstart", onPointer, true);
      document.removeEventListener("focusin", onFocus, true);
    };
  }, []);
  return null;
}
