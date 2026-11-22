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
import { SHOW_360 } from "@/lib/features";
import { swatchMetals } from "@/lib/swatches";
import { DOTS_ABOVE_HINT, Hint360 } from "./Viewer360";

export type ProductCardLabels = { info: string; addToBag: string; installments: string; learnMore: string };

/** The variant to show after choosing a metal: same carat if that metal has it, else the metal's first. */
export function variantForMetal(product: Product, current: ProductVariant, metal: MetalId) {
  return (
    product.variants.find((variant) => variant.metal === metal && variant.carat === current.carat) ??
    product.variants.find((variant) => variant.metal === metal) ??
    current
  );
}

/** The product's metal swatches (swatchMetals), in variant order. */
export function MetalSwatches({
  product,
  variant,
  onChange,
  metalFilter,
  className,
}: {
  product: Product;
  variant: ProductVariant;
  onChange: (variant: ProductVariant) => void;
  /** The list's Metal filter, when it has one: a lifestyle photo's metal gets a swatch only when the filter chose it. */
  metalFilter?: readonly MetalId[];
  className?: string;
}) {
  // The metal the card opened on, per product: when the Metal filter chose it, a lifestyle photo's swatch stays.
  const [opened, setOpened] = useState({ slug: product.slug, metal: variant.metal });
  if (opened.slug !== product.slug) setOpened({ slug: product.slug, metal: variant.metal });
  const openedOn = opened.slug === product.slug ? opened.metal : variant.metal;
  const metals = swatchMetals(product, variant.metal, metalFilter?.includes(openedOn) ? openedOn : null);
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

/**
 * "Pay in 12 interest-free installments of $100 Learn more". With onLearnMore (the quick view), Learn more opens
 * the Credit modal; on the product card it stays inert, as before.
 */
export function Installments({ price, labels, className, onLearnMore }: { price: number; labels: ProductCardLabels; className?: string; onLearnMore?: () => void }) {
  return (
    <p className={cx("type-ui-2xs-medium text-center text-primary-hazel", className)}>
      {labels.installments} <span className="text-base-black">{formatInstallment(price)}</span>{" "}
      {onLearnMore ? (
        <button type="button" onClick={onLearnMore} className="ui-transition cursor-pointer rounded-4 text-base-black underline underline-offset-2 ui-hover:text-black-alpha-60">
          {labels.learnMore}
          <span className="sr-only">: payment plans</span>
        </button>
      ) : (
        <span className="text-base-black">{labels.learnMore}</span>
      )}
    </p>
  );
}

/**
 * The ring builder's setting cards (Figma Builder 1 - Setting, 3565:101312; hover 3565:101327): the same card with
 * the setting's name without its metal, a "with stone: $1,800" note beside the price, links into the builder, and
 * "Choose Setting" (a link to Step 2) where the product list has Add to Bag.
 */
export type ProductCardBuilder = {
  title: string;
  href: (variant: ProductVariant) => string;
  priceNote: (variant: ProductVariant) => string | null;
  action: { label: string; href: (variant: ProductVariant) => string };
  /**
   * Figma's 360 marker on the hover card's photo (the ring builder's 3565:101327; the earrings card draws none),
   * for hover or focus. Hidden while SHOW_360 is off (no 360° sequence); with it on, dots sit above it.
   */
  hint360?: boolean;
};

type ProductCardProps = {
  product: Product;
  /** The variant to show first: the first one matching the filters. */
  initialVariant: ProductVariant;
  labels: ProductCardLabels;
  /** Not used by the ring builder's cards, whose main action is a link. */
  onAddToBag?: (product: Product, variant: ProductVariant) => void;
  /** Mobile: tapping the card opens the quick-view sheet. Without it the card links to the product page at every width. */
  onQuickView?: (product: Product, variant: ProductVariant) => void;
  /** No hover shell or actions: the Featured Products flyout (4142:56821 / 4142:71912) draws the plain card. */
  plain?: boolean;
  busy?: boolean;
  /** "grid": the product list (smaller text below 1024px). "carousel": landing page rows (desktop text sizes throughout). */
  size?: "grid" | "carousel";
  builder?: ProductCardBuilder;
  /** The list's Metal filter (MetalSwatches). */
  metalFilter?: readonly MetalId[];
};

/**
 * The hover panel's spacing on narrow cards. Figma (3565:98133, a 300px card) gives Info 76px, a gap of 8, panel side
 * padding 16, button side padding 16 and label side padding 8. At those values "Choose Setting" (the widest label)
 * fits on one line with 4px to spare from a card of 276.5px (about a 1330px viewport on the product list). Below that,
 * one length, --squeeze, grows from 0 at 276.5px to 8px at a 211px card (the four-column grid at 1024px) and takes the
 * panel, button and label padding down by itself (16 to 8, 16 to 8, 8 to 0) and Info's width by 2.5 times (76 to 56).
 * The gap stays 8. 100cqw is the card's width: the panel's wrapper is a size container. Labels never wrap. At 276.5px
 * and wider every value is Figma's. Every card with the hover panel uses it (lists, search, Best Sellers rows, the
 * ring and earrings builders).
 */
const SQUEEZE = "[--squeeze:clamp(0px,(276.5px_-_100cqw)_*_8_/_65.5,8px)]";
const HOVER_SQUEEZE = {
  panel: `${SQUEEZE} px-[calc(16px_-_var(--squeeze))]`,
  info: "w-[calc(76px_-_2.5_*_var(--squeeze))]",
  // The button's own px-space-4 and its label's px-space-2 (Button.tsx) are overridden here only.
  button: "px-[calc(16px_-_var(--squeeze))]! [&>span]:px-[calc(8px_-_var(--squeeze))] [&>span]:whitespace-nowrap",
};

/**
 * Figma "Product Card" on the product list (desktop 3565:98117, hover 3565:98133; mobile 3587:126789).
 * Default: square photo on the product-image gradient (multiplied), title, price and metal swatches.
 * Desktop hover or keyboard focus: an 8px white shell with a shadow grows around the card over the next row,
 * the photo zooms slightly, image dots appear (when there is more than one view), and Info, Add to Bag and
 * the installments line show below. The swatches switch the photo, title and price to that metal's variant.
 * Mobile: no hover; tapping the photo or title opens the quick view.
 */
export function ProductCard({ product, initialVariant, labels, onAddToBag, onQuickView, busy = false, size = "grid", builder, plain = false, metalFilter }: ProductCardProps) {
  const carousel = size === "carousel";
  const [variant, setVariant] = useState(initialVariant);
  const [view, setView] = useState(0);
  const images = imagesFor(product, variant.metal);
  const image = images[Math.min(view, images.length - 1)];
  const name = builder?.title ?? variantName(product, variant);
  const href = builder ? builder.href(variant) : productHref(product);
  const priceNote = builder?.priceNote(variant) ?? null;

  const chooseVariant = (next: ProductVariant) => {
    setVariant(next);
    setView(0);
  };

  return (
    <article className={cx("relative flex flex-col text-primary-leather", !plain && "group/card focus-within:z-20 ui-desktop:hover:z-20")}>
      {/* Desktop hover shell: the top part sits behind the card, the bottom part holds the actions. */}
      {plain ? null : (
        <span
          aria-hidden="true"
          data-hover-shell=""
          className="pointer-events-none absolute -inset-x-space-2 -top-space-2 bottom-0 hidden rounded-t-8 border-x border-t border-black-alpha-5 bg-base-white shadow-lg ui-desktop:group-hover/card:block ui-desktop:group-focus-within/card:block"
        />
      )}

      <div className="relative flex flex-col">
        <div className="relative aspect-square overflow-hidden rounded-4 bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]">
          <Picture
            image={image}
            sizes={{ desktop: "(width >= 90rem) 20rem, 23vw", mobile: carousel ? "18.125rem" : "45vw" }}
            className="size-full object-cover mix-blend-multiply transition-transform duration-300 ease-out motion-reduce:transition-none ui-desktop:group-hover/card:scale-[1.067] ui-desktop:group-focus-within/card:scale-[1.067] motion-reduce:scale-100!"
          />
          {SHOW_360 && builder?.hint360 ? (
            <div className="hidden ui-desktop:group-hover/card:block ui-desktop:group-focus-within/card:block">
              <Hint360 className="bottom-space-4" />
            </div>
          ) : null}
          {images.length > 1 ? (
            <div
              className={cx(
                "absolute inset-x-0 z-10 hidden justify-center ui-desktop:group-hover/card:flex ui-desktop:group-focus-within/card:flex",
                builder?.hint360 ? DOTS_ABOVE_HINT : "bottom-space-4",
              )}
            >
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

        <div className={cx("flex flex-col gap-space-1 px-space-2 text-center", carousel ? "pt-space-3" : "pt-space-2 ui-desktop:pt-space-3")}>
          <h3 className={carousel ? "type-heading-sm" : "type-heading-xs ui-desktop:type-heading-sm"}>{name}</h3>
          <p className={carousel ? "type-ui-xs-medium" : "type-ui-2xs-medium ui-desktop:type-ui-xs-medium"}>
            {formatPrice(variant.price)}
            {priceNote ? <span className="pl-space-1 font-normal text-primary-hazel">{priceNote}</span> : null}
          </p>
        </div>

        {/* Desktop: the photo and title open the product page. Mobile: they open the quick view. */}
        <Link href={href} aria-label={name} className={cx("absolute inset-0 z-0 rounded-4", onQuickView && "hidden ui-desktop:block")} />
        {onQuickView ? (
          <button
            type="button"
            aria-label={`Quick view: ${name}`}
            aria-haspopup="dialog"
            onClick={() => onQuickView(product, variant)}
            className="absolute inset-0 z-0 cursor-pointer rounded-4 ui-desktop:hidden"
          />
        ) : null}
      </div>

      <MetalSwatches product={product} variant={variant} onChange={chooseVariant} metalFilter={metalFilter} className={cx("relative", carousel ? "mt-space-3 pb-space-3" : "mt-space-2 pb-space-2 ui-desktop:mt-space-3 ui-desktop:pb-space-3")} />

      {/* A size container as wide as the card, for the panel's spacing (HOVER_SQUEEZE). */}
      <div className={cx("@container absolute inset-x-0 top-full z-10 hidden", !plain && "ui-desktop:group-hover/card:block ui-desktop:group-focus-within/card:block")}>
        {/* data-hover-shell: the carousel measures the hovered card with its shell and this panel (Carousel.tsx). */}
        <div data-hover-shell="" className={cx("-mx-space-2 flex flex-col gap-space-4 rounded-b-8 border-x border-b border-black-alpha-5 bg-base-white pt-space-1 pb-space-4 shadow-lg", HOVER_SQUEEZE.panel)}>
          <div className="flex gap-space-2">
            <ButtonLink href={href} size="sm" variant="secondary" className={cx("shrink-0", HOVER_SQUEEZE.info, HOVER_SQUEEZE.button)}>
              {labels.info}
            </ButtonLink>
            {builder ? (
              <ButtonLink href={builder.action.href(variant)} size="sm" rightIcon="chevron-right" className={cx("flex-1", HOVER_SQUEEZE.button)}>
                {builder.action.label}
              </ButtonLink>
            ) : (
              <Button
                size="sm"
                rightIcon="chevron-right"
                className={cx("flex-1", HOVER_SQUEEZE.button)}
                disabled={busy || !variant.available}
                onClick={() => onAddToBag?.(product, variant)}
              >
                {labels.addToBag}
              </Button>
            )}
          </div>
          <Installments price={variant.price} labels={labels} />
        </div>
      </div>
    </article>
  );
}
