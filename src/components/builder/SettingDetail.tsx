"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { CreditModal } from "@/components/bag/BagModals";
import { PickerLabel } from "@/components/pdp/OptionPickers";
import { metalBadge } from "@/components/plp/FilterControls";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { IconBlock } from "@/components/ui/IconBlock";
import { OptionTile } from "@/components/ui/OptionTile";
import { PaginationDots } from "@/components/ui/Pagination";
import { Picture, slotImage, type ImageRef } from "@/components/ui/Picture";
import { MetalSwatches } from "@/components/ui/ProductCard";
import { CompositionChart, ProductInfoCard } from "@/components/ui/ProductInfoCard";
import { useScrollProgress } from "@/components/ui/Scrollbar";
import { cx } from "@/components/ui/shared";
import { DOTS_ABOVE_HINT, Hint360 } from "@/components/ui/Viewer360";
import { builderContent, SETTING_SHAPE_ORDER, shapeIcon, shapeLabel, styleIcon, styleLabel, type StoneShape } from "@/content/builder";
import { metalById, type MetalId } from "@/content/metals";
import { metalComposition, productDetailContent } from "@/content/product-detail";
import { variantHref } from "@/components/pdp/productFacts";
import { formatInstallment, formatPrice, imagesFor, variantName, type Product } from "@/content/products";
import type { RingSetting, StoneSummary } from "@/lib/builder";
import { completeHref, parseRing, parseShape, ringParams, settingShapes, settingsHref, settingVariant, stoneFirst, stoneFirstStartHref, stonesHref } from "./ring";
import { liveQuery, redirectTo, useIsClient, useQuery } from "./useQuery";
import { useDragScroll } from "@/components/ui/useDragScroll";

const { setting: text } = builderContent;
const pdp = productDetailContent;
const TILE_BG = "bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]";

/** The two photos of a ring being worn that Figma's gallery adds to every setting, each under a "Shown with 2.50 ct" badge. */
export const WORN: Array<{ image: ImageRef; carat: string }> = [
  { image: { desktop: "builder-gallery-hand", alt: "A solitaire ring worn on a hand" }, carat: "2.50" },
  { image: { desktop: "builder-gallery-size", alt: "A hand with blue nails wearing a round solitaire ring" }, carat: "2.50" },
];

/** Figma "Badge - Overlay" on the gallery photos: a blurred white pill, 16px from the top. */
export function ShownWith({ carat }: { carat: string }) {
  return (
    <span className="type-overline-xs-medium absolute top-space-4 left-1/2 flex min-h-space-6 -translate-x-1/2 items-center rounded-full border border-white-alpha-20 bg-white-alpha-10 px-space-3 py-space-1 whitespace-nowrap text-base-white backdrop-blur-[15px]">
      {text.shownWith(carat)}
    </span>
  );
}

/** `hint360`: Figma's 360 marker on this photo (hidden while SHOW_360 is off: no setting has an image sequence). */
type Tile = { key: string; image: ImageRef; carat?: string; hint360?: boolean };

/**
 * Desktop gallery (Figma 3565:100665; one 512px column in the 1140 frame 4264:29542): the setting's photos, then
 * the two worn photos. Two columns from 1280px, as Product Detail; with an odd number the first photo spans the row.
 * Figma draws the 360 marker on a product photo of the setting in the second row (3565:100681, a mirrored copy of
 * the first); it is placed on the setting's first photo, as Step 3 puts it on its first tile, and hidden while
 * SHOW_360 is off.
 */
function DesktopGallery({ tiles }: { tiles: Tile[] }) {
  const wide = (index: number) => tiles.length % 2 === 1 && index === 0;
  return (
    <div className="grid grid-cols-1 gap-space-3 min-[80rem]:grid-cols-2">
      {tiles.map((tile, index) => (
        <div key={tile.key} className={cx("relative aspect-square overflow-hidden rounded-4", TILE_BG, wide(index) && "min-[80rem]:col-span-2")}>
          <Picture
            image={wide(index) ? slotImage(tile.image, "gallery-d-wide") : tile.image}
            priority={index === 0}
            sizes={{ desktop: wide(index) ? "(width > 90rem) min(calc(58.75vw - 152px), 976px), min(43.375rem, 48.2vw)" : "(width >= 80rem) 25vw, 45vw", mobile: "100vw" }}
            className={cx("size-full object-cover", !tile.carat && "mix-blend-multiply")}
          />
          {tile.carat ? <ShownWith carat={tile.carat} /> : null}
          {tile.hint360 ? <Hint360 className="bottom-space-4" /> : null}
        </div>
      ))}
    </div>
  );
}

