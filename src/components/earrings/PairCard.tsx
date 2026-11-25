"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { CreditModal } from "@/components/bag/BagModals";
import { StoneInstallments, StoneStats } from "@/components/builder/StoneCard";
import { StonePicture } from "@/components/builder/StonePicture";
import { ButtonLink } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { cx } from "@/components/ui/shared";
import { builderContent, shapeLabel } from "@/content/builder";
import { earringsContent } from "@/content/earrings";
import { formatPrice } from "@/content/products";
import type { Stone } from "@/lib/builder";
import type { StonePair } from "@/lib/earrings";

const copy = earringsContent.stones;
const TILE_BG = "bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]";

/** The pair as passed through the shared stone listing: a Stone with its two stones. */
export const asPair = (stone: Stone) => stone as StonePair;

/** "$2,300  with setting: $3,020": the pair's price, and the earrings' once a setting is chosen. */
export function PairPrice({ pair, settingPrice, className }: { pair: Pick<Stone, "price">; settingPrice: number | null; className?: string }) {
  return (
    <p className={cx("flex flex-wrap items-start justify-center gap-x-space-1", className)}>
      <span className="font-medium">{formatPrice(pair.price)}</span>
      {settingPrice !== null ? (
        <span className="text-primary-hazel">
          {builderContent.stones.withSetting} {formatPrice(pair.price + settingPrice)}
        </span>
      ) : null}
    </p>
  );
}

/**
 * One stone of the pair card (Figma "Product Card", Type=Multi: desktop 3561:62285, mobile 3587:118251): its photo
 * on the product-image gradient, its shape as the name (Figma's "Product Name" placeholder; the ring builder's
 * stone cards name the shape), and its Carat / Color / Clarity / Ratio. A rule divides the two.
 */
function PairHalf({ stone, first, sheet = false }: { stone: Stone; first: boolean; sheet?: boolean }) {
  return (
    <div className={cx("flex min-w-0 flex-1 flex-col overflow-hidden", first && "border-r border-black-alpha-10")}>
      <div className={cx("relative aspect-square overflow-hidden", TILE_BG, sheet ? "" : "rounded-t-4 ui-desktop:rounded-none")}>
        <StonePicture stone={stone} sizes={{ desktop: "(width > 90rem) min(calc(24.8vw - 50px), 426px), (width >= 90rem) 19.25rem, 21vw", mobile: sheet ? "min(11.6875rem, 48vw)" : "45vw" }} />
      </div>
      <div className={cx("flex flex-col gap-space-3", sheet ? "py-space-3" : "py-space-2 ui-desktop:gap-space-4 ui-desktop:py-space-3")}>
        <p aria-hidden="true" className={cx("text-center", sheet ? "type-heading-sm" : "type-heading-xs ui-desktop:type-heading-sm")}>
          {shapeLabel(stone.shape)}
        </p>
        <StoneStats stone={stone} size={sheet ? "sheet" : "card"} />
      </div>
    </div>
  );
}

type PairCardProps = {
  pair: StonePair;
  /** The pair's page, carrying the earrings. */
  href: string;
  /** Step 3 with this pair. */
  completeHref: string;
  settingPrice: number | null;
  /** Mobile: tapping the card opens the pair's sheet. */
  onQuickView: (pair: StonePair) => void;
};

/**
 * The pair card on Step 2 (Figma "Product Card", Type=Multi: desktop 616 x 464 in 3565:98188, hover 632 x 566
 * 3565:98305; mobile 350 x 301 in 3587:126869): the two stones side by side, then the pair's price under a rule.
 * Desktop hover or keyboard focus: the white shell with a shadow grows 8px around the card, and Info, Complete
 * Earrings and the installments line show under the price, as the ring builder's stone card does. Mobile: the card
 * sits on white (as drawn) and tapping it opens the pair's sheet.
 */
