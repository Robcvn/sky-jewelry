/*
 * Copy and SAMPLE DATA for the Product Detail page (Figma desktop 3565:98309, mobile 3587:127126).
 * Shaped like Sanity documents so it can move into a schema later.
 *
 * Product data comes from Shopify (title, price, options, photos, tags). Where the design shows values the
 * catalogue has no source for, the sample values below are used, all in this one file:
 *   - metal composition (Pendant Info chart),
 *   - diamond grades (colour, clarity, cut) and the grading lab,
 *   - stone dimensions (worked out from carat weight and shape),
 *   - the grade descriptions, What's in the Box, the closing cards, and the Shipping / Return Policy text.
 * Figma's own values disagree with each other (J / I, SI1 / VVS2 / VS1); the sample grades use the
 * "Your Diamond's Qualities" values (I, VVS2, Excellent) so the page is consistent.
 */
import type { IconName } from "@/components/ui/Icon";
import { span, type RichSpan } from "@/components/ui/RichText";
import type { ImageRef } from "@/components/ui/Picture";
import type { DiamondType } from "./catalog-seed";
import type { MetalId } from "./metals";

export type CompositionPart = { label: string; percent: number; swatch: string };

const GOLD = "#e0d06b";
const COPPER = "#fdb2a1";
const SILVER = "#e5e7eb";
const ZINC = "#dadada";
const NICKEL = "#c6c6c6";

/** SAMPLE: typical alloys by weight. Figma's chart (37% gold for 14K) is placeholder data. */
export const metalComposition: Record<MetalId, CompositionPart[]> = {
  "14k-yellow-gold": [
    { label: "Gold", percent: 58.5, swatch: GOLD },
    { label: "Silver", percent: 21.5, swatch: SILVER },
    { label: "Copper", percent: 16, swatch: COPPER },
    { label: "Zinc", percent: 4, swatch: ZINC },
  ],
  "14k-white-gold": [
    { label: "Gold", percent: 58.5, swatch: GOLD },
    { label: "Copper", percent: 23, swatch: COPPER },
    { label: "Nickel", percent: 12, swatch: NICKEL },
    { label: "Zinc", percent: 6.5, swatch: ZINC },
  ],
  "14k-rose-gold": [
    { label: "Gold", percent: 58.5, swatch: GOLD },
    { label: "Copper", percent: 32, swatch: COPPER },
    { label: "Silver", percent: 9.5, swatch: SILVER },
  ],
  "18k-yellow-gold": [
    { label: "Gold", percent: 75, swatch: GOLD },
    { label: "Silver", percent: 15, swatch: SILVER },
    { label: "Copper", percent: 10, swatch: COPPER },
  ],
  "18k-white-gold": [
    { label: "Gold", percent: 75, swatch: GOLD },
    { label: "Copper", percent: 13, swatch: COPPER },
    { label: "Nickel", percent: 8, swatch: NICKEL },
    { label: "Zinc", percent: 4, swatch: ZINC },
  ],
  "18k-rose-gold": [
    { label: "Gold", percent: 75, swatch: GOLD },
    { label: "Copper", percent: 22.5, swatch: COPPER },
    { label: "Silver", percent: 2.5, swatch: SILVER },
  ],
  platinum: [
    { label: "Platinum", percent: 95, swatch: SILVER },
    { label: "Ruthenium", percent: 5, swatch: NICKEL },
  ],
};

export type DiamondGrades = { color: string; clarity: string; cut: string; lab: string };

/** SAMPLE: grades for every diamond in the catalogue (Figma's "Your Diamond's Qualities" values). */
export const sampleDiamondGrades: Record<DiamondType, DiamondGrades> = {
  natural: { color: "I", clarity: "VVS2", cut: "Excellent", lab: "GIA" },
  "lab-grown": { color: "I", clarity: "VVS2", cut: "Excellent", lab: "GIA" },
};

/** SAMPLE: gemstone colour, by product style. */
export const sampleGemstoneColor = "Blue";

/**
 * SAMPLE: stone size from carat weight. Width of a 1 carat stone in mm, and length-to-width ratio, by shape;
 * the size scales with the cube root of the weight.
 */
export const shapeDimensions: Record<string, { widthAt1ct: number; ratio: number }> = {
  round: { widthAt1ct: 6.5, ratio: 1 },
  oval: { widthAt1ct: 5.7, ratio: 1.4 },
  emerald: { widthAt1ct: 5.5, ratio: 1.35 },
};

export type Grade = { value: string; label: string; description: string };

/**
 * Grade scales from Figma's "Your Diamond's Qualities" (Clarity uses the mobile scale, SI2 to FL). Each drawing's
 * height is a percentage of its panel (198px desktop, 144px mobile) as each frame draws it, centred.
 */
