/*
 * Site-wide content: announcement bar, header navigation and footer.
 * Shaped like Sanity documents (a _type plus plain fields) so it can move to Sanity later.
 * Copy is from the Figma Header and Footer pages. Hrefs point at routes that later tasks will build.
 */
import type { IconName } from "@/icons/icon-data";

export type NavLink = { _key: string; label: string; href: string };

export type AnnouncementBarContent = {
  _type: "announcementBar";
  /** "messages" is the default. "countdown" shows the sale timer. */
  mode: "messages" | "countdown";
  messages: string[];
  countdown: { label: string; endsAt: string };
  contact: NavLink;
};

export type HeaderContent = {
  _type: "siteHeader";
  utility: NavLink[];
  primary: NavLink[];
  account: NavLink;
  bag: NavLink;
  search: NavLink;
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
  payments: Array<{ _key: string; label: string; icon: IconName }>;
};

export const announcementBar: AnnouncementBarContent = {
  _type: "announcementBar",
  mode: "messages",
  messages: ["30 days free returns", "Free Shipping Worldwide", "Lifetime Warranty"],
  // Mock sale end date for the countdown variant.
  countdown: { label: "Up to 20% Off", endsAt: "2026-12-01T05:00:00.000Z" },
  contact: { _key: "contact", label: "Contact", href: "/contact/" },
};

export const siteHeader: HeaderContent = {
  _type: "siteHeader",
  utility: [
    { _key: "locations", label: "Locations", href: "/locations/" },
    { _key: "our-story", label: "Our Story", href: "/our-story/" },
    { _key: "support", label: "Support", href: "/support/" },
  ],
  primary: [
    { _key: "fine-jewelry", label: "Fine Jewelry", href: "/fine-jewelry/" },
    { _key: "engagement-rings", label: "Engagement Rings", href: "/engagement-rings/" },
    { _key: "wedding-bands", label: "Wedding Bands", href: "/wedding-bands/" },
    { _key: "diamonds", label: "Diamonds", href: "/diamonds/" },
    { _key: "gemstones", label: "Gemstones", href: "/gemstones/" },
    { _key: "education", label: "Education", href: "/education/" },
  ],
  account: { _key: "account", label: "Account", href: "/account/" },
  bag: { _key: "bag", label: "Bag", href: "/bag/" },
  search: { _key: "search", label: "Search", href: "/search/" },
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
  description:
    "Volutpat ridiculus amet tortor amet consectetur. Pulvinar integer dis pellentesque aliquam viverra ultricies in adipiscing velit. Blandit sit aliquet ante eu. Tempor aliquam ultrices sollicitudin.",
  contact: {
    address: "354 Lenox Ave, New York NY 10027",
    phone: "+1 (212) 601-2750",
    email: "info@skyjewelry.net",
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
  payments: [
    { _key: "visa", label: "Visa", icon: "visa" },
    { _key: "mastercard", label: "Mastercard", icon: "mastercard" },
    { _key: "amex", label: "American Express", icon: "amex" },
  ],
};
