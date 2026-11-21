/*
 * The support and guarantee page, /the-sky-guarantee/ (Figma "Sky Guarantee": desktop 3565:101916, mobile 3587:129907),
 * shaped like a Sanity document. Figma's card bodies, section intros and FAQ are Latin filler: each card keeps its drawn
 * title, and the line under it either repeats a claim the design itself makes elsewhere (the source is named beside it)
 * or is a neutral line that adds nothing. Nothing here is a commitment beyond what the design states.
 */
import { em, span, type RichSpan } from "@/components/ui/RichText";
import type { IconName } from "@/components/ui/Icon";
import type { ImageRef } from "@/components/ui/Picture";
import { siteFooter } from "./site";

export type SupportCard = {
  _key: string;
  icon: IconName;
  title: string;
  body: string;
  /** Where the design states the claim in `body` (for the report and the style guide; not shown). */
  source: string;
  /** "Request", "Contact Us" and the like: drawn, but with nothing to connect to (inert, Held for review). */
  action?: string;
};

/** Lines that state a design claim, shared by the guarantee strip, the cards and the FAQ. */
export const CLAIMS = {
  lifetimeWarranty: { text: "Sky offers a lifetime warranty.", source: "Modal - Insurance 5029:82247 (“Sky offers a lifetime warranty …”); the guarantee strip’s title (Wedding Bands 3565:97246, Diamonds 3565:97438, Gemstones 3565:97781)" },
  freeShipping: { text: "Free shipping worldwide.", source: "Top Bar 3565:101512 (“Free shipping worldwide”)" },
  freeReturns: { text: "30 days free returns.", source: "Top Bar 3565:101512 (“30 days free returns”); Builder 3 - Complete 3565:100090 (“30 days free return”)" },
  freeReturnExchange: { text: "30 day free return and exchange.", source: "Bag - Checkout 4985:72474 (“30 Day Free Return & Exchange”)" },
  experts: { text: "Get help from our experts.", source: "Sky Guarantee mobile 3587:129907, Book an Appointment card (“Get help from our experts”)" },
  guarantee: { text: "Part of the Sky Jewelry Guarantee.", source: "neutral: the guarantee strip’s heading “Sky Jewelry Guarantee” (Wedding Bands 3565:97246)" },
  repairs: { text: "Request it through Sky Repairs.", source: "Account - Profile 3565:97935 (“Sky Repairs”); Account - Order Details 3565:98015 (“Sky Repair Requests”, with Annual Shine and Diamond Warranty)" },
  support: { text: "Support around the clock.", source: "neutral: restates the drawn title “24/7 Support” (Sky Guarantee 3565:101916)" },
} as const;

export type SupportFaq = { _key: string; question: string; answer: string; source: string };

const contact = siteFooter.contact;

