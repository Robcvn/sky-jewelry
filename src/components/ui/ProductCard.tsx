"use client";

import Link from "next/link";
import { useState } from "react";
import { metalById, type MetalId } from "@/content/metals";
import {
  formatInstallment,
  formatPrice,
  imagesFor,
  productHref,
  variantName,
  type Product,
  type ProductVariant,
} from "@/content/products";
import { Button, ButtonLink } from "./Button";
import { PaginationDots } from "./Pagination";
import { Picture } from "./Picture";
import { Swatch } from "./Swatch";
import { cx } from "./shared";

export type ProductCardLabels = { info: string; addToBag: string; installments: string; learnMore: string };

/** The variant to show after choosing a metal: same carat if that metal has it, else the metal's first. */
export function variantForMetal(product: Product, current: ProductVariant, metal: MetalId) {
  return (
    product.variants.find((variant) => variant.metal === metal && variant.carat === current.carat) ??
    product.variants.find((variant) => variant.metal === metal) ??
    current
  );
}

/** One swatch button per metal the product comes in, in variant order. */
export function MetalSwatches({
  product,
  variant,
  onChange,
  className,
}: {
  product: Product;
  variant: ProductVariant;
  onChange: (variant: ProductVariant) => void;
  className?: string;
}) {
  const metals = [...new Set(product.variants.map((item) => item.metal))];
  return (
    <div role="group" aria-label="Metal" className={cx("flex items-center justify-center gap-space-2 py-space-1", className)}>
      {metals.map((metal) => {
        const info = metalById(metal);
        const selected = metal === variant.metal;
        return (
          <button
            key={metal}
            type="button"
            aria-label={info.label}
            aria-pressed={selected}
            onClick={() => onChange(variantForMetal(product, variant, metal))}
            className={cx(
              "ui-transition relative flex size-space-4 cursor-pointer items-center justify-center rounded-full after:absolute after:-inset-1",
              selected
                ? "shadow-[0_0_0_1px_var(--color-base-white),0_0_0_2px_var(--color-primary-leather)]"
                : "hover:shadow-[0_0_0_1px_var(--color-base-white),0_0_0_2px_var(--color-black-alpha-20)]",
            )}
          >
            <Swatch color={info.swatch} className={selected ? "scale-[0.875]" : undefined} />
          </button>
        );
      })}
    </div>
  );
}

/** "Pay in 12 interest-free installments of $100 Learn more". Learn more opens the Credit modal, held for later: inert. */
export function Installments({ price, labels, className }: { price: number; labels: ProductCardLabels; className?: string }) {
  return (
    <p className={cx("type-ui-2xs-medium text-center text-primary-hazel", className)}>
      {labels.installments} <span className="text-base-black">{formatInstallment(price)}</span>{" "}
      <span className="text-base-black">{labels.learnMore}</span>
    </p>
  );
}

type ProductCardProps = {
  product: Product;
  /** The variant to show first: the first one matching the filters. */
  initialVariant: ProductVariant;
  labels: ProductCardLabels;
  onAddToBag: (product: Product, variant: ProductVariant) => void;
  /** Mobile: tapping the card opens the quick-view sheet. */
  onQuickView: (product: Product, variant: ProductVariant) => void;
  busy?: boolean;
};

/**
 * Figma "Product Card" on the product list (desktop 3565:98117, hover 3565:98133; mobile 3587:126789).
 * Default: square photo on the product-image gradient (multiplied), title, price and metal swatches.
 * Desktop hover or keyboard focus: an 8px white shell with a shadow grows around the card over the next row,
 * the photo zooms slightly, image dots appear (when there is more than one view), and Info, Add to Bag and
 * the installments line show below. The swatches switch the photo, title and price to that metal's variant.
 * Mobile: no hover; tapping the photo or title opens the quick view.
 */
export function ProductCard({ product, initialVariant, labels, onAddToBag, onQuickView, busy = false }: ProductCardProps) {
  const [variant, setVariant] = useState(initialVariant);
  const [view, setView] = useState(0);
  const images = imagesFor(product, variant.metal);
  const image = images[Math.min(view, images.length - 1)];
  const name = variantName(product, variant);
  const href = productHref(product);

  const chooseVariant = (next: ProductVariant) => {
    setVariant(next);
    setView(0);
  };

  return (
    <article className="group/card relative flex flex-col text-primary-leather focus-within:z-20 ui-desktop:hover:z-20">
      {/* Desktop hover shell: the top part sits behind the card, the bottom part holds the actions. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-space-2 -top-space-2 bottom-0 hidden rounded-t-8 border-x border-t border-black-alpha-5 bg-base-white shadow-lg ui-desktop:group-hover/card:block ui-desktop:group-focus-within/card:block"
      />

      <div className="relative flex flex-col">
        <div className="relative aspect-square overflow-hidden rounded-4 bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]">
          <Picture
            image={image}
            sizes={{ desktop: "(width >= 90rem) 20rem, 23vw", mobile: "45vw" }}
            className="size-full object-cover mix-blend-multiply transition-transform duration-300 ease-out motion-reduce:transition-none ui-desktop:group-hover/card:scale-[1.067] ui-desktop:group-focus-within/card:scale-[1.067] motion-reduce:scale-100!"
          />
          {images.length > 1 ? (
            <div className="absolute inset-x-0 bottom-space-4 z-10 hidden justify-center ui-desktop:group-hover/card:flex ui-desktop:group-focus-within/card:flex">
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

        <div className="flex flex-col gap-space-1 px-space-2 pt-space-2 text-center ui-desktop:pt-space-3">
          <h3 className="type-heading-xs ui-desktop:type-heading-sm">{name}</h3>
          <p className="type-ui-2xs-medium ui-desktop:type-ui-xs-medium">{formatPrice(variant.price)}</p>
        </div>

        {/* Desktop: the photo and title open the product page. Mobile: they open the quick view. */}
        <Link href={href} aria-label={name} className="absolute inset-0 z-0 hidden rounded-4 ui-desktop:block" />
        <button
          type="button"
          aria-label={`Quick view: ${name}`}
          aria-haspopup="dialog"
          onClick={() => onQuickView(product, variant)}
          className="absolute inset-0 z-0 cursor-pointer rounded-4 ui-desktop:hidden"
        />
      </div>

      <MetalSwatches product={product} variant={variant} onChange={chooseVariant} className="relative mt-space-2 pb-space-2 ui-desktop:mt-space-3 ui-desktop:pb-space-3" />

      <div className="absolute inset-x-0 top-full z-10 hidden ui-desktop:group-hover/card:block ui-desktop:group-focus-within/card:block">
        <div className="-mx-space-2 flex flex-col gap-space-4 rounded-b-8 border-x border-b border-black-alpha-5 bg-base-white px-space-4 pt-space-1 pb-space-4 shadow-lg">
          <div className="flex gap-space-2">
            <ButtonLink href={href} size="sm" variant="secondary" className="w-19 shrink-0">
              {labels.info}
            </ButtonLink>
            <Button
              size="sm"
              rightIcon="chevron-right"
              className="flex-1"
              disabled={busy || !variant.available}
              onClick={() => onAddToBag(product, variant)}
            >
              {labels.addToBag}
            </Button>
          </div>
          <Installments price={variant.price} labels={labels} />
        </div>
      </div>
    </article>
  );
}
