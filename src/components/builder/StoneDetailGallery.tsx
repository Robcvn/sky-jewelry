import { Icon } from "@/components/ui/Icon";
import { cx, withBasePath } from "@/components/ui/shared";
import { builderContent, GEM_COLORS, GEM_TYPES, shapeIcon, shapeLabel } from "@/content/builder";
import type { Stone } from "@/lib/builder";

const { stone: copy } = builderContent;

/** Figma "bg/product-image-bg": the radial tile every product photo sits on. */
export const STONE_TILE_BG = "bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]";
/**
 * A tile with a line drawing and no photo. Figma's photos and its round specs drawing carry their own pale grey
 * backdrop, which is what makes a tile visible on the skin page; a drawing alone gets the certificate tile's fill
 * (#f2f0ec, the same grey) so it still reads as a tile.
 */
export const STONE_DRAWING_BG = "bg-[#f2f0ec]";

const mm = (value: number) => `${value.toFixed(2)}mm`;
const percent = (value: number) => `${value.toFixed(1)}%`;

/** "Natural Diamond", "Lab-Grown Diamond", "Natural Blue Sapphire": what the certificate tile and card call the stone. */
export function stoneKindLabel(stone: Pick<Stone, "kind" | "origin" | "gem" | "color">) {
  const origin = stone.origin === "natural" ? "Natural" : "Lab-Grown";
  if (stone.kind === "diamond") return `${origin} Diamond`;
  const gem = GEM_TYPES.find((type) => type.value === stone.gem)?.label ?? "Gemstone";
  const color = GEM_COLORS.find((item) => item.value === stone.color)?.label;
  return stone.gem === "moissanite" || !color ? `${origin} ${gem}` : `${origin} ${color} ${gem}`;
}

/** Figma's label on the specs drawing: ui-xs/medium on an ivory chip, 2px padding. */
function SpecLabel({ children, x, y, vertical = false }: { children: string; x: number; y: number; vertical?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cx("type-ui-xs-medium absolute -translate-x-1/2 -translate-y-1/2 bg-secondary-ivory px-0.5 whitespace-nowrap text-primary-leather", vertical && "-rotate-90")}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {children}
    </span>
  );
}

/**
 * The specs tile (Figma "image 20" with its four labels: desktop 3565:100856, mobile 3587:125967). Figma's
 * drawing is of a round stone, seen from above and from the side, and its numbers are placeholders. Built with
 * the stone's own values: length and width in mm on the top view, and on the side view the table and depth
 * percentages, with a % sign, where Figma writes "57.0mm" and "62.4mm" (its unit is wrong: a corrected design
 * oversight). Figma has no drawing for the other nine shapes: those show the shape's line icon with its length
 * and width (an inference).
 */
export function StoneSpecsTile({ stone, className }: { stone: Stone; className?: string }) {
  const round = stone.shape === "round";
  return (
    <div data-stone-specs className={cx("relative aspect-square overflow-hidden rounded-4", round ? STONE_TILE_BG : STONE_DRAWING_BG, className)}>
      <dl className="sr-only">
        <dt>Length</dt>
        <dd>{mm(stone.length)}</dd>
        <dt>Width</dt>
        <dd>{mm(stone.width)}</dd>
        <dt>Table</dt>
        <dd>{percent(stone.table)}</dd>
        <dt>Depth</dt>
        <dd>{percent(stone.depth)}</dd>
      </dl>
      {round ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- Figma's line drawing, exported at 1x and 2x */}
          <img
            src={withBasePath("/images/builder/stone-specs-round-341.webp")}
            srcSet={`${withBasePath("/images/builder/stone-specs-round-341.webp")} 341w, ${withBasePath("/images/builder/stone-specs-round-682.webp")} 682w`}
            sizes="(width >= 64rem) 24vw, calc(100vw - 2.5rem)"
            alt=""
            width={341}
            height={341}
            loading="lazy"
            className="absolute inset-0 size-full object-cover mix-blend-multiply"
          />
          {/* Label centres as Figma places them on the 341px tile. */}
          <SpecLabel x={29.5} y={28.4}>{mm(stone.length)}</SpecLabel>
          <SpecLabel x={8.5} y={51.2} vertical>{mm(stone.width)}</SpecLabel>
          <SpecLabel x={69.2} y={39.3}>{percent(stone.table)}</SpecLabel>
          <SpecLabel x={91.5} y={54.3} vertical>{percent(stone.depth)}</SpecLabel>
        </>
      ) : (
        <>
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-primary-leather">
            <Icon name={shapeIcon(stone.shape)} size={48} className="size-[46%]" />
          </span>
          <SpecLabel x={50} y={20}>{mm(stone.width)}</SpecLabel>
          <SpecLabel x={16} y={50} vertical>{mm(stone.length)}</SpecLabel>
        </>
      )}
    </div>
  );
}

/** The hand photo with its carat toggle: a client component (the toggle is interactive). */
export { StoneSizeGuideTile } from "./StoneSizeGuide";

/**
 * The certificate tile (desktop 3565:100879): the lab, what the stone is, and "view certificate". Figma draws the
 * GIA seal; third-party logos are shown as names on this site, so every lab (GIA, AGS, IGI) shows the certificate
 * icon and its name. There are no certificate files, so the link is drawn but not a link (Held for review), as on
 * Product Detail.
 */
export function StoneCertificateTile({ stone, className }: { stone: Stone; className?: string }) {
  return (
    // #f2f0ec is the tile's own fill in Figma (not a token).
    <div data-stone-certificate className={cx("relative flex aspect-square flex-col items-center justify-center gap-space-4 overflow-hidden rounded-4 bg-[#f2f0ec] text-primary-leather", className)}>
      <Icon name="certificate" size={48} />
      <div className="flex flex-col items-center gap-space-2 text-center">
        <p className="type-ui-sm-medium">{`${stone.certificate} ${stoneKindLabel(stone)}`}</p>
        <span className="type-overline-xs-medium underline underline-offset-2">{copy.viewCertificate}</span>
      </div>
    </div>
  );
}

export const stoneShapeName = (stone: Pick<Stone, "shape">) => shapeLabel(stone.shape);
