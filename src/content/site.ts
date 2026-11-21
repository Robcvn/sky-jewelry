/*
 * Site-wide content: announcement bar, header navigation and footer.
 * Shaped like Sanity documents (a _type plus plain fields) so it can move to Sanity later.
 * Copy is from the Figma Header and Footer pages. Hrefs point at routes that later tasks will build.
 */
import type { IconName } from "@/icons/icon-data";
import { homePosts, postHref } from "./blog";
import { CONTACT, DIAMOND_JEWELRY, diamondList, fineJewelryList, gemstoneList, settingsList, SUPPORT } from "./links";

export type NavLink = { _key: string; label: string; href: string };

export type AnnouncementBarContent = {
  _type: "announcementBar";
  /** "countdown" (the sale timer) is the default: every Figma page frame shows it. "messages" is the other Top Bar variant. */
  mode: "messages" | "countdown";
  messages: string[];
  /** endsAt: ISO date. A mock sale whose end has passed restarts every `restartDays`, so the timer never sits at zero. */
  countdown: { label: string; endsAt: string; restartDays: number };
  /** Contact: the desktop text link, and the mobile message icon (`mobileHref`, below 1024px only). */
  contact: NavLink & { mobileHref: string };
};

/** What sits before a menu link's label: a Figma icon or a colour swatch. */
export type MenuMedia =
  | { _type: "menuIcon"; icon: IconName }
  /** Swatch colours are product data (metal and stone colours), not design tokens. */
  | { _type: "menuSwatch"; color: string };

/** A menu link. No href: shown as drawn but not a link (no page matches it yet; Held for review). */
export type MenuLink = Omit<NavLink, "href"> & { href?: string; media?: MenuMedia };

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

/** Figma "contact drop down" (6725:45688): the panel the header's Support link opens on desktop. */
export type ContactDropdownContent = {
  label: string;
  heading: string;
  /** A row's call to action with no href is drawn but is not a link (no destination yet; Held for review). */
  items: Array<{ _key: string; icon: IconName; title: string; body: string; cta: { label: string; href?: string } }>;
  footerLink: NavLink;
};

export type HeaderContent = {
  _type: "siteHeader";
  utility: NavLink[];
  /** The utility link that opens the contact dropdown instead of navigating (the prototype's Support). */
  contactDropdown: ContactDropdownContent & { trigger: string };
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
  contact: { _key: "contact", label: "Contact", href: SUPPORT, mobileHref: CONTACT },
};

/* ---------- Mega menus ----------
 * Copy and icons from the Figma "Mega Menu" desktop frames and "Nav" mobile frames. The prototype links only each menu's
 * Shop All (its landing page) and the Fine Jewelry rows (the product list); the other items lead to the lists that exist,
 * with the filter in the address (src/content/links.ts; Deviations). An item no list matches has no href: it is drawn but
 * not a link (Held for review).
 */

const icon = (name: IconName): MenuMedia => ({ _type: "menuIcon", icon: name });
const swatch = (color: string): MenuMedia => ({ _type: "menuSwatch", color });
const slug = (label: string) => label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
/** One menu link. The key comes from the label; a null href draws the item without a link. */
const item = (label: string, href: string | null, media?: MenuMedia): MenuLink => ({ _key: slug(label), label, ...(href ? { href } : {}), media });

const METALS = (href: (metal: string) => string): MenuLink[] => [
  item("Yellow Gold", href("yellow-gold"), swatch("#e0d06b")),
  item("Rose Gold", href("rose-gold"), swatch("#fdb2a1")),
  item("White Gold", href("white-gold"), swatch("#e3e5cb")),
];

