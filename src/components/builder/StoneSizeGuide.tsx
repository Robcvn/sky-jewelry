"use client";

import { useId, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { cx, withBasePath } from "@/components/ui/shared";

const GUIDE_CARATS = ["1.0", "1.5", "2.0", "2.5", "3.0"] as const;
type GuideCarat = (typeof GUIDE_CARATS)[number];
/** Figma's photo, and the size both frames mark. */
const FIGMA_CARAT: GuideCarat = "2.5";
const WIDTHS = [342, 700, 1024];

/** 2.5 is Figma's untouched photo; the others are retouched from it (notes/t27/warp.py, see Deviations). */
const src = (carat: GuideCarat, width: number) =>
  withBasePath(`/images/builder/stone-size-guide-hand-${carat === FIGMA_CARAT ? "" : `${carat.replace(".", "")}-`}${width}.webp`);
const twoPlaces = (carat: GuideCarat) => Number(carat).toFixed(2);
const altFor = (carat: GuideCarat) => `A hand with blue nails wearing a round diamond solitaire ring, shown with a ${twoPlaces(carat)} carat stone`;

/**
 * The hand photo (desktop 3565:100875, mobile "Diamond Carat Size Guide" 3587:125982): the photo, its "Shown with"
 * badge and the carat toggle, as a radio group (native radios: arrow keys move and select, focus is visible).
 * - 2.5 is selected at first, as both frames draw it. Figma has that one photo; 1.0, 1.5, 2.0 and 3.0 are retouched
 *   from it, with the stone's diameter scaled by the cube root of the carat ratio (Deviations).
 * - Choosing a size loads its photo (only then: the others are never fetched up front) and cross-fades to it once it
 *   has loaded (ui-transition; none under reduced motion). The badge ("Shown with 1.00ct" on desktop, "Shown with
 *   1.00 ct" on mobile, each in its frame's style) and the alt text follow the photo on show.
 * - Everything is absolutely placed in the square tile, so nothing moves. The toggle is marked data-no-drag-scroll
 *   and pans vertically only (touch-pan-y), so a press or tap on it never drags or swipes a scroller around it.
 */
export function StoneSizeGuideTile({ className }: { className?: string }) {
  const id = useId();
  const [selected, setSelected] = useState<GuideCarat>(FIGMA_CARAT);
  // The photo shown, and the one it replaced (which fades out over it).
  const [{ shown, previous }, setView] = useState<{ shown: GuideCarat; previous: GuideCarat }>({ shown: FIGMA_CARAT, previous: FIGMA_CARAT });
  // Photos mount when first chosen and stay mounted, so going back to one is instant.
  const [mounted, setMounted] = useState<GuideCarat[]>([FIGMA_CARAT]);
  const loaded = useRef<Set<GuideCarat>>(new Set([FIGMA_CARAT]));
  const wanted = useRef<GuideCarat>(FIGMA_CARAT);

  const show = (carat: GuideCarat) => setView((view) => (view.shown === carat ? view : { shown: carat, previous: view.shown }));
  const choose = (carat: GuideCarat) => {
    wanted.current = carat;
    setSelected(carat);
    setMounted((list) => (list.includes(carat) ? list : [...list, carat]));
    if (loaded.current.has(carat)) show(carat);
  };
  const onLoad = (carat: GuideCarat) => {
    loaded.current.add(carat);
    // Show it only if it is still the one wanted (a quick second choice wins).
    if (wanted.current === carat) show(carat);
  };

  return (
    <div data-stone-size-guide data-shown={shown} className={cx("relative aspect-square overflow-hidden rounded-4", className)}>
      {GUIDE_CARATS.filter((carat) => mounted.includes(carat)).map((carat) => (
        // eslint-disable-next-line @next/next/no-img-element -- Figma's photo and its retouched sizes, pre-sized
        <img
          key={carat}
          src={src(carat, 342)}
          srcSet={WIDTHS.map((width) => `${src(carat, width)} ${width}w`).join(", ")}
          sizes="(width >= 64rem) 24vw, calc(100vw - 2.5rem)"
          alt={carat === shown ? altFor(carat) : ""}
          aria-hidden={carat === shown ? undefined : true}
          data-carat={carat}
          width={342}
          height={342}
          loading={carat === FIGMA_CARAT ? "lazy" : "eager"}
          onLoad={() => onLoad(carat)}
          className={cx(
            "absolute inset-0 size-full object-cover",
            carat === shown
              ? "z-1 opacity-100"
              : carat === previous
                ? // The photo being left fades out on top of the new one (opaque underneath): a cross-fade either way.
                  "ui-transition z-2 opacity-0"
                : // Figma's photo stays opaque at the bottom, so nothing ever shows the empty tile.
                  carat === FIGMA_CARAT
                  ? "opacity-100"
                  : "opacity-0",
          )}
        />
      ))}
      <div aria-hidden="true" className="absolute inset-x-0 top-space-4 z-3 flex justify-center">
        {/* Desktop: sentence case in ui-xs/medium. Mobile: the overline style, as each frame draws it. */}
        <span className="hidden ui-desktop:inline-flex">
          <Badge overlay size="xs" className="min-h-space-6">
            {`Shown with ${twoPlaces(shown)}ct`}
          </Badge>
        </span>
        <span className="inline-flex ui-desktop:hidden">
          <Badge overlay size="sm" className="min-h-space-6">
            {`Shown with ${twoPlaces(shown)} ct`}
          </Badge>
        </span>
      </div>
      <div className="absolute inset-x-space-4 bottom-space-4 z-3 flex justify-center">
        <div
          role="radiogroup"
          aria-label="Carat size shown on the hand"
          data-no-drag-scroll
          className="flex w-full max-w-[19.3125rem] touch-pan-y rounded-full border border-white-alpha-20 bg-white-alpha-10 p-[3px] backdrop-blur-md ui-desktop:w-auto"
        >
          {GUIDE_CARATS.map((carat) => (
            <label
              key={carat}
              className={cx(
                "type-ui-2xs-medium ui-transition flex h-space-6 flex-1 cursor-pointer items-center justify-center rounded-full px-space-2 ui-desktop:flex-none",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-primary-leather",
                carat === selected ? "bg-secondary-skin text-primary-leather" : "text-base-white",
              )}
            >
              <input
                type="radio"
                name={`${id}-carat`}
                value={carat}
                checked={carat === selected}
                onChange={() => choose(carat)}
                className="sr-only"
              />
              {carat}
              <span className="sr-only"> carats</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
