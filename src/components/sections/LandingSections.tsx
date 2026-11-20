import { ButtonLink } from "@/components/ui/Button";
import { ButtonCard } from "@/components/ui/ButtonCard";
import { Carousel } from "@/components/ui/Carousel";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { IconBlock } from "@/components/ui/IconBlock";
import { Picture } from "@/components/ui/Picture";
import { ProductCardSummary } from "@/components/ui/ProductCardSummary";
import { RichText, plainText } from "@/components/ui/RichText";
import { LANDING_BUTTON, SECTION_HEADING, SECTION_HEADING_EM } from "@/components/home/styles";
import type { ButtonCardPair, CtaCallout, DiamondInspection, FeatureCardRow, GuaranteeIcons, TileCarousel } from "@/content/landing/types";
import { CARD_ITEM, CARD_W, LANDING_SECTION, SectionHeading } from "./SectionHeading";

/**
 * Figma "CTA Callout" (CTA Banner page 3313:21461) as drawn on the landing pages: an ivory band with a hazel
 * eyebrow, a title and a secondary SHOP NOW button. Mobile is the Design System's Mobile variant (62px, 18/22
 * title, XS button); desktop follows the landing frames' larger, detached copy (110px, 36/40 title, MD button).
 */
export function CtaCalloutSection({ content }: { content: CtaCallout }) {
  return (
    <aside aria-label={content.eyebrow} className="bg-secondary-ivory">
      <div className="site-container flex items-center justify-between gap-space-4 py-space-3 text-primary-leather ui-desktop:py-space-6">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 ui-desktop:max-w-[35.5rem] ui-desktop:gap-space-2">
          <p className="type-overline-xs-medium text-primary-hazel">{content.eyebrow}</p>
          <p className="type-heading-xs ui-desktop:type-heading-lg">{content.title}</p>
        </div>
        {/* The Button's own inline-flex would beat `hidden`, so a wrapper switches the two sizes. */}
        <span className="shrink-0 ui-desktop:hidden">
          <ButtonLink href={content.cta.href} variant="secondary" size="xs">
            {content.cta.label}
            <span className="sr-only">: {content.title}</span>
          </ButtonLink>
        </span>
        <span className="hidden shrink-0 ui-desktop:block">
          <ButtonLink href={content.cta.href} variant="secondary" size="md" className="min-w-40">
            {content.cta.label}
            <span className="sr-only">: {content.title}</span>
          </ButtonLink>
        </span>
      </div>
    </aside>
  );
}

/**
 * Product Card - Summary tiles linking to a filter (shapes, colours, styles, metals, birthstones).
 * "carousel": arrows on desktop, swipe and scrollbar on mobile. "grid": static 4-up on desktop (metal rows).
 */
export function TileCarouselSection({ content }: { content: TileCarousel }) {
  const headingId = `${content._key}-heading`;
  return (
    <section aria-labelledby={headingId} className={LANDING_SECTION}>
      <SectionHeading id={headingId} overline={content.overline} heading={content.heading} />
      <Carousel
        label={plainText(content.heading)}
        desktop={content.layout === "grid" ? "grid" : "carousel"}
        gridClassName="ui-desktop:grid-cols-4 ui-desktop:gap-space-6"
        itemClassName={content.layout === "grid" ? "w-[18.125rem] ui-desktop:w-auto" : CARD_ITEM}
        arrowTop={`calc(${CARD_W} / 2)`}
        items={content.items.map((item) => ({
          key: item._key,
          node: (
            <ProductCardSummary
              name={item.title}
              body={item.body}
              priceLabel={item.priceLabel}
              href={item.href}
              image={item.image}
              sizes={{ desktop: "calc(25vw - 66px)", mobile: "290px" }}
            />
          ),
        }))}
      />
    </section>
  );
}

