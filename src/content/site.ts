/*
 * Site-wide content: announcement bar, header navigation and footer.
 * Shaped like Sanity documents (a _type plus plain fields) so it can move to Sanity later.
 * Copy is from the Figma Header and Footer pages. Hrefs point at routes that later tasks will build.
 */
import type { IconName } from "@/icons/icon-data";
import { blogPosts, postHref } from "./blog";

export type NavLink = { _key: string; label: string; href: string };

export type AnnouncementBarContent = {
  _type: "announcementBar";
  /** "countdown" (the sale timer) is the default: every Figma page frame shows it. "messages" is the other Top Bar variant. */
  mode: "messages" | "countdown";
  messages: string[];
  /** endsAt: ISO date. A mock sale whose end has passed restarts every `restartDays`, so the timer never sits at zero. */
  countdown: { label: string; endsAt: string; restartDays: number };
  contact: NavLink;
};

/** What sits before a menu link's label: a Figma icon or a colour swatch. */
export type MenuMedia =
  | { _type: "menuIcon"; icon: IconName }
  /** Swatch colours are product data (metal and stone colours), not design tokens. */
  | { _type: "menuSwatch"; color: string };

export type MenuLink = NavLink & { media?: MenuMedia };

export type MenuGroup = {
  _key: string;
  title: string;
  /** Columns in the desktop mega menu, and in the mobile menu unless `mobileColumns` says otherwise. */
  columns: 1 | 2;
  /** The mobile menu's own column count where its Figma frame differs from the desktop one. */
  mobileColumns?: 1 | 2;
  links: MenuLink[];
  /** Text link under the group, such as "Shop More Styles". */
  footerLink?: NavLink;
};

export type BlogTeaser = {
  _key: string;
  title: string;
  topic: string;
  /** ISO date. */
  date: string;
  href: string;
  image: { src: string; alt: string };
};

export type MegaMenu = {
  _type: "megaMenu";
  /** "compact" uses Figma's 34px rows on desktop (Fine Jewelry). Links without media are always 34px. */
  density: "default" | "compact";
  groups: MenuGroup[];
  /** Education's "Explore Our Blog" column. */
  blog?: { title: string; posts: BlogTeaser[]; footerLink: NavLink };
  /** The full-width row under the panel, and the fixed bar on mobile sub-screens. */
  shopAll: NavLink;
};

export type PrimaryNavLink = NavLink & { menu: MegaMenu };

export type HeaderContent = {
  _type: "siteHeader";
  utility: NavLink[];
  primary: PrimaryNavLink[];
  account: NavLink;
  bag: NavLink;
  search: NavLink;
  searchPanel: {
    label: string;
    placeholder: string;
    mobilePlaceholder: string;
    submitLabel: string;
  };
  mobileMenu: {
    label: string;
    backLabel: string;
    utility: NavLink[];
  };
};

export type FooterContent = {
  _type: "siteFooter";
  newsletter: {
    headingBefore: string;
    headingItalic: string;
    headingAfter: string;
    emailLabel: string;
    submitLabel: string;
    consent: string;
    invalidEmail: string;
    successHeading: string;
    successBody: string;
  };
  privacyLine: { before: string; privacy: NavLink; middle: string; contact: NavLink; after: string };
  description: string;
  contact: { address: string; phone: string; email: string };
  social: Array<{ _key: string; label: string; href: string; icon: IconName }>;
  columns: Array<{ _key: string; title: string; links: NavLink[] }>;
  copyright: string;
  /** Deliberate addition, not in Figma: says this is a portfolio build with sample content. */
  demoNotice: string;
  payments: Array<{ _key: string; label: string; icon: IconName }>;
};

/** The mock sale ends 6 days 8 hours 23 minutes 48 seconds after the build: Figma's "06 D : 08 H : 23 M : 48 S". */
const SALE_AFTER_BUILD_MS = (((6 * 24 + 8) * 60 + 23) * 60 + 48) * 1000;
const BUILD_TIME = Number(process.env.NEXT_PUBLIC_BUILD_TIME) || Date.parse("2026-11-19T00:00:00.000Z");

