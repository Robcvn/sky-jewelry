"use client";

import { useRef, useState } from "react";
import { StoneCertificateTile, StoneSpecsTile, STONE_DRAWING_BG, STONE_TILE_BG } from "@/components/builder/StoneDetailGallery";
import { StonePicture } from "@/components/builder/StonePicture";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { PaginationDots } from "@/components/ui/Pagination";
import { Picture, slotImage, type ImageRef } from "@/components/ui/Picture";
import { cx, withBasePath } from "@/components/ui/shared";
import { Hint360 } from "@/components/ui/Viewer360";
import { earringsContent } from "@/content/earrings";
import type { Stone } from "@/lib/builder";
import { useDragScroll } from "@/components/ui/useDragScroll";

const copy = earringsContent.pair;
const TILE_BG = "bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]";

/** The setting's three photos, by Figma's roles: the studs from the front, with their backs, and worn. */
export type SettingPhotos = { front: ImageRef; angled: ImageRef | null; worn: ImageRef | null; all: ImageRef[] };

/** Splits a setting's photos by file name (front, "-angled", "-worn"), as the catalogue names them. */
export function settingPhotos(images: ImageRef[]): SettingPhotos {
  const by = (suffix: string) => images.find((image) => String(image.desktop).endsWith(suffix)) ?? null;
  const angled = by("-angled");
  const worn = by("-worn");
  const front = images.find((image) => image !== angled && image !== worn) ?? images[0];
  return { front, angled, worn, all: images };
}

/**
 * The model photo tile (Figma tile 2 of Setting Info 3565:98797 and Complete 3565:99734): the studs worn, with
 * Figma's overlay pagination dots at the bottom and its overlay arrow on the right. The dots and the arrow page
 * through the setting's photos, the worn one first (Figma draws five dots; there is one dot per photo). On Step 3 it
 * carries Figma's badge.
 */
export function ModelTile({ images, name, badge, sizes }: { images: ImageRef[]; name: string; badge?: string; sizes: { desktop: string; mobile: string } }) {
  const [index, setIndex] = useState(0);
  const image = images[index] ?? images[0];
  const worn = String(image.desktop).endsWith("-worn");
  return (
    <div data-model-tile className={cx("relative aspect-square overflow-hidden rounded-4", TILE_BG)}>
      <Picture image={image} sizes={sizes} className={cx("size-full object-cover", !worn && "mix-blend-multiply")} />
      {badge ? (
        <span className="absolute inset-x-0 top-space-4 flex justify-center">
          <Badge overlay size="xs" className="min-h-space-6">
            {badge}
          </Badge>
        </span>
      ) : null}
      {images.length > 1 ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-space-4 flex justify-center [&>*]:pointer-events-auto">
            <PaginationDots count={images.length} current={index} onSelect={setIndex} overlay label={`Photos of ${name}`} itemLabel={(item) => `Photo ${item + 1} of ${images.length}`} />
          </div>
          <IconButton
            icon="chevron-right"
            label="Next photo"
            size="sm"
            variant="ghost"
            overlay
            onClick={() => setIndex((current) => (current + 1) % images.length)}
            className="absolute top-1/2 right-space-2 -translate-y-1/2"
          />
        </>
      ) : null}
    </div>
  );
}

export type GalleryTile =
  | { key: string; kind: "photo"; image: ImageRef; hint360?: boolean; priority?: boolean }
  | { key: string; kind: "model"; images: ImageRef[]; name: string; badge?: string }
  | { key: string; kind: "stone"; stone: Pick<Stone, "image" | "shape" | "title">; hint360?: boolean };

const DESKTOP_SIZES = { desktop: "(width >= 90rem) 21.3rem, 24vw", mobile: "100vw" };

