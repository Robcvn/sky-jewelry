/*
 * Diamonds landing page (Figma desktop 3565:97438, mobile 3587:123850), shaped for Sanity.
 * Figma's placeholders are replaced with short neutral copy (see the report's "Corrected design oversights").
 */
import { br, em, span } from "@/components/ui/RichText";
import { colorTiles, consultModule, diamondShapes, faqs, guaranteeIcons, reviews } from "./shared";
import type { LandingPage } from "./types";
import { homeSection } from "./shared";

const SHOP = "/diamonds/shop/";
const homeFeatures = homeSection("featureGrid", "features");
const dyo = homeSection("designYourOwn", "design-your-own");

export const diamondsPage: LandingPage = {
  _type: "landingPage",
  slug: "diamonds",
  seo: { title: "Diamonds", description: "Natural and lab-grown diamonds by shape and color, from Sky Jewelry." },
  sections: [
    {
      _type: "homeHero",
      _key: "hero",
      overline: "Brilliance That Lasts Forever",
      heading: [span("Diamonds "), em("by"), span(" Sky Jewelry")],
      body: "Natural and lab-grown diamonds, by shape and by color.",
      image: { desktop: "hero-diamonds-d", mobile: "hero-diamonds-m", alt: "Two hands resting together, wearing gold and diamond bands" },
      links: [{ _key: "shop", icon: "gemstone", label: "Shop Diamonds", mobileLabel: "Shop Diamonds", href: SHOP }],
    },
    {
      ...dyo,
      _key: "diamond-type",
      heading: [span("Choose "), em("your"), br(), span(" Diamond Type")],
      body: "Natural or lab-grown: both are real diamonds.",
      cards: [
        { _key: "natural", icon: "natural-diamond", title: "Natural\nDiamonds", body: "Celebrate your love with our stunning selection of engagement ring designs.", cta: { label: "Shop Natural Diamonds", href: `${SHOP}?type=natural` } },
        { _key: "lab-grown", icon: "lab-diamond", title: "Lab-Grown\nDiamonds", body: "Browse our dazzling diamond collection and experience the brilliance in every piece.", cta: { label: "Shop Lab-Grown Diamonds", href: `${SHOP}?type=lab-grown` } },
      ],
    },
    {
      _type: "tileCarousel",
      _key: "shapes",
      layout: "carousel",
      overline: "Cut to Perfection",
      heading: [span("Shop "), em("by"), span(" Diamond Shape")],
      items: diamondShapes(SHOP),
    },
    {
      _type: "tileCarousel",
      _key: "colors",
      layout: "carousel",
      overline: "A Spectrum of Sparkle",
      // Mobile frame (3587:123850) breaks the line before "by" (a hard line break in Figma's text).
      heading: [span("Shop Diamonds "), br(true), em("by"), span(" Color")],
      items: colorTiles(`${SHOP}`, "diamonds"),
    },
    {
      _type: "diamondInspection",
      _key: "inspection",
      heading: [span("Diamond Inspection\n"), em("and"), span(" Quality")],
      body: "What to look at before you choose a diamond.",
      steps: ["Compare the cut, color and clarity grades.", "Weigh carat against the stone’s measurements.", "Read the grading certificate."],
      cta: { label: "Read More", href: "/education/the-4cs-of-diamonds/", context: "the 4Cs of diamonds" },
      image: { desktop: "about-d", mobile: "about-m", alt: "A gold and a white gold engagement ring, each with a matching band, on linen" },
    },
    {
      // Figma's five titles are the placeholder "Diamonds Subcategory": built with the menu's Diamond Jewelry links.
      ...homeFeatures,
      _key: "diamond-jewelry",
      heading: "Shop diamond jewelry",
      padTop: true,
      mobileCaption: "rule-title",
      cards: homeFeatures.cards.map((card, index) => ({
        ...card,
        ...[
          { title: "Eternity Rings", href: "/diamond-jewelry/?type=eternity-rings" },
          { title: "Anniversary Rings", href: "/diamond-jewelry/?type=anniversary-rings" },
          { title: "Diamond Studs", href: "/diamond-jewelry/?type=studs" },
          { title: "Diamond Pendants", href: "/diamond-jewelry/?type=pendants" },
          { title: "Tennis Bracelets", href: "/diamond-jewelry/?type=tennis-bracelets" },
        ][index],
        _key: `diamond-jewelry-${index}`,
      })),
    },
    reviews(),
    consultModule("consult", "both"),
    guaranteeIcons("guarantee"),
    faqs(),
  ],
};
