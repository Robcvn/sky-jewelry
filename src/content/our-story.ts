/*
 * Our Story, /our-story/ (Figma "Our Story" 5110:36289, desktop only: there is no mobile frame), shaped like a Sanity
 * document. The design's own copy is kept (with three typos corrected, Corrected design oversights); the one filler
 * paragraph is replaced with a neutral line that makes no claim about the business.
 */
import { em, span, type RichSpan } from "@/components/ui/RichText";
import type { IconName } from "@/components/ui/Icon";
import type { ImageRef } from "@/components/ui/Picture";

export const ourStoryPage = {
  _type: "ourStoryPage" as const,
  seo: { title: "Our Story", description: "The story behind Sky Jewelry, a multi-generational business." },
  hero: {
    overline: "A Multi-Generational Business",
    // Figma: “theThe Story Behind Sky Jewelry”, an italic “the” before a doubled “The”.
    title: [em("the"), span(" Story Behind Sky Jewelry")] as RichSpan[],
    image: { desktop: "story-hero-d", mobile: "story-hero-m", alt: "Two hands holding a pair of gold rings" } as ImageRef,
    /** Hero Button - Overlay with Map Pin: no store page to go to yet, so drawn but inert (Held for review). */
    button: { label: "Visit Our Store", icon: "map-pin" as IconName },
  },
  business: {
    // Figma: “A Multi-General Business” (the hero’s overline reads “Multi-Generational”).
    heading: [span("A Multi-Generational Business")] as RichSpan[],
    body: "For three generations our family has been providing our clientele the opportunity to indulge in sustainable, high-quality jewelry with modest pricing. We believe in providing exceptional customer service and affordable prices, and that’s how our customers turn into lifetime clients.",
    /**
     * Figma draws two Buttons (MD, Secondary), both “Read More”, with nothing to read: one is kept, inert (Held for
     * review); the duplicate is dropped (Corrected design oversights).
     */
    buttons: ["Read More"],
    image: { desktop: "story-rings-sq", alt: "Two engagement rings with their wedding bands, one in yellow gold and one in white gold" } as ImageRef,
  },
  apart: {
    heading: [span("What sets us apart")] as RichSpan[],
    // Figma: Latin filler. A neutral line that introduces the two passages below without adding a claim.
    body: "Our philosophy and our values, in our own words.",
    items: [
      { _key: "philosophy", label: "Our Philosophy", body: "To beautify the world with our meticulously crafted fine jewelry. To inspire moments of happiness and celebrations. To enlighten and enrich women’s lives." },
      { _key: "values", label: "Our values", body: "Bring to the world a portfolio of exquisitely designed jewelry brands that anticipate and satisfy people’s needs and desires. We love to think outside the box and break conventions. We always surprise customers with our creativity." },
    ],
    image: { desktop: "story-hand-sq", alt: "A hand wearing several stacked gold rings" } as ImageRef,
  },
  foundations: {
    overline: "The Foundations",
    // Figma: “… maintaining respectful relation with …”.
    statement: "We are committed to protecting the environment, and maintaining respectful relations with customers, partners, suppliers, employees and communities",
  },
};
