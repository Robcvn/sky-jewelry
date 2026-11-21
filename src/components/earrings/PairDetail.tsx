"use client";

import { useState } from "react";
import { CreditModal } from "@/components/bag/BagModals";
import { StoneInfoSection } from "@/components/builder/StoneDetail";
import { StoneDetailQualities } from "@/components/builder/StoneDetailQualities";
import { StoneStats } from "@/components/builder/StoneCard";
import { useQuery } from "@/components/builder/useQuery";
import { parseShape } from "@/components/builder/ring";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { shapeLabel } from "@/content/builder";
import { earringsContent } from "@/content/earrings";
import { productDetailContent } from "@/content/product-detail";
import { formatPrice } from "@/content/products";
import type { Stone } from "@/lib/builder";
import type { StonePair } from "@/lib/earrings";
import { HeadingPrice, InstallmentsLine, ShipsAndIcons } from "./EarringSettingDetail";
import { PairStoneViews } from "./EarringsGallery";
import { earringsCompleteHref, pairsHref, parseEarrings } from "./routes";

const text = earringsContent.pair;
const pdp = productDetailContent;

/** Each stone's name, price and figures under its views (Figma 3565:99246: heading-sm, ui-xs, then the four figures). */
function StoneCaption({ stone, variant }: { stone: Stone; variant: "desktop" | "mobile" }) {
  return (
    <div className="flex flex-col gap-space-3 text-center text-primary-leather ui-desktop:py-space-3">
      <div className="flex flex-col gap-1">
        <p className="type-heading-sm">
          {shapeLabel(stone.shape)}
          <span className="sr-only">: {stone.title}</span>
        </p>
        <p className="type-ui-xs-regular">{formatPrice(stone.price)}</p>
      </div>
      <StoneStats stone={stone} size={variant === "mobile" ? "sheet" : "card"} />
    </div>
  );
}

/** "0.63ct Diamond Info" (Figma 3565:99143 and 3565:99156): the ring builder's Diamond Info cards, one block per stone. */
export function PairDiamondInfo({ pair, idPrefix }: { pair: StonePair; idPrefix: string }) {
  return (
    <>
      {pair.stones.map((stone, index) => (
        <StoneInfoSection key={index} stone={stone} heading={text.diamondInfo(stone.carat.toFixed(2))} headingId={`${idPrefix}-${index + 1}`} caratNote={text.caratNote} mobileRow2="earrings" />
      ))}
    </>
  );
}

/**
 * The qualities after the page (desktop "Your Diamond's Qualities" 3565:99304, once: the two stones share their
 * grades; mobile "0.63ct Diamond Qualities" and "0.65ct Diamond Qualities", one block per stone in one section).
 */
export function PairQualities({ pair, desktop = true }: { pair: StonePair; /** Step 3's desktop frame draws no qualities. */ desktop?: boolean }) {
  return (
    <>
      {desktop ? (
        <div className="hidden ui-desktop:block">
          <StoneDetailQualities stone={pair.stones[0]} headingId="pair-qualities" />
        </div>
      ) : null}
      <section aria-label="Diamond qualities" className="flex flex-col gap-space-10 bg-secondary-skin py-space-11 ui-desktop:hidden">
        {pair.stones.map((stone, index) => (
          <StoneDetailQualities key={index} stone={stone} compact heading={text.qualities(stone.carat.toFixed(2))} headingId={`pair-qualities-${index + 1}`} />
        ))}
      </section>
    </>
  );
}

/**
 * Earrings builder Step 2, a pair's page (Figma desktop Custom Earrings - Stones Info 3565:99083, mobile 3587:127889).
 * Desktop: each stone's views and figures side by side in the left column, sticky under the header bar; on the
 * right the pair's title and price, Select These Diamonds and Remove, the ships line, the icon row, a Diamond Info
 * block per stone and the accordions. Mobile: one stone's views at a time, switched by the Diamond 1 / Diamond 2
 * tabs, then the same column. The earrings in the URL pass through to Step 3 and back to the list.
 */
export function PairDetail({ pair }: { pair: StonePair }) {
  const [search] = useQuery();
  const earrings = parseEarrings(new URLSearchParams(search));
  const [creditOpen, setCreditOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const complete = earringsCompleteHref({ ...earrings, shape: parseShape(pair.shape) ?? earrings.shape, stone: pair.handle });

  return (
    <div className="ui-desktop:site-container ui-desktop:grid ui-desktop:grid-cols-[minmax(0,718fr)_minmax(0,506fr)] ui-desktop:gap-space-6">
      <div className="hidden ui-desktop:block">
        <div className="sticky top-(--sticky-header-height) py-space-15 pr-space-6">
          {/* Two 323px stacks 24 apart: 670 of the 694px column. */}
          <div data-pair-gallery className="grid w-[calc(100%-var(--spacing-space-6))] grid-cols-2 gap-x-space-6">
            {pair.stones.map((stone, index) => (
              <div key={index} data-pair-stone={index + 1} className="flex flex-col gap-space-2">
                <PairStoneViews stone={stone} name={`${text.tabs[index]}: ${stone.title}`} variant="desktop" />
                <StoneCaption stone={stone} variant="desktop" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-space-4 ui-desktop:hidden">
        <PairStoneViews key={shown} stone={pair.stones[shown]} name={`${text.tabs[shown]}: ${pair.stones[shown].title}`} variant="mobile" />
        <StoneCaption stone={pair.stones[shown]} variant="mobile" />
        <Tabs label={text.tabsLabel} variant="line" size="sm" divider value={String(shown)} onChange={(id) => setShown(Number(id))} items={text.tabs.map((label, index) => ({ id: String(index), label }))} />
      </div>

      <div className="site-container flex flex-col gap-space-6 pt-space-5 pb-space-11 ui-desktop:gap-space-8 ui-desktop:px-0 ui-desktop:py-space-15">
        <div className="flex flex-col gap-space-4">
          {/* Mobile Figma titles this page with the setting's name, a placeholder: both breakpoints use the pair's title. */}
          <h1 className="type-heading-md text-primary-leather">{pair.title}</h1>
          <HeadingPrice price={pair.price} />
        </div>

        <div className="flex flex-col gap-space-4">
          <div className="flex flex-col gap-space-3 ui-desktop:gap-space-4">
            <ButtonLink href={complete} className="w-full">
              {text.selectThese}
            </ButtonLink>
            <ButtonLink href={pairsHref(earrings)} variant="secondary" className="w-full">
              {text.remove}
            </ButtonLink>
          </div>
          <InstallmentsLine price={pair.price} onLearnMore={() => setCreditOpen(true)} />
        </div>

        <ShipsAndIcons days={pair.shipsInDays} />

        <div className="flex flex-col gap-space-5 ui-desktop:gap-space-8">
          <PairDiamondInfo pair={pair} idPrefix="pair-info" />
          <Accordion>
            <AccordionItem question="Shipping" icon="truck" headingLevel={2}>
              {pdp.shipping(pair.shipsInDays).map((paragraph) => (
                <p key={paragraph}>{paragraph.replace("This piece", "This pair")}</p>
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

      <CreditModal open={creditOpen} onClose={() => setCreditOpen(false)} />
    </div>
  );
}
