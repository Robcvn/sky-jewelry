"use client";

import { useState } from "react";
import { CreditModal } from "@/components/bag/BagModals";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { IconBlock } from "@/components/ui/IconBlock";
import { DimensionsDiagram, InfoScale, ProductInfoCard } from "@/components/ui/ProductInfoCard";
import { builderContent, DIAMOND_SCALES, GEM_COLORS, GEM_TYPES, gradeLabel, shapeIcon } from "@/content/builder";
import { CLARITY_GRADES, COLOR_GRADES, CUT_GRADES } from "@/content/builder-grades";
import { productDetailContent } from "@/content/product-detail";
import { formatInstallment, formatPrice } from "@/content/products";
import type { Stone } from "@/lib/builder";
import { completeHref, parseRing, parseShape, stonesHref } from "./ring";
import { StoneCertificateTile, stoneKindLabel, StoneSizeGuideTile, StoneSpecsTile, STONE_DRAWING_BG, STONE_TILE_BG } from "./StoneDetailGallery";
import { StonePicture } from "./StonePicture";
import { useQuery } from "./useQuery";

const { stone: copy } = builderContent;
const pdp = productDetailContent;

/**
 * Where a grade's marker sits on Figma's Product Info Scale (0 to 1). Figma draws one example of each: Color I at
 * 66.8% of the white-to-peach bar, Clarity VVS2 at 55.1% of the speckled bar. The other grades step evenly from
 * there, the best grade nearest the clear end.
 */
const colorPosition = (grade: string) => 0.78 - Math.max(0, DIAMOND_SCALES.color.findIndex((item) => item.value === grade)) * 0.112;
const clarityPosition = (grade: string) => 0.94 - Math.max(0, DIAMOND_SCALES.clarity.findIndex((item) => item.value === grade)) * 0.13;

/** Mobile frame 3587:125941 words the weight "0.50 Carat"; desktop 3565:100742 "2.50ct". */
const mobileTitle = (title: string) => title.replace(/^(\d+(?:\.\d+)?)ct\b/, "$1 Carat");

/**
 * The stone's page, top part (Figma desktop Builder 2 - Stone Info 3565:100732, mobile 3587:125910): the image
 * tiles, the buying area and "Your Diamond Info" with the accordions. Each breakpoint follows its own frame:
 * desktop has a sticky 2 x 2 tile grid and no Remove Stone; mobile has the photo on top, Remove Stone, the ships
 * line, and the specs drawing and size guide as sections in the column.
 * The ring from the URL (?setting=&metal=&shape=) passes through to Complete Your Ring and Remove Stone.
 */
