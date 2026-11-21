/*
 * The legal pages (Figma "Legal Template": desktop 3565:102087, mobile 3587:130116), shaped like Sanity documents.
 * Figma's template holds a real company's privacy policy; this is a portfolio demonstration, so it is not published.
 * The text below is sample text that is true of this site: it collects no personal information, its forms send
 * nothing, the bag uses a Shopify development store and the browser's local storage, and no order can be placed.
 */
export type LegalBlock =
  | { _type: "h2"; _key: string; text: string }
  | { _type: "h3"; _key: string; text: string }
  | { _type: "p"; _key: string; text: string }
  | { _type: "label"; _key: string; text: string }
  | { _type: "list"; _key: string; items: string[] }
  | { _type: "table"; _key: string; caption: string; columns: [string, string, string]; rows: Array<[string, string, string]> };

export type LegalDoc = {
  _type: "legalPage";
  slug: string;
  title: string;
  /** ISO date */
  updated: string;
  seo: { description: string };
  /** The opening paragraphs, before the table of contents; the first is the sample-text line. */
  intro: Array<{ _key: string; text: string } | { _key: string; items: string[] }>;
  body: LegalBlock[];
};

const UPDATED = "2026-11-21";
export const SAMPLE_LINE = "This is sample text for a portfolio demonstration, not a real policy.";

const h2 = (key: string, text: string): LegalBlock => ({ _type: "h2", _key: key, text });
const h3 = (key: string, text: string): LegalBlock => ({ _type: "h3", _key: key, text });
const p = (key: string, text: string): LegalBlock => ({ _type: "p", _key: key, text });
const inShort = (key: string): LegalBlock => h3(`${key}-short`, "In short:");

export const privacyPolicy: LegalDoc = {
  _type: "legalPage",
  slug: "privacy-policy",
  title: "Privacy Policy",
  updated: UPDATED,
  seo: { description: "Sample privacy text for this portfolio demonstration: it collects no personal information." },
  intro: [
    { _key: "sample", text: SAMPLE_LINE },
    { _key: "about", text: "This site is a portfolio demonstration of an online jewelry store. It is not a store: nothing is for sale, and no order can be placed. This notice describes what the site does with information when you use it:" },
    { _key: "uses", items: ["when you browse its pages;", "when you add pieces to the bag;", "when you fill in one of its forms."] },
  ],
  body: [
    h2("summary", "Summary of Key Points"),
    p("summary-1", "The site collects no personal information. Its forms send nothing anywhere. The bag keeps the pieces you choose in a cart in a Shopify development store, with no personal details, and remembers that cart in your browser. No order can be placed and no payment is taken."),
    h3("summary-forms", "Do the forms send anything?"),
    p("summary-forms-1", "No. The newsletter signup, Drop a Hint, the support page’s message form and the sample account pages’ address form send nothing anywhere, and nothing you type is stored on a server."),
    h3("summary-tracking", "Is there any tracking?"),
    p("summary-tracking-1", "No. The site sets no cookies of its own and uses no analytics or advertising trackers."),

    h2("collect", "What Information Do We Collect?"),
    inShort("collect"),
    p("collect-1", "None that identifies you. The table shows each kind of information and what the site does with it."),
    { _type: "label", _key: "collect-label", text: "Information you type into the site" },
    p("collect-2", "Anything you type into a form stays in the page. Addresses you add on the sample account pages, and the bag’s note and care plan choices, are kept in your browser’s local storage, on your device only."),
    {
      _type: "table",
      _key: "collect-table",
      caption: "What the site keeps, and where",
      columns: ["Category", "Examples", "Collected"],
      rows: [
        ["Identifiers", "Name, email address, phone number, postal address", "No"],
        ["Payment information", "Card numbers and billing details (never asked for)", "No"],
        ["Bag contents", "The pieces, metals, sizes and care plans you choose, held in a Shopify development store cart without personal details", "Yes"],
        ["Browser storage", "The cart’s id, the bag’s note and care plan choices, addresses added on the sample account pages", "Your device only"],
        ["Analytics and advertising", "Page views, tracking cookies", "No"],
      ],
    },

    h2("process", "How Do We Process Your Information?"),
    inShort("process"),
    p("process-1", "Only to show your bag. The cart in the Shopify development store holds the pieces you choose so the bag can show them on every page; nothing else is done with it."),

    h2("share", "When and with Whom Do We Share Your Information?"),
    inShort("share"),
    p("share-1", "The site has no personal information to share. Loading and using it involves three services, each under its own privacy policy:"),
    { _type: "list", _key: "share-list", items: [
      "GitHub Pages hosts the site and handles the requests your browser makes to load it.",
      "Adobe Fonts serves the site’s fonts to your browser.",
      "Shopify holds the bag’s cart in a development store; no order can be placed there.",
    ] },

    h2("choices", "Your Choices"),
    inShort("choices"),
    p("choices-1", "You can empty your bag at any time, and clear the site’s local storage in your browser’s settings to remove the cart’s id, the bag’s note, care plan choices and any addresses you added."),
  ],
};

