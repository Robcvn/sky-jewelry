"use client";

import { useId, useState } from "react";
import { CreditModal } from "@/components/bag/BagModals";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { MetalBadge } from "@/components/ui/MetalBadge";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { PaginationDots } from "@/components/ui/Pagination";
import { Picture, slotImage } from "@/components/ui/Picture";
import { Installments, MetalSwatches } from "@/components/ui/ProductCard";
import { cx } from "@/components/ui/shared";
import { DOTS_ABOVE_HINT, Hint360 } from "@/components/ui/Viewer360";
import { builderContent, shapeIcon, shapeLabel, styleIcon, styleLabel, type StoneShape } from "@/content/builder";
import { metalById } from "@/content/metals";
import { productListContent } from "@/content/product-list";
import { formatPrice, imagesFor, type ProductVariant } from "@/content/products";
import type { RingSetting } from "@/lib/builder";
import { settingTitle } from "./ring";

const { settings: text } = builderContent;
const cardLabels = productListContent.card;

type SettingQuickViewProps = {
  setting: RingSetting;
  initialVariant: ProductVariant;
  /** The centre stone shape the ring is being built for ("Set with"); round, Figma's example, when none is chosen. */
  shape: StoneShape | null;
  open: boolean;
  onClose: () => void;
  priceNote: (variant: ProductVariant) => string | null;
  infoHref: (variant: ProductVariant) => string;
  addHref: (variant: ProductVariant) => string;
  /**
   * The earrings builder: its label for the main button ("Customize"), no Stone tile (an earring setting has no
   * shape option) and no 360 marker (its quick view, Fine Jewelry's "Product List / Modal" 3587:127035, hides it).
   */
  actionLabel?: string;
  stoneTile?: boolean;
  hint360?: boolean;
};

/**
 * Figma mobile "Modal / Setting Selection" (3587:126322, 390 x 696), opened by tapping a setting card on mobile:
 * the photo, the name, the price with its "with stone" note, the Metal, Stone and Style tiles, then Info and Add
 * Setting with the installments line. The swatches choose the metal. As in the product list's quick view, the
 * tiles show the current choice and their chevrons are not interactive (their pickers are on the setting's page).
 * Figma's 360° marker is placed on the photo, hidden while SHOW_360 is off (no 360° sequence; Deviations). The
 * frame's 360° View / Images / Video tabs are not built.
 */
export function SettingQuickView({ setting, initialVariant, shape, open, onClose, priceNote, infoHref, addHref, actionLabel = text.addSetting, stoneTile = true, hint360 = true }: SettingQuickViewProps) {
  const id = useId();
  const { product } = setting;
  const [variant, setVariant] = useState(initialVariant);
  const [view, setView] = useState(0);
  const [creditOpen, setCreditOpen] = useState(false);
  const images = imagesFor(product, variant.metal);
  const image = images[Math.min(view, images.length - 1)];
  const name = settingTitle(product);
  const metal = metalById(variant.metal);
  const note = priceNote(variant);
  const stone = shape ?? "round";

  const tile = (label: string, media: React.ReactNode, value: string) => (
    <div className="flex flex-1 flex-col gap-space-2">
      <p className="type-overline-xs-medium flex items-center justify-center gap-space-1">
        {label}
        <Icon name="chevron-right" size={12} />
      </p>
      <div className="flex h-space-15 flex-col items-center justify-center gap-space-1 rounded-4 border border-black-alpha-20 p-space-2">
        {media}
        <span className="type-ui-2xs-medium">{value}</span>
      </div>
    </div>
  );

  return (
    <>
      <DialogShell open={open} onClose={onClose} labelledBy={`${id}-title`}>
        {({ visible }) => (
          <div
            className={`relative flex max-h-[calc(100dvh-var(--spacing-space-4))] w-full max-w-[24.375rem] flex-col overflow-y-auto overscroll-contain rounded-8 border border-black-alpha-5 bg-base-white p-space-2 text-primary-leather shadow-lg ${dialogPanelMotion(visible)}`}
          >
            <IconButton icon="close" label="Close" variant="ghost" size="md" onClick={onClose} className="absolute top-space-4 right-space-4 z-10" />

            <div className="relative aspect-square shrink-0 overflow-hidden rounded-4 bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]">
              <Picture image={slotImage(image, "quickview")} sizes={{ desktop: "23rem", mobile: "min(23.375rem, 96vw)" }} className="size-full object-cover mix-blend-multiply" />
              {hint360 ? <Hint360 className="bottom-space-4" /> : null}
              {images.length > 1 ? (
                <div className={cx("absolute inset-x-0 flex justify-center", hint360 ? DOTS_ABOVE_HINT : "bottom-space-4")}>
                  <PaginationDots count={images.length} current={view} onSelect={setView} label={`Photos of ${name}`} itemLabel={(index) => `Photo ${index + 1} of ${images.length}`} />
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-space-4 px-space-2 py-space-3">
              <div className="flex flex-col gap-space-1 text-center">
                <h2 id={`${id}-title`} className="type-heading-sm">
                  {name}
                </h2>
                <p className="type-ui-xs-medium">
                  {formatPrice(variant.price)}
                  {note ? <span className="pl-space-1 font-normal text-primary-hazel">{note}</span> : null}
                </p>
                <MetalSwatches
                  product={product}
                  variant={variant}
                  onChange={(next) => {
                    setVariant(next);
                    setView(0);
                  }}
                  className="mt-space-2"
                />
              </div>

              <div className="flex gap-space-2">
                {tile(cardLabels.metal, <MetalBadge metal={metal.id} />, metal.shortLabel)}
                {stoneTile ? tile(cardLabels.stone, <Icon name={shapeIcon(stone)} size={32} />, shapeLabel(stone)) : null}
                {setting.style ? tile(text.style, <Icon name={styleIcon(setting.style)} size={32} />, styleLabel(setting.style)) : null}
              </div>

              <div className="flex gap-space-2">
                <ButtonLink href={infoHref(variant)} size="sm" variant="secondary" className="w-19 shrink-0">
                  {builderContent.info}
                </ButtonLink>
                <ButtonLink href={addHref(variant)} size="sm" rightIcon="chevron-right" className="flex-1">
                  {actionLabel}
                </ButtonLink>
              </div>
              <Installments price={variant.price} labels={cardLabels} onLearnMore={() => setCreditOpen(true)} />
            </div>
          </div>
        )}
      </DialogShell>
      <CreditModal open={creditOpen} onClose={() => setCreditOpen(false)} />
    </>
  );
}
