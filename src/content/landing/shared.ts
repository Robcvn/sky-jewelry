/*
 * Content shared by several landing pages. Sections that are identical to Home's in Figma (Design Your Own,
 * Customer Stories, Reviews, the Sky Guarantee module, FAQs) reuse Home's content, which already replaces
 * Figma's placeholders.
 *
 * Links: the landing pages' shop links lead to the lists that exist, with the filter in the address
 * (src/content/links.ts): the ring builder's settings list, the stone-first stone list, and the Fine Jewelry lists.
 */
import { CLAIMS } from "../support";
import { em, span } from "@/components/ui/RichText";
import { homePage, type HeroModule, type HomeSection } from "@/content/home";
import { productDetailContent } from "@/content/product-detail";
import type { ButtonCardPair, CtaCallout, GuaranteeIcons, TileCarousel } from "./types";

/** A Home section by its _key, so landing pages reuse it exactly. */
export function homeSection<T extends HomeSection["_type"]>(type: T, key: string): Extract<HomeSection, { _type: T }> {
  const section = homePage.sections.find((item) => item._type === type && item._key === key);
  if (!section) throw new Error(`Home has no ${type} section "${key}"`);
  return section as Extract<HomeSection, { _type: T }>;
}

export const designYourOwn = () => homeSection("designYourOwn", "design-your-own");
export const customerStories = () => homeSection("customerStories", "stories");
/** Reviews, FAQs and the guarantee module as the landing frames space them on mobile (see `landing` on each type). */
export const reviews = () => ({ ...homeSection("reviews", "reviews"), landing: true });
export const faqs = () => ({ ...homeSection("faqs", "faqs"), landing: true });

/**
 * Home's "the Sky Guarantee" module; flushTop where Figma butts it against the Reviews band. The Engagement Rings
 * mobile frame (3587:123662) crops the photo tighter than Home's (3587:124706), so the landing copy has its own
 * mobile image; desktop is the same crop on both.
 */
export const guaranteeModule = (flushTop?: HeroModule["flushTop"]): HeroModule => {
  const home = homeSection("heroModule", "guarantee");
  // Its mobile card also has 12px from title to body (Home's has 20; Consult and Moissanite 20).
  return { ...home, flushTop, landing: true, mobileTitleGap: "tight", image: { ...home.image, mobile: "guarantee-er-m" } };
};

/**
 * "Consult with our Experts". Figma's button starts a live chat, which has nothing to connect to: shown as
 * designed but inert (see the report). Body: Figma's is Latin filler.
 */
export const consultModule = (key: string, flushTop?: HeroModule["flushTop"]): HeroModule => ({
  _type: "heroModule",
  _key: key,
  flushTop,
  landing: true,
  inert: true,
  heading: [span("Consult "), em("with"), span(" our Experts")],
  body: "Questions about settings, stones or sizing? Talk to us before you choose.",
  cta: { label: "Start a live chat", href: "", context: "live chat" },
  image: { desktop: "module-consult-d", mobile: "module-consult-m", alt: "Two people at a marble table trying on gold rings" },
});

/** The promo band. Figma's eyebrow is the placeholder "Promo Eyebrow". */
export const ctaCallout = (key: string, title: string, href: string): CtaCallout => ({
  _type: "ctaCallout",
  _key: key,
  eyebrow: "Sale",
  title,
  cta: { label: "Shop Now", href },
});

/** "Shop by Metal Type": identical on Engagement Rings, Wedding Bands and Fine Jewelry; links to `base?metal=`. */
export const metalRow = (key: string, href: (metal: string) => string): TileCarousel => ({
  _type: "tileCarousel",
  _key: key,
  layout: "grid",
  overline: "Shine in Your Style",
  heading: [span("Shop "), em("by"), span(" Metal Type")],
  items: [
    { _key: "white-gold", title: "White Gold", href: href("white-gold"), image: { desktop: "product-ring-vine-white-gold", alt: "Vine ring in white gold" } },
    { _key: "yellow-gold", title: "Yellow Gold", href: href("yellow-gold"), image: { desktop: "product-ring-vine-yellow-gold", alt: "Vine ring in yellow gold" } },
    { _key: "rose-gold", title: "Rose Gold", href: href("rose-gold"), image: { desktop: "product-ring-vine-rose-gold", alt: "Vine ring in rose gold" } },
    // Figma reuses the white gold photo for Platinum (no platinum photo exists).
    { _key: "platinum", title: "Platinum", href: href("platinum"), image: { desktop: "product-ring-vine-white-gold", alt: "Vine ring in a white metal" } },
  ],
});

