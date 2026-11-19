/*
 * Home page content, shaped like a Sanity "homePage" document: an ordered list of sections, each with a
 * _type and _key. Copy is from the Figma Home frames (desktop 3565:101343, mobile 3587:124551).
 * Figma's Latin filler and repeated placeholders are replaced (see "Corrected design oversights").
 * Hrefs are planned routes. Images are keys into src/content/image-manifest.ts.
 */
import type { ImageRef } from "@/components/ui/Picture";
import { br, em, span, type RichSpan } from "@/components/ui/RichText";
import type { IconName } from "@/icons/icon-data";
import { blogPosts } from "./blog";

export type Cta = { label: string; href: string };

export type HomeHero = {
  _type: "homeHero";
  _key: string;
  overline: string;
  heading: RichSpan[];
  body: string;
  image: ImageRef;
  /** The two large links at the bottom. Figma shortens the labels on mobile. */
  links: Array<{ _key: string; icon: IconName; label: string; mobileLabel: string; href: string }>;
};

export type CategoryStrip = {
  _type: "categoryStrip";
  _key: string;
  label: string;
  categories: Array<{ _key: string; label: string; href: string; image: ImageRef }>;
};

export type DesignYourOwn = {
  _type: "designYourOwn";
  _key: string;
  /** Shown on mobile; on desktop it is the section's visually hidden heading. */
  heading: RichSpan[];
  body: string;
  cards: Array<{ _key: string; icon: IconName; title: string; body: string; cta: Cta }>;
  diamond: ImageRef;
  setting: ImageRef;
};

export type FeatureGrid = {
  _type: "featureGrid";
  _key: string;
  /** Visually hidden: Figma has no visible heading here. */
  heading: string;
  cards: Array<{ _key: string; title: string; href: string; image: ImageRef; wide?: boolean }>;
  ctaLabel: string;
};

export type HeroModule = {
  _type: "heroModule";
  _key: string;
  overline?: string;
  heading: RichSpan[];
  body: string;
  cta: Cta & { context: string };
  image: ImageRef;
};

export type ProductCarousel = {
  _type: "productCarousel";
  _key: string;
  overline: string;
  heading: RichSpan[];
  /** Shopify product handles, in display order (the mock products use the same handles). */
  productIds: string[];
};

export type CustomerStories = {
  _type: "customerStories";
  _key: string;
  heading: RichSpan[];
  cta: Cta;
  stories: Array<{ _key: string; title: string; body: string; href: string; image: ImageRef }>;
  storyCtaLabel: string;
};

export type EducationCenter = {
  _type: "educationCenter";
  _key: string;
  heading: RichSpan[];
  body: string;
  cta: Cta;
  featured: { topic: string; title: string; body: string; href: string; ctaLabel: string; image: ImageRef };
  resources: Array<{ _key: string; topic: string; title: string; href: string; image: ImageRef }>;
};

export type Reviews = {
  _type: "reviews";
  _key: string;
  heading: RichSpan[];
  rating: number;
  reviewCount: string;
  reviews: Array<{ _key: string; name: string; rating: number; date: string; body: string }>;
};

export type BlogRow = {
  _type: "blogRow";
  _key: string;
  overline: string;
  heading: RichSpan[];
  cta: Cta;
  postIds: string[];
};

export type About = {
  _type: "about";
  _key: string;
  heading: RichSpan[];
  body: string;
  cta: Cta & { context: string };
  image: ImageRef;
};

export type Faqs = {
  _type: "faqs";
  _key: string;
  heading: RichSpan[];
  body: string;
  cta: Cta;
  /** Figma shows this question open on desktop and all closed on mobile. */
  openOnDesktop: number;
  items: Array<{ _key: string; question: string; answer: string[] }>;
};

export type HomeSection =
  | HomeHero
  | CategoryStrip
  | DesignYourOwn
  | FeatureGrid
  | HeroModule
  | ProductCarousel
  | CustomerStories
  | EducationCenter
  | Reviews
  | BlogRow
  | About
  | Faqs;

export type HomePage = {
  _type: "homePage";
  seo: { title: string; description: string };
  sections: HomeSection[];
};

const HERO_BODY = "Start with a ring setting or center stone and then add the perfect counterpart.";

