"use client";

import { useId, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { OptionTile } from "@/components/ui/OptionTile";
import { PaginationDots } from "@/components/ui/Pagination";
import { Picture } from "@/components/ui/Picture";
import { Installments, MetalSwatches, type ProductCardLabels } from "@/components/ui/ProductCard";
import { metalById } from "@/content/metals";
import { formatCarat, formatPrice, imagesFor, productHref, variantName, type Product, type ProductVariant } from "@/content/products";
import { MetalBadge } from "@/components/ui/MetalBadge";

export type QuickViewLabels = ProductCardLabels & { caratWeight: string; metal: string; stone: string; close: string };

type QuickViewProps = {
  product: Product;
  initialVariant: ProductVariant;
  open: boolean;
  onClose: () => void;
  onAddToBag: (product: Product, variant: ProductVariant) => void;
  busy?: boolean;
  labels: QuickViewLabels;
};

const SHAPE_ICON: Record<string, IconName> = { round: "round", oval: "oval", emerald: "emerald" };

/**
 * Figma mobile quick-view sheet (3587:127035), opened by tapping a card on mobile. The swatches and the carat
 * tiles choose the variant: photo, title, price and the installments line follow it.
 * The Metal and Stone tiles show the current choice; in Figma their chevrons point to pickers that belong
 * to the product page, so they are not interactive here (flagged).
 */
export function QuickView({ product, initialVariant, open, onClose, onAddToBag, busy = false, labels }: QuickViewProps) {
  const id = useId();
  const [variant, setVariant] = useState(initialVariant);
  const [view, setView] = useState(0);
  const images = imagesFor(product, variant.metal);
  const image = images[Math.min(view, images.length - 1)];
  const name = variantName(product, variant);
  const metal = metalById(variant.metal);
  const carats = [...new Set(product.variants.filter((item) => item.metal === variant.metal && item.carat !== null).map((item) => item.carat!))].sort(
    (a, b) => a - b,
  );

  const choose = (next: ProductVariant) => {
    setVariant(next);
    setView(0);
  };

  return (
    <DialogShell open={open} onClose={onClose} labelledBy={`${id}-title`}>
      {({ visible }) => (
        // Figma 3587:127035: 8px padding and no gap, so the text block starts right under the photo.
        <div
          className={`relative flex max-h-[calc(100dvh-var(--spacing-space-4))] w-full max-w-[24.375rem] flex-col overflow-y-auto overscroll-contain rounded-8 border border-black-alpha-5 bg-base-white p-space-2 text-primary-leather shadow-lg ${dialogPanelMotion(visible)}`}
        >
          <IconButton icon="close" label={labels.close} variant="ghost" size="md" onClick={onClose} className="absolute top-space-4 right-space-4 z-10" />

          <div className="relative aspect-square shrink-0 overflow-hidden rounded-4 bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]">
            <Picture image={image} sizes={{ desktop: "23rem", mobile: "min(23.375rem, 96vw)" }} className="size-full object-cover mix-blend-multiply" />
            {images.length > 1 ? (
              <div className="absolute inset-x-0 bottom-space-4 flex justify-center">
                <PaginationDots
                  count={images.length}
                  current={view}
                  onSelect={setView}
                  label={`Photos of ${name}`}
                  itemLabel={(index) => `Photo ${index + 1} of ${images.length}`}
                />
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-space-4 px-space-2 py-space-3">
            <div className="flex flex-col gap-space-1 text-center">
              <h2 id={`${id}-title`} className="type-heading-sm">
                {name}
              </h2>
              <p className="type-ui-xs-medium">{formatPrice(variant.price)}</p>
              <MetalSwatches product={product} variant={variant} onChange={choose} className="mt-space-2" />
            </div>

            {carats.length ? (
              <fieldset className="flex min-w-0 flex-col gap-space-3">
                <legend className="type-overline-xs-medium mb-space-3 flex gap-space-1">
                  {labels.caratWeight}:<span className="type-overline-xs-regular text-black-alpha-60">{formatCarat(variant.carat ?? carats[0])}</span>
                </legend>
                <div className="-mx-space-2 flex gap-space-2 overflow-x-auto px-space-2 pb-space-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {carats.map((carat) => (
                    <OptionTile
                      key={carat}
                      type="radio"
                      shape="compact"
                      name={`${id}-carat`}
                      checked={variant.carat === carat}
                      onChange={() => {
                        const next = product.variants.find((item) => item.metal === variant.metal && item.carat === carat);
                        if (next) choose(next);
                      }}
                    >
                      {formatCarat(carat)}
                    </OptionTile>
                  ))}
                </div>
              </fieldset>
            ) : null}

            <div className="flex gap-space-2">
              <div className="flex flex-1 flex-col gap-space-2">
                <p className="type-overline-xs-medium flex items-center justify-center gap-space-1">
                  {labels.metal}
                  <Icon name="chevron-right" size={12} />
                </p>
                <div className="flex h-space-15 flex-col items-center justify-center gap-space-1 rounded-4 border border-black-alpha-20 p-space-2">
                  <MetalBadge metal={metal.id} />
                  <span className="type-ui-2xs-medium">{metal.shortLabel}</span>
                </div>
              </div>
              {product.shape ? (
                <div className="flex flex-1 flex-col gap-space-2">
                  <p className="type-overline-xs-medium flex items-center justify-center gap-space-1">
                    {labels.stone}
                    <Icon name="chevron-right" size={12} />
                  </p>
                  <div className="flex h-space-15 flex-col items-center justify-center gap-space-1 rounded-4 border border-black-alpha-20 p-space-2">
                    <Icon name={SHAPE_ICON[product.shape] ?? "round"} size={32} />
                    <span className="type-ui-2xs-medium capitalize">{product.shape}</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex gap-space-2">
              <ButtonLink href={productHref(product)} size="sm" variant="secondary" className="w-19 shrink-0">
                {labels.info}
              </ButtonLink>
              <Button size="sm" rightIcon="chevron-right" className="flex-1" disabled={busy || !variant.available} onClick={() => onAddToBag(product, variant)}>
                {labels.addToBag}
              </Button>
            </div>
            <Installments price={variant.price} labels={labels} />
          </div>
        </div>
      )}
    </DialogShell>
  );
}
