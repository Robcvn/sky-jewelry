"use client";

import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { cx } from "@/components/ui/shared";
import type { Option } from "@/content/builder";

type GradeRangeProps = {
  /** What is being chosen, e.g. "cut": names the handles ("Lowest cut", "Highest cut"). */
  name: string;
  /** The scale, lowest grade first. */
  options: Option[];
  /** The lowest and highest grade chosen, as indexes into the scale. */
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
};

/**
 * Figma's grade slider on the builder's stone filters (Builder 2 - Stone 3565:101144, Filters / Stone
 * 3587:126389): a row of "Slider Option" segments, each with a 2px top border (leather inside the chosen range,
 * gold outside) and its grade below (36px tall with 12/16 labels on desktop, 32px with 10/14 on mobile), and two
 * 20px handles on the border line: one where the range starts, one where it ends, flush with the row at its ends.
 * Keyboard: each handle is a slider; arrows move it one grade, Home and End to the ends; they never cross.
 * Pointer: press a grade to move the nearer handle there, or drag.
 */
export function GradeRange({ name, options, value, onChange, className }: GradeRangeProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<0 | 1 | null>(null);
  const last = options.length - 1;
  const [min, max] = [Math.max(0, Math.min(value[0], last)), Math.max(0, Math.min(value[1], last))];

  const setHandle = (handle: 0 | 1, index: number) => {
    const clamped = Math.max(0, Math.min(last, index));
    const next: [number, number] = handle === 0 ? [Math.min(clamped, max), max] : [min, Math.max(clamped, min)];
    if (next[0] !== min || next[1] !== max) onChange(next);
  };

  const indexAt = (clientX: number) => {
    const rect = rowRef.current!.getBoundingClientRect();
    return Math.max(0, Math.min(last, Math.floor(((clientX - rect.left) / Math.max(1, rect.width)) * options.length)));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const index = indexAt(event.clientX);
    // Outside the range the nearer end moves; inside it, the end the press is closer to.
    const handle: 0 | 1 = index < min ? 0 : index > max ? 1 : index - min < max - index ? 0 : 1;
    dragging.current = handle;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.querySelectorAll<HTMLElement>("[role=slider]")[handle]?.focus();
    setHandle(handle, index);
  };

  const onKeyDown = (handle: 0 | 1) => (event: KeyboardEvent<HTMLDivElement>) => {
    const current = handle === 0 ? min : max;
    const moves: Record<string, number> = { ArrowRight: current + 1, ArrowUp: current + 1, ArrowLeft: current - 1, ArrowDown: current - 1, Home: 0, End: last };
    if (!(event.key in moves)) return;
    event.preventDefault();
    setHandle(handle, moves[event.key]);
  };

  // A handle sits on the boundary where the range starts or ends, kept inside the row at its two ends.
  const left = (boundary: number) => `clamp(0px, calc(${(boundary / options.length) * 100}% - 0.625rem), calc(100% - 1.25rem))`;

  return (
    <div
      ref={rowRef}
      onPointerDown={onPointerDown}
      onPointerMove={(event) => {
        if (dragging.current !== null) setHandle(dragging.current, indexAt(event.clientX));
      }}
      onPointerUp={() => (dragging.current = null)}
      onPointerCancel={() => (dragging.current = null)}
      className={cx("relative cursor-pointer touch-none pt-space-2 select-none", className)}
    >
      <div className="flex gap-0.5">
        {options.map((option, index) => {
          const inside = index >= min && index <= max;
          return (
            <span
              key={option.value}
              data-grade={option.value}
              data-selected={inside ? "" : undefined}
              className={cx(
                "ui-transition-fast min-w-0 flex-1 border-t-2 px-0.5 pt-space-2 pb-space-2 text-center ui-desktop:pt-2.5",
                inside ? "border-primary-leather text-primary-leather" : "border-secondary-gold text-black-alpha-70",
              )}
            >
              <span className="type-ui-2xs-medium block truncate ui-desktop:type-ui-xs-regular">{option.label}</span>
            </span>
          );
        })}
      </div>
      {([0, 1] as const).map((handle) => {
        const index = handle === 0 ? min : max;
        return (
          <div
            key={handle}
            role="slider"
            tabIndex={0}
            aria-label={`${handle === 0 ? "Lowest" : "Highest"} ${name}`}
            aria-valuemin={handle === 0 ? 0 : min}
            aria-valuemax={handle === 0 ? max : last}
            aria-valuenow={index}
            aria-valuetext={options[index]?.label}
            aria-orientation="horizontal"
            onKeyDown={onKeyDown(handle)}
            className="ui-transition absolute -top-0.5 size-space-5 rounded-full border border-primary-leather bg-base-white shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-leather"
            style={{ left: left(handle === 0 ? min : max + 1), zIndex: handle === 0 && min === last ? 2 : 1 }}
          />
        );
      })}
    </div>
  );
}
