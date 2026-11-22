import type { CSSProperties, ReactNode } from "react";
import { Swatch } from "./Swatch";
import { cx, withBasePath } from "./shared";

type ProductInfoCardProps = {
  label: string;
  value: ReactNode;
  /** Figma "Product Info Scale", the composition chart, a diagram... shown between the value and the note. */
  children?: ReactNode;
  note?: ReactNode;
  /** Push the note to the bottom of the card when the card stretches to its row. */
  spread?: boolean;
  /**
   * Space between the value, the content and the note. "sm" (8px) is Figma's stat and scale cards; "md" (12px)
   * is the Metal card, whose chart stack Figma spaces at 12.
   */
  gap?: "sm" | "md";
  className?: string;
};

/**
 * Figma "Product Info Card" (Cards page), Sizes MD (desktop) and SM (mobile): white, a black-alpha-5 border,
 * radius 4; an overline label, an 18/24 value, optional content, and a short note. Figma draws the 1px border inside
 * its 12 / 16 padding, so the padding here is 11 / 15.
 */
export function ProductInfoCard({ label, value, children, note, spread = false, gap = "sm", className }: ProductInfoCardProps) {
  const space = gap === "md" ? "gap-space-3" : "gap-space-2";
  return (
    <div
      className={cx(
        "flex flex-col rounded-4 border border-black-alpha-5 bg-secondary-pure-white p-[0.6875rem] text-primary-leather ui-desktop:p-[0.9375rem]",
        space,
        spread && "justify-between",
        className,
      )}
    >
      <div className={cx("flex flex-col", space)}>
        <div className="flex flex-col gap-space-2 pr-space-3 ui-desktop:pr-space-8">
          <p className="type-overline-xs-medium">{label}</p>
          <p className="type-ui-lg-medium">{value}</p>
        </div>
        {children}
      </div>
      {note ? <div className="type-ui-2xs-regular ui-desktop:type-ui-xs-regular">{note}</div> : null}
    </div>
  );
}

// Figma's clarity bar is a monotone noise fill (size 2, density 0.4) fading out to the left, which CSS can't
// reproduce: the bar is Figma's own 2x export (desktop 215x32 from 3565:98309, mobile 147x32 from 3587:127126),
// trimmed of its 1px border, which the bar draws itself. The desktop export ended in 18 transparent columns (a light
// strip at the bar's right end, as some Figma instances draw it); it is cropped to its opaque 408x60, so the texture
// meets the border on all four sides (Corrected design oversights). The mobile export is opaque edge to edge.
const CLARITY = {
  mobile: `url("${withBasePath("/images/pdp/clarity-scale-m.webp")}")`,
  desktop: `url("${withBasePath("/images/pdp/clarity-scale-d.webp")}")`,
};

/**
 * Figma "Product Info Scale": a 32px bar with a leather marker (1px line and a 6px dot) at `position` (0 to 1).
 * "color": white to peach. "clarity": a speckled texture that fades from right to left.
 */
export function InfoScale({ kind, position, label }: { kind: "color" | "clarity"; position: number; label: string }) {
  const left = `${Math.min(0.97, Math.max(0.03, position)) * 100}%`;
  return (
    <div role="img" aria-label={label} className="relative h-space-8">
      <span
        className={cx(
          "absolute inset-0 overflow-hidden rounded-[2px] border",
          kind === "color"
            ? "border-black-alpha-10 bg-[linear-gradient(90deg,var(--color-secondary-pure-white),var(--color-secondary-peach))]"
            : "border-black-alpha-10 bg-secondary-pure-white",
        )}
      >
        {kind === "clarity" ? (
          <span
            className="absolute inset-0 bg-(image:--clarity-m) bg-size-[100%_100%] ui-desktop:bg-(image:--clarity-d)"
            style={{ "--clarity-m": CLARITY.mobile, "--clarity-d": CLARITY.desktop } as CSSProperties}
          />
        ) : null}
      </span>
      <span aria-hidden="true" className="absolute -top-0.5 bottom-0 w-px -translate-x-1/2 bg-primary-leather" style={{ left }}>
        <span className="absolute -top-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary-leather" />
      </span>
    </div>
  );
}

export type CompositionPart = { label: string; percent: number; swatch: string };

/**
 * The metal composition: a 64px donut built from the data (decorative; the legend carries the text) and a
 * two-column legend with 12px swatches.
 */
export function CompositionChart({ parts }: { parts: CompositionPart[] }) {
  const radius = 26.8;
  const circumference = 2 * Math.PI * radius;
  const starts = parts.map((_, index) => parts.slice(0, index).reduce((sum, part) => sum + (part.percent / 100) * circumference, 0));
  const format = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)}%`;
  return (
    <div className="flex items-center gap-space-6">
      <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden="true" className="shrink-0 -rotate-90">
        {parts.map((part, index) => {
          const length = (part.percent / 100) * circumference;
          return (
            <circle
              key={part.label}
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke={part.swatch}
              strokeWidth="10.4"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-starts[index]}
            />
          );
        })}
      </svg>
      <ul className="grid flex-1 grid-cols-2 gap-space-2 ui-desktop:max-w-60">
        {parts.map((part) => (
          <li key={part.label} className="type-ui-2xs-regular flex items-center gap-1.5 ui-desktop:type-ui-xs-regular ui-desktop:gap-space-2">
            <Swatch color={part.swatch} size="sm" />
            {format(part.percent)} {part.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Figma's mobile-only dimensions diagram: an L-shaped ruler around the stone outline (40px). */
export function DimensionsDiagram() {
  // eslint-disable-next-line @next/next/no-img-element -- a static SVG exported from Figma
  return <img src={withBasePath("/images/pdp/dimensions-scale-round.svg")} alt="" width={40} height={40} className="size-space-10" />;
}
