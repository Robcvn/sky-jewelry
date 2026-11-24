"use client";

import { useRef, useState } from "react";
import { PaginationDots } from "@/components/ui/Pagination";
import { Picture, slotImage, type ImageRef } from "@/components/ui/Picture";
import { Tabs } from "@/components/ui/Tabs";
import { Viewer360 } from "@/components/ui/Viewer360";
import { SHOW_360 } from "@/lib/features";
import { cx } from "@/components/ui/shared";
import { productDetailContent } from "@/content/product-detail";
import type { Product, ProductVariant } from "@/content/products";
import { desktopGallery, galleryPhotos, stonePhoto } from "./productFacts";
import { useDragScroll } from "@/components/ui/useDragScroll";

const { labels } = productDetailContent;
const TILE_BG = "bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]";

/**
 * Desktop gallery (Figma 3565:98419): a sticky column with the photos in a 2 x 2 grid of squares on the
 * product-image gradient. With an odd number of photos the first one spans the row. When the product has a
 * 360° sequence (and SHOW_360 is on), the viewer takes the second tile (Figma's 360 tile); otherwise that tile shows
 * the stone.
 */
export function DesktopGallery({ product, variant, name }: { product: Product; variant: ProductVariant; name: string }) {
  const photos = desktopGallery(product, variant.metal);
  const tiles: Array<{ key: string; image?: ImageRef; spin?: ImageRef[] }> = photos.map((image, index) => ({ key: `${variant.metal}-${index}`, image }));
  const spin = SHOW_360 ? product.spin : null;
  if (spin) tiles.splice(1, 0, { key: "spin", spin });
  const wide = (index: number) => tiles.length % 2 === 1 && index === 0;

  return (
    <div className="grid grid-cols-2 gap-space-3">
      {tiles.map((tile, index) => (
        <div
          key={tile.key}
          className={cx("relative aspect-square overflow-hidden rounded-4", TILE_BG, wide(index) && "col-span-2")}
        >
          {tile.spin ? (
            <Viewer360 frames={tile.spin} label={`${name}, 360° view`} sizes={{ desktop: "27vw", mobile: "100vw" }} />
          ) : (
            <Picture
              // The first tile spans the row when the count is odd: 694px at 1440 (the 718 column less its 24px padding).
              image={wide(index) ? slotImage(tile.image!, "gallery-d-wide") : tile.image!}
              priority={index === 0}
              sizes={{ desktop: wide(index) ? "min(43.375rem, 48.2vw)" : "25vw", mobile: "100vw" }}
              className="size-full object-cover mix-blend-multiply"
            />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Mobile gallery (Figma "PDP - Asset Tabs", 3587:127149): a full-width square that swipes between the photos,
 * with pagination dots; a 64px thumbnail in the corner switches between the piece and its stone (Type
 * Setting / Stone); "360° View / Images" line tabs below, shown only when the product has a 360° sequence.
 */
export function MobileGallery({ product, variant, name }: { product: Product; variant: ProductVariant; name: string }) {
  const stone = stonePhoto(product);
  const [showStone, setShowStone] = useState(false);
  const [tab, setTab] = useState<"images" | "spin">("images");
  const spin = SHOW_360 ? product.spin : null;
  const photos = showStone && stone ? [stone] : galleryPhotos(product, variant.metal).map((image) => slotImage(image, "gallery-m"));
  const scroller = useRef<HTMLDivElement>(null);
  const scrollerRef = useDragScroll(scroller);
  const [current, setCurrent] = useState(0);

  // Back to the first photo when the metal or the stone view changes (the scroller remounts at the start).
  const viewKey = `${variant.metal}-${showStone}`;
  const [shownKey, setShownKey] = useState(viewKey);
  if (shownKey !== viewKey) {
    setShownKey(viewKey);
    setCurrent(0);
  }

  const goTo = (index: number) => {
    const node = scroller.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollTo({ left: index * node.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="flex flex-col gap-space-2">
      <div className={cx("relative aspect-square w-full overflow-hidden", TILE_BG)}>
        {tab === "spin" && spin ? (
          <Viewer360 frames={spin} label={`${name}, 360° view`} sizes={{ desktop: "50vw", mobile: "100vw" }} />
        ) : (
          <>
            <div
              key={viewKey}
              ref={scrollerRef}
              role="region"
              aria-label={`Photos of ${name}`}
              tabIndex={photos.length > 1 ? 0 : undefined}
              data-scroll-region
              onScroll={(event) => setCurrent(Math.round(event.currentTarget.scrollLeft / Math.max(1, event.currentTarget.clientWidth)))}
              className="relative flex size-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] focus-visible:-outline-offset-2 [&::-webkit-scrollbar]:hidden"
            >
              {photos.map((image, index) => (
                <div key={`${showStone}-${variant.metal}-${index}`} className="relative size-full shrink-0 snap-start">
                  <Picture image={image} priority={index === 0} sizes={{ desktop: "50vw", mobile: "100vw" }} className="size-full object-cover mix-blend-multiply" />
                </div>
              ))}
            </div>
            {photos.length > 1 ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-space-4 flex justify-center [&>*]:pointer-events-auto">
                <PaginationDots
                  count={photos.length}
                  current={current}
                  onSelect={goTo}
                  label={`Photos of ${name}`}
                  itemLabel={(index) => `Photo ${index + 1} of ${photos.length}`}
                />
              </div>
            ) : null}
          </>
        )}
        {stone ? (
          <button
            type="button"
            aria-pressed={showStone}
            aria-label={showStone ? labels.showSetting : labels.showStone}
            onClick={() => {
              setShowStone((value) => !value);
              setTab("images");
            }}
            className="ui-transition absolute right-space-4 bottom-space-4 size-space-13 cursor-pointer overflow-hidden rounded-4 border border-black-alpha-10 bg-base-white hover:border-black-alpha-50"
          >
            <Picture
              image={{ ...(showStone ? galleryPhotos(product, variant.metal)[0] : stone), alt: "" }}
              sizes={{ desktop: "64px", mobile: "64px" }}
              className="size-full object-cover mix-blend-multiply"
            />
          </button>
        ) : null}
      </div>
      {spin ? (
        <Tabs
          label={`Views of ${name}`}
          variant="line"
          size="sm"
          divider
          value={tab}
          onChange={(id) => setTab(id as "images" | "spin")}
          items={[
            { id: "spin", label: labels.view360 },
            { id: "images", label: labels.images },
          ]}
        />
      ) : null}
    </div>
  );
}
