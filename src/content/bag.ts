/*
 * Bag panel (Figma "Bag Overlay" 5011:77722, mobile "Nav / Bag" 4990:74441), bag page (desktop "Bag / Cart"
 * 6579:196214, mobile "Bag Checkout" 6579:210059) and their modals. Shaped like a Sanity document.
 * Care plan prices are mock values held here, not in Shopify.
 */

/**
 * The newer bag design's additions (care plans, Edit links, the "Perfectly Paired Wedding Bands" row). Each is a
 * separate component behind its flag: turning a flag off goes back to the older bag design for that part.
 */
export const bagFeatures = { carePlans: true, editLinks: true, pairedBands: true } as const;

export type CarePlanId = "3-year" | "lifetime";
export type CarePlan = { _key: CarePlanId; name: string; rowName: string; provider: string; price: number };

export const bagContent = {
  heading: "Your Bag",
  panelHeading: "What’s in your bag",
  /** Mobile bag screen's back row (Figma "Nav / Bag"). */
  panelBack: "Your Bag",
  close: "Close bag",
  backToShopping: { label: "Back to Shopping", href: "/fine-jewelry/shop/" },
  remove: "Remove",
  edit: "Edit",
  quantity: "Quantity",
  decrease: "Decrease quantity",
  increase: "Increase quantity",
  currencySuffix: "USD",
  attributes: { metal: "Metal", carat: "Carat", size: "Size", caratValue: (carat: string) => `${carat} Total Carat Weight` },
  /** Fine Jewelry version of Figma's "This stone is no longer available." */
  unavailable: "This item is no longer available.",
  /**
   * A ring built in the ring builder: Figma's ring rows (the setting row's Metal, Band and Ring Size; the stone row's
   * Carat, Color, Cut and Clarity). Band is left out: the catalogue has no band value for a setting.
   */
  ring: {
    metal: "Metal",
    ringSize: "Ring Size",
    carat: "Carat",
    color: "Color",
    cut: "Cut",
    clarity: "Clarity",
    stoneUnavailable: "This stone is no longer available.",
    selectNewStone: "Select New Stone",
  },
  orderPrice: "Order Price",
  subtotal: "Subtotal",
  discount: "Discount",
  carePlans: "Care Plans",
  shippingNote: "Shipping upgrades & taxes calculated at checkout",
  total: "Total",
  installments: "Pay in 12 interest free payments of",
  learnMore: "learn more",
  secureCheckout: "Secure Checkout",
  shipsIn: (days: number) => `Ships in ${days} ${days === 1 ? "day" : "days"}`,
  returns: "30 Day Free Return & Exchange",
  /** Two lines in both frames. Figma's "I.E" is corrected to "i.e." (Corrected design oversights). */
  specialInstructions: ["Special Instructions?", "i.e. gift note or a note for us:"],
  gift: "This is a Gift",
  /** Desktop shows Return Policy, mobile Sky Repairs (each as its frame draws it). Figma's bodies are Latin filler. */
  returnPolicy: { title: "Return Policy", body: "Returns and exchanges are free within 30 days.", cta: "Learn More" },
  skyRepairs: { title: "Sky Repairs", body: "Find out how to arrange a repair for your Sky Jewelry piece.", cta: "Learn More" },
  pairedBands: {
    heading: "Perfectly Paired Wedding Bands",
    handles: ["flush-set-natural-diamond-band", "flush-set-lab-grown-diamond-band", "twig-diamond-stackable-band", "classic-2mm-band", "classic-4mm-band"],
  },
  empty: { message: "Your bag is empty.", cta: "Back to Shopping" },
  /** Not drawn: the bag page's Secure Checkout opens Figma's "Modal - Default" with this notice. */
  checkoutNotice: {
    heading: "This is a portfolio demo",
    body: "Sky Jewelry is a design portfolio project, so checkout stops here. No order is placed and no payment is taken.",
    close: "Back to Bag",
  },
  carePlan: {
    add: "Add a care plan",
    /** Figma's wording beside Add a care plan. */
    from: "from $89/year",
    learnMore: "Learn More",
    more: "About care plans",
    added: "added to your order",
    /** Desktop says Change, mobile Edit (each as its frame draws it). */
    change: { desktop: "Change", mobile: "Edit" },
    unavailableTitle: "This care plan is no longer available",
    unavailableBody: "Please remove it to continue to checkout.",
    /** Desktop says Remove Plan, mobile Remove. */
    removePlan: { desktop: "Remove Plan", mobile: "Remove" },
    plans: [
      { _key: "3-year", name: "3-Year Plan", rowName: "3-Year Care Plan", provider: "Jeweler’s Mutual Care Plan", price: 89 },
      { _key: "lifetime", name: "Lifetime Plan", rowName: "Lifetime Care Plan", provider: "Jeweler’s Mutual Care Plan", price: 149 },
    ] as CarePlan[],
  },
};

/** Figma "Modal / Care Plan" (6579:196459) and its loading state (6579:196464). */
export const carePlanModal = {
  heading: "Protect Your Purchase",
  body: "Jeweler's Mutual covers accidental damage, loss, and theft, with a claims team that specializes in fine jewelry. Choose a plan to add it alongside your ring.",
  plansLabel: "Care plans",
  loading: "Loading Plans...",
  noThanks: "No Thanks",
  add: "Add Care Plan",
};