export const announcementBar: AnnouncementBarContent = {
  _type: "announcementBar",
  mode: "countdown",
  messages: ["30 days free returns", "Free Shipping Worldwide", "Lifetime Warranty"],
  countdown: { label: "Up to 20% Off", endsAt: new Date(BUILD_TIME + SALE_AFTER_BUILD_MS).toISOString(), restartDays: 7 },
  contact: { _key: "contact", label: "Contact", href: "/contact/" },
};

/* ---------- Mega menus ----------
 * Copy and icons from the Figma "Mega Menu" desktop frames and "Nav" mobile frames.
 * Hrefs are planned routes; filters use query strings so each listing stays one static page.
 */

const icon = (name: IconName): MenuMedia => ({ _type: "menuIcon", icon: name });
const swatch = (color: string): MenuMedia => ({ _type: "menuSwatch", color });
const slug = (label: string) => label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
/** One menu link. The key comes from the label, the href from the base plus an optional query. */
const item = (label: string, href: string, media?: MenuMedia): MenuLink => ({ _key: slug(label), label, href, media });

const METALS = (base: string): MenuLink[] => [
  item("Yellow Gold", `${base}?metal=yellow-gold`, swatch("#e0d06b")),
  item("Rose Gold", `${base}?metal=rose-gold`, swatch("#fdb2a1")),
  item("White Gold", `${base}?metal=white-gold`, swatch("#e3e5cb")),
];

const SHAPES = (base: string): MenuLink[] =>
  (
    [
      ["Round", "round"],
      ["Oval", "oval"],
      ["Cushion", "cushion"],
      ["Pear", "pear"],
      ["Emerald", "emerald"],
      ["Princess", "princess"],
      ["Radiant", "radiant"],
      ["Elongated Cushion", "cushion"],
      ["Marquise", "marquise"],
      ["Asscher", "asscher"],
    ] as const
  ).map(([label, name]) => item(label, `${base}?shape=${slug(label)}`, icon(name)));

const fineJewelryMenu: MegaMenu = {
  _type: "megaMenu",
  density: "compact",
  groups: [
    {
      _key: "rings",
      title: "Rings",
      columns: 1,
      links: [
        item("Stackable Rings", "/fine-jewelry/rings/?type=stackable", icon("stackable-rings")),
        item("Diamond Rings", "/fine-jewelry/rings/?type=diamond", icon("setting")),
        item("Gemstone Rings", "/fine-jewelry/rings/?type=gemstone", icon("gemstone-ring")),
        item("Pearl Rings", "/fine-jewelry/rings/?type=pearl", icon("pearl-ring")),
        item("Gold Rings", "/fine-jewelry/rings/?type=gold", icon("band")),
        item("Cocktail Rings", "/fine-jewelry/rings/?type=cocktail", icon("cocktail-ring")),
        item("Initial Rings", "/fine-jewelry/rings/?type=initial", icon("initial-ring")),
      ],
    },
    {
      _key: "earrings",
      title: "Earrings",
      columns: 1,
      links: [
        item("Diamond Earrings", "/fine-jewelry/earrings/?type=diamond", icon("diamond-earrings")),
        item("Gemstone Earrings", "/fine-jewelry/earrings/?type=gemstone", icon("gemstone-earrings")),
        item("Pearl Earrings", "/fine-jewelry/earrings/?type=pearl", icon("pearl-earrings")),
        item("Gold Earrings", "/fine-jewelry/earrings/?type=gold", icon("gold-earrings")),
        item("Hoop Earrings", "/fine-jewelry/earrings/?type=hoop", icon("hoop-earrings")),
      ],
    },
    {
      _key: "necklaces",
      title: "Necklaces",
      columns: 1,
      links: [
        item("Diamond Necklaces", "/fine-jewelry/necklaces/?type=diamond", icon("diamond-necklace")),
        item("Gemstone Necklaces", "/fine-jewelry/necklaces/?type=gemstone", icon("gemstone-necklace")),
        item("Pearl Necklaces", "/fine-jewelry/necklaces/?type=pearl", icon("pearl-necklace")),
        item("Gold Necklaces", "/fine-jewelry/necklaces/?type=gold", icon("gold-necklace")),
        item("Cross Necklaces", "/fine-jewelry/necklaces/?type=cross", icon("cross-necklace")),
        item("Cuban Chains", "/fine-jewelry/necklaces/?type=cuban-chain", icon("cuban-chain")),
      ],
    },
    {
      _key: "bracelets",
      title: "Bracelets",
      columns: 1,
      links: [
        item("Diamond Bracelets", "/fine-jewelry/bracelets/?type=diamond", icon("diamond-bracelet")),
        item("Gemstone Bracelets", "/fine-jewelry/bracelets/?type=gemstone", icon("gemstone-bracelet")),
        item("Pearl Bracelets", "/fine-jewelry/bracelets/?type=pearl", icon("pearl-bracelet")),
        item("Gold Bracelets", "/fine-jewelry/bracelets/?type=gold", icon("gold-bracelet")),
        item("Chain Bracelets", "/fine-jewelry/bracelets/?type=chain", icon("cuban-chain")),
      ],
    },
  ],
  shopAll: { _key: "shop-all", label: "Shop All Fine Jewelry", href: "/fine-jewelry/shop/" },
};