export const gradeScales = {
  color: {
    title: "Color",
    illustration: { src: "/images/pdp/quality-color-diamond.svg", height: { mobile: 89.2, desktop: 100 } },
    options: ["J", "I", "H", "G", "F", "E", "D"],
    /** Short descriptor for the Stone Info card, and the full description for the Qualities card. */
    grades: {
      I: {
        short: "Nearly colorless",
        description:
          "These diamonds are considered nearly colorless, with any slight tint being difficult to detect. They offer excellent value, making them a smart choice for those seeking larger stones at more affordable prices.",
      },
    } as Record<string, { short: string; description: string }>,
  },
  clarity: {
    title: "Clarity",
    illustration: { src: "/images/pdp/quality-clarity-diamond.svg", height: { mobile: 86.1, desktop: 76.8 } },
    options: ["SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "IF", "FL"],
    grades: {
      VVS2: {
        short: "Inclusions are extremely difficult to see",
        description:
          "Very, Very Slightly Included: Inclusions exist but are extremely difficult to detect, even under 10x magnification.",
      },
    } as Record<string, { short: string; description: string }>,
  },
  cut: {
    title: "Cut",
    illustration: { src: "/images/pdp/quality-cut-diamond.svg", height: { mobile: 93.1, desktop: 100 } },
    options: ["Good", "Very Good", "Excellent"],
    grades: {
      Excellent: { short: "Exceptional fire and brilliance", description: "Exceptional fire, brilliance, and precise diamond craftsmanship." },
    } as Record<string, { short: string; description: string }>,
  },
};

export type IconBlockItem = { _key: string; icon: IconName; label: string; /** Desktop line break, as in Figma. */ lines: [string, string] };

export type BoxItem = { _key: string; image: ImageRef; caption: string; width: "narrow" | "wide" };

export type ButtonCardContent = {
  _key: string;
  title: string;
  body: string;
  /** inert: shown as designed but not a link, when there is nothing to connect to yet (send a text). */
  cta: { label: string; href: string; inert?: boolean };
  image: ImageRef;
};

export const productDetailContent = {
  _type: "productDetailPage" as const,
  labels: {
    carat: "Carat Weight",
    metal: "Metal",
    stone: "Stone",
    back: "Back",
    more: "More",
    less: "Less",
    secureCheckout: "Secure Checkout",
    addToBag: "Add to Bag",
    installments: "Pay in 12 interest free payments of",
    learnMore: "Learn more",
    dropHint: "Drop a hint",
    shipsIn: (days: number) => `Ships in ${days} ${days === 1 ? "day" : "days"}`,
    info: "Info",
    stoneInfo: "Stone Info",
    details: "Details",
    centerStone: "Center Stone",
    stones: "Stones",
    viewCertificate: "View Certificate",
    ratio: "Ratio",
    images: "Images",
    view360: "360° View",
    showStone: "Show the stone",
    showSetting: "Show the piece",
  },
  iconRow: [
    { _key: "shipping", icon: "truck", label: "Overnight Shipping", lines: ["Overnight", "Shipping"] },
    { _key: "warranty", icon: "seal-check", label: "Lifetime Warranty", lines: ["Lifetime", "Warranty"] },
    { _key: "returns", icon: "package", label: "30 Days Free Return", lines: ["30 Days", "Free Return"] },
    { _key: "certificate", icon: "certificate", label: "Certificate & Appraisal", lines: ["Certificate &", "Appraisal"] },
  ] satisfies IconBlockItem[],
  metalNote: "Percentages by weight.",
  caratNote: {
    single: "The weight of the center stone.",
    pair: "The total weight of both stones.",
    line: "The total weight of all the stones.",
  },
  /** Shipping and Return Policy say only what the page's icon row already states. */
  shipping: (days: number) => [
    `This piece ships in ${days} ${days === 1 ? "day" : "days"}, with overnight shipping.`,
  ],
  returns: ["Returns are free within 30 days.", "Every piece comes with a lifetime warranty, and a certificate and appraisal."],
  qualitiesHeading: [span("Your Diamond’s Qualities")] as RichSpan[],
  box: {
    heading: [span("What’s in "), span("the", true), span(" Box")] as RichSpan[],
    items: [
      {
        _key: "sleeve",
        width: "narrow",
        caption: "A gift sleeve for your certificate and appraisal.",
        image: { desktop: "box-gift-sleeve-d", mobile: "box-gift-sleeve-m", alt: "Blue gift sleeve with a printed card, on linen" },
      },
      {
        _key: "ring-box",
        width: "wide",
        caption: "A presentation box for your piece.",
        image: { desktop: "box-ring-box-d", mobile: "box-ring-box-m", alt: "Open green presentation box holding a ring" },
      },
      {
        _key: "piece",
        width: "narrow",
        caption: "Your piece, cleaned and polished.",
        image: { desktop: "box-halo-ring-d", mobile: "box-halo-ring-m", alt: "Rose gold halo ring on a cream surface" },
      },
      {
        _key: "card",
        width: "wide",
        caption: "Ready to give.",
        image: { desktop: "box-invitation-d", mobile: "box-invitation-m", alt: "Two rings resting on a wedding invitation" },
      },
    ] satisfies BoxItem[],
  },
  buttonCards: [
    {
      _key: "questions",
      title: "Have Questions?",
      body: "Ask us about sizing, metals or stones before you order.",
      // Nothing to connect a text message to yet: shown as designed, inert.
      cta: { label: "Send us a text", href: "/contact/", inert: true },
      image: { desktop: "card-questions-d", mobile: "card-questions-m", alt: "Two hands held together, one wearing an engagement ring" },
    },
    {
      _key: "guarantee",
      title: "The Sky Guarantee",
      body: "Read what the Sky Guarantee covers.",
      cta: { label: "Learn More", href: "/the-sky-guarantee/" },
      image: { desktop: "card-guarantee-d", mobile: "card-guarantee-m", alt: "Hand wearing a gold signet ring" },
    },
  ] satisfies ButtonCardContent[],
};
