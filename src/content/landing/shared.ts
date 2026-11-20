/*
 * Content shared by several landing pages. Sections that are identical to Home's in Figma (Design Your Own,
 * Customer Stories, Reviews, the Sky Guarantee module, FAQs) reuse Home's content, which already replaces
 * Figma's placeholders.
 *
 * Routes: the landing pages own /engagement-rings/, /diamonds/ and /gemstones/, so their product lists are
 * planned at /<category>/shop/ (with the filters in the query). Wedding bands keep the planned
 * /wedding-bands/women/ and /wedding-bands/men/; fine jewelry uses its existing list pages.
 */
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

/** Home's "the Sky Guarantee" module; flushTop where Figma butts it against the Reviews band. */
export const guaranteeModule = (flushTop?: HeroModule["flushTop"]): HeroModule => ({ ...homeSection("heroModule", "guarantee"), flushTop, landing: true });

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
export const metalRow = (key: string, base: string): TileCarousel => ({
  _type: "tileCarousel",
  _key: key,
  layout: "grid",
  overline: "Shine in Your Style",
  heading: [span("Shop "), em("by"), span(" Metal Type")],
  items: [
    { _key: "white-gold", title: "White Gold", href: `${base}?metal=white-gold`, image: { desktop: "product-ring-vine-white-gold", alt: "Vine ring in white gold" } },
    { _key: "yellow-gold", title: "Yellow Gold", href: `${base}?metal=yellow-gold`, image: { desktop: "product-ring-vine-yellow-gold", alt: "Vine ring in yellow gold" } },
    { _key: "rose-gold", title: "Rose Gold", href: `${base}?metal=rose-gold`, image: { desktop: "product-ring-vine-rose-gold", alt: "Vine ring in rose gold" } },
    // Figma reuses the white gold photo for Platinum (no platinum photo exists).
    { _key: "platinum", title: "Platinum", href: `${base}?metal=platinum`, image: { desktop: "product-ring-vine-white-gold", alt: "Vine ring in a white metal" } },
  ],
});

/** Loose diamond shape tiles (Figma has photos of five shapes). */
export const diamondShapes = (base: string): TileCarousel["items"] =>
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
    href: `${base}?shape=${slug}`,
    image: { desktop: `shape-${slug}-sq` as const, alt: `${title} diamond` },
  }));

/** Coloured diamond tiles (also used, as Figma does, for gemstone colours). */
export const colorTiles = (base: string, noun: string): TileCarousel["items"] =>
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
    href: `${base}?color=${slug}`,
    image: { desktop: `color-${slug}-sq` as const, alt },
  }));

/** "Sky Jewelry Guarantee" (Wedding Bands, Diamonds, Gemstones). Bodies restate each title; Figma's are Latin. */
export const guaranteeIcons = (key: string): GuaranteeIcons => ({
  _type: "guaranteeIcons",
  _key: key,
  overline: "Our Promise of Perfection",
  heading: [span("Sky Jewelry Guarantee")],
  items: [
    { _key: "warranty", icon: "warranty", title: "Lifetime Warranty", body: "Every piece is covered for life." },
    { _key: "shipping", icon: "truck", title: "Free Shipping", body: "Shipping is free on every order." },
    { _key: "money-back", icon: "money-back-guarantee", title: "Money Back Guarantee", body: "Returns are free within 30 days." },
    { _key: "experts", icon: "diamond-experts", title: "Diamond Experts", body: "Ask our specialists before you choose." },
    { _key: "conflict-free", icon: "natural-diamond", title: "Certified Conflict-Free", body: "Every diamond is certified conflict-free." },
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

export const couplePhoto = { desktop: "card-questions-d", mobile: "card-questions-m", alt: "Two hands held together, one wearing an engagement ring" } as const;