/**
 * The desktop gallery of Setting Info and Complete (Figma 3565:98709 and 3565:99574, "images"): a 2 x 2 grid of
 * 341px tiles, 12 apart, in the 694px column. Each frame chooses its four tiles. The 360 hint is placed where Figma
 * draws it and hidden while SHOW_360 is off (no photo has an image sequence; Deviations).
 */
export function EarringsDesktopGallery({ tiles }: { tiles: GalleryTile[] }) {
  return (
    <div data-earrings-gallery className="grid grid-cols-2 gap-space-3">
      {tiles.map((tile) => {
        if (tile.kind === "model") return <ModelTile key={tile.key} images={tile.images} name={tile.name} badge={tile.badge} sizes={DESKTOP_SIZES} />;
        const stone = tile.kind === "stone";
        return (
          <div
            key={tile.key}
            data-gallery-tile={tile.kind}
            className={cx("relative aspect-square overflow-hidden rounded-4", stone ? (tile.stone.image ? STONE_TILE_BG : STONE_DRAWING_BG) : TILE_BG)}
          >
            {stone ? (
              <StonePicture stone={tile.stone} sizes={DESKTOP_SIZES} />
            ) : (
              <Picture image={tile.image} priority={tile.priority} sizes={DESKTOP_SIZES} className="size-full object-cover mix-blend-multiply" />
            )}
            {tile.hint360 ? <Hint360 className="bottom-space-4" /> : null}
          </div>
        );
      })}
    </div>
  );
}

/**
 * The mobile gallery of Setting Info and Complete (Figma "PDP - Fine Jewelry / Asset Tabs" 3587:127517, 390 tall
 * here): the setting's photos, full width and swiped sideways, with the 360 hint, and a 64px thumbnail of a
 * diamond in the corner that switches to the diamond and back (the prototype's "State=360, Type=Stone"). The 360 hint
 * is hidden while SHOW_360 is off, and the "360° View / Images" tabs below are not built (Deviations).
 */
export function EarringsMobileGallery({ photos, stone, name }: { photos: ImageRef[]; stone: Pick<Stone, "image" | "shape" | "title">; name: string }) {
  const [showStone, setShowStone] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const scrollerRef = useDragScroll(scroller);
  return (
    <div data-earrings-mobile-gallery className={cx("relative aspect-square w-full overflow-hidden", showStone && !stone.image ? STONE_DRAWING_BG : TILE_BG)}>
      {showStone ? (
        <StonePicture stone={stone} sizes={{ desktop: "50vw", mobile: "100vw" }} />
      ) : (
        <div
          ref={scrollerRef}
          role="region"
          aria-label={`Photos of ${name}`}
          tabIndex={photos.length > 1 ? 0 : undefined}
          data-scroll-region
          className="relative flex size-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] focus-visible:-outline-offset-2 [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((image, index) => (
            <div key={`${String(image.desktop)}-${index}`} className="relative size-full shrink-0 snap-start">
              <Picture image={slotImage(image, "gallery-m")} priority={index === 0} sizes={{ desktop: "50vw", mobile: "100vw" }} className={cx("size-full object-cover", !String(image.desktop).endsWith("-worn") && "mix-blend-multiply")} />
            </div>
          ))}
        </div>
      )}
      <Hint360 className="bottom-space-4" />
      <button
        type="button"
        aria-pressed={showStone}
        aria-label={showStone ? "Show the earrings" : "Show the diamond"}
        onClick={() => setShowStone((value) => !value)}
        className={cx(
          "ui-transition absolute right-space-4 bottom-space-4 size-space-13 cursor-pointer overflow-hidden rounded-4 border border-black-alpha-10 hover:border-black-alpha-50",
          showStone || stone.image ? "bg-base-white" : STONE_DRAWING_BG,
        )}
      >
        {showStone ? (
          <Picture image={{ ...photos[0], alt: "" }} sizes={{ desktop: "64px", mobile: "64px" }} className="size-full object-cover mix-blend-multiply" />
        ) : (
          <span aria-hidden="true" className="block size-full">
            <StonePicture stone={{ ...stone, title: "" }} sizes={{ desktop: "64px", mobile: "64px" }} />
          </span>
        )}
      </button>
    </div>
  );
}

