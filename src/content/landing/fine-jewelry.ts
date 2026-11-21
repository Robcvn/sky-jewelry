/*
 * Fine Jewelry landing page (Figma desktop 3565:97650, mobile 3587:124041), shaped for Sanity.
 * Figma's placeholders are replaced with short neutral copy (see the report's "Corrected design oversights").
 */
import { em, mobileOnlySpan, span } from "@/components/ui/RichText";
import { closingCards, consultModule, couplePhoto, ctaCallout, faqs, menCard, metalRow, reviews } from "./shared";
import type { LandingPage } from "./types";
import { fineJewelryList } from "../links";

/** Every Fine Jewelry product, with all filters (/fine-jewelry/shop/). */
const ALL = "/fine-jewelry/shop/";

export const fineJewelryPage: LandingPage = {
  _type: "landingPage",
  slug: "fine-jewelry",
  seo: { title: "Fine Jewelry", description: "Rings, necklaces, earrings and bracelets: shop fine jewelry by category, occasion, price and metal at Sky Jewelry." },
  sections: [
    {
      _type: "homeHero",
      _key: "hero",
      overline: "Where Luxury Meets Meaning",
      // Figma words the h1 differently per breakpoint ("by Sky" desktop, "by Sky Jewelry" mobile): built as drawn,
      // with " Jewelry" shown (and read) on mobile only, so the heading text is in the page once.
      heading: [span("Fine Jewelry "), em("by"), span(" Sky"), mobileOnlySpan(" Jewelry")],
      body: "Rings, necklaces, earrings and bracelets for every day and every occasion.",
      image: { desktop: "hero-fine-jewelry-d", mobile: "hero-fine-jewelry-m", alt: "Gold chains, a bangle, diamond studs and bands laid out on a pale surface" },
      links: [{ _key: "shop", icon: "necklace", label: "Shop All Fine Jewelry", mobileLabel: "Shop All Fine Jewelry", href: ALL }],
    },
    ctaCallout("promo", "Up to 20% Off All Fine Jewelry", ALL),
    {
      _type: "featureCardRow",
      _key: "categories",
      srHeading: "Shop fine jewelry by category",
      mobile: "grid",
      ctaLabel: "Shop Now",
      cards: [
        { _key: "rings", title: "Rings", href: "/fine-jewelry/rings/", image: { desktop: "fc-rings-fc", alt: "Two rose gold cluster rings on blue paper" } },
        { _key: "earrings", title: "Earrings", href: "/fine-jewelry/earrings/", image: { desktop: "fc-earrings-fc", alt: "A woman wearing long drop earrings" } },
        { _key: "necklaces", title: "Necklaces", href: "/fine-jewelry/necklaces/", image: { desktop: "feature-fine-jewelry-d", alt: "Layered fine necklaces" } },
        { _key: "bracelets", title: "Bracelets", href: "/fine-jewelry/bracelets/", image: { desktop: "fc-bracelets-fc", alt: "Stacked bracelets on a wrist" } },
      ],
    },
    {
      _type: "buttonCardPair",
      _key: "men-women",
      // Figma's mobile heading is "Shop by Type" with a Latin line: built with the desktop heading on both.
      overline: "For Him, For Her, Forever in Style",
      heading: [span("Fine Jewelry "), em("for"), span(" men & women")],
      cards: [
        { _key: "womens", title: "Women’s Fine Jewelry", body: "Rings, necklaces, earrings and bracelets.", cta: { label: "Shop for her", href: fineJewelryList(null) }, image: couplePhoto("card-women-fj-m") },
        { ...menCard, title: "Men’s Fine Jewelry", body: "Bands and pieces for him.", cta: { label: "Shop for him", href: fineJewelryList(null) } },
      ],
    },
    {
      _type: "featureCardRow",
      _key: "occasions",
      heading: [span("Shop "), em("by"), span(" Occasion")],
      body: "Pieces to mark the moments that matter.",
      mobile: "carousel",
      compact: true,
      ctaLabel: "Shop Now",
      cards: [
        {
          _key: "anniversary",
          title: "Anniversary",
          body: "Celebrate lasting love with timeless fine jewelry — from diamond bands to elegant tennis bracelets.",
          href: "/fine-jewelry/shop/?occasion=anniversary",
          image: { desktop: "fc-anniversary-fc", alt: "A woman wearing a gold hoop earring and a fine chain" },
        },
        {
          _key: "birthday",
          title: "Birthday",
          body: "Mark the moment with personalized pieces, birthstones, or classic everyday luxury.",
          href: "/fine-jewelry/shop/?occasion=birthday",
          image: { desktop: "fc-birthday-fc", alt: "A rose gold halo ring set in a pink rose" },
        },
        {
          _key: "new-beginnings",
          title: "New Beginnings",
          body: "Whether it’s motherhood, a fresh chapter, or a meaningful life change — commemorate it with a piece made to last.",
          href: "/fine-jewelry/shop/?occasion=new-beginnings",
          image: { desktop: "fc-new-beginnings-fc", alt: "Hands cradling a baby in a knitted blanket" },
        },
        {
          _key: "milestones",
          title: "Milestones & Achievements",
          // Figma forces a line break before "and success."; left to wrap naturally.
          body: "Honor promotions, graduations, or personal wins with jewelry that reflects growth and success.",
          href: "/fine-jewelry/shop/?occasion=milestones",
          image: { desktop: "fc-milestones-fc", alt: "Two hands held together, one wearing a solitaire ring" },
        },
      ],
    },
    {
      _type: "featureCardRow",
      _key: "prices",
      heading: [span("Shop "), em("by"), span(" Price")],
      body: "Fine jewelry at every price.",
      mobile: "grid",
      ctaLabel: "Shop Now",
      // The tiles name no category: they open the all-categories list with the price filter applied.
      cards: [
        { _key: "1000", title: "Under $1,000", href: `${ALL}?price=0-1000`, image: { desktop: "feature-gemstones-d", alt: "A woman wearing a gold, pearl and emerald choker" } },
        { _key: "1500", title: "Under $1,500", href: `${ALL}?price=0-1500`, image: { desktop: "feature-wedding-rings-d", alt: "A couple’s joined hands wearing wedding bands" } },
        { _key: "2500", title: "Under $2,500", href: `${ALL}?price=0-2500`, image: { desktop: "story-arms-d", alt: "Crossed arms, a hand wearing a pear-shaped diamond ring" } },
        { _key: "5000", title: "Under $5,000", href: `${ALL}?price=0-5000`, image: { desktop: "fc-hero-hands-fc", alt: "Two hands passing a pair of gold rings" } },
      ],
    },
    metalRow("metals", (metal) => fineJewelryList("rings", { metal })),
    {
      _type: "bestSellers",
      _key: "best-sellers",
      // Figma's overline is the placeholder "Optional Subheader": left out.
      heading: [span("Shop "), em("our"), span(" Best Sellers")],
      rows: [
        {
          _key: "fine-jewelry",
          handles: [
            "four-prong-solitaire-lab-grown-pendant",
            "four-prong-solitaire-lab-grown-stud-earrings",
            "beaded-bezel-lab-grown-tennis-bracelet",
            "vine-natural-diamond-ring",
            "paperclip-chain-necklace-2-5mm",
          ],
        },
      ],
    },
    // Figma has Reviews on mobile only on this page.
    { ...reviews(), only: "mobile" },
    consultModule("consult", "mobile"),
    closingCards("closing"),
    faqs(),
  ],
};
