import { cx } from "./shared";

// Figma "Product Card Swatch" Glow layer: a radial gradient blended with overlay. Copied from the Figma fill.
const GLOW =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect width='100%' height='100%' fill='url(%23g)'/><defs><radialGradient id='g' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-0.71111 -0.75556 2.6101 -2.4565 9.3333 9.3333)'><stop stop-color='rgba(0,0,0,0)' offset='0'/><stop stop-color='rgba(0,0,0,1)' offset='1'/></radialGradient></defs></svg>\")";

type SwatchProps = {
  /** Metal or stone colour. This is product data, not a design token. */
  color: string;
  className?: string;
};

/** Figma "Product Card Swatch": a 16px colour dot with a shine and a glow. Decorative; the label sits next to it. */
export function Swatch({ color, className }: SwatchProps) {
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: color }}
      className={cx(
        "relative block size-space-4 shrink-0 overflow-hidden rounded-full border-[0.75px] border-black-alpha-5 shadow-[inset_0_0_0_1px_var(--color-black-alpha-2)]",
        className,
      )}
    >
      <span className="absolute -inset-[0.75px] rounded-full bg-[linear-gradient(135.067deg,transparent_16.706%,var(--color-secondary-pure-white)_49.68%,transparent_83.294%)] opacity-75" />
      <span className="absolute -inset-[0.75px] -rotate-90 rounded-full bg-size-[100%_100%] mix-blend-overlay" style={{ backgroundImage: GLOW }} />
    </span>
  );
}
