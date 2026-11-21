/*
 * Content types for the category landing pages, shaped like Sanity documents: a "landingPage" with an ordered
 * list of sections, each with a _type and _key. Home section types are reused as they are; the types below are
 * the sections that first appear on the landing pages (Figma desktop 3565:97085 ... 3565:97781).
 */
import type { ImageRef } from "@/components/ui/Picture";
import type { RichSpan } from "@/components/ui/RichText";
import type { Cta, HomeSection } from "@/content/home";
import type { ButtonCardContent } from "@/content/product-detail";
import type { IconName } from "@/icons/icon-data";

/** Figma "CTA Callout" (CTA Banner page 3313:21461): an ivory promo band under the hero. */
export type CtaCallout = {
  _type: "ctaCallout";
  _key: string;
  eyebrow: string;
  title: string;
  cta: Cta;
};

/** Product Card - Summary tiles (no product data): shapes, colours, styles, metals, birthstones. */
export type TileCarousel = {
  _type: "tileCarousel";
  _key: string;
  overline?: string;
  heading: RichSpan[];
  /** "carousel": arrows on desktop, swipe on mobile. "grid": a static 4-up row on desktop (the metal rows). */
  layout: "carousel" | "grid";
  /** An item with no href is drawn but not a link (no page matches it yet; Held for review). */
  items: Array<{ _key: string; title: string; body?: string; priceLabel?: string; href?: string; image: ImageRef }>;
};

/** "Sky Jewelry Guarantee": a heading and five Icon Blocks with a title and a line of text. */
export type GuaranteeIcons = {
  _type: "guaranteeIcons";
  _key: string;
  overline: string;
  heading: RichSpan[];
  items: Array<{ _key: string; icon: IconName; title: string; body: string }>;
};

/** A row of four Feature Cards, with or without a heading. */
export type FeatureCardRow = {
  _type: "featureCardRow";
  _key: string;
  /** Without a visible heading the section gets this as a visually hidden one. */
  heading?: RichSpan[];
  srHeading?: string;
  body?: string;
  /** Mobile: a swipe row of 288 x 360 cards, or a 2 x 2 grid of title-only cards. */
  mobile: "carousel" | "grid";
  /** Cards with a body line use Figma's 16px desktop caption padding. */
  compact?: boolean;
  ctaLabel: string;
  cards: Array<{ _key: string; title: string; body?: string; href: string; image: ImageRef }>;
};

/** Best sellers: rows of real products (Shopify handles), each with an optional row title. */
export type BestSellers = {
  _type: "bestSellers";
  _key: string;
  overline?: string;
  heading: RichSpan[];
  rows: Array<{ _key: string; title?: string; handles: string[] }>;
};

/** Two Button Cards, with or without a section heading. */
export type ButtonCardPair = {
  _type: "buttonCardPair";
  _key: string;
  overline?: string;
  heading?: RichSpan[];
  /** Accessible name when there is no heading. */
  label?: string;
  cards: ButtonCardContent[];
};

/** Diamonds only: photo beside a heading, body and numbered steps. */
export type DiamondInspection = {
  _type: "diamondInspection";
  _key: string;
  heading: RichSpan[];
  body: string;
  steps: string[];
  cta: Cta & { context: string };
  image: ImageRef;
};

export type LandingSection = HomeSection | CtaCallout | TileCarousel | GuaranteeIcons | FeatureCardRow | BestSellers | ButtonCardPair | DiamondInspection;

/** A section shown on one breakpoint only (Figma draws it on one frame only). */
export type PageSection = LandingSection & { only?: "desktop" | "mobile" };

export type LandingPage = {
  _type: "landingPage";
  slug: string;
  seo: { title: string; description: string };
  sections: PageSection[];
};