/** "Sky Jewelry Guarantee": five Icon Blocks with a title and a line, in a row (desktop) or stacked rows (mobile). */
export function GuaranteeIconsSection({ content }: { content: GuaranteeIcons }) {
  const headingId = `${content._key}-heading`;
  return (
    <section aria-labelledby={headingId} className={`bg-secondary-skin ${LANDING_SECTION}`}>
      {/* Figma's mobile overline here is 12/16 (overline-sm) on both breakpoints. */}
      <SectionHeading id={headingId} overline={content.overline} heading={content.heading} overlineSize="sm" />
      <ul className="site-container flex flex-col items-center gap-space-6 ui-desktop:flex-row ui-desktop:items-start">
        {content.items.map((item) => (
          <li key={item._key} className="flex w-full max-w-[21.875rem] flex-1 ui-desktop:max-w-none">
            {/* Figma strokes these icons in primary/hazel (#746345), lighter than the text. */}
            <IconBlock icon={item.icon} label={item.title} body={item.body} layout="row-on-mobile" asHeading iconClassName="text-primary-hazel" />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** A row of four Feature Cards: static on desktop; a swipe row or a 2 x 2 title-only grid on mobile. */
export function FeatureCardRowSection({ content }: { content: FeatureCardRow }) {
  const headingId = `${content._key}-heading`;
  const card = (item: FeatureCardRow["cards"][number], className: string) => (
    <FeatureCard
      title={item.title}
      body={item.body}
      ctaLabel={content.ctaLabel}
      href={item.href}
      image={item.image}
      compact={content.compact}
      ctaOnMobile={content.mobile === "carousel"}
      sizes={{ desktop: "calc(25vw - 66px)", mobile: content.mobile === "carousel" ? "288px" : "calc(50vw - 24px)" }}
      className={className}
    />
  );
  return (
    <section aria-labelledby={headingId} className={LANDING_SECTION}>
      {content.heading ? (
        <SectionHeading id={headingId} heading={content.heading} body={content.body} />
      ) : (
        <h2 id={headingId} className="sr-only">
          {content.srHeading}
        </h2>
      )}
      {content.mobile === "carousel" ? (
        <Carousel
          label={content.heading ? plainText(content.heading) : (content.srHeading ?? "")}
          desktop="grid"
          gridClassName="ui-desktop:grid-cols-4 ui-desktop:gap-space-6"
          itemClassName="w-[18rem] ui-desktop:w-auto"
          items={content.cards.map((item) => ({ key: item._key, node: card(item, "aspect-[288/360] ui-desktop:aspect-[294/367]") }))}
        />
      ) : (
        <ul className="site-container grid grid-cols-2 gap-space-2 ui-desktop:grid-cols-4 ui-desktop:gap-space-6">
          {content.cards.map((item) => (
            <li key={item._key} className="flex">
              {card(item, "aspect-[171/214] w-full ui-desktop:aspect-[294/367]")}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Two Button Cards, with the standard heading block or (without one) an accessible name and h2 card titles. */
export function ButtonCardPairSection({ content }: { content: ButtonCardPair }) {
  const headingId = `${content._key}-heading`;
  const headed = Boolean(content.heading);
  return (
    <section
      aria-labelledby={headed ? headingId : undefined}
      aria-label={headed ? undefined : content.label}
      className={headed ? LANDING_SECTION : "py-space-11 ui-desktop:py-space-15"}
    >
      {content.heading ? <SectionHeading id={headingId} overline={content.overline} heading={content.heading} /> : null}
      <div className="site-container grid gap-space-6 ui-desktop:grid-cols-2">
        {content.cards.map((card) => (
          <ButtonCard
            key={card._key}
            title={card.title}
            body={card.body}
            cta={card.cta}
            image={card.image}
            headingLevel={headed ? 3 : 2}
            // Figma: 30% on the headed landing pairs; the headless pair is the product page pair (50% on mobile).
            mobileOverlay={headed ? "soft" : "strong"}
            sizes={{ desktop: "42.5vw", mobile: "calc(100vw - 2.5rem)" }}
            className="aspect-[350/438] ui-desktop:aspect-[612/500]"
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Diamonds "Diamond Inspection and Quality": the About layout with the photo on the left (desktop), plus three
 * numbered steps between the body and the button.
 */
export function DiamondInspectionSection({ content }: { content: DiamondInspection }) {
  const headingId = `${content._key}-heading`;
  return (
    <section
      aria-labelledby={headingId}
      className="site-container flex flex-col gap-space-6 py-space-11 text-primary-leather ui-desktop:flex-row ui-desktop:items-center ui-desktop:gap-space-17 ui-desktop:py-space-15"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-4 bg-secondary-ivory ui-desktop:w-[49.04%] ui-desktop:shrink-0">
        <Picture image={content.image} sizes={{ desktop: "calc(49vw - 94px)", mobile: "calc(100vw - 40px)" }} className="absolute inset-0 size-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col items-start gap-space-4 ui-desktop:gap-space-6 ui-desktop:py-space-10">
        <div className="flex flex-col gap-space-4">
          <h2 id={headingId} className={`whitespace-pre-line ${SECTION_HEADING}`}>
            <RichText value={content.heading} emClassName={SECTION_HEADING_EM} />
          </h2>
          <p className="type-body-sm-regular ui-desktop:type-body-md-regular">{content.body}</p>
        </div>
        {/* Figma 3565:97438 / 3587:123850: 48px circles, 32px apart on desktop and 16px on mobile, each step's text centred
            on its circle; 40px above the first circle and 48px below the last on desktop, 24 and 32 on mobile. */}
        <ol className="flex flex-col gap-space-4 self-stretch py-space-2 ui-desktop:gap-space-8 ui-desktop:py-space-4">
          {content.steps.map((step, index) => (
            <li key={step} className="flex items-center gap-space-4">
              <span aria-hidden="true" className="type-heading-caps-md flex size-space-11 shrink-0 items-center justify-center rounded-full border border-secondary-gold pb-0.5">
                {index + 1}
              </span>
              <span className="type-body-sm-medium flex-1 ui-desktop:type-body-md-medium">{step}</span>
            </li>
          ))}
        </ol>
        <div className="pt-space-2">
          <ButtonLink href={content.cta.href} variant="secondary" size="responsive" className={LANDING_BUTTON}>
            {content.cta.label}
            <span className="sr-only">: {content.cta.context}</span>
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