/** The Diamonds and Gemstones menus' ten shapes. The stone list has no Elongated Cushion, so that item has no link. */
const SHAPES = (href: (shape: string) => string): MenuLink[] =>
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
  ).map(([label, name]) => item(label, label === "Elongated Cushion" ? null : href(slug(label)), icon(name)));

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
        // Not in the approved menu: wording from the TO DOS menu rebuild (7970:215029), whose "Start with an Earring
        // Setting" row uses the Assets "Band" icon (Deviations).
        item("Design Your Own Earrings", "/design-your-own/earrings/", icon("band")),
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
  // The prototype sends Shop All to the Fine Jewelry landing page (desktop 3565:97650, mobile 3587:124041).
  shopAll: { _key: "shop-all", label: "Shop All Fine Jewelry", href: "/fine-jewelry/" },
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
        item("Start with a Natural Diamond", "/design-your-own/stone/?start=natural-diamond&first=stone", icon("natural-diamond")),
        item("Start with a Lab-Created Diamond", "/design-your-own/stone/?start=lab-diamond&first=stone", icon("lab-diamond")),
        item("Start with a Setting", "/design-your-own/?start=setting", icon("setting")),
        item("Start with a Gemstone", "/design-your-own/stone/?start=gemstone&first=stone", icon("gemstone")),
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
      ).map(([label, name]) => item(label, settingsList({ shape: name }), icon(name))),
      // The mobile prototype sends this to Builder 1 - Setting (3587:125289): the settings list.
      footerLink: { _key: "top", label: "Shop Top Engagement Rings", href: settingsList() },
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
      ).map(([label, name]) => item(label, settingsList({ style: slug(label) }), icon(name))),
      footerLink: { _key: "more", label: "Shop More Styles", href: settingsList() },
    },
    { _key: "metal", title: "Shop by Metal", columns: 1, links: METALS((metal) => settingsList({ metal })) },
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
      // No rings-list filter isolates the band products, so the style items lead to the rings list unfiltered.
      ).map(([label, name]) => item(label, fineJewelryList("rings"), icon(name))),
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
      ).map(([label, name]) => item(label, fineJewelryList("rings"), icon(name))),
    },
    { _key: "metal", title: "Shop by Metal", columns: 1, links: METALS((metal) => fineJewelryList("rings", { metal })) },
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
        item("Start with a Natural Diamond", "/design-your-own/stone/?start=natural-diamond&first=stone", icon("natural-diamond")),
        item("Start with a Lab-Created Diamond", "/design-your-own/stone/?start=lab-diamond&first=stone", icon("lab-diamond")),
        item("Start with a Setting", "/design-your-own/?start=setting", icon("setting")),
        // No pendant builder: drawn, not a link (Held for review).
        item("Start with a Pendant", null, icon("pendant-solitaire")),
      ],
    },
    { _key: "loose", title: "Loose Diamonds", columns: 2, links: SHAPES((shape) => diamondList({ shape })) },
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
        // No coloured diamonds in the stone list: drawn, not links (Held for review).
      ).map(([label, color]) => item(label, null, swatch(color))),
    },
    {
      _key: "jewelry",
      title: "Diamond Jewelry",
      columns: 1,
      links: [
        ...DIAMOND_JEWELRY.map(({ label, href, icon: name }) => item(label, href, icon(name))),
      ],
      footerLink: { _key: "all", label: "All Diamond Jewelry", href: fineJewelryList(null, { type: "diamond" }) },
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
        item("Start with a Moissanite", "/design-your-own/stone/?start=moissanite&first=stone", icon("natural-diamond")),
        item("Start with a Sapphire", "/design-your-own/stone/?start=sapphire&first=stone", icon("gemstone")),
        item("Start with a Setting", "/design-your-own/?start=setting", icon("setting")),
        item("Start with an Emerald", "/design-your-own/stone/?start=emerald&first=stone", icon("emerald")),
      ],
    },
    { _key: "shape", title: "Gemstones By Shape", columns: 2, links: SHAPES((shape) => gemstoneList({ shape })) },
    {
      _key: "color",
      title: "Gemstones By Color",
      columns: 2,
      links: (
        [
          ["Blue Sapphire", "#cdd5ee", gemstoneList({ start: "sapphire", gemcolor: "blue" })],
          ["Pink Sapphire", "#f4c8c8", gemstoneList({ start: "sapphire", gemcolor: "pink" })],
          ["Yellow Sapphire", "#e0d06b", gemstoneList({ start: "sapphire", gemcolor: "yellow" })],
          ["Green Sapphire", "#ccf0cc", gemstoneList({ start: "sapphire", gemcolor: "green" })],
          ["Red Ruby", "#f7a59d", gemstoneList({ gem: "ruby" })],
          ["Green Emerald", "#6dd995", gemstoneList({ start: "emerald" })],
          ["Moissanite", "#939486", gemstoneList({ start: "moissanite" })],
        ] as const
      ).map(([label, color, href]) => item(label, href, swatch(color))),
    },
    {
      _key: "jewelry",
      title: "Gemstone Jewelry",
      columns: 1,
      links: [
        item("Gemstone Earrings", fineJewelryList("earrings", { type: "gemstone" }), icon("gemstone-earrings")),
        item("Gemstone Necklaces", fineJewelryList("necklaces", { type: "gemstone" }), icon("gemstone-necklace")),
        item("Gemstone Bracelets", fineJewelryList("bracelets", { type: "gemstone" }), icon("gemstone-bracelet")),
        item("Gemstone Rings", fineJewelryList("rings", { type: "gemstone" }), icon("gemstone-ring")),
      ],
      footerLink: { _key: "all", label: "All Gemstone Jewelry", href: fineJewelryList(null, { type: "gemstone" }) },
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
    posts: homePosts.map((post) => ({
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

/** Mock contact details: this is a public demo, so the store's own address, phone and email (in Figma) are not shown. */
const SAMPLE_CONTACT = {
  address: "123 Sample Ave, New York NY 10001",
  phone: "+1 (212) 555-0142",
  email: "info@example.com",
};

export const siteHeader: HeaderContent = {
  _type: "siteHeader",
  utility: [
    { _key: "locations", label: "Locations", href: SUPPORT },
    { _key: "our-story", label: "Our Story", href: "/our-story/" },
    // On desktop Support opens the contact dropdown (the prototype's overlay); its "more contact options" opens the page.
    { _key: "support", label: "Support", href: SUPPORT },
  ],
  contactDropdown: {
    trigger: "support",
    label: "Contact",
    heading: "We’re here to help.",
    items: [
      // No chat or text service: drawn, not a link (Held for review).
      { _key: "text", icon: "text-message", title: "Text Us", body: "Get an instant response", cta: { label: "Let’s Chat!" } },
      // Figma's number is the store's own: the site's sample number instead (Deviations).
      { _key: "call", icon: "phone", title: "Give Us a Call", body: "Chat with one of our experts.", cta: { label: `Call ${SAMPLE_CONTACT.phone}`, href: `tel:${SAMPLE_CONTACT.phone.replace(/[^+\d]/g, "")}` } },
      { _key: "email", icon: "mail", title: "Have an Inquiry?", body: "Email us at anytime.", cta: { label: "Send an email", href: `mailto:${SAMPLE_CONTACT.email}` } },
    ],
    // The prototype sends this row to the Sky Guarantee page (3565:101916).
    footerLink: { _key: "more", label: "more contact options", href: SUPPORT },
  },
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
      { _key: "locations", label: "Locations", href: SUPPORT },
      { _key: "our-story", label: "Our Story", href: "/our-story/" },
      { _key: "contact", label: "Contact", href: CONTACT },
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
    // One link at both sizes: the support page (its Contact section is mobile only, so #contact would leave desktop mid-page).
    contact: { _key: "contact", label: "Contact Us", href: SUPPORT },
    after: ".",
  },
  // Figma has Latin filler here; replaced with one neutral sentence.
  description: "Engagement rings, wedding bands and fine jewelry from Sky Jewelry in New York.",
  contact: SAMPLE_CONTACT,
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
        { _key: "contact", label: "Contact Us", href: SUPPORT },
        { _key: "shipping", label: "Shipping Info", href: "/shipping/" },
        { _key: "faqs", label: "FAQs", href: "/the-sky-guarantee/#faqs" },
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