const engagementRingsMenu: MegaMenu = {
  _type: "megaMenu",
  density: "default",
  groups: [
    {
      _key: "design-your-own",
      title: "Design Your Own",
      columns: 1,
      links: [
        item("Start with a Natural Diamond", "/design-your-own/?start=natural-diamond", icon("natural-diamond")),
        item("Start with a Lab-Created Diamond", "/design-your-own/?start=lab-diamond", icon("lab-diamond")),
        item("Start with a Setting", "/design-your-own/?start=setting", icon("setting")),
        item("Start with a Gemstone", "/design-your-own/?start=gemstone", icon("gemstone")),
      ],
    },
    {
      _key: "preset",
      title: "Preset engagement rings",
      columns: 2,
      links: (
        [
          ["Round", "round"],
          ["Oval", "oval"],
          ["Princess", "princess"],
          ["Cushion", "cushion"],
          ["Emerald", "emerald"],
          ["Radiant", "radiant"],
          ["Pear", "pear"],
          ["Asscher", "asscher"],
          ["Heart", "heart"],
          ["Marquise", "marquise"],
        ] as const
      ).map(([label, name]) => item(label, `/engagement-rings/?shape=${name}`, icon(name))),
      footerLink: { _key: "top", label: "Shop Top Engagement Rings", href: "/engagement-rings/best-sellers/" },
    },
    {
      _key: "style",
      title: "Shop by Style",
      columns: 2,
      links: (
        [
          ["Solitaire", "solitaire"],
          ["Bezel", "bezel"],
          ["Pave", "pave"],
          ["Halo", "halo"],
          ["Channel-Set", "channel-set"],
          ["Hidden Halo", "hidden-halo"],
          ["Side-Stone", "side-stones"],
          ["Three-Stone", "three-stone"],
          ["Tension", "tension"],
          ["Vintage", "vintage"],
        ] as const
      ).map(([label, name]) => item(label, `/engagement-rings/?style=${slug(label)}`, icon(name))),
      footerLink: { _key: "more", label: "Shop More Styles", href: "/engagement-rings/styles/" },
    },
    { _key: "metal", title: "Shop by Metal", columns: 1, links: METALS("/engagement-rings/") },
  ],
  shopAll: { _key: "shop-all", label: "Shop All Engagement Rings", href: "/engagement-rings/" },
};