export function StoneDetail({ stone }: { stone: Stone }) {
  const [search] = useQuery();
  const ring = parseRing(new URLSearchParams(search));
  const [creditOpen, setCreditOpen] = useState(false);
  const diamond = stone.kind === "diamond";
  const icon = shapeIcon(stone.shape);
  const [dollar, amount] = [formatPrice(stone.price).slice(0, 1), formatPrice(stone.price).slice(1)];
  const complete = completeHref({ ...ring, shape: parseShape(stone.shape) ?? ring.shape, stone: stone.handle });
  const kindLabel = stoneKindLabel(stone);
  const photoBg = stone.image ? STONE_TILE_BG : STONE_DRAWING_BG;

  const sectionHeading = (title: string) => (
    <h2 className="type-heading-sm flex items-center gap-space-2 text-primary-leather ui-desktop:type-heading-md ui-desktop:gap-space-3">
      <Icon name={icon} size={24} className="ui-desktop:hidden" />
      <Icon name={icon} size={32} className="hidden ui-desktop:block" />
      {title}
    </h2>
  );

  return (
    <div className="ui-desktop:site-container ui-desktop:grid ui-desktop:grid-cols-[minmax(0,718fr)_minmax(0,506fr)] ui-desktop:gap-space-6">
      {/* Desktop: the tile grid, 694 of the 718 column (the images frame pads its right side 24px), sticky under the header bar. */}
      <div className="hidden ui-desktop:block">
        <div className="sticky top-(--sticky-header-height) py-space-15 pr-space-6">
          <div data-stone-gallery className="grid grid-cols-2 gap-space-3">
            <StoneSpecsTile stone={stone} />
            {/* Figma's 360° marker on this tile needs an image sequence, which no stone has: left out, as on Product Detail. */}
            <div data-stone-photo className={`relative aspect-square overflow-hidden rounded-4 ${photoBg}`}>
              <StonePicture stone={stone} priority sizes={{ desktop: "25vw", mobile: "100vw" }} />
            </div>
            {diamond ? <StoneSizeGuideTile /> : null}
            <StoneCertificateTile stone={stone} />
          </div>
        </div>
      </div>
      {/* Mobile: Figma "PDP - Asset Tabs" (3587:125937) with one photo and no tabs row. */}
      <div data-stone-photo className={`relative aspect-square w-full overflow-hidden ui-desktop:hidden ${photoBg}`}>
        <StonePicture stone={stone} priority sizes={{ desktop: "25vw", mobile: "100vw" }} />
      </div>

      <div className="site-container flex flex-col gap-space-6 pt-space-5 pb-space-11 ui-desktop:gap-space-8 ui-desktop:px-0 ui-desktop:py-space-15">
        <div className="flex flex-col gap-space-4">
          <h1 className="type-heading-md text-primary-leather">
            <span className="hidden ui-desktop:inline">{stone.title}</span>
            <span className="ui-desktop:hidden">{mobileTitle(stone.title)}</span>
          </h1>
          {/* Figma: the "$" in caps-xs centred beside the amount in caps-sm, 26px in all. */}
          <p className="flex text-primary-leather">
            <span className="type-heading-caps-xs flex flex-col justify-center">{dollar}</span>
            <span className="type-heading-caps-sm">{amount}</span>
          </p>
        </div>

        <div className="flex flex-col gap-space-4">
          <div className="flex flex-col gap-space-3">
            <ButtonLink href={complete} className="w-full">
              {copy.completeYourRing}
            </ButtonLink>
            {/* Mobile frame only: desktop draws no Remove Stone. */}
            <ButtonLink href={stonesHref(ring)} variant="secondary" className="w-full ui-desktop:hidden">
              {copy.removeStone}
            </ButtonLink>
          </div>
          <p className="type-body-xs-regular flex flex-wrap items-center justify-center gap-x-space-2 text-center text-primary-leather">
            <span>
              {builderContent.installments} <span className="font-medium">{formatInstallment(stone.price)}</span>
            </span>
            <button type="button" onClick={() => setCreditOpen(true)} className="type-overline-xs-link ui-transition cursor-pointer rounded-4 ui-hover:text-black-alpha-60">
              {builderContent.learnMore}
              <span className="sr-only">: payment plans</span>
            </button>
          </p>
        </div>

        {/* Mobile frame only. */}
        <p className="type-ui-xs-regular flex items-center justify-center gap-space-2 text-primary-leather ui-desktop:hidden">
          <Icon name="truck" size={24} />
          {pdp.labels.shipsIn(stone.shipsInDays)}
        </p>

        <ul className="flex gap-space-2">
          {pdp.iconRow.map((item) => (
            <li key={item._key} className="flex flex-1">
              <IconBlock icon={item.icon} label={item.label} lines={item.lines} />
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-space-5 ui-desktop:gap-space-8">
          {/* Mobile: the specs drawing and the size guide are sections of the column; on desktop they are gallery tiles. */}
          <section aria-labelledby="stone-specs" className="flex flex-col gap-space-5 border-t border-secondary-gold pt-[calc(var(--spacing-space-5)-1px)] ui-desktop:hidden">
            <div id="stone-specs">{sectionHeading(diamond ? copy.diamondSpecs : copy.stoneSpecs)}</div>
            <StoneSpecsTile stone={stone} />
          </section>
          {diamond ? (
            <section aria-labelledby="stone-size-guide" className="flex flex-col gap-space-5 border-t border-secondary-gold pt-[calc(var(--spacing-space-5)-1px)] ui-desktop:hidden">
              <div id="stone-size-guide">{sectionHeading(copy.sizeGuide)}</div>
              <StoneSizeGuideTile />
            </section>
          ) : null}

          <section aria-labelledby="stone-info" className="flex flex-col gap-space-5 border-t border-secondary-gold pt-[calc(var(--spacing-space-5)-1px)] ui-desktop:gap-space-8 ui-desktop:pt-[calc(var(--spacing-space-8)-1px)]">
            <div id="stone-info">{sectionHeading(diamond ? copy.diamondInfo : copy.stoneInfo)}</div>
            {/* Figma: 171px cards 8 apart on mobile, 245px cards 16 apart on desktop, each with its own height. */}
            <div data-stone-info-grid className="grid grid-cols-2 items-start gap-space-2 ui-desktop:gap-space-4">
              <ProductInfoCard label="Carat" value={stone.carat.toFixed(2)} note={pdp.caratNote.single} spread className="h-[8.5rem] ui-desktop:h-[9.375rem]" />
              {diamond ? (
                <ProductInfoCard label="Color" value={stone.color} note={COLOR_GRADES[stone.color]?.short} className="min-h-[8.5rem] ui-desktop:min-h-0">
                  <InfoScale kind="color" position={colorPosition(stone.color)} label={`Color ${stone.color} on a scale from colorless to tinted`} />
                </ProductInfoCard>
              ) : (
                <ProductInfoCard
                  label="Color"
                  value={GEM_COLORS.find((item) => item.value === stone.color)?.label ?? stone.color}
                  note={GEM_TYPES.find((item) => item.value === stone.gem)?.label}
                  spread
                  className="h-[8.5rem] ui-desktop:h-[9.375rem]"
                />
              )}
              {diamond ? (
                <ProductInfoCard label="Clarity" value={stone.clarity} note={CLARITY_GRADES[stone.clarity]?.short} className="min-h-[10.25rem] ui-desktop:min-h-0">
                  <InfoScale kind="clarity" position={clarityPosition(stone.clarity)} label={`Clarity ${stone.clarity} on a scale from flawless to included`} />
                </ProductInfoCard>
              ) : (
                <ProductInfoCard label="Clarity" value={stone.clarity} className="h-[10.25rem] ui-desktop:h-[10.375rem]" />
              )}
              <ProductInfoCard
                label="Dimensions (mm)"
                value={`${stone.length.toFixed(2)} × ${stone.width.toFixed(2)}`}
                note={
                  <span className="block text-right">
                    {copy.ratio}: {stone.ratio.toFixed(2)}
                  </span>
                }
                spread
                className="h-[10.25rem] ui-desktop:h-[10.375rem]"
              >
                {/* Figma's ruler drawing is of a round stone: shown for round stones, between the value and the ratio. */}
                {stone.shape === "round" ? (
                  <span className="block pt-space-3 ui-desktop:pt-1.5">
                    <DimensionsDiagram />
                  </span>
                ) : null}
              </ProductInfoCard>
              <ProductInfoCard
                label="Cut"
                value={diamond ? gradeLabel(DIAMOND_SCALES.cut, stone.cut) : stone.cut}
                note={diamond ? CUT_GRADES[stone.cut]?.short : undefined}
                spread
                className="h-[9.75rem] ui-desktop:h-[10.625rem]"
              />
              <ProductInfoCard
                label="Certification"
                value={stone.certificate}
                // View Certificate needs a certificate file per stone, which the catalogue doesn't have: shown, not linked.
                note={<span className="underline decoration-black-alpha-25 underline-offset-2 ui-desktop:font-medium">{copy.viewCertificate}</span>}
                className="min-h-36"
              >
                {/* Figma draws the GIA seal here; labs are shown by icon and name (see StoneCertificateTile). */}
                <span className="type-ui-sm-medium flex items-center gap-space-2">
                  <Icon name="certificate" size={32} className="shrink-0" />
                  <span>{kindLabel}</span>
                </span>
              </ProductInfoCard>
            </div>
          </section>
        </div>

        <Accordion>
          <AccordionItem question="Shipping" icon="truck" headingLevel={2}>
            {pdp.shipping(stone.shipsInDays).map((paragraph) => (
              <p key={paragraph}>{paragraph.replace("This piece", "This stone")}</p>
            ))}
          </AccordionItem>
          <AccordionItem question="Return Policy" icon="package" headingLevel={2}>
            {pdp.returns.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </AccordionItem>
        </Accordion>
      </div>

      <CreditModal open={creditOpen} onClose={() => setCreditOpen(false)} />
    </div>
  );
}