type View = "photo" | "specs" | "certificate";

/** The small drawing on the specs thumbnail: Figma's round drawing for a round stone, the shape's line icon otherwise. */
function SpecsThumb({ stone }: { stone: Stone }) {
  if (stone.shape === "round")
    // eslint-disable-next-line @next/next/no-img-element -- Figma's line drawing, pre-sized
    return <img src={withBasePath("/images/builder/stone-specs-round-341.webp")} alt="" width={75} height={75} loading="lazy" className="size-full object-cover mix-blend-multiply" />;
  return <StonePicture stone={{ image: null, shape: stone.shape, title: "" }} sizes={{ desktop: "75px", mobile: "75px" }} />;
}

/**
 * One diamond of a pair (Figma Stones Info "stack" 3565:99228: desktop a 323px tile over a row of three 75px
 * thumbnails, 8 apart and 12 in from the left; mobile 3587:127889: a 390px tile and the row centred). The tile
 * shows the stone's photo (with the 360 hint while SHOW_360 is on), its specs drawing, or its certificate; the thumbnails switch it, the
 * chosen one outlined in leather. Mobile Figma's first thumbnail is the earrings photo, a placeholder: it shows the
 * stone, as on desktop (a corrected design oversight).
 */
export function PairStoneViews({ stone, name, variant }: { stone: Stone; name: string; variant: "desktop" | "mobile" }) {
  const [view, setView] = useState<View>("photo");
  const photoBg = stone.image ? STONE_TILE_BG : STONE_DRAWING_BG;
  const mobile = variant === "mobile";
  const thumbs: Array<{ view: View; label: string; node: React.ReactNode; bg: string }> = [
    { view: "photo", label: copy.photo, node: <StonePicture stone={{ ...stone, title: "" }} sizes={{ desktop: "75px", mobile: "75px" }} />, bg: photoBg },
    { view: "specs", label: copy.specs, node: <SpecsThumb stone={stone} />, bg: stone.shape === "round" ? STONE_TILE_BG : STONE_DRAWING_BG },
    {
      view: "certificate",
      label: copy.certificate,
      node: (
        <span className="flex size-full items-center justify-center text-primary-leather">
          <Icon name="certificate" size={32} />
        </span>
      ),
      bg: "bg-[#f2f0ec]",
    },
  ];
  return (
    <div className="flex flex-col gap-space-2">
      <div className={cx("relative aspect-square overflow-hidden", mobile ? "" : "rounded-4", view === "photo" && photoBg)}>
        {view === "photo" ? (
          <>
            <StonePicture stone={stone} priority sizes={{ desktop: "(width >= 90rem) 20.2rem, 23vw", mobile: "100vw" }} />
            <Hint360 className="bottom-space-4" />
          </>
        ) : view === "specs" ? (
          <StoneSpecsTile stone={stone} className="size-full rounded-none!" />
        ) : (
          <StoneCertificateTile stone={stone} className="size-full rounded-none!" />
        )}
      </div>
      <div role="group" aria-label={copy.viewsLabel(name)} className={cx("flex gap-space-2", mobile ? "justify-center" : "px-space-3")}>
        {thumbs.map((thumb) => (
          <button
            key={thumb.view}
            type="button"
            aria-pressed={view === thumb.view}
            aria-label={thumb.label}
            onClick={() => setView(thumb.view)}
            className={cx(
              "ui-transition relative size-[4.6875rem] shrink-0 cursor-pointer overflow-hidden rounded-4 border hover:border-black-alpha-50",
              view === thumb.view ? "border-primary-leather" : "border-transparent",
              thumb.bg,
            )}
          >
            {thumb.node}
          </button>
        ))}
      </div>
    </div>
  );
}
