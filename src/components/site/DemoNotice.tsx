"use client";

import { useEffect, useId, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { cx } from "@/components/ui/shared";

type DemoNoticeProps = {
  /** The two words on the copyright line ("Portfolio demo"). */
  label: string;
  /** The full sentence (Sanity's demo notice). */
  notice: string;
};

type Via = "hover" | "focus" | "click";

/**
 * The footer's demo label (Task 27; not in Figma, see Deviations): "Portfolio demo" at the end of the copyright line, a
 * button in the line's own text style, underlined. It shows the full demo notice in a small popover above the line.
 * - Opens on mouse hover, on keyboard focus (focus-visible), and on a click or tap. A click or tap toggles it (a click
 *   on a popover opened by hover keeps it open, the next click closes it).
 * - Opened by a click or tap, it stays open until a second click or tap on the button, Escape or a click outside.
 *   Opened by hover, it also closes when the pointer leaves the label and popover (after a short pause, so the pointer
 *   can cross to the popover). Opened by keyboard focus, it closes when focus leaves the label (Rob, Nov 23).
 * - Screen readers: aria-expanded on the button, and the sentence is always in the document (transparent while
 *   closed, never display:none) and is the button's description, so it is read on focus and in reading order.
 * - Surface: there is no tooltip in the design system, so it borrows the Dropdown panel's (secondary/skin, a 1px
 *   secondary/gold border, 4px radius, the panel's shadow) with body-xs leather text and 12px padding.
 * - It is anchored to the start of the line and is never wider than the line's container (the viewport less the
 *   page margins), so it can't run off the screen.
 */
export function DemoNotice({ label, notice }: DemoNoticeProps) {
  const id = useId();
  const [via, setVia] = useState<Via | null>(null);
  const open = via !== null;
  const wrapRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const leaveTimer = useRef<number | undefined>(undefined);

  // Escape and a press outside close it.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setVia(null);
    };
    const onPress = (event: globalThis.PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setVia(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress);
    };
  }, [open]);
  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(leaveTimer.current);
    setVia((current) => current ?? "hover");
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(leaveTimer.current);
    // Only a popover opened by hover closes when the pointer moves away (Rob, Nov 23).
    leaveTimer.current = window.setTimeout(() => setVia((current) => (current === "hover" ? null : current)), 150);
  };
  const onFocus = () => {
    if (buttonRef.current?.matches(":focus-visible")) setVia((current) => current ?? "focus");
  };
  const onBlur = (event: FocusEvent) => {
    if (!wrapRef.current?.contains(event.relatedTarget as Node | null)) setVia(null);
  };
  const onClick = () => setVia((current) => (current === "click" ? null : "click"));

  return (
    <span ref={wrapRef} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-notice`}
        aria-describedby={`${id}-notice`}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        className="ui-focus:outline-base-white cursor-pointer rounded-4 underline"
      >
        {label}
      </button>
      {/* The bridge (pb-space-2) keeps the pointer inside while it crosses from the label to the panel. */}
      <span
        className={cx(
          "ui-transition absolute bottom-full left-0 z-30 block w-max max-w-[min(22rem,calc(100vw-2*var(--grid-margin)))] pb-space-2",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <span id={`${id}-notice`} data-demo-notice className="block rounded-4 border border-secondary-gold bg-secondary-skin p-space-3 text-left text-primary-leather shadow-lg">
          {notice}
        </span>
      </span>
    </span>
  );
}