export function PairCard({ pair, href, completeHref, settingPrice, onQuickView }: PairCardProps) {
  const [a, b] = pair.stones;
  return (
    <article data-pair={pair.handle} className="group/card relative flex flex-col text-primary-leather focus-within:z-20 ui-desktop:hover:z-20">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-space-2 -top-space-2 bottom-0 hidden rounded-t-8 border-x border-t border-black-alpha-10 bg-base-white shadow-lg ui-desktop:group-hover/card:block ui-desktop:group-focus-within/card:block"
      />
      <div className="relative flex flex-col overflow-hidden rounded-8 border border-black-alpha-10 bg-base-white ui-desktop:bg-transparent ui-desktop:group-hover/card:rounded-b-none ui-desktop:group-hover/card:border-transparent ui-desktop:group-focus-within/card:rounded-b-none ui-desktop:group-focus-within/card:border-transparent">
        <h3 className="sr-only">{pair.title}</h3>
        <div className="flex overflow-hidden ui-desktop:group-hover/card:rounded-4 ui-desktop:group-focus-within/card:rounded-4">
          <PairHalf stone={a} first />
          <PairHalf stone={b} first={false} />
        </div>
        <div className="flex justify-center border-t border-black-alpha-10 py-space-4">
          <PairPrice pair={pair} settingPrice={settingPrice} className="type-ui-2xs-regular ui-desktop:type-ui-sm-regular" />
        </div>
        {/* Desktop: the card opens the pair's page. Mobile: it opens the pair's sheet. */}
        <Link href={href} aria-label={pair.title} className="absolute inset-0 z-0 hidden rounded-8 ui-desktop:block" />
        <button type="button" aria-label={`Quick view: ${pair.title}`} aria-haspopup="dialog" onClick={() => onQuickView(pair)} className="absolute inset-0 z-0 cursor-pointer rounded-8 ui-desktop:hidden" />
      </div>

      <div className="absolute inset-x-0 top-full z-10 hidden ui-desktop:group-hover/card:block ui-desktop:group-focus-within/card:block">
        <div className="-mx-space-2 flex flex-col items-center gap-space-4 rounded-b-8 border-x border-b border-black-alpha-10 bg-base-white px-space-4 pb-space-6 shadow-lg">
          <div className="flex justify-center gap-space-2">
            <ButtonLink href={href} size="sm" variant="secondary" className="shrink-0">
              {builderContent.info}
              <span className="sr-only">: {pair.title}</span>
            </ButtonLink>
            <ButtonLink href={completeHref} size="sm" rightIcon="chevron-right" className="min-w-60">
              {copy.completeEarrings}
            </ButtonLink>
          </div>
          <StoneInstallments price={pair.price} />
        </div>
      </div>
    </article>
  );
}

type PairQuickViewProps = {
  pair: StonePair;
  open: boolean;
  onClose: () => void;
  href: string;
  completeHref: string;
  settingPrice: number | null;
};

/**
 * Figma mobile "Product List - Multi / Modal" (3587:127084), opened by tapping a pair card on mobile: a white sheet
 * with the two stones, a rule, the price, Info and Complete Earrings, and the installments line (Learn more opens
 * the Credit modal, as the ring builder's stone sheet).
 */
export function PairQuickView({ pair, open, onClose, href, completeHref, settingPrice }: PairQuickViewProps) {
  const id = useId();
  const [creditOpen, setCreditOpen] = useState(false);
  const [a, b] = pair.stones;
  return (
    <>
      <DialogShell open={open} onClose={onClose} labelledBy={`${id}-title`}>
        {({ visible }) => (
          <div
            data-pair-sheet={pair.handle}
            className={`relative flex max-h-[calc(100dvh-var(--spacing-space-4))] w-full max-w-[24.375rem] flex-col overflow-y-auto overscroll-contain rounded-8 border border-black-alpha-5 bg-base-white p-space-2 text-primary-leather shadow-lg ${dialogPanelMotion(visible)}`}
          >
            <h2 id={`${id}-title`} className="sr-only">
              {pair.title}
            </h2>
            <IconButton icon="close" label="Close" variant="ghost" size="md" onClick={onClose} className="absolute top-space-4 right-space-4 z-10" />
            <div className="flex overflow-hidden rounded-4">
              <PairHalf stone={a} first sheet />
              <PairHalf stone={b} first={false} sheet />
            </div>
            <div className="flex flex-col gap-space-4 border-t border-black-alpha-10 px-space-2 pt-space-4 pb-space-3">
              <PairPrice pair={pair} settingPrice={settingPrice} className="type-ui-xs-regular" />
              <div className="flex justify-center gap-space-2">
                <ButtonLink href={href} size="sm" variant="secondary" className="w-19 shrink-0">
                  {builderContent.info}
                </ButtonLink>
                <ButtonLink href={completeHref} size="sm" rightIcon="chevron-right" className="flex-1">
                  {copy.completeEarrings}
                </ButtonLink>
              </div>
              <StoneInstallments price={pair.price} onLearnMore={() => setCreditOpen(true)} />
            </div>
          </div>
        )}
      </DialogShell>
      <CreditModal open={creditOpen} onClose={() => setCreditOpen(false)} />
    </>
  );
}