export const termsOfUse: LegalDoc = {
  _type: "legalPage",
  slug: "terms-of-use",
  title: "Terms of Use",
  updated: UPDATED,
  seo: { description: "Sample terms for this portfolio demonstration: nothing is for sale and no order can be placed." },
  intro: [
    { _key: "sample", text: SAMPLE_LINE },
    { _key: "about", text: "This site is a portfolio demonstration of an online jewelry store. By using it you accept that:" },
    { _key: "points", items: ["it is not a store, and nothing on it is for sale;", "its products, prices, reviews and contact details are sample content;", "no order can be placed and no payment is taken."] },
  ],
  body: [
    h2("summary", "Summary of Key Points"),
    p("summary-1", "Browse and try every part of the site, including the ring and earrings builders and the bag. Checkout stops with a notice before any order is placed."),

    h2("about", "About This Site"),
    inShort("about"),
    p("about-1", "A design and front-end portfolio piece, not the Sky Jewelry store."),
    { _type: "label", _key: "about-label", text: "Sample content" },
    p("about-2", "Product names, prices, ship dates, reviews, customer stories and contact details are sample content for the demonstration. Products and prices come from a Shopify development store."),

    h2("orders", "Products, Prices and Orders"),
    inShort("orders"),
    p("orders-1", "No order can be placed. The bag works, but Secure Checkout shows a notice instead of taking an order, and no payment details are ever asked for."),
    {
      _type: "table",
      _key: "orders-table",
      caption: "What works on this site",
      columns: ["Feature", "What it does here", "Real order"],
      rows: [
        ["Bag", "Holds the pieces you choose in a Shopify development store cart", "No"],
        ["Secure Checkout", "Shows a notice that this is a portfolio demonstration", "No"],
        ["Forms", "Send nothing anywhere", "No"],
      ],
    },

    h2("content", "Information on This Site"),
    inShort("content"),
    p("content-1", "The Education Center and Blog give general jewelry information for the demonstration. It is not professional advice: ask a qualified jeweler before you buy."),

    h2("links", "Links to Other Sites"),
    inShort("links"),
    p("links-1", "The footer links to social sites, which have their own terms."),

    h2("changes", "Changes to These Terms"),
    inShort("changes"),
    p("changes-1", "This sample text may change as the demonstration changes. The date at the top shows the last change."),
  ],
};

export const shippingInfo: LegalDoc = {
  _type: "legalPage",
  slug: "shipping",
  title: "Shipping Info",
  updated: UPDATED,
  seo: { description: "Sample shipping text for this portfolio demonstration: no order can be placed, so nothing ships." },
  intro: [
    { _key: "sample", text: SAMPLE_LINE },
    { _key: "about", text: "This site is a portfolio demonstration of an online jewelry store. No order can be placed, so nothing ships from it. This page explains the shipping details you will see in the design:" },
    { _key: "points", items: ["ship dates on products and in the builders;", "shipping and returns in the guarantee;", "shipping in the bag."] },
  ],
  body: [
    h2("summary", "Summary of Key Points"),
    p("summary-1", "Shipping and return details on this site are sample content from the design. Nothing is shipped, and there is nothing to return."),

    h2("dates", "Ship Dates"),
    inShort("dates"),
    p("dates-1", "Sample dates. Each product shows when it would ship, from the sample data in the Shopify development store, and the product lists can be filtered by it."),

    h2("guarantee", "Shipping and Returns in the Guarantee"),
    inShort("guarantee"),
    p("guarantee-1", "Sample text from the design. The table shows where each appears and what it means here."),
    {
      _type: "table",
      _key: "guarantee-table",
      caption: "Shipping and returns shown in the design",
      columns: ["Shown as", "Where", "On this site"],
      rows: [
        ["Free shipping worldwide", "The guarantee strip and FAQs", "Nothing ships"],
        ["30 day free return and exchange", "The guarantee, the bag and FAQs", "No orders to return"],
        ["Ships in a number of days", "Products and the builders", "Sample data"],
      ],
    },

    h2("bag", "Shipping in the Bag"),
    inShort("bag"),
    p("bag-1", "The bag shows the ship date of each piece. Secure Checkout stops with a notice, so no shipping address is ever asked for."),
  ],
};

export const legalDocs = [privacyPolicy, termsOfUse, shippingInfo];
