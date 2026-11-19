/*
 * Gemstones landing page (Figma desktop 3565:97781, mobile 3587:124191), shaped for Sanity.
 * Figma's placeholders are replaced with short neutral copy (see the report's "Corrected design oversights").
 */
import { em, span } from "@/components/ui/RichText";
import { colorTiles, ctaCallout, designYourOwn, faqs, guaranteeIcons, reviews } from "./shared";
import type { LandingPage } from "./types";

const SHOP = "/gemstones/shop/";

/** Figma reuses the coloured-diamond photos for every gemstone carousel; built as designed (flagged). */
const PHOTOS = ["color-yellow-sq", "color-pink-sq", "color-purple-sq", "color-blue-sq", "color-red-sq"] as const;
const BIRTHSTONES = [
  "Jan - Garnet",
  "Feb - Amethyst",
  "Mar - Aquamarine",
  "Apr - Diamond",
  "May - Emerald",
  "Jun - Pearl",
  "Jul - Ruby",
  "Aug - Peridot",
  "Sep - Sapphire",
  "Oct - Opal",
  "Nov - Citrine",
  "Dec - Topaz",
];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// Figma's last three cards all use the red photo.
const BIRTHSTONE_PHOTO = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 4, 4];

export const gemstonesPage: LandingPage = {
  _type: "landingPage",
  slug: "gemstones",
  seo: { title: "Gemstones", description: "Gemstones by shape, color and birthstone, and gemstone jewelry, from Sky Jewelry." },
  sections: [
    {
      _type: "homeHero",
      _key: "hero",
      overline: "Color for Every Story",
      heading: [span("Gemstones "), em("by"), span(" Sky Jewelry")],
      body: "Gemstones by shape, by color and by birthstone.",
      image: { desktop: "hero-gemstones-d", mobile: "hero-gemstones-m", alt: "Gold rings set with pink, red, blue and green gemstones on a pale stone" },
      links: [{ _key: "shop", icon: "emerald", label: "Shop All Gemstones", mobileLabel: "Shop All Gemstones", href: SHOP }],
    },
    // Mobile only in Figma (the desktop copy is hidden). Figma's title reads "Fine Jewelry": built for gemstones.
    { ...ctaCallout("promo", "Up to 20% Off Gemstones", `${SHOP}?sale=true`), only: "mobile" },
    {
      _type: "tileCarousel",
      _key: "shapes",
      layout: "carousel",
      overline: "A Spectrum of Sparkle",
      heading: [span("Shop Gemstones "), em("by"), span(" Shape")],
      // Figma's titles are the placeholder "Shape Name": named after the shapes the photos show.
      items: (
        [
          ["cushion", "Cushion", "A square cut with rounded corners.", 0],
          ["asscher", "Asscher", "A square step cut.", 1],
          ["pear", "Pear", "A teardrop shape.", 2],
          ["oval", "Oval", "An elongated round shape.", 3],
        ] as const
      ).map(([slug, title, body, photo]) => ({ _key: slug, title, body, href: `${SHOP}?shape=${slug}`, image: { desktop: PHOTOS[photo], alt: `${title} gemstone` } })),
    },
    {
      _type: "tileCarousel",
      _key: "colors",
      layout: "carousel",
      overline: "A Spectrum of Sparkle",
      heading: [span("Shop Gemstones "), em("by"), span(" Color")],
      items: colorTiles(SHOP, "gemstones"),
    },
    {
      _type: "tileCarousel",
      _key: "birthstones",
      layout: "carousel",
      overline: "Born to Shine",
      heading: [span("Shop "), em("by"), span(" Birthstone")],
      items: BIRTHSTONES.map((title, index) => ({
        _key: title.slice(0, 3).toLowerCase(),
        title,
        body: `The ${MONTHS[index]} birthstone.`,
        href: `${SHOP}?birthstone=${title.split(" - ")[1].toLowerCase()}`,
        image: { desktop: PHOTOS[BIRTHSTONE_PHOTO[index]], alt: "" },
      })),
    },
    designYourOwn(),
    {
      _type: "featureCardRow",
      _key: "gemstone-jewelry",
      heading: [span("Gemstone Jewelry")],
      body: "Rings, earrings, necklaces and bracelets set with gemstones.",
      mobile: "grid",
      // Figma says "Read Story" on these category links; the identical Fine Jewelry row says "Shop Now".
      ctaLabel: "Shop Now",
      cards: [
        { _key: "rings", title: "Rings", href: "/fine-jewelry/rings/?type=gemstone", image: { desktop: "fc-rings-fc", alt: "Two rose gold cluster rings on blue paper" } },
        { _key: "earrings", title: "Earrings", href: "/fine-jewelry/earrings/?type=gemstone", image: { desktop: "fc-earrings-fc", alt: "A woman wearing long drop earrings" } },
        { _key: "necklaces", title: "Necklaces", href: "/fine-jewelry/necklaces/?type=gemstone", image: { desktop: "feature-fine-jewelry-d", alt: "Layered fine necklaces" } },
        { _key: "bracelets", title: "Bracelets", href: "/fine-jewelry/bracelets/?type=gemstone", image: { desktop: "fc-bracelets-fc", alt: "Stacked bracelets on a wrist" } },
      ],
    },
    reviews(),
    {
      _type: "heroModule",
      _key: "moissanite",
      flushTop: "both",
      heading: [span("Explore Moissanite Stones")],
      body: "Moissanite center stones for your ring.",
      cta: { label: "Shop Now", href: `${SHOP}?stone=moissanite`, context: "moissanite stones" },
      image: { desktop: "module-moissanite-d", mobile: "module-moissanite-m", alt: "A rose gold band set with pink stones" },
    },
    guaranteeIcons("guarantee"),
    faqs(),
  ],
};
