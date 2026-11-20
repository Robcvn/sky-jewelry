"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { cx } from "@/components/ui/shared";
import { builderContent, shapeLabel } from "@/content/builder";
import { formatInstallment, formatPrice } from "@/content/products";
import type { Stone } from "@/lib/builder";
import { stoneColorLabel } from "./stoneFilters";
import { StonePicture } from "./StonePicture";

const copy = builderContent.stones;

/** Figma's stone cards word the line "Pay in 4 interest-free installments of $145 Learn more" (the setting cards say 12). */
export const STONE_INSTALLMENTS = 4;

/**
 * The four figures under a stone: Carat, Color, Clarity, Ratio, divided by black-alpha-20 rules.
 * "card": desktop 12/16 values and labels in 75 x 40 cells, mobile 10/14 values over 8/12 labels (3587:125351).
 * "sheet": the 12/16 size at every width (Modal / Stone Selection).
 */
export function StoneStats({ stone, size = "card" }: { stone: Stone; size?: "card" | "sheet" }) {
  const stats: Array<[string, string]> = [
    [stone.carat.toFixed(2), copy.stats.carat],
    [stoneColorLabel(stone), copy.stats.color],
    [stone.clarity, copy.stats.clarity],
    [stone.ratio.toFixed(2), copy.stats.ratio],
  ];
  const sheet = size === "sheet";
  return (
    <dl className="flex w-full text-center text-primary-leather">
      {stats.map(([value, label], index) => (
        <div
          key={label}
          className={cx(
            "flex min-w-0 flex-1 flex-col-reverse items-center",
            sheet ? "px-space-2 py-space-1" : "px-space-2 py-0.5 ui-desktop:py-space-1",
            index < stats.length - 1 && "border-r border-black-alpha-20",
          )}
        >
          <dt className={sheet ? "type-ui-xs-regular" : "type-ui-3xs-regular ui-desktop:type-ui-xs-regular"}>{label}</dt>
          {/* No truncation: "VVS2" is a hair wider than the 171px mobile card's cell less its padding, and must stay whole. */}
          <dd className={cx("whitespace-nowrap", sheet ? "type-ui-xs-medium" : "type-ui-2xs-regular ui-desktop:type-ui-xs-medium")}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** "$1,200  with setting: $1,800". The second part shows only when the ring has a setting. */
export function StonePrice({ stone, settingPrice, className }: { stone: Stone; settingPrice: number | null; className?: string }) {
  return (
    <p className={cx("flex flex-wrap items-start justify-center gap-x-space-1", className)}>
      <span className="font-medium">{formatPrice(stone.price)}</span>
      {settingPrice !== null ? (
        <span className="text-primary-hazel">
          {copy.withSetting} {formatPrice(stone.price + settingPrice)}
        </span>
      ) : null}
    </p>
  );
}

/** The installments line as the stone frames word it. With onLearnMore, Learn more opens the Credit modal. */
export function StoneInstallments({ price, onLearnMore }: { price: number; onLearnMore?: () => void }) {
  return (
    <p className="type-ui-2xs-medium text-center text-primary-hazel">
      Pay in {STONE_INSTALLMENTS} interest-free installments of <span className="text-base-black">{formatInstallment(price, STONE_INSTALLMENTS)}</span>{" "}
      {onLearnMore ? (
        <button type="button" onClick={onLearnMore} className="ui-transition cursor-pointer rounded-4 text-base-black underline underline-offset-2 ui-hover:text-black-alpha-60">
          {builderContent.learnMore}
          <span className="sr-only">: payment plans</span>
        </button>
      ) : (
        <span className="text-base-black">{builderContent.learnMore}</span>
      )}
    </p>
  );
}

type StoneCardProps = {
  stone: Stone;
  /** The stone's page, carrying the ring. */
  href: string;
  /** Step 3 with this stone (planned route). */
  completeHref: string;
  /** Price of the chosen setting, or null when the ring has none yet. */
  settingPrice: number | null;
  /** Mobile: tapping the card opens Modal / Stone Selection. */
  onQuickView: (stone: Stone) => void;
};

/**
 * Figma "Product Card", Type=Diamond, on Builder 2 - Stone (desktop 300 x 426 in 3565:101144, hover 316 x 572;
 * mobile 171 wide in 3587:125351): a bordered card with the stone's photo on the product-image gradient, its shape
 * as the title, its price (and the ring's price once a setting is chosen), and the Carat / Color / Clarity / Ratio
 * row. Desktop hover or keyboard focus: the white shell with a shadow grows 8px around the card and Info, Complete
 * Ring and the installments line show below, as the Fine Jewelry product card does. Figma's hover card also has
 * "360° View / Images" tabs, hidden because no stone has a 360° sequence (Held for review).
 * Mobile: no hover; tapping the card opens the stone's sheet.
 */
export function StoneCard({ stone, href, completeHref, settingPrice, onQuickView }: StoneCardProps) {
  const title = shapeLabel(stone.shape);
  return (
    <article data-stone={stone.handle} className="group/card relative flex flex-col text-primary-leather focus-within:z-20 ui-desktop:hover:z-20">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-space-2 -top-space-2 bottom-0 hidden rounded-t-8 border-x border-t border-black-alpha-5 bg-base-white shadow-lg ui-desktop:group-hover/card:block ui-desktop:group-focus-within/card:block"
      />
      <div className="relative flex flex-col overflow-hidden rounded-8 border border-black-alpha-10 bg-secondary-skin ui-desktop:group-hover/card:border-transparent ui-desktop:group-hover/card:bg-transparent ui-desktop:group-focus-within/card:border-transparent ui-desktop:group-focus-within/card:bg-transparent">
        <div className="relative aspect-square overflow-hidden rounded-t-4 bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))] ui-desktop:rounded-4">
          <StonePicture stone={stone} sizes={{ desktop: "(width >= 90rem) 18.75rem, 21vw", mobile: "45vw" }} />
        </div>
        <div className="flex flex-col gap-space-3 py-space-2 ui-desktop:gap-space-4 ui-desktop:py-space-3">
          <div className="flex flex-col gap-space-1 text-center">
            <h3 className="type-heading-xs ui-desktop:type-heading-sm">
              {title}
              <span className="sr-only">: {stone.title}</span>
            </h3>
            <StonePrice stone={stone} settingPrice={settingPrice} className="type-ui-2xs-regular ui-desktop:type-ui-xs-regular" />
          </div>
          <StoneStats stone={stone} />
        </div>
        {/* Desktop: the card opens the stone's page. Mobile: it opens the stone's sheet. */}
        <Link href={href} aria-label={stone.title} className="absolute inset-0 z-0 hidden rounded-8 ui-desktop:block" />
        <button type="button" aria-label={`Quick view: ${stone.title}`} aria-haspopup="dialog" onClick={() => onQuickView(stone)} className="absolute inset-0 z-0 cursor-pointer rounded-8 ui-desktop:hidden" />
      </div>

      <div className="absolute inset-x-0 top-full z-10 hidden ui-desktop:group-hover/card:block ui-desktop:group-focus-within/card:block">
        <div className="-mx-space-2 flex flex-col gap-space-4 rounded-b-8 border-x border-b border-black-alpha-5 bg-base-white px-space-4 pt-space-1 pb-space-4 shadow-lg">
          <div className="flex gap-space-2">
            <ButtonLink href={href} size="sm" variant="secondary" className="w-19 shrink-0">
              {builderContent.info}
              <span className="sr-only">: {stone.title}</span>
            </ButtonLink>
            <ButtonLink href={completeHref} size="sm" rightIcon="chevron-right" className="flex-1">
              {copy.completeRing}
            </ButtonLink>
          </div>
          <StoneInstallments price={stone.price} />
        </div>
      </div>
    </article>
  );
}