/**
 * Mobile gallery (Figma "PDP - Asset Tabs" 3587:125842): a full-width square that swipes between photos, with
 * the 64px thumbnail in the corner switching between the setting's own photos and the worn photos, as Product
 * Detail's thumbnail switches between the piece and its stone. The setting's photos carry Figma's 360 marker
 * (3587:125815), hidden while SHOW_360 is off; with it on, the dots of several photos sit above it. The worn photos
 * have no marker.
 */
function MobileGallery({ photos, name }: { photos: Tile[]; name: string }) {
  const [worn, setWorn] = useState(false);
  const [current, setCurrent] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const scrollerRef = useDragScroll(scroller);
  const shown = worn ? WORN.map((item, index) => ({ key: `worn-${index}`, ...item })) : photos;
  const goTo = (index: number) => {
    const node = scroller.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollTo({ left: index * node.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <div className={cx("relative aspect-square w-full overflow-hidden", TILE_BG)}>
      <div
        key={String(worn)}
        ref={scrollerRef}
        role="region"
        aria-label={`Photos of ${name}`}
        tabIndex={shown.length > 1 ? 0 : undefined}
        data-scroll-region
        onScroll={(event) => setCurrent(Math.round(event.currentTarget.scrollLeft / Math.max(1, event.currentTarget.clientWidth)))}
        className="relative flex size-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] focus-visible:-outline-offset-2 [&::-webkit-scrollbar]:hidden"
      >
        {shown.map((tile, index) => (
          <div key={tile.key} className="relative size-full shrink-0 snap-start">
            <Picture
              image={tile.carat ? tile.image : slotImage(tile.image, "gallery-m")}
              priority={index === 0 && !worn}
              sizes={{ desktop: "50vw", mobile: "100vw" }}
              className={cx("size-full object-cover", !tile.carat && "mix-blend-multiply")}
            />
            {tile.carat ? <ShownWith carat={tile.carat} /> : null}
          </div>
        ))}
      </div>
      {worn ? null : <Hint360 className="bottom-space-4" />}
      {shown.length > 1 ? (
        <div className={cx("pointer-events-none absolute inset-x-0 flex justify-center [&>*]:pointer-events-auto", worn ? "bottom-space-4" : DOTS_ABOVE_HINT)}>
          <PaginationDots count={shown.length} current={current} onSelect={goTo} label={`Photos of ${name}`} itemLabel={(index) => `Photo ${index + 1} of ${shown.length}`} overlay={worn} />
        </div>
      ) : null}
      <button
        type="button"
        aria-pressed={worn}
        aria-label={worn ? "Show the setting" : "Show the ring worn"}
        onClick={() => {
          setWorn((value) => !value);
          setCurrent(0);
        }}
        className="ui-transition absolute right-space-4 bottom-space-4 size-space-13 cursor-pointer overflow-hidden rounded-4 border border-black-alpha-10 bg-base-white hover:border-black-alpha-50"
      >
        <Picture image={{ ...(worn ? photos[0].image : WORN[0].image), alt: "" }} sizes={{ desktop: "64px", mobile: "64px" }} className={cx("size-full object-cover", worn && "mix-blend-multiply")} />
      </button>
    </div>
  );
}

/** The More / Less tile of Figma's "Setting Options" pickers. */
function MoreTile({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onClick}
      className="ui-transition flex h-space-15 cursor-pointer flex-col items-center justify-center gap-space-1 rounded-4 border border-black-alpha-20 bg-secondary-skin text-primary-leather hover:border-black-alpha-50"
    >
      <span className="flex size-space-8 items-center justify-center rounded-full bg-black-alpha-5">
        <Icon name={expanded ? "minus" : "plus"} size={16} />
      </span>
      <span className="type-ui-2xs-medium">{expanded ? pdp.labels.less : pdp.labels.more}</span>
    </button>
  );
}

/**
 * Desktop pickers, Figma "Setting Options - Stone" (3565:101516) and "Setting Options - Material" (3565:101545):
 * a label with the current value, then a 5-column grid of 80px tiles, 16px under the label. With more than five
 * options, four show with a More tile; More reveals the rest and becomes Less, in the fifth place as drawn.
 */
export function OptionGrid<T extends string>({
  label,
  valueLabel,
  options,
  value,
  onChange,
  columns = 5,
}: {
  label: string;
  valueLabel: string;
  options: Array<{ value: T; label: string; ariaLabel?: string; icon?: IconName; media?: React.ReactNode }>;
  value: T;
  onChange: (value: T) => void;
  /** 5 (Setting Options - Stone and Material), or 2 (the stone-first "Stone" picker's 249px tiles). */
  columns?: 2 | 5;
}) {
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const collapsible = options.length > 5;
  // Keep the chosen option in view when it sits behind More.
  const first = collapsible && !expanded ? options.slice(0, 4) : options;
  const shown = collapsible && !expanded && !first.some((option) => option.value === value) ? [...options.slice(0, 3), options.find((option) => option.value === value)!] : first;
  const tile = (option: (typeof options)[number]) => (
    <OptionTile
      key={option.value}
      type="radio"
      shape="fill"
      name={`${id}-option`}
      icon={option.icon}
      media={option.media}
      aria-label={option.ariaLabel}
      checked={value === option.value}
      onChange={() => onChange(option.value)}
    >
      {option.label}
    </OptionTile>
  );
  return (
    <div className="flex flex-col gap-space-4">
      <PickerLabel id={`${id}-label`} label={label} value={valueLabel} />
      <div className={cx("grid gap-space-2", columns === 2 ? "grid-cols-2" : "grid-cols-5")}>
        <div role="radiogroup" aria-labelledby={`${id}-label`} className="contents">
          {shown.slice(0, 4).map(tile)}
        </div>
        {collapsible ? <MoreTile expanded={expanded} onClick={() => setExpanded((open) => !open)} /> : null}
        {shown.length > 4 ? (
          <div role="group" aria-labelledby={`${id}-label`} className="contents">
            {shown.slice(4).map(tile)}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Mobile options (Figma 3587:125815): three tiles, METAL, STONE and STYLE, each showing the current choice.
 * Metal and Stone open a row of tiles to choose from, as Product Detail's mobile Metal tile does; Style is the
 * setting's own and only shows it.
 */
function MobileOptions({
  metals,
  metal,
  shape,
  style,
  onMetal,
  onShape,
  shapeLocked = false,
}: {
  metals: MetalId[];
  metal: MetalId;
  shape: StoneShape;
  style: string | null;
  onMetal: (metal: MetalId) => void;
  onShape: (shape: StoneShape) => void;
  /** Stone first: the shape is the chosen stone's, so the Stone tile only shows it, as Style does. */
  shapeLocked?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState<"metal" | "stone" | null>(null);
  const rowRef = useDragScroll<HTMLDivElement>();
  const back = useRef<HTMLButtonElement>(null);
  const openers = useRef<Record<string, HTMLButtonElement | null>>({});
  const last = useRef<"metal" | "stone" | null>(null);

  // Keep keyboard focus with the control the shopper used: Back after opening, the tile after closing.
  useEffect(() => {
    if (open) back.current?.focus();
    else if (last.current) openers.current[last.current]?.focus();
    last.current = open;
  }, [open]);

  const summary = (label: string, media: React.ReactNode, value: string, chevron: boolean) => (
    <>
      <span className="type-overline-xs-medium flex items-center justify-center gap-space-1">
        {label}
        {chevron ? <Icon name="chevron-right" size={12} /> : null}
      </span>
      <span className="flex h-space-15 w-full flex-col items-center justify-center gap-space-1 rounded-4 border border-black-alpha-20 bg-secondary-skin p-space-2">
        {media}
        <span className="type-ui-2xs-medium">{value}</span>
      </span>
    </>
  );

  if (open) {
    const isMetal = open === "metal";
    return (
      <div className="flex w-full flex-col gap-space-2 text-primary-leather">
        <div className="flex items-center gap-space-2">
          <button ref={back} type="button" aria-expanded onClick={() => setOpen(null)} className="inline-flex cursor-pointer items-center gap-space-1 rounded-4">
            <Icon name="chevron-left" size={16} />
            <span className="sr-only">{pdp.labels.back}: </span>
          </button>
          <PickerLabel id={`${id}-label`} label={isMetal ? pdp.labels.metal : pdp.labels.stone} value={isMetal ? metalById(metal).label : shapeLabel(shape)} />
        </div>
        <div ref={rowRef} role="radiogroup" aria-labelledby={`${id}-label`} className="relative -mx-(--grid-margin) flex gap-space-2 overflow-x-auto px-(--grid-margin) pb-space-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {isMetal
            ? metals.map((item) => (
                <OptionTile key={item} type="radio" name={`${id}-metal`} media={metalBadge(item)} aria-label={metalById(item).label} checked={metal === item} onChange={() => onMetal(item)}>
                  {metalById(item).shortLabel}
                </OptionTile>
              ))
            : SETTING_SHAPE_ORDER.map((item) => (
                <OptionTile key={item} type="radio" name={`${id}-shape`} icon={shapeIcon(item)} checked={shape === item} onChange={() => onShape(item)}>
                  {shapeLabel(item)}
                </OptionTile>
              ))}
        </div>
      </div>
    );
  }

  const tileClass = "flex min-w-0 flex-1 flex-col items-center gap-space-2 rounded-4 text-primary-leather";
  return (
    <div className="flex gap-space-2">
      {metals.length > 1 ? (
        <button
          ref={(node) => {
            openers.current.metal = node;
          }}
          type="button"
          aria-expanded={false}
          onClick={() => setOpen("metal")}
          className={cx(tileClass, "cursor-pointer")}
        >
          {summary(pdp.labels.metal, metalBadge(metal), metalById(metal).shortLabel, true)}
        </button>
      ) : (
        <div className={tileClass}>{summary(pdp.labels.metal, metalBadge(metal), metalById(metal).shortLabel, false)}</div>
      )}
      {shapeLocked ? (
        <div className={tileClass}>{summary(pdp.labels.stone, <Icon name={shapeIcon(shape)} size={32} />, shapeLabel(shape), false)}</div>
      ) : (
        <button
          ref={(node) => {
            openers.current.stone = node;
          }}
          type="button"
          aria-expanded={false}
          onClick={() => setOpen("stone")}
          className={cx(tileClass, "cursor-pointer")}
        >
          {summary(pdp.labels.stone, <Icon name={shapeIcon(shape)} size={32} />, shapeLabel(shape), true)}
        </button>
      )}
      {style ? <div className={tileClass}>{summary(builderContent.settings.style, <Icon name={styleIcon(style)} size={32} />, styleLabel(style), false)}</div> : null}
    </div>
  );
}

/** One card of "Perfectly Paired Wedding Bands": Figma's 220px Product Card (160px in the 1140 frame). */
function BandCard({ product }: { product: Product }) {
  const [variant, setVariant] = useState(product.variants[0]);
  const name = variantName(product, variant);
  return (
    <article className="relative flex flex-col text-center text-primary-leather">
      <div className={cx("relative aspect-square overflow-hidden rounded-4", TILE_BG)}>
        <Picture image={imagesFor(product, variant.metal)[0]} sizes={{ desktop: "(width > 90rem) min(calc(19.59vw - 61px), 315px), (width >= 90rem) 13.75rem, 15vw", mobile: "45vw" }} className="size-full object-cover mix-blend-multiply" />
      </div>
      <div className="flex flex-col gap-space-1 px-space-2 pt-space-3">
        {/* Desktop: heading-sm (22/26), as the setting page's and Step 3's frames draw the band's name (Task 30). */}
        <h3 className="type-heading-xs ui-desktop:type-heading-sm">
          <Link href={variantHref(product, variant)} className="rounded-4 after:absolute after:inset-0">
            {name}
          </Link>
        </h3>
        <p className="type-ui-xs-medium">{formatPrice(variant.price)}</p>
      </div>
      <MetalSwatches product={product} variant={variant} onChange={setVariant} className="relative mt-space-3 pb-space-3" />
    </article>
  );
}

/** "Perfectly Paired Wedding Bands" (Figma 3565:100694), under the desktop gallery: a row of three cards that pages sideways. */
/**
 * `lowerArrows`: the stone-first setting page's frame (5440:30785) draws the 32px arrows 53px below the photos' centre;
 * the other frames centre them on the photos (frames disagree, Open questions; Task 30, sf-settinginfo-1440-7).
 */
export function PairedBands({ bands, lowerArrows = false }: { bands: Product[]; lowerArrows?: boolean }) {
  const { ref, atStart, atEnd, scrollable } = useScrollProgress<HTMLUListElement>();
  const dragRef = useDragScroll(ref);
  const page = (direction: 1 | -1) => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollBy({ left: direction * node.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };
  const arrow = cx(
    lowerArrows ? "top-[calc((100cqw-2rem)/6+3.3125rem)]" : "top-[calc((100cqw-2rem)/6)]",
    "ui-transition absolute z-10 flex size-space-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-secondary-gold bg-secondary-skin text-primary-leather hover:border-primary-leather",
  );
  return (
    <section aria-labelledby="builder-paired" className="flex flex-col gap-space-6">
      <h2 id="builder-paired" className="type-heading-md text-center text-primary-leather">
        {text.paired}
      </h2>
      {/* A size container, so the arrows can centre on the square photos (a third of the row wide). */}
      <div className="@container relative">
        <ul ref={dragRef} tabIndex={0} data-scroll-region aria-label={text.paired} className="flex gap-space-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {bands.map((band) => (
            <li key={band.slug} className="w-[calc((100%-2rem)/3)] shrink-0">
              <BandCard product={band} />
            </li>
          ))}
        </ul>
        {scrollable && !atStart ? (
          <button type="button" aria-label="Previous bands" onClick={() => page(-1)} className={cx(arrow, "-left-3.5")}>
            <Icon name="chevron-left" size={20} />
          </button>
        ) : null}
        {scrollable && !atEnd ? (
          <button type="button" aria-label="Next bands" onClick={() => page(1)} className={cx(arrow, "-right-3.5")}>
            <Icon name="chevron-right" size={20} />
          </button>
        ) : null}
      </div>
    </section>
  );
}

const PROFILE = {
  low: { label: "Low", note: "Sits close to the finger" },
  medium: { label: "Medium", note: "Sits at a medium height above the band" },
  high: { label: "High", note: "Raises the center stone above the band" },
};

/**
 * Ring builder Step 1, the setting's page (Figma desktop Builder 1 - Setting Info 3565:100536 and its 1140px version
 * 4264:29414; mobile 3587:125815). Built from Product Detail's parts: the gallery, the option tiles, the icon row,
 * the Product Info Cards and the accordions. The chosen metal and centre stone shape live in the URL
 * (?metal=&shape=), and "Choose This Setting" carries them to Step 2.
 */
export function SettingDetail({ setting, bands, stones = [] }: { setting: RingSetting; bands: Product[]; stones?: StoneSummary[] }) {
  const { product } = setting;
  const [search, setQuery] = useQuery();
  const isClient = useIsClient();
  const router = useRouter();
  const ring = parseRing(new URLSearchParams(search));
  // Stone first (?first=stone&stone=; Builder Stone First - Setting Info 5440:30785, mobile 6683:68628) this page is
  // Step 2: the chosen stone fixes the shape (and, on desktop, the "Stone" picker shows its origin), there is no Meet
  // With Our Consultant, and Choose This Setting goes to Step 3. Without a valid stone it goes back to Step 1.
  const first = stoneFirst(ring);
  const chosen = first ? (stones.find((stone) => stone.handle === ring.stone) ?? null) : null;
  const variant = settingVariant(product, ring.metal);
  const shape: StoneShape = (chosen ? parseShape(chosen.shape) : null) ?? ring.shape ?? "round";
  const [creditOpen, setCreditOpen] = useState(false);
  const name = variantName(product, variant);
  const metals = [...new Set(product.variants.map((item) => item.metal))];
  const keep = chosen ? { stone: chosen.handle, first: "stone" as const } : {};
  const choose = (patch: { metal?: MetalId; shape?: StoneShape }) => setQuery(ringParams({ metal: patch.metal ?? variant.metal, shape: patch.shape ?? shape, start: ring.start, ...keep }));
  const [dollar, amount] = [formatPrice(variant.price).slice(0, 1), formatPrice(variant.price).slice(1)];
  const nextHref = chosen
    ? completeHref({ setting: setting.handle, metal: variant.metal, shape, stone: chosen.handle, first: "stone" })
    : stonesHref({ setting: setting.handle, metal: variant.metal, shape, start: ring.start });

  useEffect(() => {
    if (!isClient) return;
    const live = parseRing(liveQuery());
    if (stoneFirst(live) && !stones.some((stone) => stone.handle === live.stone)) redirectTo(router, stoneFirstStartHref(live));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, first, chosen]);

  const photos: Tile[] = imagesFor(product, variant.metal).map((image, index) => ({ key: `${variant.metal}-${index}`, image }));
  const tiles: Tile[] = [...photos.map((tile, index) => ({ ...tile, hint360: index === 0 })), ...WORN.map((item, index) => ({ key: `worn-${index}`, ...item }))];

  const quickCheckout = (
    // Drawn, but its flow belongs to part 2: shown as designed, not interactive (Held for review).
    // Figma: padding 20 on desktop; on mobile (3587:125815, 6683:68628) padding 16, a 20px chevron and the body in
    // body-xs (12/18), 108 tall (Task 30, sf-settinginfo-390-5).
    <div className="flex flex-col gap-space-4 rounded-4 border border-black-alpha-20 bg-secondary-skin p-[calc(var(--spacing-space-4)-1px)] text-primary-leather ui-desktop:p-[calc(var(--spacing-space-5)-1px)]">
      <div className="flex items-start gap-space-6">
        <p className="type-heading-sm flex flex-1 items-start gap-space-2">
          <Icon name="quick-checkout" size={24} className="shrink-0 text-primary-hazel" />
          {text.quickCheckout.title}
        </p>
        <Icon name="chevron-down" size={20} className="mt-0.5 ui-desktop:hidden" />
        <Icon name="chevron-down" size={24} className="hidden ui-desktop:block" />
      </div>
      <p className="type-body-xs-regular ui-desktop:type-body-sm-regular">{text.quickCheckout.body}</p>
    </div>
  );

  const consultant = (
    // Booking has nothing to connect to yet: shown as designed, not interactive (Held for review).
    <div className="flex flex-col overflow-hidden rounded-4 border border-black-alpha-20 bg-secondary-skin text-primary-leather">
      <div className="flex flex-col gap-space-4 p-[calc(var(--spacing-space-5)-1px)] ui-desktop:p-[calc(var(--spacing-space-6)-1px)]">
        <h2 className="type-heading-sm">{text.consultant.title}</h2>
        <p className="type-body-sm-regular">{text.consultant.body}</p>
      </div>
      <div className="type-overline-xs-medium flex items-center justify-between border-t border-black-alpha-10 bg-secondary-ivory px-space-5 py-[1.125rem] ui-desktop:px-space-6">
        <span className="flex items-center gap-space-4">
          <span className="flex items-center gap-space-1">
            <Icon name="phone" size={16} />
            {text.consultant.virtual}
          </span>
          <span className="flex items-center gap-space-1">
            <Icon name="account" size={16} />
            {text.consultant.inPerson}
          </span>
        </span>
        <span className="flex items-center gap-space-1">
          {text.consultant.bookNow}
          <Icon name="chevron-right" size={16} />
        </span>
      </div>
    </div>
  );

  const installments = (
    <p className="type-body-xs-regular flex flex-wrap items-center justify-center gap-x-space-2 text-center text-primary-leather">
      <span>
        {builderContent.installments} <span className="font-medium">{formatInstallment(variant.price)}</span>
      </span>
      <button type="button" onClick={() => setCreditOpen(true)} className="type-overline-xs-link ui-transition cursor-pointer rounded-4 ui-hover:text-black-alpha-60">
        {builderContent.learnMore}
        <span className="sr-only">: payment plans</span>
      </button>
    </p>
  );

  return (
    <div className="ui-desktop:site-container ui-desktop:grid ui-desktop:max-[79.9375rem]:grid-cols-[minmax(0,512fr)_minmax(0,460fr)] ui-desktop:max-[79.9375rem]:gap-space-10 min-[80rem]:grid-cols-[minmax(0,718fr)_minmax(0,506fr)] min-[80rem]:gap-space-6">
      <div className="hidden ui-desktop:block">
        {/* Figma's images frame pads its right side 24px at 1440 (the tile grid is 694 of the 718 column); the 1140 frame has none. */}
        <div className="sticky top-(--sticky-header-height) flex flex-col gap-space-11 py-space-15 min-[80rem]:pr-space-6">
          <DesktopGallery tiles={tiles} />
          {bands.length ? <PairedBands bands={bands} lowerArrows={first} /> : null}
        </div>
      </div>
      <div className="ui-desktop:hidden">
        <MobileGallery photos={photos} name={name} />
      </div>

      <div className="site-container flex flex-col gap-space-6 pt-space-5 pb-space-11 ui-desktop:gap-space-8 ui-desktop:px-0 ui-desktop:py-space-15">
        <div className="flex flex-col gap-space-4">
          <h1 className="type-heading-md text-primary-leather">{name}</h1>
          <p className="type-paragraph text-primary-leather">
            <span className="type-heading-caps-xs">{dollar}</span>
            <span className="type-heading-caps-sm">{amount}</span>
          </p>
        </div>

        <div className="hidden flex-col gap-space-8 ui-desktop:flex">
          <OptionGrid
            label={text.centerShape}
            valueLabel={shapeLabel(shape)}
            options={(chosen ? [shape] : settingShapes(setting)).map((item) => ({ value: item, label: shapeLabel(item), icon: shapeIcon(item) }))}
            value={shape}
            onChange={(next) => choose({ shape: next })}
          />
          <OptionGrid
            label={text.material}
            valueLabel={metalById(variant.metal).label}
            options={metals.map((item) => ({ value: item, label: metalById(item).shortLabel, ariaLabel: metalById(item).label, media: metalBadge(item) }))}
            value={variant.metal}
            onChange={(next) => choose({ metal: next })}
          />
          {chosen && chosen.kind === "diamond" ? (
            // Stone first, desktop only: the chosen diamond's origin. Figma draws both tiles; the stone fixes it, so only its own shows.
            <OptionGrid
              columns={2}
              label={text.stoneOrigin.label}
              valueLabel={chosen.origin === "natural" ? text.stoneOrigin.natural : text.stoneOrigin.labGrown}
              options={[
                chosen.origin === "natural"
                  ? { value: "natural", label: text.stoneOrigin.natural, icon: "natural-diamond" as const }
                  : { value: "lab-grown", label: text.stoneOrigin.labGrown, icon: "lab-diamond" as const },
              ]}
              value={chosen.origin}
              onChange={() => undefined}
            />
          ) : null}
        </div>
        <div className="ui-desktop:hidden">
          <MobileOptions
            metals={metals}
            metal={variant.metal}
            shape={shape}
            style={setting.style}
            onMetal={(metal) => choose({ metal })}
            onShape={(next) => choose({ shape: next })}
            shapeLocked={Boolean(chosen)}
          />
        </div>

        {quickCheckout}
        {/* Neither stone-first frame draws Meet With Our Consultant. */}
        {first ? null : consultant}

        <div className="flex flex-col gap-space-6 ui-desktop:gap-space-8">
          <div className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-space-3">
              <ButtonLink href={nextHref} className="w-full">
                {text.chooseThis}
              </ButtonLink>
              {/* Remove Setting is in the mobile frame only. */}
              <ButtonLink href={settingsHref(ring)} variant="secondary" className="w-full ui-desktop:hidden">
                {text.removeSetting}
              </ButtonLink>
            </div>
            {installments}
          </div>
          {product.shipsInDays ? (
            // The ships line is in the mobile frame only.
            <p className="type-ui-xs-regular flex items-center justify-center gap-space-2 text-primary-leather ui-desktop:hidden">
              <Icon name="truck" size={24} />
              {pdp.labels.shipsIn(product.shipsInDays)}
            </p>
          ) : null}
          <ul className="flex gap-space-2">
            {pdp.iconRow.map((item) => (
              <li key={item._key} className="flex flex-1">
                <IconBlock icon={item.icon} label={item.label} lines={item.lines} />
              </li>
            ))}
          </ul>
        </div>

        <SettingInfoSection setting={setting} metal={variant.metal} />

        <Accordion>
          <AccordionItem question="Shipping" icon="truck" headingLevel={2}>
            {pdp.shipping(product.shipsInDays ?? 3).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </AccordionItem>
          <AccordionItem question="Return Policy" icon="package" headingLevel={2}>
            {pdp.returns.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </AccordionItem>
        </Accordion>
      </div>

      <CreditModal open={creditOpen} onClose={() => setCreditOpen(false)} />
    </div>
  );
}

/** SAMPLE: the accent stones' average grades, Figma's example values, for every setting that has accents. */
export const ACCENT = { color: "D–F", clarity: "VVS" };

export const PROFILE_LABELS = PROFILE;

/**
 * "Your Setting Info" (Figma 3565:100650; mobile 3587:125891): the Metal card with its composition chart, then Width,
 * Approx. TCW, Accent Gems and Profile. Settings without accent stones leave out TCW and Accent Gems. Step 3 reuses it;
 * its mobile frame (6579:208256) draws Metal, Width and Approx. TCW only (mobileCards="three").
 */
export function SettingInfoSection({
  setting,
  metal,
  heading = text.info,
  headingId = "builder-setting-info",
  mobileCards = "all",
  className,
}: {
  setting: RingSetting;
  metal: MetalId;
  heading?: string;
  headingId?: string;
  mobileCards?: "all" | "three";
  className?: string;
}) {
  const { specs } = setting;
  const desktopOnly = mobileCards === "three" ? "hidden ui-desktop:flex" : undefined;
  // Width and Approx. TCW on mobile: 144 tall on the setting page (3587:125815, stone first 6683:68628), 120 on Step 3
  // (6579:208256). The frames disagree, so each page follows its own (Open questions; Task 30, sf-settinginfo-390-8).
  const sizeCard = cx("h-full ui-desktop:min-h-36", mobileCards === "three" ? "min-h-30" : "min-h-36");
  return (
    <section aria-labelledby={headingId} className={cx("flex flex-col gap-space-5 border-t border-secondary-gold ui-desktop:gap-space-8 ui-desktop:pt-space-8", className ?? "pt-space-6")}>
      <h2 id={headingId} className="type-heading-sm flex items-center gap-space-2 text-primary-leather ui-desktop:type-heading-md ui-desktop:gap-space-3">
        <Icon name="setting" size={24} className="ui-desktop:hidden" />
        <Icon name="setting" size={32} className="hidden ui-desktop:block" />
        {heading}
      </h2>
      <div className="grid grid-cols-2 items-start gap-space-2 ui-desktop:gap-space-4">
        <ProductInfoCard label={pdp.labels.metal} value={metalById(metal).label} note={pdp.metalNote} gap="md" className="col-span-2">
          <CompositionChart parts={metalComposition[metal]} />
        </ProductInfoCard>
        <ProductInfoCard label={text.cards.width.label} value={`${specs.width.toFixed(1)}mm`} note={text.cards.width.note} spread className={sizeCard} />
        {specs.tcw > 0 ? (
          <ProductInfoCard label={text.cards.tcw.label} value={`${specs.tcw.toFixed(2)} ct`} note={text.cards.tcw.note} spread className={sizeCard} />
        ) : null}
        {specs.tcw > 0 ? (
          <ProductInfoCard
            label={text.cards.accent.label}
            value={
              <span className="flex gap-space-3">
                <span className="flex flex-col">
                  {ACCENT.color}
                  <span className="type-ui-2xs-regular">{text.cards.accent.color}</span>
                </span>
                <span className="flex flex-col border-l border-black-alpha-20 pl-space-3">
                  {ACCENT.clarity}
                  <span className="type-ui-2xs-regular">{text.cards.accent.clarity}</span>
                </span>
              </span>
            }
            note={text.cards.accent.note}
            spread
            className={cx("h-full min-h-36 ui-desktop:min-h-[11.125rem]", desktopOnly)}
          />
        ) : null}
        <ProductInfoCard label={text.cards.profile.label} value={PROFILE[specs.profile].label} note={PROFILE[specs.profile].note} className={cx("h-full min-h-36", desktopOnly)}>
          <Icon name={setting.style ? styleIcon(setting.style) : "setting"} size={48} />
        </ProductInfoCard>
      </div>
    </section>
  );
}