export const supportPage = {
  _type: "supportPage" as const,
  seo: { title: "Sky Jewelry Support", description: "The Sky Jewelry Guarantee, the services you can request and answers to common questions." },
  hero: {
    // Figma's hero photo (22e38582) is an Unsplash+ preview with its watermarks: a placeholder. The rings-and-chains
    // photo from Resource Detail's mobile hero stands in (Corrected design oversights).
    image: { desktop: "support-hero-d", mobile: "edu-hero-m", alt: "" } as ImageRef,
    /** Each breakpoint's own title: desktop “Sky Jewelry Support”, mobile “the Sky Guarantee” (Open questions). */
    title: { desktop: [span("Sky Jewelry "), em("Support")] as RichSpan[], mobile: [em("the"), span(" Sky Guarantee")] as RichSpan[] },
    body: "Our guarantee, the services you can request and answers to common questions.",
  },
  navLabel: "Sky Guarantee",
  contact: {
    // Mobile only: the desktop frame has this section hidden.
    heading: "Contact Sky Jewelry",
    nav: "Contact Sky Jewelry",
    locationsHeading: "Our Locations",
    // Figma repeats one address and its hours twice (a placeholder); shown once. The address is the footer's sample
    // address, and the hours are sample hours too (Figma's are the store's own), as the footer's mock contact details.
    address: contact.address,
    hoursLabel: "Business Hours",
    hours: ["Mon–Sat: 10AM – 6PM", "Sun: CLOSED"],
    cards: [
      { _key: "email", icon: "mail", title: "Email Us", body: contact.email, source: "drawn (Figma’s email replaced by the footer’s sample address)", action: "Contact Us" },
      { _key: "call", icon: "warranty", title: "Support", body: contact.phone, source: "drawn (Figma’s number replaced by the footer’s sample number)", action: "Give us a Call" },
      { _key: "appointment", icon: "map-pin", title: "Book an Appointment", body: "Get help from our experts", source: "drawn", action: "Book Now" },
      { _key: "text", icon: "text-message", title: "Text Us", body: "Text us to get the quickest response.", source: "drawn", action: contact.phone },
    ] satisfies SupportCard[],
    formHeading: "Send us a Message",
    fields: [
      { _key: "first", label: "First Name", type: "text", autoComplete: "given-name" },
      { _key: "last", label: "Last Name", type: "text", autoComplete: "family-name" },
      { _key: "email", label: "Email Address", type: "email", autoComplete: "email" },
      { _key: "phone", label: "Phone Number", type: "tel", autoComplete: "tel" },
    ],
    messageLabel: "Your Message",
    submit: "Send Message",
  },
  offerings: {
    heading: "Support Offerings",
    nav: "Support Offerings",
    body: "What the Sky Jewelry Guarantee covers.",
    cards: [
      { _key: "warranty", icon: "warranty", title: "Lifetime Warranty", body: CLAIMS.lifetimeWarranty.text, source: CLAIMS.lifetimeWarranty.source },
      { _key: "support", icon: "question-mark", title: "24/7 Support", body: CLAIMS.support.text, source: CLAIMS.support.source },
      { _key: "money-back", icon: "money-back-guarantee", title: "Money Back Guarantee", body: CLAIMS.freeReturns.text, source: CLAIMS.freeReturns.source },
      { _key: "experts", icon: "diamond-experts", title: "Diamond Experts", body: CLAIMS.experts.text, source: CLAIMS.experts.source },
      { _key: "conflict-free", icon: "natural-diamond", title: "Certified Conflict-Free", body: CLAIMS.guarantee.text, source: CLAIMS.guarantee.source },
      { _key: "returns", icon: "truck", title: "Free Returns", body: CLAIMS.freeReturnExchange.text, source: CLAIMS.freeReturnExchange.source },
    ] satisfies SupportCard[],
  },
  services: {
    heading: "Additional Services",
    nav: "Additional Services",
    body: "Services you can request for your jewelry.",
    cards: [
      { _key: "repair", icon: "repair", title: "Product Repair", body: CLAIMS.repairs.text, source: CLAIMS.repairs.source, action: "Request" },
      { _key: "shine", icon: "shine", title: "Annual Shine", body: CLAIMS.repairs.text, source: CLAIMS.repairs.source, action: "Request" },
      { _key: "diamond-warranty", icon: "warranty", title: "Diamond Warranty", body: CLAIMS.repairs.text, source: CLAIMS.repairs.source, action: "Request" },
    ] satisfies SupportCard[],
  },
  faqs: {
    heading: "Sky FAQs",
    nav: "FAQs",
    body: "Answers to common questions.",
    /** Figma: the second question open on desktop, all closed on mobile. */
    openOnDesktop: 1,
    items: [
      { _key: "shipping", question: "Is shipping free?", answer: "Yes. Shipping is free worldwide.", source: CLAIMS.freeShipping.source },
      { _key: "returns", question: "Can I return my order?", answer: "Yes. Returns and exchanges are free within 30 days.", source: CLAIMS.freeReturnExchange.source },
      { _key: "warranty", question: "Is my jewelry covered by a warranty?", answer: "Yes. Sky offers a lifetime warranty. Accidental damage isn’t covered.", source: "Modal - Insurance 5029:82247 (“Sky offers a lifetime warranty and 100% value guarantee, but accidental damage isn’t covered.”)" },
      { _key: "resizing", question: "Can my ring be resized?", answer: "Yes. Resizing is free for 60 days after purchase.", source: "Builder 3 - Complete 3565:100090 (“60 days free resizing after purchase”)" },
      { _key: "design", question: "Can I design my own ring?", answer: "Yes. Start with a setting or a center stone, then choose the other.", source: "Builder 1 - Setting 3565:101274 and the stone-first builder (Builder Stone First - Stone 5440:31393)" },
      { _key: "lab-grown", question: "Do you offer lab-grown diamonds?", answer: "Yes. You can choose a lab-grown or a natural diamond.", source: "Builder 2 - Stone 3565:101144 (Lab Grown and Natural)" },
      { _key: "installments", question: "Can I pay in installments?", answer: "Yes. You can pay in interest-free installments.", source: "Builder 2 - Stone 3565:101144 (“Pay in 4 interest-free installments”); Bag - Checkout 4985:72474 (“Pay in 12 interest free payments”)" },
      { _key: "experts", question: "Can I talk to an expert before I choose?", answer: "Yes. Book a personalized consultation with one of our jewelry experts, in our showroom or in a one-on-one online session.", source: "Builder 1 - Setting Info 3565:100536 (“Book a personalized consultation with one of our jewelry experts in our showroom or in a one-on-one online session”)" },
      { _key: "ships", question: "When will my order ship?", answer: "Each piece shows when it ships on its page.", source: "Builder 3 - Complete 3565:100090 (“Ships in 2-3 weeks”); Builder 2 - Stone 3565:101144 (“Ships By”)" },
      { _key: "guarantee", question: "What does the Sky Jewelry Guarantee include?", answer: "A lifetime warranty, free shipping, a money back guarantee, diamond experts and certified conflict-free diamonds.", source: "the guarantee strip’s five titles (Wedding Bands 3565:97246, Diamonds 3565:97438, Gemstones 3565:97781)" },
    ] satisfies SupportFaq[],
  },
};
