"use client";

import { useEffect } from "react";

/**
 * Text fields: they keep their own focus styling whatever the input was (components.css), and keys typed into them
 * don't count as keyboard use (see onKey). Keep in step with the selector in components.css.
 */
const TEXT_FIELD =
  'input:not([type="checkbox"], [type="radio"], [type="range"], [type="button"], [type="submit"], [type="reset"], [type="image"], [type="file"], [type="color"]), textarea, [contenteditable]:not([contenteditable="false"])';

/**
 * Tracks the last input, keyboard or pointer, as data-input on <html>, for the whole document.
 *
 * - The site-wide focus ring (Task 29): components.css removes the focus outline from every control (buttons, links,
 *   icon buttons, tiles, swatches, sliders) while data-input is "pointer". So when a tap or a click opens a quick view,
 *   a sheet, a menu or a modal and the site moves focus to its close button, or puts focus back on the opener when it
 *   closes, no ring shows. iOS (Safari and Chrome, both WebKit) counts that moved focus as :focus-visible, which desktop
 *   Chrome doesn't after a mouse click. Keyboard use is unchanged: Tab, and a dialog opened from the keyboard, show
 *   the ring as before. Text fields keep their own focus styling either way.
 * - Product cards rise and show their panel for focus inside them only while it is "keyboard" (Task 28;
 *   components.css: keyboard-focus-within, card-keyboard-focus), so focus a mouse press or a drag leaves behind never
 *   holds a card up.
 * - How each focusable sideways scroller ([data-scroll-region]: the carousels, swiping galleries, ScrollArea and the
 *   like) got focus, as data-focus-by="keyboard" or "pointer" (Task 28). components.css hides the region's outline when
 *   a pointer focused it, and keeps it hidden while arrow keys then scroll it.
 *
 * Keyboard: any key without Cmd, Ctrl or Alt, except keys typed into a text field other than Tab and Escape. An on-screen
 * keyboard sends key events too: typing an address and pressing Go must not put the ring on the button the form's
 * modal returns focus to. Pointer: pointerdown, mousedown or touchstart. Until the first input, data-input is unset and
 * the ring shows (a keyboard user's first Tab sets "keyboard" before focus moves anyway). Renders nothing.
 */
export function FocusModality() {
  useEffect(() => {
    let last: "keyboard" | "pointer" = "keyboard";
    const root = document.documentElement;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const typing = event.target instanceof Element && event.target.matches(TEXT_FIELD);
      if (typing && event.key !== "Tab" && event.key !== "Escape") return;
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
