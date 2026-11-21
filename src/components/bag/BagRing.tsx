"use client";

import Link from "next/link";
import { ringName, settingShortFromTitle, stonesHref, stoneShortName, type Ring } from "@/components/builder/ring";
import { pairsHref } from "@/components/earrings/routes";
import { earringsContent } from "@/content/earrings";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Picture } from "@/components/ui/Picture";
import { cx } from "@/components/ui/shared";
import { bagContent, bagFeatures } from "@/content/bag";
import { DIAMOND_SCALES, GEM_COLORS, gradeLabel, shapeIcon, shapeLabel } from "@/content/builder";
import { metalById } from "@/content/metals";
import { formatPrice } from "@/content/products";
import { ringHref, type BagLine, type BagRingItem, type BagStone } from "@/lib/bag";
import type { CarePlanState } from "@/lib/carePlans";
import { formatMoney, PillButton, QuantitySelect } from "./BagParts";
import { TILE_BG } from "./BagPanel";

const ringCopy = bagContent.ring;

/**
 * The ring's names, from its cart lines: the setting's title and the stone's. Built earrings: the bag page's heading
 * is Step 3's name ("Four Prong Custom Diamond Stud Earrings with IGI 1.28 Total Carat Round Diamonds"), the panel's
 * and the setting row's the setting's name.
 */
export function bagRingNames(ring: BagRingItem) {
  const setting = ring.setting ? settingShortFromTitle(ring.setting.title) : "";
  const stoneTitle = ring.stone?.title ?? "";
  if (ring.build === "earrings") return { setting, bag: stoneTitle ? earringsContent.complete.name(setting, stoneTitle) : setting, panel: setting };
  return {
    setting,
    bag: ring.stone ? ringName(setting, { title: stoneTitle }, "bag") : setting,
    panel: ringName(setting, { title: stoneTitle }, "panel"),
  };
}

/** Step 2 with the ring's setting kept: where Select New Stone leads. */
export function newStoneHref(ring: BagRingItem) {
  if (ring.build === "earrings") return pairsHref({ setting: ring.setting?.handle ?? null, metal: ring.setting?.metal ?? null, shape: (ring.stone?.stone?.shape as Ring["shape"]) ?? null });
  // Stone first, a new stone is chosen on Step 1 (keeping the setting for the "with setting" prices).
  if (ring.first === "stone") return stonesHref({ setting: ring.setting?.handle ?? null, metal: ring.setting?.metal ?? null, first: "stone" });
  return stonesHref({ setting: ring.setting?.handle ?? null, metal: ring.setting?.metal ?? null, shape: (ring.stone?.stone?.shape as Ring["shape"]) ?? null });
}

const stoneAttributes = (stone: BagStone) => [
  // A matched pair: both weights.
  { label: ringCopy.carat, value: stone.pair ? stone.pair.map((carat) => `${carat.toFixed(2)}ct`).join(", ") : `${stone.carat.toFixed(2)}ct` },
  { label: ringCopy.color, value: stone.kind === "diamond" ? stone.color : (GEM_COLORS.find((item) => item.value === stone.color)?.label ?? stone.color) },
  { label: ringCopy.cut, value: stone.kind === "diamond" ? gradeLabel(DIAMOND_SCALES.cut, stone.cut) : stone.cut },
  { label: ringCopy.clarity, value: stone.clarity },
];

/** A part's price in whole dollars, as Figma's rows write it ("$3,750"); struck through first when the cart discounts it ("$4,250 $3,750"). */
function PartPrice({ line, struck }: { line: BagLine; struck: boolean }) {
  if (struck)
    return (
      <p className="type-ui-xs-regular text-black-alpha-50 line-through ui-desktop:type-ui-sm-regular">
        {formatPrice(line.subtotal)}
      </p>
    );
  return (
    <p className="type-ui-xs-regular flex gap-space-2 ui-desktop:type-ui-sm-regular">
      {line.subtotal > line.total ? <span className="text-black-alpha-50 line-through">{formatPrice(line.subtotal)}</span> : null}
      <span>{formatPrice(line.total)}</span>
    </p>
  );
}

type PartRowProps = {
  icon: "setting-empty" | ReturnType<typeof shapeIcon> | "stone-unavailable";
  name: string;
  attributes: Array<{ label: string; value: string }>;
  line: BagLine;
  /** Edit (behind bagFeatures.editLinks, the newer bag design's flag), or Select New Stone. */
  link: { label: string; href: string; context: string } | null;
  unavailable?: boolean;
  /** Built earrings word the unavailable line for a pair. */
  unavailableText?: string;
};

