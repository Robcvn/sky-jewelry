"use client";

import { useId, useState } from "react";
import { CreditModal } from "@/components/bag/BagModals";
import { DropHintModal } from "@/components/builder/DropHintModal";
import { settingVariant } from "@/components/builder/ring";
import { OptionGrid } from "@/components/builder/SettingDetail";
import { useQuery } from "@/components/builder/useQuery";
import { PickerLabel } from "@/components/pdp/OptionPickers";
import { metalBadge } from "@/components/plp/FilterControls";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { IconBlock } from "@/components/ui/IconBlock";
import { IconLabelButton } from "@/components/ui/IconButton";
import { OptionTile } from "@/components/ui/OptionTile";
import { CompositionChart, ProductInfoCard } from "@/components/ui/ProductInfoCard";
import { cx } from "@/components/ui/shared";
import { builderContent } from "@/content/builder";
import { STONE_PHOTOS } from "@/content/builder-seed";
import { earringsContent } from "@/content/earrings";
import { metalById, type MetalId } from "@/content/metals";
import { metalComposition, productDetailContent } from "@/content/product-detail";
import { formatInstallment, formatPrice, imagesFor, variantName, type Product } from "@/content/products";
import type { EarringSetting } from "@/lib/earrings";
import { EarringsDesktopGallery, EarringsMobileGallery, settingPhotos } from "./EarringsGallery";
import { earringSettingsHref, pairsHref, parseEarrings } from "./routes";
import { useDragScroll } from "@/components/ui/useDragScroll";

const text = earringsContent.setting;
const pdp = productDetailContent;

/** Figma's diamond on the setting pages' third tile and mobile thumbnail: the builder's round diamond photo. */
export const SAMPLE_DIAMOND = {
  image: { desktop: "diamond-round-d" as const, mobile: "diamond-round-m" as const, alt: STONE_PHOTOS["stone-diamond-round"] },
  shape: "round",
  title: "A round diamond",
};

/** "$" in heading-caps-xs beside the amount in heading-caps-sm, as the ring builder's pages draw prices. */
export function HeadingPrice({ price }: { price: number }) {
  const formatted = formatPrice(price);
  return (
    <p className="flex text-primary-leather">
      <span className="type-heading-caps-xs flex flex-col justify-center">{formatted.slice(0, 1)}</span>
      <span className="type-heading-caps-sm">{formatted.slice(1)}</span>
    </p>
  );
}

/** The installments line with Learn more (opens the Credit modal), as on the ring builder's pages. */
export function InstallmentsLine({ price, onLearnMore }: { price: number; onLearnMore: () => void }) {
  return (
    <p className="type-body-xs-regular flex flex-wrap items-center justify-center gap-x-space-2 text-center text-primary-leather">
      <span>
        {builderContent.installments} <span className="font-medium">{formatInstallment(price)}</span>
      </span>
      <button type="button" onClick={onLearnMore} className="type-overline-xs-link ui-transition cursor-pointer rounded-4 ui-hover:text-black-alpha-60">
        {builderContent.learnMore}
        <span className="sr-only">: payment plans</span>
      </button>
    </p>
  );
}

/** The ships line and the icon row, in both breakpoints (Figma "Ships in" 3565:98763 and the four Icon Blocks). */
export function ShipsAndIcons({ days }: { days: number }) {
  return (
    <>
      <p className="type-ui-xs-regular flex items-center justify-center gap-space-2 text-primary-leather ui-desktop:type-body-sm-regular">
        <Icon name="truck" size={24} />
        {pdp.labels.shipsIn(days)}
      </p>
      <ul className="flex gap-space-2">
        {pdp.iconRow.map((item) => (
          <li key={item._key} className="flex flex-1">
            <IconBlock icon={item.icon} label={item.label} lines={item.lines} />
          </li>
        ))}
      </ul>
    </>
  );
}

