/*
 * Engagement Rings landing page (Figma desktop 3565:97085, mobile 3587:123511), shaped for Sanity.
 * Figma's placeholders are replaced with short neutral copy (see the report's "Corrected design oversights").
 */
import { em, span } from "@/components/ui/RichText";
import { consultModule, couplePhoto, ctaCallout, customerStories, designYourOwn, diamondShapes, faqs, guaranteeModule, homeSection, menCard, metalRow, reviews } from "./shared";
import type { LandingPage } from "./types";

const SHOP = "/engagement-rings/shop/";
const hero = homeSection("homeHero", "hero");

export const engagementRingsPage: LandingPage = {
  _type: "landingPage",
  slug: "engagement-rings",
  seo: {
    title: "Engagement Rings",
    description: "Design your engagement ring from stone to setting: shop ring styles, metals and diamond shapes from Sky Jewelry.",
  },
  sections: [
    {
      ...hero,
      overline: "Engagement Rings",
      // Figma's desktop label is misspelt ("Engagment"); the mobile frame spells it correctly.
      links: [{ _key: "shop", icon: "setting", mobileIcon: "setting-empty", label: "Shop Engagement Rings", mobileLabel: "Shop Engagement Rings", href: SHOP }],
    },
    ctaCallout("promo", "Up to 20% Off Natural Diamonds", "/diamonds/shop/?type=natural"),
    designYourOwn(),
    {
      _type: "tileCarousel",
      _key: "styles",
      layout: "carousel",
      overline: "Shop by Style",
      heading: [span("Engagement ring Styles "), em("by"), span(" sky")],
      items: (
        [
          ["channel-set", "Channel Set", "Stones set flush into the band.", "style-channel-set-sq", "Channel-set ring with a cushion-cut diamond"],
          ["halo", "Halo", "A circle of stones around the center.", "product-ring-round-halo-rose-gold", "Round halo ring in rose gold"],
          ["solitaire", "Solitaire", "A single center stone on a slim band.", "product-ring-round-solitaire-white-gold", "Round solitaire ring in white gold"],
          ["side-stone", "Side-Stone", "Accent stones beside the center stone.", "product-ring-side-stone-white-gold", "Side-stone ring in white gold"],
          ["pave", "Pavé", "Small stones set along the band.", "product-ring-pave-emerald-yellow-gold", "Pavé ring with an emerald-cut diamond"],
        ] as const
      ).map(([slug, title, body, image, alt]) => ({ _key: slug, title, body, priceLabel: "starting at $999", href: `${SHOP}?style=${slug}`, image: { desktop: image, alt } })),
    },
    metalRow("metals", SHOP),
    consultModule("consult"),
    {
      _type: "tileCarousel",
      _key: "shapes",
      layout: "carousel",
      overline: "Cut to Perfection",
      heading: [span("Shop "), em("by"), span(" Diamond Shape")],
      items: diamondShapes(SHOP),
    },
    {
      _type: "buttonCardPair",
      _key: "men-women",
      overline: "Rings for Every Love Story",
      heading: [span("Rings "), em("for"), span(" men & women")],
      cards: [
        { _key: "womens", title: "Women’s Engagement Rings", body: "Settings and stones, chosen your way.", cta: { label: "Shop Now", href: SHOP }, image: couplePhoto },
        { ...menCard, title: "Men’s Wedding Bands", body: "Classic and diamond bands for him.", cta: { label: "Shop Now", href: "/wedding-bands/men/" } },
      ],
    },
    customerStories(),
    reviews(),
    guaranteeModule("desktop"),
    faqs(),
  ],
};