/**
 * One part of a ring in the bag (Figma 6579:196271 setting row, 6579:196298 stone row; mobile 6579:210090): its
 * icon, name, attributes, price and Edit. The unavailable stone row (7414:137203) is in the error colour with its
 * attributes struck through at 50%, "This stone is no longer available." and Select New Stone in place of Edit.
 */
function PartRow({ icon, name, attributes, line, link, unavailable = false, unavailableText }: PartRowProps) {
  return (
    <div data-ring-part={line.ring?.role} className="flex justify-between gap-space-4 border-b border-black-alpha-20 py-space-3 ui-desktop:py-space-4">
      <div className="flex min-w-0 flex-1 gap-space-2">
        <Icon name={unavailable ? "stone-unavailable" : icon} size={24} className={cx("shrink-0", unavailable && "text-state-error")} />
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className={cx("type-heading-xs ui-desktop:type-heading-sm", unavailable && "text-state-error")}>{name}</h3>
          <dl className={cx("flex flex-col", unavailable && "opacity-50")}>
            {attributes.map((attribute) => (
              <div key={attribute.label} className="type-ui-xs-regular flex gap-space-2">
                <dt className="w-16 shrink-0 text-black-alpha-70">{attribute.label}</dt>
                <dd className={cx(unavailable && "line-through")}>{attribute.value}</dd>
              </div>
            ))}
          </dl>
          {unavailable ? <p className="type-ui-xs-medium pt-space-2 text-state-error">{unavailableText ?? ringCopy.stoneUnavailable}</p> : null}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-space-2 py-1 ui-desktop:gap-2.5 ui-desktop:py-0">
        <PartPrice line={line} struck={unavailable} />
        {link ? (
          <Link href={link.href} className="type-overline-xs-link ui-transition rounded-4 text-primary-leather ui-hover:text-black-alpha-60">
            {link.label}
            <span className="sr-only">{link.context}</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

type BagRingRowProps = {
  ring: BagRingItem;
  busy?: boolean;
  /** The care plan row, drawn once per ring (null when care plans are off). */
  carePlan?: React.ReactNode;
  plan?: CarePlanState | null;
  onRemove?: () => void;
};

/**
 * A built ring on the bag page (Figma "Bag / Cart" 6579:196262, mobile "Bag Checkout" 6579:210090): the ring's photo
 * and name, its setting row and stone row, the care plan row, then the ring's total and Remove. No quantity: each
 * stone is one of a kind. Edit and the name lead back to Step 3 with the whole ring in the URL.
 */
export function BagRingRow({ ring, busy = false, carePlan, onRemove }: BagRingRowProps) {
  const names = bagRingNames(ring);
  const earrings = ring.build === "earrings";
  const href = ringHref(ring);
  const stoneUnavailable = Boolean(ring.stone && !ring.stone.available);
  const settingUnavailable = Boolean(ring.setting && !ring.setting.available);
  const image = ring.setting?.image ?? ring.stone?.image ?? null;
  return (
    <article data-bag-ring className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-space-4 gap-y-space-3 ui-desktop:grid-cols-[11.75rem_minmax(0,1fr)] ui-desktop:gap-x-space-6 ui-desktop:gap-y-0">
      <Link href={href} tabIndex={-1} aria-hidden="true" className={cx("relative col-start-1 row-start-1 block aspect-square overflow-hidden rounded-4 ui-desktop:row-span-2", TILE_BG)}>
        {image ? <Picture image={{ ...image, alt: "" }} sizes={{ desktop: "188px", mobile: "72px" }} className="size-full object-cover mix-blend-multiply" /> : null}
      </Link>
      <h2 className="type-heading-sm col-start-2 row-start-1 self-start ui-desktop:type-heading-md">
        <Link href={href} className="ui-transition rounded-4 ui-hover:text-black-alpha-60">
          {names.bag}
        </Link>
      </h2>
      <div className="col-span-2 flex flex-col ui-desktop:col-span-1 ui-desktop:col-start-2 ui-desktop:row-start-2">
        {ring.setting ? (
          <PartRow
            icon="setting-empty"
            name={names.setting}
            line={ring.setting}
            attributes={[
              { label: ringCopy.metal, value: metalById(ring.setting.metal).label },
              ...(ring.size ? [{ label: ringCopy.ringSize, value: ring.size }] : []),
            ]}
            link={bagFeatures.editLinks ? { label: bagContent.edit, href, context: `: ${names.setting} setting` } : null}
            unavailable={settingUnavailable}
          />
        ) : null}
        {ring.stone?.stone ? (
          <PartRow
            icon={shapeIcon(ring.stone.stone.shape)}
            name={earrings ? earringsContent.pairRowName(ring.stone.stone.origin, shapeLabel(ring.stone.stone.shape)) : stoneShortName({ ...ring.stone.stone, title: ring.stone.title }, "bag")}
            line={ring.stone}
            attributes={stoneAttributes(ring.stone.stone)}
            link={
              stoneUnavailable
                ? {
                    label: earrings ? earringsContent.unavailable.selectNew : ringCopy.selectNewStone,
                    href: newStoneHref(ring),
                    context: earrings ? ": replaces the diamonds" : `: replaces the ${shapeLabel(ring.stone.stone.shape).toLowerCase()} stone`,
                  }
                : bagFeatures.editLinks
                  ? { label: bagContent.edit, href, context: `: ${ring.stone.title}` }
                  : null
            }
            unavailable={stoneUnavailable}
            unavailableText={earrings ? earringsContent.unavailable.row : undefined}
          />
        ) : null}
        {carePlan}
        <div className="flex h-space-12 items-center justify-between gap-space-3">
          <p className={cx("type-ui-md-medium", !ring.available && "type-ui-md-regular line-through opacity-50")}>{formatMoney(ring.total)}</p>
          <Button size="xs" variant="secondary" disabled={busy} onClick={onRemove} aria-label={`${bagContent.remove}, ${names.panel}`}>
            {bagContent.remove}
          </Button>
        </div>
      </div>
    </article>
  );
}

/**
 * A built ring in the bag panel (Figma "Bag Overlay" 5011:77722 and mobile "Nav / Bag" 4990:74441 draw rings as one
 * item: "Hidden Halo Diamond Ring", "14k Yellow Gold / 8.5 / 1ct", the price, quantity and Remove). The quantity
 * stays at 1 (its plus is disabled: a stone is one of a kind); minus or Remove takes out both lines.
 */
export function BagPanelRing({ ring, busy = false, onNavigate, onRemove }: { ring: BagRingItem; busy?: boolean; onNavigate?: () => void; onRemove: () => void }) {
  const names = bagRingNames(ring);
  const href = ringHref(ring);
  const image = ring.setting?.image ?? ring.stone?.image ?? null;
  // Built earrings: metal and the pair's total weight (no size).
  const summary = [ring.setting ? metalById(ring.setting.metal).label : null, ring.size, ring.stone?.stone ? `${ring.stone.stone.carat.toFixed(2)}ct` : null].filter(Boolean).join(" / ");
  const unitPrice = ring.lines.reduce((sum, line) => sum + line.unitPrice, 0);
  return (
    <li data-bag-ring className="flex items-center gap-space-4">
      <Link href={href} onClick={onNavigate} tabIndex={-1} aria-hidden="true" className={cx("relative block size-[7.5rem] shrink-0 overflow-hidden rounded-4", TILE_BG)}>
        {image ? <Picture image={{ ...image, alt: "" }} sizes={{ desktop: "120px", mobile: "120px" }} className="size-full object-cover mix-blend-multiply" /> : null}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-space-2 py-space-2">
        <div className="flex flex-col gap-1">
          <h3 className="type-heading-sm">
            <Link href={href} onClick={onNavigate} className="ui-transition rounded-4 ui-hover:text-black-alpha-60">
              {names.panel}
            </Link>
          </h3>
          <p className="type-ui-xs-medium">{summary}</p>
          <p className="type-ui-xs-medium">
            {formatPrice(unitPrice)} {bagContent.currencySuffix}
          </p>
          {ring.stone && !ring.stone.available ? <p className="type-ui-xs-medium text-state-error">{ring.build === "earrings" ? earringsContent.unavailable.row : ringCopy.stoneUnavailable}</p> : null}
        </div>
        <div className="flex items-center gap-1.5">
          <QuantitySelect value={1} max={1} itemName={names.panel} disabled={busy} onChange={(quantity) => (quantity <= 0 ? onRemove() : undefined)} />
          <PillButton disabled={busy} onClick={onRemove} aria-label={`${bagContent.remove}, ${names.panel}`}>
            {bagContent.remove}
          </PillButton>
        </div>
      </div>
    </li>
  );
}