/** "Setting Info"'s heading: Figma's Diamond Earrings icon (24px mobile, 32px desktop) and the title. */
export function SettingInfoHeading({ id, title = text.settingInfo }: { id: string; title?: string }) {
  return (
    <h2 id={id} className="type-heading-sm flex items-center gap-space-2 text-primary-leather ui-desktop:type-heading-md ui-desktop:gap-space-3">
      <Icon name="diamond-earrings" size={24} className="ui-desktop:hidden" />
      <Icon name="diamond-earrings" size={32} className="hidden ui-desktop:block" />
      {title}
    </h2>
  );
}

/** The Metal card with its composition chart (Figma 3565:98777's visible card; the frame hides its other two cards). */
export function MetalCard({ metal }: { metal: MetalId }) {
  return (
    <ProductInfoCard label={pdp.labels.metal} value={metalById(metal).label} note={pdp.metalNote} gap="md">
      <CompositionChart parts={metalComposition[metal]} />
    </ProductInfoCard>
  );
}

/** "Setting Info" (Figma 3565:98774; mobile 3587:127517): the heading and the Metal card, under a gold rule. */
export function EarringSettingInfo({ metal, headingId = "earring-setting-info", className }: { metal: MetalId; headingId?: string; className?: string }) {
  return (
    <section
      aria-labelledby={headingId}
      className={cx("flex flex-col gap-space-5 border-t border-secondary-gold ui-desktop:gap-space-8", className ?? "pt-[calc(var(--spacing-space-5)-1px)] ui-desktop:pt-[calc(var(--spacing-space-8)-1px)]")}
    >
      <SettingInfoHeading id={headingId} />
      <MetalCard metal={metal} />
    </section>
  );
}

/**
 * Mobile Metal (Figma "Product Card Options 2" 3587:127535): "METAL: 14K YELLOW GOLD" over a row of 80px tiles that
 * scrolls sideways. Only the metals the setting comes in.
 */
function MobileMetalRow({ metals, value, onChange }: { metals: MetalId[]; value: MetalId; onChange: (metal: MetalId) => void }) {
  const id = useId();
  const rowRef = useDragScroll<HTMLDivElement>();
  return (
    <div className="flex flex-col gap-space-2">
      {/* Figma centres the label over the tiles (3587:127535; Task 30, ea-settinginfo-390-5). */}
      <PickerLabel id={`${id}-label`} label={text.metal} value={metalById(value).label} className="justify-center" />
      <div ref={rowRef} role="radiogroup" aria-labelledby={`${id}-label`} className="-mx-(--grid-margin) flex gap-space-2 overflow-x-auto px-(--grid-margin) [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {metals.map((metal) => (
          <OptionTile key={metal} type="radio" name={`${id}-metal`} media={metalBadge(metal)} aria-label={metalById(metal).label} checked={value === metal} onChange={() => onChange(metal)}>
            {metalById(metal).shortLabel}
          </OptionTile>
        ))}
      </div>
    </div>
  );
}

/** The setting's tiles in Figma's order: the studs from the front, worn (the model tile), a diamond, and with their backs. */
export function settingGalleryOrder(product: Product, metal: MetalId) {
  const photos = settingPhotos(imagesFor(product, metal));
  const model = [photos.worn, photos.front, photos.angled].filter((image): image is NonNullable<typeof image> => image !== null);
  return { photos, model, mobile: [photos.front, photos.worn, photos.angled].filter((image): image is NonNullable<typeof image> => image !== null) };
}

/**
 * Earrings builder Step 1, the setting's page (Figma desktop Custom Earrings - Setting Info 3565:98709, mobile
 * 3587:127517). Built from the ring builder's parts: the gallery tiles, the option tiles, the icon row, the Product
 * Info Card and the accordions. The chosen metal lives in the URL (?metal=), and Select These Earrings carries it
 * to Step 2. Figma's prototype opens "Choose your Stones" (Add Diamonds / Add Gemstones) from that button; no
 * gemstone step is drawn for earrings, so the button goes straight to the diamonds (Open questions).
 */
