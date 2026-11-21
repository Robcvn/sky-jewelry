/*
 * Wedding Bands landing page (Figma desktop 3565:97246, mobile 3587:123687), shaped for Sanity.
 * Figma's placeholders are replaced with short neutral copy (see the report's "Corrected design oversights").
 */
import { em, span } from "@/components/ui/RichText";
import type { TileCarousel } from "./types";
import { consultModule, ctaCallout, customerStories, faqs, guaranteeIcons, metalRow, reviews } from "./shared";
import type { LandingPage } from "./types";
import { fineJewelryList } from "../links";

// No Wedding Bands list pages, and no rings-list filter isolates the band products (Stackable misses the Classic 4mm,
// Gold has only the two Classic bands): the shop links lead to the Fine Jewelry rings list unfiltered (src/content/links.ts).
const WOMEN = fineJewelryList("rings");
const MEN = fineJewelryList("rings");

/**
 * Figma's style rows use the engagement-ring style photos (no band photos exist) and repeat "Pavé"; the men's
 * row copies the women's. Built as designed without the duplicate (flagged).
 */
const styles = (base: string): TileCarousel["items"] =>
  (
    [
      ["classic", "Classic", "A plain, rounded band.", "style-channel-set-sq"],
      ["solid", "Solid", "A solid band with a smooth finish.", "product-ring-round-halo-rose-gold"],
      ["eternity", "Eternity", "Stones all the way around.", "product-ring-round-solitaire-white-gold"],
      ["prong", "Prong", "Stones held in small prongs.", "product-ring-side-stone-white-gold"],
      ["pave", "Pavé", "Small stones set along the band.", "product-ring-pave-emerald-yellow-gold"],
      ["diamond", "Diamond", "A band set with diamonds.", "style-channel-set-sq"],
      ["anniversary", "Anniversary", "A band to mark the years.", "product-ring-round-halo-rose-gold"],
      ["solitaire", "Solitaire", "A single stone on a slim band.", "product-ring-round-solitaire-white-gold"],
      ["side-stone", "Side-Stone", "Accent stones beside the center.", "product-ring-side-stone-white-gold"],
    ] as const
  ).map(([slug, title, body, image]) => ({
    _key: slug,
    title,
    body,
    priceLabel: "starting at $999",
    href: base,
    image: { desktop: image, alt: "" },
  }));

export const weddingBandsPage: LandingPage = {
  _type: "landingPage",
  slug: "wedding-bands",
  seo: { title: "Wedding Bands", description: "Wedding rings for her and for him: shop bands by style and metal from Sky Jewelry." },
  sections: [
    {
      _type: "homeHero",
      _key: "hero",
      overline: "For Him, For Her, Forever",
      heading: [span("Wedding Rings "), em("by"), span(" Sky Jewelry")],
      body: "Wedding rings for her and for him, in classic and diamond styles.",
      image: { desktop: "hero-wedding-bands-d", mobile: "hero-wedding-bands-m", alt: "Two hands clasped, one wearing a halo diamond ring" },
      links: [
        { _key: "women", icon: "setting", label: "Shop Women’s", mobileLabel: "Shop Women’s", href: WOMEN },
        { _key: "men", icon: "band", label: "Shop Men’s", mobileLabel: "Shop Men’s", href: MEN },
      ],
    },
    // Figma's mobile title reads "20% Off  Wedding Bands" (double space, no "Up to"): built as the desktop title.
    ctaCallout("promo", "Up to 20% Off Wedding Bands", fineJewelryList("rings")),
    {
      _type: "tileCarousel",
      _key: "womens-styles",
      layout: "carousel",
      overline: "Styled to Last a Lifetime",
      heading: [span("Women’s Wedding rings "), em("by"), span(" Style")],
      items: styles(WOMEN),
    },
    {
      _type: "tileCarousel",
      _key: "mens-styles",
      layout: "carousel",
      overline: "Styled to Last a Lifetime",
      heading: [span("Men’s Wedding rings "), em("by"), span(" Style")],
      items: styles(MEN),
    },
    metalRow("metals", (metal) => fineJewelryList("rings", { metal })),
    consultModule("consult"),
    {
      _type: "bestSellers",
      _key: "best-sellers",
      heading: [span("Shop "), em("our"), span(" Best Sellers")],
      // The catalogue has no wedding bands: the closest real products are its plain and diamond bands (flagged).
      rows: [
        {
          _key: "women",
          title: "women’s Best-selling wedding rings",
          handles: ["flush-set-natural-diamond-band", "flush-set-lab-grown-diamond-band", "twig-diamond-stackable-band", "classic-2mm-band", "classic-4mm-band"],
        },
        {
          _key: "men",
          title: "men’s Best-selling wedding rings",
          handles: ["classic-4mm-band", "classic-2mm-band", "flush-set-natural-diamond-band", "flush-set-lab-grown-diamond-band", "twig-diamond-stackable-band"],
        },
      ],
    },
    reviews(),
    // Figma has Customer Stories on desktop only.
    { ...customerStories(), only: "desktop" },
    guaranteeIcons("guarantee"),
    faqs(),
  ],
};
