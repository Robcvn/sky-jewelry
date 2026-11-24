"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CreditModal } from "@/components/bag/BagModals";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Icon } from "@/components/ui/Icon";
import { IconBlock } from "@/components/ui/IconBlock";
import { IconLabelButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";
import { PaginationDots } from "@/components/ui/Pagination";
import { Picture, slotImage, type ImageRef } from "@/components/ui/Picture";
import { cx } from "@/components/ui/shared";
import { DOTS_ABOVE_HINT, Hint360 } from "@/components/ui/Viewer360";
import { useIsDesktop } from "@/components/ui/useIsDesktop";
import { builderContent, RING_SIZES, ringSizeLabel, shapeIcon, shapeLabel, styleLabel } from "@/content/builder";
import { metalById } from "@/content/metals";
import { productDetailContent } from "@/content/product-detail";
import { formatInstallment, formatPrice, imagesFor, type Product } from "@/content/products";
import { addRing } from "@/lib/bag";
import type { RingSetting, Stone } from "@/lib/builder";
import { useStoneAvailable } from "@/lib/stoneAvailability";
import { BuilderSteps } from "./BuilderSteps";
import { DropHintModal } from "./DropHintModal";
import {
  gemLabel,
  parseRing,
  ringName,
  ringParams,
  settingHref,
  settingShort,
  settingsHref,
  settingVariant,
  stoneCaratTitle,
  stoneColorLabel,
  stoneFirst,
  stoneFirstStartHref,
  stoneHref,
  stonesHref,
  stoneShortName,
  stoneSummary,
  type Ring,
} from "./ring";
import { RingConfigChoice } from "./RingConfigChoice";
import { RingSizeModal } from "./RingSizeModal";
import { ACCENT, PairedBands, PROFILE_LABELS, SettingInfoSection, ShownWith, WORN } from "./SettingDetail";
import { StoneInfoSection } from "./StoneDetail";
import { StoneCertificateTile, STONE_DRAWING_BG, STONE_TILE_BG } from "./StoneDetailGallery";
import { StoneDetailQualities } from "./StoneDetailQualities";
import { StonePicture } from "./StonePicture";
import { liveQuery, redirectTo, useIsClient, useQuery } from "./useQuery";
import { useDragScroll } from "@/components/ui/useDragScroll";

const text = builderContent.complete;
const pdp = productDetailContent;
const TILE_BG = "bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]";

type Tile = { key: string; image: ImageRef; carat?: string };

/** "$" in heading-caps-lg beside the amount in heading-caps-2xl, top-aligned (Figma "Total Price", 6579:194433). */
export function TotalPrice({ total, struck }: { total: number; struck: boolean }) {
  const formatted = formatPrice(total);
  return (
    <div data-total-price className="flex flex-col items-center text-primary-leather">
      <p className="type-ui-sm-medium">{text.totalPrice}</p>
      <p className={cx("flex items-start", struck && "opacity-50")}>
        <span aria-hidden="true" className="type-heading-caps-lg">
          {formatted.slice(0, 1)}
        </span>
        <span aria-hidden="true" className={cx("type-heading-caps-2xl", struck && "line-through decoration-1")}>
          {formatted.slice(1)}
        </span>
        <span className="sr-only">{struck ? `${formatted}, no longer available` : formatted}</span>
      </p>
    </div>
  );
}

/**
 * Desktop gallery (Figma 6579:194556): a 2 x 2 grid of 341px tiles. The setting's photo, the stone, the stone's
 * certificate, and a second ring photo: the setting's own when it has one, otherwise the setting page's photo of a
 * ring worn (with its "Shown with" badge). Figma's 360° marker is placed on the setting's photo (6579:194559),
 * hidden while SHOW_360 is off (no 360° sequences; Deviations), as on the setting and stone pages. The stone tile's pagination dots
 * are left out (one stone photo).
 */
function DesktopGallery({ ring, stone }: { ring: Tile[]; stone: Stone }) {
  const second = ring[1] ?? { key: "worn", ...WORN[0] };
  const photo = (tile: Tile, priority: boolean, hint360 = false) => (
    <div className={cx("relative aspect-square overflow-hidden rounded-4", TILE_BG)}>
      <Picture image={tile.image} priority={priority} sizes={{ desktop: "(width >= 90rem) 21.3rem, 24vw", mobile: "100vw" }} className={cx("size-full object-cover", !tile.carat && "mix-blend-multiply")} />
      {tile.carat ? <ShownWith carat={tile.carat} /> : null}
      {hint360 ? <Hint360 className="bottom-space-4" /> : null}
    </div>
  );
  return (
    <div data-complete-gallery className="grid grid-cols-2 gap-space-3">
      {photo(ring[0], true, true)}
      <div data-stone-photo className={cx("relative aspect-square overflow-hidden rounded-4", stone.image ? STONE_TILE_BG : STONE_DRAWING_BG)}>
        <StonePicture stone={stone} sizes={{ desktop: "(width >= 90rem) 21.3rem, 24vw", mobile: "100vw" }} />
      </div>
      <StoneCertificateTile stone={stone} />
      {photo(second, false)}
    </div>
  );
}

/**
 * Mobile gallery (Figma "PDP - Asset Tabs" 6579:208207): the ring photo, full width, with a 64px thumbnail of the
 * stone that switches the view to the stone and back, as the setting page's thumbnail switches to the worn photos.
 * Figma's 360° marker (6579:208180) is placed on the ring and on the stone, hidden while SHOW_360 is off (with it on,
 * the dots of several ring photos sit above it). The "360° View / Images" tabs are not built.
 */
function MobileGallery({ ring, stone, name }: { ring: Tile[]; stone: Stone; name: string }) {
  const [showStone, setShowStone] = useState(false);
  const [current, setCurrent] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const scrollerRef = useDragScroll(scroller);
  const goTo = (index: number) => {
    const node = scroller.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollTo({ left: index * node.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <div className={cx("relative aspect-square w-full overflow-hidden", showStone && !stone.image ? STONE_DRAWING_BG : TILE_BG)}>
      {showStone ? (
        <StonePicture stone={stone} sizes={{ desktop: "50vw", mobile: "100vw" }} />
      ) : (
        <div
          ref={scrollerRef}
          role="region"
          aria-label={`Photos of ${name}`}
          tabIndex={ring.length > 1 ? 0 : undefined}
          data-scroll-region
          onScroll={(event) => setCurrent(Math.round(event.currentTarget.scrollLeft / Math.max(1, event.currentTarget.clientWidth)))}
          className="relative flex size-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] focus-visible:-outline-offset-2 [&::-webkit-scrollbar]:hidden"
        >
          {ring.map((tile, index) => (
            <div key={tile.key} className="relative size-full shrink-0 snap-start">
              <Picture image={slotImage(tile.image, "gallery-m")} priority={index === 0} sizes={{ desktop: "50vw", mobile: "100vw" }} className="size-full object-cover mix-blend-multiply" />
            </div>
          ))}
        </div>
      )}
      <Hint360 className="bottom-space-4" />
      {!showStone && ring.length > 1 ? (
        <div className={cx("pointer-events-none absolute inset-x-0 flex justify-center [&>*]:pointer-events-auto", DOTS_ABOVE_HINT)}>
          <PaginationDots count={ring.length} current={current} onSelect={goTo} label={`Photos of ${name}`} itemLabel={(index) => `Photo ${index + 1} of ${ring.length}`} />
        </div>
      ) : null}
      <button
        type="button"
        aria-pressed={showStone}
        aria-label={showStone ? "Show the ring" : "Show the stone"}
        onClick={() => {
          setShowStone((value) => !value);
          setCurrent(0);
        }}
        className={cx(
          "ui-transition absolute right-space-4 bottom-space-4 size-space-13 cursor-pointer overflow-hidden rounded-4 border border-black-alpha-10 hover:border-black-alpha-50",
          showStone ? "bg-base-white" : stone.image ? "bg-base-white" : STONE_DRAWING_BG,
        )}
      >
        {showStone ? (
          <Picture image={{ ...ring[0].image, alt: "" }} sizes={{ desktop: "64px", mobile: "64px" }} className="size-full object-cover mix-blend-multiply" />
        ) : (
          <span aria-hidden="true" className="block size-full">
            <StonePicture stone={{ ...stone, title: "" }} sizes={{ desktop: "64px", mobile: "64px" }} />
          </span>
        )}
      </button>
    </div>
  );
}

/** One table of the Ring Details accordion (desktop 6579:194487; mobile 6579:208268). */
function DetailsTable({ title, rows, variant }: { title: string; rows: Array<[string, string]>; variant: "desktop" | "mobile" }) {
  return (
    <div className={cx("flex flex-col gap-space-4", variant === "desktop" ? "px-space-2" : "px-1")}>
      <h3 className="type-ui-sm-medium">{title}</h3>
      <dl className="flex flex-col gap-space-2">
        {rows.map(([label, value]) => (
          <div key={label} className="type-ui-xs-regular flex gap-space-2">
            <dt className={cx("shrink-0", variant === "desktop" ? "w-24" : "w-30")}>{label}</dt>
            <dd className={cx("min-w-0", variant === "mobile" && "font-medium")}>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

type CompleteRingProps = {
  settings: RingSetting[];
  stones: Stone[];
  bands: Product[];
  /** The page's closing sections (What's in the Box, reviews, button cards), rendered once the ring is shown. */
  children?: ReactNode;
};

/**
 * Ring builder Step 3, "Complete" (Figma desktop "Add Care Plan - Select Ring Size" 6579:194412, "Ring Size Selected"
 * 6579:194864, "Complete" 6579:195316, "None Available" 6579:195764; mobile 6579:208180 and its three sisters).
 * One static page: the ring (?setting=&metal=&shape=&stone=&size=) is read from the URL in the browser.
 * - No valid setting: back to Step 1. A setting but no valid stone: Step 2, keeping the ring. Stone first
 *   (?first=stone): no valid stone goes back to Step 1, a stone without a valid setting to Step 2, keeping the stone.
 * - Stone first (Builder Stone First - Complete 5440:30339, mobile 6683:68224): the step bar starts with the stone,
 *   and on desktop the stone's row comes before the setting's (mobile keeps the setting first, as its frame does).
 *   Edit, View and Remove lead to that flow's steps; the bag remembers the flow (see addRing).
 * - Choosing a ring size writes size= to the URL, so a link resumes the whole ring. Secure Checkout and Add to Bag
 *   are disabled until a size is chosen, as Figma's Select Ring Size frame draws them.
 * - The stone's availability is read from the Storefront API; when it is gone, the page takes Figma's "Builder -
 *   Stone Unavailable" state (7412:100078) and shows its modal once (7412:101478).
 */
export function CompleteRing({ settings, stones, bands, children }: CompleteRingProps) {
  const [search, setQuery] = useQuery();
  const isClient = useIsClient();
  const isDesktop = useIsDesktop();
  const router = useRouter();
  const ring = parseRing(new URLSearchParams(search));
  const first = stoneFirst(ring);
  const foundSetting = settings.find((item) => item.handle === ring.setting) ?? null;
  const foundStone = stones.find((item) => item.handle === ring.stone) ?? null;
  // Each flow needs its first piece before the second counts.
  const setting = first ? (foundStone ? foundSetting : null) : foundSetting;
  const stone = first ? foundStone : setting ? foundStone : null;
  const available = useStoneAvailable(stone);
  const unavailable = Boolean(stone) && !available;
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState<"credit" | "size" | "hint" | "unavailable" | null>(null);
  const [hintKey, setHintKey] = useState(0);
  const unavailableShown = useRef(false);
  const describedBy = useId();

  // Missing pieces: no valid setting goes to Step 1; a setting without a valid stone goes to Step 2 with the ring kept
  // (stone first: no valid stone goes to Step 1, a stone without a setting to Step 2). The URL is read as the effect
  // runs: right after a link to this page, the first render can still see the previous page's query.
  useEffect(() => {
    if (!isClient) return;
    const live = parseRing(liveQuery());
    const liveSetting = settings.find((item) => item.handle === live.setting) ?? null;
    const liveStone = stones.find((item) => item.handle === live.stone) ?? null;
    if (stoneFirst(live)) {
      if (!liveStone) redirectTo(router, stoneFirstStartHref(live));
      else if (!liveSetting) redirectTo(router, settingsHref({ ...live, stone: liveStone.handle, shape: liveStone.shape as Ring["shape"] }));
    } else if (!liveSetting) redirectTo(router, settingsHref(live));
    else if (!liveStone) redirectTo(router, stonesHref({ ...live, setting: liveSetting.handle }));
    // The ring is read from the URL; re-run when it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, search, setting, stone]);

  // Figma's modal for a stone that is no longer available, once per page view.
  useEffect(() => {
    if (!unavailable || unavailableShown.current) return;
    unavailableShown.current = true;
    const frame = requestAnimationFrame(() => setDialog("unavailable"));
    return () => cancelAnimationFrame(frame);
  }, [unavailable]);

  const products = settings.map((item) => item.product);
  if (!isClient || !setting || !stone) {
    return (
      <>
        <BuilderSteps current={3} settings={products} />
        {/* Until the URL is read (or while leaving for Step 1 or 2), the page keeps its height so the footer doesn't jump. */}
        <div className="min-h-dvh" />
      </>
    );
  }

  const { product } = setting;
  const variant = settingVariant(product, ring.metal);
  const short = settingShort(product);
  const linkRing: Partial<Ring> = { setting: setting.handle, metal: variant.metal, shape: stone.shape as Ring["shape"], start: ring.start, first: ring.first, stone: first ? stone.handle : null };
  const total = variant.price + stone.price;
  const ringPhotos: Tile[] = imagesFor(product, variant.metal).map((image, index) => ({ key: `${variant.metal}-${index}`, image }));
  const shipsInDays = Math.max(product.shipsInDays ?? 0, stone.shipsInDays);
  const diamond = stone.kind === "diamond";
  const close = () => setDialog(null);
  // Select New Stone: setting first, the stone list keeping the setting; stone first, Step 1 keeping the setting (for
  // the "with setting" prices). Remove on the stone: setting first, the same; stone first, Step 1 with nothing chosen.
  const newStoneHref = first ? stonesHref({ setting: setting.handle, metal: variant.metal, start: ring.start, first: "stone" }) : stonesHref({ ...linkRing, stone: null });
  const removeStoneHref = first ? stoneFirstStartHref(ring) : newStoneHref;

  const addArgs = { setting: product, settingVariant: variant, stone, size: ring.size ?? "", name: ringName(short, stone, "panel"), first: ring.first };
  // Add to Bag opens the bag panel (the header draws it), which also shows a failure.
  const add = async () => {
    setBusy(true);
    await addRing(addArgs);
    setBusy(false);
  };
  // Secure Checkout adds the ring and goes to the bag page, as on the product page (Figma draws no step between).
  const checkout = async () => {
    setBusy(true);
    const result = await addRing(addArgs, { openPanel: false });
    setBusy(false);
    if (result.ok) router.push("/bag/");
  };

  const stoneType = diamond ? "Diamond" : gemLabel(stone);
  const t = text.tables;
  const centerStoneRows: Array<[string, string]> = [
    [t.size, `${stone.carat.toFixed(2)}ct`],
    [t.type, stoneType],
    [t.color, stoneColorLabel(stone)],
    [t.clarity, stone.clarity],
    [t.shape, shapeLabel(stone.shape)],
    [t.lw, `${stone.length.toFixed(2)}/${stone.width.toFixed(2)}`],
    [t.ratio, stone.ratio.toFixed(2)],
  ];
  const sku = variant.sku ? [[t.sku, variant.sku] as [string, string]] : [];
  const settingRows = (shapeLabelText: string): Array<[string, string]> => [
    ...sku,
    [t.width, `${setting.specs.width.toFixed(1)}mm`],
    [shapeLabelText, shapeLabel(stone.shape)],
    [t.material, metalById(variant.metal).label],
    ...(setting.style ? [[t.style, styleLabel(setting.style)] as [string, string]] : []),
    [t.profile, PROFILE_LABELS[setting.specs.profile].label],
  ];
  const sideStoneRows: Array<[string, string]> = [
    [t.averageColor, ACCENT.color],
    [t.averageClarity, ACCENT.clarity],
    [t.approxTotalCarat, `${setting.specs.tcw.toFixed(2)}ct`],
  ];

  const settingRow = (
    <RingConfigChoice
      key="setting"
      icon="setting"
      name={short}
      summary={metalById(variant.metal).label}
      price={formatPrice(variant.price)}
      actions={[
        { label: text.edit, href: settingHref(setting.handle, linkRing), context: `: ${short} setting` },
        { label: text.remove, href: settingsHref(linkRing), context: `: ${short} setting` },
      ]}
    />
  );
  const stoneRow = (
    <RingConfigChoice
      key="stone"
      icon={shapeIcon(stone.shape)}
      name={
        <>
          <span className="hidden ui-desktop:inline">{stoneCaratTitle(stone.title)}</span>
          <span className="ui-desktop:hidden">{stoneShortName(stone, "complete")}</span>
        </>
      }
      summary={
        <>
          <span className="hidden ui-desktop:inline">{stoneSummary(stone, " • ")}</span>
          <span className="ui-desktop:hidden">{stoneSummary(stone, " ")}</span>
        </>
      }
      price={formatPrice(stone.price)}
      actions={[
        { label: text.view, href: stoneHref(stone.handle, { ...linkRing, stone: null }), context: `: ${stoneCaratTitle(stone.title)}` },
        { label: text.remove, href: removeStoneHref, context: `: ${stoneCaratTitle(stone.title)}` },
      ]}
      unavailable={unavailable ? { message: text.unavailable.row, action: { label: text.unavailable.selectNewStone, href: newStoneHref } } : null}
    />
  );

  return (
    <>
      <BuilderSteps current={3} settings={products} stone={stone} stoneUnavailable={unavailable} />

      <div className="ui-desktop:site-container ui-desktop:grid ui-desktop:grid-cols-[minmax(0,718fr)_minmax(0,506fr)] ui-desktop:gap-space-6">
        <div className="hidden ui-desktop:block">
          {/* Figma's images column pads its right side 24px (the tile grid is 694 of the 718 column). */}
          <div className="sticky top-(--sticky-header-height) flex flex-col gap-space-11 py-space-15 pr-space-6">
            <DesktopGallery ring={ringPhotos} stone={stone} />
            {bands.length ? <PairedBands bands={bands} /> : null}
          </div>
        </div>
        <div className="ui-desktop:hidden">
          <MobileGallery ring={ringPhotos} stone={stone} name={ringName(short, stone, "mobile")} />
        </div>

        <div className="site-container flex flex-col gap-space-6 pt-space-5 pb-space-11 ui-desktop:gap-space-8 ui-desktop:px-0 ui-desktop:py-space-15">
          {/* Title and Drop a Hint: side by side on desktop (the button's icon above its label), stacked on mobile. */}
          <div className="flex flex-col items-start gap-space-4 ui-desktop:flex-row ui-desktop:justify-between">
            <h1 className="type-heading-md text-primary-leather ui-desktop:max-w-[25.9375rem]">
              <span className="hidden ui-desktop:inline">{ringName(short, stone, "desktop")}</span>
              <span className="ui-desktop:hidden">{ringName(short, stone, "mobile")}</span>
            </h1>
            <IconLabelButton
              icon="mail"
              layout={isDesktop ? "stack" : "row"}
              onClick={() => {
                setHintKey((key) => key + 1);
                setDialog("hint");
              }}
              className="shrink-0"
            >
              {text.dropHint}
            </IconLabelButton>
          </div>

          <div className="flex flex-col gap-space-4">
            {first && isDesktop ? [stoneRow, settingRow] : [settingRow, stoneRow]}
          </div>

          <div className="flex flex-col gap-space-4">
            <Dropdown
              label={text.ringSize}
              placeholder={text.selectRingSize}
              size={isDesktop ? "md" : "sm"}
              options={RING_SIZES.map((size) => ({ value: size, label: ringSizeLabel(size) }))}
              value={ring.size ?? undefined}
              onChange={(size) => setQuery(ringParams({ ...ring, size: size as Ring["size"] }))}
            />
            <div className="flex flex-col items-center gap-space-3 text-center">
              <button type="button" onClick={() => setDialog("size")} className="type-overline-xs-link ui-transition cursor-pointer rounded-4 text-primary-leather ui-hover:text-black-alpha-60">
                {text.findRingSize}
              </button>
              <p className="type-body-xs-regular text-black-alpha-60">{text.sizeHelp}</p>
            </div>
          </div>

          <TotalPrice total={total} struck={unavailable} />

          <div className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-space-3 ui-desktop:gap-space-4">
              {unavailable ? (
                <ButtonLink href={newStoneHref} className="w-full">
                  {text.unavailable.button}
                </ButtonLink>
              ) : (
                <Button leftIcon="security-card" className="w-full" disabled={busy || !ring.size} aria-describedby={ring.size ? undefined : describedBy} onClick={checkout}>
                  {text.secureCheckout}
                </Button>
              )}
              <Button variant="secondary" leftIcon="bag" className="w-full" disabled={busy || !ring.size || unavailable} aria-describedby={ring.size || unavailable ? undefined : describedBy} onClick={add}>
                {text.addToBag}
              </Button>
              {!ring.size && !unavailable ? (
                <p id={describedBy} className="sr-only">
                  {text.sizeFirst}
                </p>
              ) : null}
            </div>
            <p className="type-body-xs-regular flex flex-wrap items-center justify-center gap-x-space-2 text-center text-primary-leather">
              <span>
                {builderContent.installments} <span className="font-medium">{formatInstallment(total)}</span>
              </span>
              <button type="button" onClick={() => setDialog("credit")} className="type-overline-xs-link ui-transition cursor-pointer rounded-4 ui-hover:text-black-alpha-60">
                {builderContent.learnMore}
                <span className="sr-only">: payment plans</span>
              </button>
            </p>
          </div>

          <p className="type-ui-xs-regular flex items-center justify-center gap-space-2 text-primary-leather ui-desktop:type-body-sm-regular">
            <Icon name="truck" size={24} />
            {pdp.labels.shipsIn(shipsInDays)}
          </p>

          <ul className="flex gap-space-2">
            {pdp.iconRow.map((item) => (
              <li key={item._key} className="flex flex-1">
                <IconBlock icon={item.icon} label={item.label} lines={item.lines} />
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-space-5 ui-desktop:gap-space-8">
            <StoneInfoSection stone={stone} heading={diamond ? text.diamondInfo : text.stoneInfo} headingId="complete-stone-info" />
            <SettingInfoSection
              setting={setting}
              metal={variant.metal}
              heading={text.settingInfo}
              headingId="complete-setting-info"
              mobileCards="three"
              className="pt-[calc(var(--spacing-space-5)-1px)] ui-desktop:pt-[calc(var(--spacing-space-8)-1px)]"
            />

            <Accordion>
              <AccordionItem question={text.ringDetails} icon={shapeIcon(stone.shape)} headingLevel={2} defaultOpen>
                {text.ringDetailsBody(stoneCaratTitle(stone.title), short, metalById(variant.metal).label).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {/* Each breakpoint's frame draws its own tables. */}
                <div data-ring-details="desktop" className="hidden grid-cols-2 items-start gap-space-4 pt-space-2 ui-desktop:grid">
                  <DetailsTable title={t.centerStone} rows={centerStoneRows} variant="desktop" />
                  <DetailsTable title={t.setting} rows={settingRows(t.shape)} variant="desktop" />
                </div>
                <div data-ring-details="mobile" className="flex flex-col gap-space-8 pb-space-3 ui-desktop:hidden">
                  <DetailsTable title={t.details} rows={settingRows(t.stoneShape)} variant="mobile" />
                  {setting.specs.tcw > 0 ? <DetailsTable title={t.sideStones} rows={sideStoneRows} variant="mobile" /> : null}
                </div>
              </AccordionItem>
              <AccordionItem question="Shipping" icon="truck" headingLevel={2}>
                {pdp.shipping(shipsInDays).map((paragraph) => (
                  <p key={paragraph}>{paragraph.replace("This piece", "Your ring")}</p>
                ))}
              </AccordionItem>
              <AccordionItem question="Return Policy" icon="package" headingLevel={2}>
                {pdp.returns.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Figma draws "Your Diamond's Qualities" for a diamond; gemstones are graded on other scales, as on the stone page. */}
      {diamond ? <StoneDetailQualities stone={stone} /> : null}
      {children}

      <CreditModal open={dialog === "credit"} onClose={close} />
      <RingSizeModal open={dialog === "size"} onClose={close} />
      <DropHintModal
        key={hintKey}
        open={dialog === "hint"}
        onClose={close}
        name={ringName(short, stone, "mobile")}
        image={ringPhotos[0].image}
      />
      <Modal
        open={dialog === "unavailable"}
        onClose={close}
        align="center"
        icon={<Icon name="stone-unavailable" size={64} className="text-state-error" />}
        heading={text.unavailable.modal.heading}
        body={text.unavailable.modal.body}
        actionsLayout="stack"
        primaryAction={{ label: text.unavailable.modal.primary, onClick: () => router.push(newStoneHref) }}
        secondaryAction={{ label: text.unavailable.modal.secondary, onClick: close }}
      />
    </>
  );
}