const weddingBandsMenu: MegaMenu = {
  _type: "megaMenu",
  density: "default",
  groups: [
    {
      _key: "for-her",
      title: "For Her",
      columns: 2,
      links: (
        [
          ["Classic", "band-classic"],
          ["Diamond", "band-diamonds"],
          ["Solid", "band-solid"],
          ["Pave", "band-pave"],
          ["Eternity", "band-eternity"],
          ["Anniversary", "band-anniversary"],
          ["Prong", "band-prong"],
        ] as const
      ).map(([label, name]) => item(label, `/wedding-bands/women/?style=${slug(label)}`, icon(name))),
    },
    {
      _key: "for-him",
      title: "For Him",
      // Figma: two columns in the desktop mega menu (3565:99947), one in the mobile menu (3587:124991).
      columns: 2,
      mobileColumns: 1,
      links: (
        [
          ["Classic", "band-classic"],
          // No carved or alternative-metal band icon in Assets: Figma's stand-ins are kept and flagged.
          ["Carved", "oval"],
          ["Diamond", "band-diamonds"],
          ["Alternative Metal", "pear"],
        ] as const
      ).map(([label, name]) => item(label, `/wedding-bands/men/?style=${slug(label)}`, icon(name))),
    },
    { _key: "metal", title: "Shop by Metal", columns: 1, links: METALS("/wedding-bands/") },
  ],
  shopAll: { _key: "shop-all", label: "Shop All Wedding Bands", href: "/wedding-bands/" },
};

const diamondsMenu: MegaMenu = {
  _type: "megaMenu",
  density: "default",
  groups: [
    {
      _key: "design",
      title: "Design Your Diamond Ring",
      columns: 1,
      links: [
        item("Start with a Natural Diamond", "/design-your-own/?start=natural-diamond", icon("natural-diamond")),
        item("Start with a Lab-Created Diamond", "/design-your-own/?start=lab-diamond", icon("lab-diamond")),
        item("Start with a Setting", "/design-your-own/?start=setting", icon("setting")),
        item("Start with a Pendant", "/design-your-own/pendant/", icon("pendant-solitaire")),
      ],
    },
    { _key: "loose", title: "Loose Diamonds", columns: 2, links: SHAPES("/diamonds/") },
    {
      _key: "color",
      title: "Diamonds By Color",
      columns: 2,
      links: (
        [
          ["Yellow", "#e0d06b"],
          ["Green", "#ccf0cc"],
          ["Pink", "#f4c8c8"],
          ["Orange", "#f7d89d"],
          ["Purple", "#dad0f5"],
          ["Brown", "#c8b185"],
          ["Blue", "#cdd5ee"],
          ["Black", "#939486"],
        ] as const
      ).map(([label, color]) => item(label, `/diamonds/fancy-color/?color=${slug(label)}`, swatch(color))),
    },
    {
      _key: "jewelry",
      title: "Diamond Jewelry",
      columns: 1,
      links: [
        item("Eternity Rings", "/diamond-jewelry/?type=eternity-rings", icon("eternity-ring")),
        item("Anniversary Rings", "/diamond-jewelry/?type=anniversary-rings", icon("band-anniversary")),
        item("Diamond Studs", "/diamond-jewelry/?type=studs", icon("diamond-stud")),
        item("Diamond Pendants", "/diamond-jewelry/?type=pendants", icon("pendant-solitaire")),
        item("Tennis Bracelets", "/diamond-jewelry/?type=tennis-bracelets", icon("tennis-bracelet")),
      ],
      footerLink: { _key: "all", label: "All Diamond Jewelry", href: "/diamond-jewelry/" },
    },
  ],
  shopAll: { _key: "shop-all", label: "Shop All Diamonds", href: "/diamonds/" },
};

