"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Picture, type ImageRef } from "./Picture";
import { cx, withBasePath } from "./shared";
import { Icon } from "./Icon";

type Viewer360Props = {
  /** The image sequence, in rotation order (at least two frames). */
  frames: ImageRef[];
  /** e.g. "14K Yellow Gold Four Prong Solitaire Pendant, 360° view". */
  label: string;
  sizes: { desktop: string; mobile: string };
  className?: string;
};

/**
 * 360° viewer for an image sequence, with Figma's drag hint (the 360 icon over a dashed arc and an
 * arrow-dot-arrow control). Drag sideways to turn the piece; with the keyboard, the viewer is a slider:
 * arrows step one frame, Home/End go to the first and last. Frames after the first load lazily. No motion
 * runs on its own, so reduced motion needs nothing extra.
 */
export function Viewer360({ frames, label, sizes, className }: Viewer360Props) {
  const [frame, setFrame] = useState(0);
  const [touched, setTouched] = useState(false);
  const drag = useRef<{ x: number; frame: number } | null>(null);
  const count = frames.length;
  const wrap = (n: number) => ((n % count) + count) % count;

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, frame };
    event.currentTarget.setPointerCapture(event.pointerId);
    setTouched(true);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    // One full turn per width of the viewer.
    const width = event.currentTarget.clientWidth || 1;
    const steps = Math.round(((event.clientX - drag.current.x) / width) * count);
    setFrame(wrap(drag.current.frame - steps));
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowRight: frame + 1, ArrowUp: frame + 1, ArrowLeft: frame - 1, ArrowDown: frame - 1, Home: 0, End: count - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    setTouched(true);
    setFrame(wrap(moves[event.key]));
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={count}
      aria-valuenow={frame + 1}
      aria-valuetext={`View ${frame + 1} of ${count}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      onKeyDown={onKeyDown}
      className={cx(
        "relative size-full cursor-grab touch-pan-y select-none active:cursor-grabbing focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-leather",
        className,
      )}
    >
      {frames.map((image, index) => (
        <div key={index} className={cx("absolute inset-0", index === frame ? "block" : "hidden")}>
          <Picture image={image} sizes={sizes} className="pointer-events-none size-full object-cover mix-blend-multiply" />
        </div>
      ))}
      <Hint360 className={cx("bottom-space-6 transition-opacity duration-300 motion-reduce:transition-none", touched ? "opacity-0" : "opacity-100")} />
    </div>
  );
}

/** Pagination dots placed above the 360 hint when a photo has both (16 + the hint's 48 + 8). */
export const DOTS_ABOVE_HINT = "bottom-[calc(var(--spacing-space-4)+var(--spacing-space-11)+var(--spacing-space-2))]";

/**
 * Figma's 360 hint (the 360 icon over a dashed arc and its control dots, 132 x 48), centred at the bottom of a tile.
 * The viewer above uses it as its drag hint; the ring and earrings builders show it alone, wherever Figma draws it
 * on a photo with no image sequence (a drawn control with nothing to turn yet: Held for review).
 */
export function Hint360({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" data-hint-360 className={cx("pointer-events-none absolute inset-x-0 flex flex-col items-center", className)}>
      <Icon name="360-view" size={40} className="text-primary-leather" />
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG parts of Figma's 360 hint */}
      <img src={withBasePath("/images/pdp/360-arc.svg")} alt="" width={131} height={25} className="-mt-space-2" />
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG parts of Figma's 360 hint */}
      <img src={withBasePath("/images/pdp/360-control.svg")} alt="" width={24} height={8} className="-mt-space-3" />
    </div>
  );
}