export const homePage: HomePage = {
  _type: "homePage",
  seo: {
    title: "Sky Jewelry | Engagement Rings, Wedding Bands and Fine Jewelry",
    description:
      "Design your engagement ring from stone to setting, or shop wedding bands, diamonds, gemstones and fine jewelry from Sky Jewelry in New York.",
  },
  sections: [
    {
      _type: "homeHero",
      _key: "hero",
      overline: "Created custom by you & Yours",
      heading: [span("Design your ring "), em("from"), span(" stone to setting")],
      body: HERO_BODY,
      image: {
        desktop: "hero-d",
        mobile: "hero-m",
        alt: "Two hands passing a pair of gold rings between them",
      },
      links: [
        { _key: "engagement", icon: "setting", label: "Shop Engagement Rings", mobileLabel: "Engagement Rings", href: "/engagement-rings/" },
        { _key: "fine-jewelry", icon: "band", label: "Shop Fine Jewelry", mobileLabel: "Fine Jewelry", href: "/fine-jewelry/" },
      ],
    },
    {
      _type: "categoryStrip",
      _key: "categories",
      label: "Shop by category",
      categories: [
        {
          _key: "engagement-rings",
          label: "engagement rings",
          href: "/engagement-rings/",
          image: { desktop: "cat-engagement-rings-d", mobile: "cat-engagement-rings-m", alt: "" },
        },
        {
          _key: "womens-wedding-rings",
          label: "Women’s wedding rings",
          href: "/wedding-bands/women/",
          image: { desktop: "cat-womens-wedding-rings-d", mobile: "cat-womens-wedding-rings-m", alt: "" },
        },
        {
          _key: "fine-jewelry",
          label: "Fine Jewelry",
          href: "/fine-jewelry/",
          image: { desktop: "cat-fine-jewelry-d", mobile: "cat-fine-jewelry-m", alt: "" },
        },
        {
          _key: "mens-wedding-rings",
          label: "men’s wedding rings",
          href: "/wedding-bands/men/",
          image: { desktop: "cat-mens-wedding-rings-d", mobile: "cat-mens-wedding-rings-m", alt: "" },
        },
        {
          _key: "gemstone-rings",
          label: "gemstone rings",
          href: "/gemstone-jewelry/?type=rings",
          image: { desktop: "cat-gemstone-rings-d", mobile: "cat-gemstone-rings-m", alt: "" },
        },
      ],
    },
    {
      _type: "designYourOwn",
      _key: "design-your-own",
      heading: [span("Design "), em("your"), span(" engagement ring"), br(true), span(" "), em("your"), span(" way")],
      body: HERO_BODY,
      cards: [
        {
          _key: "setting",
          icon: "setting-empty",
          title: "Setting",
          body: "Celebrate your love with our stunning selection of engagement ring designs.",
          cta: { label: "Start with a setting", href: "/design-your-own/?start=setting" },
        },
        {
          _key: "stone",
          icon: "gemstone",
          title: "Stone",
          body: "Browse our dazzling diamond collection and experience the brilliance in every piece.",
          cta: { label: "Start with a Stone", href: "/design-your-own/?start=natural-diamond" },
        },
      ],
      diamond: { desktop: "dyo-diamond-d", mobile: "dyo-diamond-m", alt: "" },
      setting: { desktop: "dyo-setting-d", mobile: "dyo-setting-m", alt: "" },
    },
    {
      _type: "featureGrid",
      _key: "features",
      heading: "Shop the collections",
      ctaLabel: "Shop Now",
      cards: [
        {
          _key: "engagement-rings",
          title: "Engagement Rings",
          href: "/engagement-rings/",
          wide: true,
          image: {
            desktop: "feature-engagement-rings-d",
            mobile: "feature-engagement-rings-m",
            alt: "Two people holding hands, one wearing a diamond engagement ring",
          },
        },
        {
          _key: "wedding-rings",
          title: "Wedding Rings",
          href: "/wedding-bands/",
          image: { desktop: "feature-wedding-rings-d", mobile: "feature-wedding-rings-m", alt: "Joined hands wearing wedding bands" },
        },
        {
          _key: "gemstones",
          title: "Gemstones",
          href: "/gemstones/",
          image: { desktop: "feature-gemstones-d", mobile: "feature-gemstones-m", alt: "A woman wearing an emerald and gold necklace" },
        },
        {
          _key: "fine-jewelry",
          title: "Fine Jewelry",
          href: "/fine-jewelry/",
          image: { desktop: "feature-fine-jewelry-d", mobile: "feature-fine-jewelry-m", alt: "A woman wearing layered fine gold necklaces" },
        },
        {
          _key: "diamonds",
          title: "Diamonds",
          href: "/diamonds/",
          image: { desktop: "feature-diamonds-d", mobile: "feature-diamonds-m", alt: "A pair of diamond cluster earrings" },
        },
      ],
    },
    {
      _type: "heroModule",
      _key: "endear-collection",
      overline: "The endear collection",
      heading: [em("the"), span(" engagement collection "), em("by"), span(" Sky Jewelry.")],
      body: "Bezel-set stones on sculpted bands, designed to be stacked and worn every day.",
      cta: { label: "shop collection", href: "/engagement-rings/?collection=endear", context: "the Endear collection" },
      image: {
        desktop: "collection-d",
        mobile: "collection-m",
        alt: "A hand resting against a cheek, wearing a rose gold bezel ring stacked with a diamond band",
      },
    },
    {
      _type: "productCarousel",
      _key: "best-sellers",
      overline: "Sky Jewelry’s best selling",
      heading: [span("Engagement rings "), br(true), em("by"), span(" sky")],
      productIds: [
        "channel-set-ring",
        "halo-ring",
        "side-stone-ring",
        "eternity-ring",
        "channel-set-ring",
        "halo-ring",
        "side-stone-ring",
        "eternity-ring",
      ],
    },
    {
      _type: "customerStories",
      _key: "stories",
      heading: [span("Customer Stories")],
      cta: { label: "View All Stories", href: "/stories/" },
      storyCtaLabel: "Read Story",
      stories: [
        {
          _key: "amara-james",
          title: "Amara & James",
          body: "A pear-cut diamond on a slim band, chosen together.",
          href: "/stories/amara-and-james/",
          image: { desktop: "story-face-d", mobile: "story-face-m", alt: "A woman with her hand to her face, wearing a pear-shaped diamond ring" },
        },
        {
          _key: "sofia-daniel",
          title: "Sofia & Daniel",
          body: "A cushion-cut diamond with a hidden halo.",
          href: "/stories/sofia-and-daniel/",
          image: { desktop: "story-arms-d", mobile: "story-arms-m", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" },
        },
        {
          _key: "nia-marcus",
          title: "Nia & Marcus",
          body: "Stacked bands in yellow gold, one for every year.",
          href: "/stories/nia-and-marcus/",
          image: { desktop: "story-hand-d", mobile: "story-hand-m", alt: "A hand wearing several stacked gold rings" },
        },
        {
          _key: "lena-omar",
          title: "Lena & Omar",
          body: "A surprise proposal with a ring designed in secret.",
          href: "/stories/lena-and-omar/",
          image: { desktop: "story-face-d", mobile: "story-face-m", alt: "A woman with her hand to her face, wearing a pear-shaped diamond ring" },
        },
        {
          _key: "grace-tom",
          title: "Grace & Tom",
          body: "Matching wedding bands in white gold.",
          href: "/stories/grace-and-tom/",
          image: { desktop: "story-arms-d", mobile: "story-arms-m", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" },
        },
        {
          _key: "priya-sam",
          title: "Priya & Sam",
          body: "An emerald and diamond stack for their anniversary.",
          href: "/stories/priya-and-sam/",
          image: { desktop: "story-hand-d", mobile: "story-hand-m", alt: "A hand wearing several stacked gold rings" },
        },
      ],
    },
    {
      _type: "educationCenter",
      _key: "education",
      heading: [span("Education Center")],
      body: "Guides to help you choose with confidence, from diamond grading to ring sizing.",
      cta: { label: "view all Resources", href: "/education/" },
      featured: {
        topic: "Diamonds",
        title: "The 4Cs of Diamonds",
        body: "Cut, color, clarity and carat weight decide how a diamond looks and what it costs. Learn what each grade means, which ones you will notice, and where you can save without giving up sparkle.",
        href: "/education/the-4cs-of-diamonds/",
        ctaLabel: "Read More",
        image: { desktop: "story-arms-wide", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" },
      },
      resources: [
        {
          _key: "diamond-cut",
          topic: "Diamonds",
          title: "How cut shapes a diamond’s sparkle",
          href: "/education/diamond-cut/",
          image: { desktop: "story-face-sq", alt: "" },
        },
        {
          _key: "ring-size",
          topic: "Rings",
          title: "Finding the right ring size at home",
          href: "/education/ring-size-guide/",
          image: { desktop: "story-hand-sq", alt: "" },
        },
        {
          _key: "metal",
          topic: "Rings",
          title: "Choosing a metal for everyday wear",
          href: "/education/choosing-a-metal/",
          image: { desktop: "collection-sq", alt: "" },
        },
        {
          _key: "lab-grown",
          topic: "Diamonds",
          title: "Lab-grown and natural diamonds compared",
          href: "/education/lab-grown-vs-natural-diamonds/",
          image: { desktop: "story-arms-sq", alt: "" },
        },
      ],
    },
    {
      _type: "reviews",
      _key: "reviews",
      heading: [span("What "), em("our"), span(" Clients "), br(true), em("are"), span(" Saying")],
      rating: 4.9,
      reviewCount: "200 Reviews",
      reviews: [
        {
          _key: "maya",
          name: "Maya R.",
          rating: 5,
          date: "2026-10-12",
          body: "We designed my ring from the setting up, and the finished ring is exactly what I pictured. I could not be happier with it.",
        },
        {
          _key: "jordan",
          name: "Jordan T.",
          rating: 5,
          date: "2026-09-03",
          body: "I knew nothing about diamonds. The guides helped me choose a stone I love, and she said yes.",
        },
        {
          _key: "elena",
          name: "Elena S.",
          rating: 5,
          date: "2026-07-21",
          body: "Our wedding bands are beautiful and comfortable to wear every day. We get compliments on them all the time.",
        },
      ],
    },
    {
      _type: "blogRow",
      _key: "blog",
      overline: "Sky Jewelry Blog",
      heading: [span("Latest From "), em("the"), span(" blog")],
      cta: { label: "view all posts", href: "/blog/" },
      postIds: blogPosts.map((post) => post._id),
    },
    {
      _type: "about",
      _key: "about",
      heading: [span("About Sky Jewelry")],
      body: "Sky Jewelry makes engagement rings, wedding bands and fine jewelry, from rings you design yourself to pieces for every day. Every piece comes with our lifetime warranty.",
      cta: { label: "Read More", href: "/our-story/", context: "about Sky Jewelry" },
      image: { desktop: "about-d", mobile: "about-m", alt: "Diamond rings arranged on a soft fabric" },
    },
    {
      _type: "heroModule",
      _key: "guarantee",
      heading: [em("the"), span(" Sky guarantee")],
      body: "A lifetime warranty, free shipping worldwide and 30 days of free returns on every piece.",
      cta: { label: "Read More", href: "/the-sky-guarantee/", context: "the Sky guarantee" },
      image: {
        desktop: "guarantee-d",
        mobile: "guarantee-m",
        alt: "A hand wearing several stacked gold rings",
      },
    },
    {
      _type: "faqs",
      _key: "faqs",
      heading: [span("Sky Jewelry FAQs")],
      body: "Quick answers about ordering, sizing and caring for your jewelry.",
      cta: { label: "view all faqs", href: "/faqs/" },
      openOnDesktop: 1,
      items: [
        {
          _key: "design-your-own",
          question: "Can I design my own ring?",
          answer: ["Yes. Start with a ring setting or a center stone, then add the perfect counterpart."],
        },
        {
          _key: "lab-grown",
          question: "Do you offer lab-grown diamonds?",
          answer: ["Yes. You can start your ring with a natural diamond or a lab-created diamond."],
        },
        {
          _key: "shipping",
          question: "Do you ship worldwide?",
          answer: ["Yes. Shipping is free worldwide."],
        },
        {
          _key: "returns",
          question: "Can I return my order?",
          answer: ["Yes. Returns are free within 30 days."],
        },
        {
          _key: "warranty",
          question: "Is my jewelry covered by a warranty?",
          answer: ["Yes. Every piece comes with a lifetime warranty."],
        },
      ],
    },
  ],
};
