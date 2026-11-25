"use client";

import { useRef, type KeyboardEvent } from "react";
import { cx } from "./shared";
import { useRangeDrag } from "./useRangeDrag";

export type RangeValue = [number, number];

type RangeSliderProps = {
  min: number;
  max: number;
  step: number;
  value: RangeValue;
  /** Called while dragging or pressing keys. */
  onChange: (value: RangeValue) => void;
  /** Accessible names for the two handles, e.g. "Minimum price" and "Maximum price". */
  labels: [string, string];
  /** Spoken value, e.g. (500) => "$500". */
  formatValue?: (value: number) => string;
  className?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Figma range slider (Price dropdown, Filters sheet): a 2px track, gold outside the range and leather inside,
 * with two 20px handles that sit flush inside the track at its ends.
 * Keyboard: arrows move one step, Page Up/Down ten steps, Home/End to the ends. The handles never cross.
 * Pointer: press anywhere on the track to move the nearer handle there, then drag. A pressed handle is the one dragged
 * (useRangeDrag), and its centre follows the pointer.
 */
export function RangeSlider({ min, max, step, value, onChange, labels, formatValue = String, className }: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const span = max - min || 1;
  const decimals = (String(step).split(".")[1] ?? "").length;
  const snap = (raw: number) => Number(clamp(Math.round((raw - min) / step) * step + min, min, max).toFixed(decimals));
  const percent = (n: number) => ((n - min) / span) * 100;

  const setHandle = (index: 0 | 1, next: number) => {
    const snapped = snap(next);
    const updated: RangeValue = index === 0 ? [Math.min(snapped, value[1]), value[1]] : [value[0], Math.max(snapped, value[0])];
    if (updated[0] !== value[0] || updated[1] !== value[1]) onChange(updated);
  };

  const valueAt = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    // Handles are 20px and sit inside the track, so their centres run from 10px to width - 10px.
    const ratio = clamp((clientX - rect.left - 10) / Math.max(1, rect.width - 20), 0, 1);
    return min + ratio * span;
  };

  const pointer = useRangeDrag({
    onTrackPress: (clientX) => {
      const target = valueAt(clientX);
      const index: 0 | 1 =
        Math.abs(target - value[0]) < Math.abs(target - value[1]) || (value[0] === value[1] && target < value[0]) ? 0 : 1;
      setHandle(index, target);
      return index;
    },
    onTrackMove: (index, clientX) => setHandle(index, valueAt(clientX)),
    onHandleMove: (index, centreX) => setHandle(index, valueAt(centreX)),
  });

  const onKeyDown = (index: 0 | 1) => (event: KeyboardEvent<HTMLDivElement>) => {
    const current = value[index];
    const moves: Record<string, number> = {
      ArrowRight: current + step,
      ArrowUp: current + step,
      ArrowLeft: current - step,
      ArrowDown: current - step,
      PageUp: current + step * 10,
      PageDown: current - step * 10,
      Home: min,
      End: max,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    setHandle(index, moves[event.key]);
  };

  const left = percent(value[0]);
  const right = percent(value[1]);
  const position = (pct: number) => `calc(${pct / 100} * (100% - 1.25rem))`;

  return (
    <div
      ref={trackRef}
      {...pointer}
      className={cx("relative h-space-5 w-full cursor-pointer touch-none select-none", className)}
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-secondary-gold" />
      <span
        aria-hidden="true"
        className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-primary-leather"
        style={{ left: `calc(${position(left)} + 0.625rem)`, right: `calc(100% - ${position(right)} - 0.625rem)` }}
      />
      {([0, 1] as const).map((index) => (
        <div
          key={index}
          role="slider"
          tabIndex={0}
          aria-label={labels[index]}
          aria-valuemin={index === 0 ? min : value[0]}
          aria-valuemax={index === 0 ? value[1] : max}
          aria-valuenow={value[index]}
          aria-valuetext={formatValue(value[index])}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown(index)}
          className="ui-transition absolute top-0 size-space-5 rounded-full border border-primary-leather bg-base-white shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-leather"
          style={{ left: position(index === 0 ? left : right), zIndex: index === 0 && value[0] === max ? 2 : 1 }}
        />
      ))}
    </div>
  );
}