const gemstonesMenu: MegaMenu = {
  _type: "megaMenu",
  density: "default",
  groups: [
    {
      _key: "design",
      title: "Design Your Gemstone Ring",
      columns: 1,
      links: [
        // No moissanite icon in Assets: Figma's Natural Diamond is kept and flagged.
        item("Start with a Moissanite", "/design-your-own/?start=moissanite", icon("natural-diamond")),
        item("Start with a Sapphire", "/design-your-own/?start=sapphire", icon("gemstone")),
        item("Start with a Setting", "/design-your-own/?start=setting", icon("setting")),
        item("Start with an Emerald", "/design-your-own/?start=emerald", icon("emerald")),
      ],
    },
    { _key: "shape", title: "Gemstones By Shape", columns: 2, links: SHAPES("/gemstones/") },
    {
      _key: "color",
      title: "Gemstones By Color",
      columns: 2,
      links: (
        [
          ["Blue Sapphire", "#cdd5ee"],
          ["Pink Sapphire", "#f4c8c8"],
          ["Yellow Sapphire", "#e0d06b"],
          ["Green Sapphire", "#ccf0cc"],
          ["Red Ruby", "#f7a59d"],
          ["Green Emerald", "#6dd995"],
          ["Moissanite", "#939486"],
        ] as const
      ).map(([label, color]) => item(label, `/gemstones/?stone=${slug(label)}`, swatch(color))),
    },
    {
      _key: "jewelry",
      title: "Gemstone Jewelry",
      columns: 1,
      links: [
        item("Gemstone Earrings", "/gemstone-jewelry/?type=earrings", icon("gemstone-earrings")),
        item("Gemstone Necklaces", "/gemstone-jewelry/?type=necklaces", icon("gemstone-necklace")),
        item("Gemstone Bracelets", "/gemstone-jewelry/?type=bracelets", icon("gemstone-bracelet")),
        item("Gemstone Rings", "/gemstone-jewelry/?type=rings", icon("gemstone-ring")),
      ],
      footerLink: { _key: "all", label: "All Gemstone Jewelry", href: "/gemstone-jewelry/" },
    },
  ],
  shopAll: { _key: "shop-all", label: "Shop All Gemstones", href: "/gemstones/" },
};

/** Figma's Education frame has placeholder copy. These topics replace it; the layout is as designed. */
const educationMenu: MegaMenu = {
  _type: "megaMenu",
  density: "compact",
  groups: [
    {
      _key: "diamonds",
      title: "Diamonds",
      columns: 1,
      links: [
        "The 4Cs of Diamonds",
        "Diamond Cut",
        "Diamond Color",
        "Diamond Clarity",
        "Carat Weight",
        "Diamond Shapes",
        "Lab-Grown vs Natural Diamonds",
      ].map((label) => item(label, `/education/${slug(label)}/`)),
    },
    {
      _key: "rings",
      title: "Rings",
      columns: 1,
      links: ["Ring Size Guide", "Engagement Ring Settings", "Choosing a Metal", "Wedding Band Guide", "Ring Care"].map(
        (label) => item(label, `/education/${slug(label)}/`),
      ),
    },
    {
      _key: "gemstones",
      title: "Gemstones & Fine Jewelry",
      columns: 1,
      links: ["Gemstone Guide", "Sapphires", "Emeralds", "Moissanite", "Pearl Guide", "Jewelry Care"].map((label) =>
        item(label, `/education/${slug(label)}/`),
      ),
    },
  ],
  blog: {
    title: "Explore Our Blog",
    posts: blogPosts.map((post) => ({
      _key: post._id,
      title: post.title,
      topic: post.topic,
      date: post.date,
      href: postHref(post),
      image: post.thumbnail,
    })),
    footerLink: { _key: "all", label: "All Blog Posts", href: "/blog/" },
  },
  shopAll: { _key: "shop-all", label: "All Education", href: "/education/" },
};

export const siteHeader: HeaderContent = {
  _type: "siteHeader",
  utility: [
    { _key: "locations", label: "Locations", href: "/locations/" },
    { _key: "our-story", label: "Our Story", href: "/our-story/" },
    { _key: "support", label: "Support", href: "/support/" },
  ],
  primary: [
    { _key: "fine-jewelry", label: "Fine Jewelry", href: "/fine-jewelry/", menu: fineJewelryMenu },
    { _key: "engagement-rings", label: "Engagement Rings", href: "/engagement-rings/", menu: engagementRingsMenu },
    { _key: "wedding-bands", label: "Wedding Bands", href: "/wedding-bands/", menu: weddingBandsMenu },
    { _key: "diamonds", label: "Diamonds", href: "/diamonds/", menu: diamondsMenu },
    { _key: "gemstones", label: "Gemstones", href: "/gemstones/", menu: gemstonesMenu },
    { _key: "education", label: "Education", href: "/education/", menu: educationMenu },
  ],
  account: { _key: "account", label: "Account", href: "/account/" },
  bag: { _key: "bag", label: "Bag", href: "/bag/" },
  search: { _key: "search", label: "Search", href: "/search/" },
  searchPanel: {
    label: "Search the site",
    placeholder: "Jewelry, news, Blog etc.",
    mobilePlaceholder: "Search",
    submitLabel: "Submit search",
  },
  mobileMenu: {
    label: "Menu",
    backLabel: "Back to menu",
    utility: [
      { _key: "locations", label: "Locations", href: "/locations/" },
      { _key: "our-story", label: "Our Story", href: "/our-story/" },
      { _key: "contact", label: "Contact", href: "/contact/" },
    ],
  },
};