/** Loose diamond shape tiles (Figma has photos of five shapes). */
export const diamondShapes = (href: (shape: string) => string): TileCarousel["items"] =>
  (
    [
      ["round", "Round", "A circular brilliant cut."],
      ["cushion", "Cushion", "A square cut with rounded corners."],
      ["emerald", "Emerald", "A rectangular step cut."],
      ["radiant", "Radiant", "A rectangle with trimmed corners."],
      ["marquise", "Marquise", "A long shape with pointed ends."],
    ] as const
  ).map(([slug, title, body]) => ({
    _key: slug,
    title,
    body,
    href: href(slug),
    image: { desktop: `shape-${slug}-sq` as const, alt: `${title} diamond` },
  }));

/** Coloured diamond tiles (also used, as Figma does, for gemstone colours). A null href draws the tile without a link. */
export const colorTiles = (href: (color: string) => string | null, noun: string): TileCarousel["items"] =>
  (
    [
      ["yellow", "Yellow", "Yellow cushion-cut stone"],
      ["pink", "Pink", "Pink asscher-cut stone"],
      ["purple", "Purple", "Purple pear-shaped stone"],
      ["blue", "Blue", "Blue oval stone"],
      ["red", "Red", "Red oval stone"],
    ] as const
  ).map(([slug, title, alt]) => ({
    _key: slug,
    title,
    body: `${title} ${noun}.`,
    ...(href(slug) ? { href: href(slug)! } : {}),
    image: { desktop: `color-${slug}-sq` as const, alt },
  }));

/**
 * "Sky Jewelry Guarantee" (Wedding Bands, Diamonds, Gemstones, Education Center, Blog). Figma's bodies are Latin: each
 * line repeats a claim the design states elsewhere, or is neutral (sources in src/content/support.ts CLAIMS).
 */
export const guaranteeIcons = (key: string): GuaranteeIcons => ({
  _type: "guaranteeIcons",
  _key: key,
  overline: "Our Promise of Perfection",
  heading: [span("Sky Jewelry Guarantee")],
  items: [
    { _key: "warranty", icon: "warranty", title: "Lifetime Warranty", body: CLAIMS.lifetimeWarranty.text },
    { _key: "shipping", icon: "truck", title: "Free Shipping", body: CLAIMS.freeShipping.text },
    { _key: "money-back", icon: "money-back-guarantee", title: "Money Back Guarantee", body: CLAIMS.freeReturns.text },
    { _key: "experts", icon: "diamond-experts", title: "Diamond Experts", body: CLAIMS.experts.text },
    { _key: "conflict-free", icon: "natural-diamond", title: "Certified Conflict-Free", body: CLAIMS.guarantee.text },
  ],
});

/** The product page's closing pair ("Have Questions?" / "The Sky Guarantee"), headless. */
export const closingCards = (key: string): ButtonCardPair => ({
  _type: "buttonCardPair",
  _key: key,
  label: "More from Sky Jewelry",
  // "Send us a text" is inert (nothing to connect to), as on the product page.
  cards: productDetailContent.buttonCards,
});

export const menCard = {
  _key: "mens",
  image: { desktop: "card-mens-d", mobile: "card-mens-m", alt: "A man in a navy suit wearing a gold band and a watch" },
} as const;

/**
 * The couple photo on the Women's cards. Desktop uses the product page's crop on both pages; on mobile each
 * frame crops it differently (Engagement Rings 3587:123620, Fine Jewelry 3587:124091), so each has its own file.
 */
export const couplePhoto = (mobile: "card-women-er-m" | "card-women-fj-m") =>
  ({ desktop: "card-questions-d", mobile, alt: "Two hands held together, one wearing an engagement ring" }) as const;