/** Figma "Modal - JM Info" (7260:61576). Figma's "Extend" is corrected to Jeweler's Mutual (Corrected design oversights). */
export const carePlanInfoModal = {
  provider: "Jeweler’s Mutual",
  heading: "Protect What You Love",
  body: "Sky offers a lifetime warranty and 100% value guarantee, but accidental damage isn't covered. We've partnered with Jeweler's Mutual to help protect your most meaningful designs through every moment.",
  features: [
    { _key: "damage", icon: "warranty", title: "Accidental Damage", body: "Coverage in case of chipped stones, broken clasps, bent prongs, or lost center stone." },
    { _key: "fees", icon: "security-card", title: "No Hidden Fees", body: "After the purchase of your Jeweler's Mutual protection, you won't experience any fees or deductible" },
    { _key: "claims", icon: "diamond-experts", title: "24/7 Online Claims", body: "Total convenience and fast, hassle-free resolutions." },
  ],
  cta: "Learn More",
} as const;

type Coverage = "yes" | "no" | "first-year";

/** One set of care plan prices everywhere: the plans table shows the picker's prices (Figma's frames disagree). */
const planPrice = (id: CarePlanId) => `$${bagContent.carePlan.plans.find((plan) => plan._key === id)?.price ?? ""}`;

/** Figma "Modal / JM Info v2" (7479:93082) and mobile "Modal / JM Info - Columns" (7479:93509). */
export const protectionPlansModal = {
  heading: "Sky Jewelry Protection Plans",
  intro: [
    {
      _key: "matters",
      icon: "warranty",
      title: "Protect What Matters",
      body: "Sky offers a lifetime warranty and 100% value guarantee, but accidental damage isn't covered. We've partnered with Jeweler's Mutual to help protect your most meaningful designs through every moment.",
    },
    {
      _key: "why",
      icon: "certificate",
      title: "Why Choose a Protection Plan with Jeweler's Mutual?",
      bullets: ["Simple claims, handled start to finish.", "Fair pricing with no fees and no deductibles.", "Backed by Jeweler's Mutual, specialists in jewelry care and insurance."],
    },
  ],
  columns: [
    { _key: "free", logo: "sky", title: "Free Warranty", subtitle: "Limited Lifetime", mobileTitle: "Lifetime Limited Warranty", price: "Free", plan: null },
    { _key: "3-year", logo: "jm", title: "Upgraded Plan**", subtitle: "3-Year", mobileTitle: "3-Year Upgraded Protection Plan**", price: planPrice("3-year"), plan: "3-year" },
    { _key: "lifetime", logo: "jm", title: "Upgraded Plan**", subtitle: "Lifetime", mobileTitle: "Lifetime Upgraded Protection Plan**", price: planPrice("lifetime"), plan: "lifetime" },
  ] as Array<{ _key: string; logo: "sky" | "jm"; title: string; subtitle: string; mobileTitle: string; price: string; plan: CarePlanId | null }>,
  /** Coverage per column: Sky's free warranty, then the two Jeweler's Mutual plans. */
  rows: [
    ["Free Warranty", "no", "yes", "yes"],
    ["Ring resizing", "first-year", "yes", "yes"],
    ["Inspection and cleaning", "yes", "yes", "yes"],
    ["Prong tightening", "yes", "yes", "yes"],
    ["Polishing and rhodium plating", "no", "yes", "yes"],
    ["Broken, bent, or worn prong repair", "no", "yes", "yes"],
    ["Center & accent stone replacement due to faulty setting", "no", "yes", "yes"],
    ["Cracked or thinning band repair", "no", "yes", "yes"],
    ["Clasp repair", "no", "yes", "yes"],
    ["Cracked or chipped stone replacement", "no", "yes", "yes"],
    ["Earring post repair", "no", "yes", "yes"],
    ["Pearl restringing", "no", "yes", "yes"],
  ] as Array<[string, Coverage, Coverage, Coverage]>,
  firstYearOnly: "First year only*",
  included: "Included",
  select: "Select Plan",
  viewDetails: "View Plan Details",
  hideDetails: "Hide Plan Details",
  termsHeading: "Terms & Conditions",
  terms: "*Applicable only during the first year after purchase **Exclusions and limitations apply. For plan details, please see Terms & Conditions.",
  termsLinks: ["JM™ 3-Year Care Plan Terms & Conditions", "JM™ Lifetime Care Plan Terms & Conditions"],
  support: {
    heading: "Questions about coverage or claims?",
    body: "We’ll walk you through what's covered and which plan fits the piece you're buying.",
    cta: "Visit support page",
  },
};

/** Figma "Modal - Credit" (5019:79850): the installments "Learn more" on the product page, quick view and bag. */
export const creditModal = {
  providers: ["Affirm", "Klarna"],
  heading: "Get It Now, Pay Later",
  body: "Split your purchase to up-to 24 payments",
  rangeLabel: "Order Range:",
  noInterest: "No Interest",
  groups: [
    { _key: "small", range: "$400 - $999", plans: [{ _key: "4", title: "Pay in 4", body: "Pay bi-weekly", term: "6 weeks" }] },
    {
      _key: "large",
      range: "$1,000 - $17,500",
      plans: [
        { _key: "12", title: "Pay in 12", body: "Pay every month", term: "12 Months" },
        { _key: "24", title: "Pay in 24", body: "Pay every month", term: "24 Months" },
      ],
    },
  ],
  fineprint: [
    "*In case Interest is included it will be calculated at checkout",
    "Interest rates, as well as terms and conditions, will be determined by Shop-Pay under its sole discretion",
  ],
  previous: "Previous",
  next: "Next",
};