export const siteFooter: FooterContent = {
  _type: "siteFooter",
  newsletter: {
    headingBefore: "Subscribe ",
    headingItalic: "to",
    headingAfter: " our Newsletter",
    emailLabel: "Email Address",
    submitLabel: "Sign up",
    consent: "I agree to receive promotional emails from Sky Jewelry. You can unsubscribe at any time.",
    invalidEmail: "Please provide a valid email address.",
    successHeading: "You’re subscribed",
    successBody: "Check your inbox for a confirmation email from Sky Jewelry. You can unsubscribe at any time.",
  },
  privacyLine: {
    before: "View our ",
    privacy: { _key: "privacy", label: "Privacy Policy", href: "/privacy-policy/" },
    middle: " or ",
    contact: { _key: "contact", label: "Contact Us", href: "/contact/" },
    after: ".",
  },
  // Figma has Latin filler here; replaced with one neutral sentence.
  description: "Engagement rings, wedding bands and fine jewelry from Sky Jewelry in New York.",
  // Mock contact details: this is a public demo, so the store's own address, phone and email (in Figma) are not shown.
  contact: {
    address: "123 Sample Ave, New York NY 10001",
    phone: "+1 (212) 555-0142",
    email: "info@example.com",
  },
  social: [
    { _key: "instagram", label: "Sky Jewelry on Instagram", href: "https://www.instagram.com/", icon: "instagram" },
    { _key: "facebook", label: "Sky Jewelry on Facebook", href: "https://www.facebook.com/", icon: "facebook" },
    { _key: "pinterest", label: "Sky Jewelry on Pinterest", href: "https://www.pinterest.com/", icon: "pinterest" },
  ],
  columns: [
    {
      _key: "information",
      title: "Information",
      links: [
        { _key: "guarantee", label: "The Sky Guarantee", href: "/the-sky-guarantee/" },
        { _key: "contact", label: "Contact Us", href: "/contact/" },
        { _key: "shipping", label: "Shipping Info", href: "/shipping/" },
        { _key: "faqs", label: "FAQs", href: "/faqs/" },
        { _key: "blog", label: "Blog", href: "/blog/" },
        { _key: "terms", label: "Terms of Use", href: "/terms-of-use/" },
        { _key: "privacy", label: "Privacy Policy", href: "/privacy-policy/" },
      ],
    },
    {
      _key: "jewelry",
      title: "Jewelry",
      links: [
        { _key: "engagement-rings", label: "Engagement Rings", href: "/engagement-rings/" },
        { _key: "wedding-bands", label: "Wedding Bands", href: "/wedding-bands/" },
        { _key: "diamonds", label: "Diamonds", href: "/diamonds/" },
        { _key: "gemstones", label: "Gemstones", href: "/gemstones/" },
        { _key: "fine-jewelry", label: "Fine Jewelry", href: "/fine-jewelry/" },
      ],
    },
  ],
  copyright: "© All Rights Reserved to Sky Jewelry",
  demoNotice: "Portfolio build by Rob Coven. Not the live Sky Jewelry store; products, prices, reviews and contact details are sample content.",
  payments: [
    { _key: "visa", label: "Visa", icon: "visa" },
    { _key: "mastercard", label: "Mastercard", icon: "mastercard" },
    { _key: "amex", label: "American Express", icon: "amex" },
  ],
};