export function EarringSettingDetail({ setting }: { setting: EarringSetting }) {
  const { product } = setting;
  const [search, setQuery] = useQuery();
  const earrings = parseEarrings(new URLSearchParams(search));
  const variant = settingVariant(product, earrings.metal);
  const [dialog, setDialog] = useState<"credit" | "hint" | null>(null);
  const [hintKey, setHintKey] = useState(0);
  const name = variantName(product, variant);
  const metals = [...new Set(product.variants.map((item) => item.metal))];
  const choose = (metal: MetalId) => setQuery(new URLSearchParams({ metal }));
  const nextHref = pairsHref({ setting: setting.handle, metal: variant.metal });
  const { photos, model, mobile } = settingGalleryOrder(product, variant.metal);

  return (
    <div className="ui-desktop:site-container ui-desktop:grid ui-desktop:grid-cols-[minmax(0,718fr)_minmax(0,506fr)] ui-desktop:gap-space-6">
      <div className="hidden ui-desktop:block">
        <div className="sticky top-(--sticky-header-height) py-space-15 pr-space-6">
          <EarringsDesktopGallery
            tiles={[
              { key: "front", kind: "photo", image: photos.front, priority: true },
              { key: "model", kind: "model", images: model, name },
              { key: "diamond", kind: "stone", stone: SAMPLE_DIAMOND, hint360: true },
              ...(photos.angled ? [{ key: "angled", kind: "photo" as const, image: photos.angled }] : []),
            ]}
          />
        </div>
      </div>
      <div className="ui-desktop:hidden">
        <EarringsMobileGallery photos={mobile} stone={SAMPLE_DIAMOND} name={name} />
      </div>

      <div className="site-container flex flex-col gap-space-6 pt-space-5 pb-space-11 ui-desktop:gap-space-8 ui-desktop:px-0 ui-desktop:py-space-15">
        {/* Title and Drop a Hint side by side on desktop; the mobile frame draws no Drop a Hint. */}
        <div className="flex items-start justify-between gap-space-4">
          <div className="flex flex-col gap-space-4 ui-desktop:max-w-[25.9375rem]">
            <h1 className="type-heading-md text-primary-leather">{name}</h1>
            <HeadingPrice price={variant.price} />
          </div>
          <div className="hidden shrink-0 ui-desktop:block">
            <IconLabelButton
              icon="mail"
              layout="stack"
              onClick={() => {
                setHintKey((key) => key + 1);
                setDialog("hint");
              }}
            >
              {builderContent.complete.dropHint}
            </IconLabelButton>
          </div>
        </div>

        <div className="hidden ui-desktop:block">
          <OptionGrid
            label={text.material}
            valueLabel={metalById(variant.metal).label}
            options={metals.map((item) => ({ value: item, label: metalById(item).shortLabel, ariaLabel: metalById(item).label, media: metalBadge(item) }))}
            value={variant.metal}
            onChange={choose}
          />
        </div>
        <div className="ui-desktop:hidden">
          <MobileMetalRow metals={metals} value={variant.metal} onChange={choose} />
        </div>

        <div className="flex flex-col gap-space-4">
          <div className="flex flex-col gap-space-3 ui-desktop:gap-space-4">
            <ButtonLink href={nextHref} className="w-full">
              {text.selectThese}
            </ButtonLink>
            <ButtonLink href={earringSettingsHref()} variant="secondary" className="w-full">
              {text.remove}
            </ButtonLink>
          </div>
          <InstallmentsLine price={variant.price} onLearnMore={() => setDialog("credit")} />
        </div>

        <ShipsAndIcons days={product.shipsInDays ?? 7} />

        <div className="flex flex-col gap-space-5 ui-desktop:gap-space-8">
          <EarringSettingInfo metal={variant.metal} />
          <Accordion>
            <AccordionItem question="Shipping" icon="truck" headingLevel={2}>
              {pdp.shipping(product.shipsInDays ?? 7).map((paragraph) => (
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
      </div>

      <CreditModal open={dialog === "credit"} onClose={() => setDialog(null)} />
      <DropHintModal key={hintKey} open={dialog === "hint"} onClose={() => setDialog(null)} name={name} image={photos.front} ringSize={false} intro={text.hintIntro} />
    </div>
  );
}
