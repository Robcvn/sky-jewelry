import { useId } from "react";
import { metalBadgeData } from "@/icons/metal-badge-data";
import type { MetalId } from "@/content/metals";

/**
 * Figma "Metal - 14k Yellow Gold" and the other metal badges: a ring in the metal colour around a near-white
 * centre with the karat. Drawn inline rather than as an <img>: the badge's Glow layer is blended with overlay,
 * and only an inline SVG blends with the tile behind it, as in Figma (D20). In an <img> the blend has nothing
 * behind it and the centre turns grey. Gradient ids get a per-badge suffix, so a badge inside a hidden
 * breakpoint copy doesn't break the visible one's gradients. Decorative: the tile's label names the metal.
 */
export function MetalBadge({ metal, size = 32, className }: { metal: MetalId; size?: number; className?: string }) {
  const suffix = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { viewBox, body } = metalBadgeData[metal];
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-metal-badge={metal}
      className={["shrink-0", className].filter(Boolean).join(" ")}
      dangerouslySetInnerHTML={{ __html: body.replace(/(paint\d+_(?:linear|radial)_[\d_]+)/g, `$1-${suffix}`) }}
    />
  );
}
