/*
 * Copy and option lists for the ring builder (setting-first flow), from the Figma frames:
 * desktop Builder 1 - Setting 3565:101274, Setting Info 3565:100536, Builder 2 - Stone 3565:101144,
 * Stone Info 3565:100732, Builder - Gemstone 6659:72885, Color Dropdown 6659:109856, the Filters modals
 * 3565:101513 to 101515; mobile 3587:125289, 125815, 125351, 125910 and the Filters sheets.
 * Shaped like Sanity documents so it can move into a schema later.
 */
import type { IconName } from "@/components/ui/Icon";
import type { ImageRef } from "@/components/ui/Picture";
import { br, em, span, type RichSpan } from "@/components/ui/RichText";

export type Option<T extends string = string> = { value: T; label: string };

/** Setting styles, in the order of Figma's style tiles (Builder 1 - Setting). */
export const SETTING_STYLES = [
  { value: "solitaire", label: "Solitaire", icon: "solitaire" },
  { value: "pave", label: "Pave", icon: "pave" },
  { value: "channel-set", label: "Channel Set", icon: "channel-set" },
  { value: "side-stone", label: "Side Stone", icon: "side-stones" },
  { value: "three-stone", label: "Three Stone", icon: "three-stone" },
  { value: "bezel", label: "Bezel", icon: "bezel" },
  { value: "halo", label: "Halo", icon: "halo" },
  { value: "hidden-halo", label: "Hidden Halo", icon: "hidden-halo" },
  { value: "natural", label: "Natural", icon: "natural" },
] as const satisfies ReadonlyArray<Option & { icon: IconName }>;
export type SettingStyle = (typeof SETTING_STYLES)[number]["value"];

/** The mobile Filters / Setting sheet (3587:126356) draws eight style tiles: the desktop nine without Natural. */
export const SHEET_SETTING_STYLES = SETTING_STYLES.filter((style) => style.value !== "natural");

/** Stone shapes, in the order of Figma's shape tiles (Builder 2 - Stone). */
export const STONE_SHAPES = [
  { value: "round", label: "Round", icon: "round" },
  { value: "oval", label: "Oval", icon: "oval" },
  { value: "emerald", label: "Emerald", icon: "emerald" },
  { value: "princess", label: "Princess", icon: "princess" },
  { value: "cushion", label: "Cushion", icon: "cushion" },
  { value: "radiant", label: "Radiant", icon: "radiant" },
  { value: "asscher", label: "Asscher", icon: "asscher" },
  { value: "marquise", label: "Marquise", icon: "marquise" },
  { value: "heart", label: "Heart", icon: "heart" },
  { value: "pear", label: "Pear", icon: "pear" },
] as const satisfies ReadonlyArray<Option & { icon: IconName }>;
export type StoneShape = (typeof STONE_SHAPES)[number]["value"];

/**
 * The Setting page's "Center Stone Shape" tiles (Figma "Setting Options - Stone" 3565:101516) put Round, Oval,
 * Princess and Cushion first, with the rest behind More.
 */
export const SETTING_SHAPE_ORDER: StoneShape[] = ["round", "oval", "princess", "cushion", "emerald", "radiant", "asscher", "marquise", "heart", "pear"];

export const shapeLabel = (shape: string) => STONE_SHAPES.find((item) => item.value === shape)?.label ?? shape;
export const shapeIcon = (shape: string): IconName => STONE_SHAPES.find((item) => item.value === shape)?.icon ?? "round";
export const styleLabel = (style: string) => SETTING_STYLES.find((item) => item.value === style)?.label ?? style;
export const styleIcon = (style: string): IconName => SETTING_STYLES.find((item) => item.value === style)?.icon ?? "setting";

export type StoneOrigin = "natural" | "lab-grown";
export type StoneKind = "diamond" | "gemstone";

/** Grade scales as Figma's sliders draw them, lowest grade first. `short` is the slider label where Figma abbreviates. */
export const DIAMOND_SCALES = {
  cut: [
    { value: "good", label: "Good" },
    { value: "very-good", label: "Very Good" },
    { value: "excellent", label: "Excellent" },
  ],
  color: ["J", "I", "H", "G", "F", "E", "D"].map((grade) => ({ value: grade, label: grade })),
  clarity: ["SI1", "VS2", "VS1", "VVS2", "VVS1", "IF", "FL"].map((grade) => ({ value: grade, label: grade })),
  polish: [
    { value: "good", label: "Good" },
    { value: "very-good", label: "Very Good" },
    { value: "excellent", label: "Excellent" },
  ],
  symmetry: [
    { value: "good", label: "Good" },
    { value: "very-good", label: "Very Good" },
    { value: "excellent", label: "Excellent" },
  ],
  fluorescence: [
    { value: "strong", label: "Strong" },
    { value: "medium", label: "Medium" },
    { value: "faint", label: "Faint" },
    { value: "none", label: "None" },
  ],
} satisfies Record<string, Option[]>;

/** Gemstone scales as the Gemstone frames label them (6659:72885; Filters / Gemstones 6659:107965). */
export const GEM_SCALES = {
  cut: ["F", "GD", "VG", "EX", "FAC", "CAB"].map((grade) => ({ value: grade, label: grade })),
  clarity: ["EC", "EC1", "EC2", "SI", "MI", "VI1", "VI2"].map((grade) => ({ value: grade, label: grade })),
} satisfies Record<string, Option[]>;

/** Gemstone colours, in the order of Figma's Color dropdown (6659:112899). Swatches are that dropdown's fills where the site already has them. */
export const GEM_COLORS = [
  { value: "blue", label: "Blue", swatch: "#cdd5ee" },
  { value: "green", label: "Green", swatch: "#ccf0cc" },
  { value: "red", label: "Red", swatch: "#f7a59d" },
  { value: "pink", label: "Pink", swatch: "#f4c8c8" },
  { value: "yellow", label: "Yellow", swatch: "#e0d06b" },
  { value: "orange", label: "Orange", swatch: "#f7d89d" },
  { value: "purple", label: "Purple", swatch: "#dad0f5" },
  { value: "white", label: "White", swatch: "#f3f1e7" },
  { value: "black", label: "Black", swatch: "#939486" },
] as const satisfies ReadonlyArray<Option & { swatch: string }>;
export type GemColor = (typeof GEM_COLORS)[number]["value"];

/** Gemstone types. Figma draws the Type dropdown closed ("All Types"); these are the stones the site's menus name. */
export const GEM_TYPES = [
  { value: "sapphire", label: "Sapphire" },
  { value: "ruby", label: "Ruby" },
  { value: "emerald", label: "Emerald" },
  { value: "moissanite", label: "Moissanite" },
] as const satisfies ReadonlyArray<Option>;
export type GemType = (typeof GEM_TYPES)[number]["value"];

/** Treatments, in the order of the mobile Filters / Gemstones sheet (two columns, read down each). */
export const GEM_TREATMENTS = [
  { value: "none", label: "None" },
  { value: "heating", label: "Heating" },
  { value: "oiling", label: "Oiling" },
  { value: "diffusion", label: "Diffusion" },
  { value: "irradiation", label: "Irradiation" },
  { value: "filling", label: "Filling" },
  { value: "waxing", label: "Waxing" },
  { value: "lasering", label: "Lasering" },
] as const satisfies ReadonlyArray<Option>;

export const CERTIFICATES = ["GIA", "AGS", "IGI"] as const;
export type Certificate = (typeof CERTIFICATES)[number];

export const gradeLabel = (scale: Option[], value: string) => scale.find((item) => item.value === value)?.label ?? value;

/** Planned route of Step 3 (Builder 3 - Complete), which belongs to part 2. */
export const COMPLETE_ROUTE = "/design-your-own/complete/";

export type PromoCard = {
  _key: string;
  /** How many setting cards come before it, as each frame places it. null: that frame doesn't draw it. */
  after: { desktop: number; mobile: number | null };
  /** Desktop: "wide" spans two columns (616 x 400). Mobile: "wide" spans both columns (350 x 228). */
  width: { desktop: "single" | "wide"; mobile: "single" | "wide" };
  title: string;
  body: string;
  cta: { label: string; href: string };
  image: ImageRef;
};

export const builderContent = {
  _type: "ringBuilder" as const,
  steps: {
    label: "Design your ring",
    setting: { verb: "Select", noun: "Setting" },
    diamond: { verb: "Select", noun: "Diamond" },
    stone: { verb: "Select", noun: "Stone" },
    complete: { verb: "Complete", noun: "Ring" },
    edit: "Edit",
    remove: "Remove",
  },
  settings: {
    seo: { title: "Design Your Own Ring: Choose a Setting", description: "Choose an engagement ring setting, then pair it with a diamond or gemstone." },
    // The mobile frame (3587:125319) breaks the line after "your".
    heading: [span("Choose "), em("your"), br(true), span(" Perfect Setting")] as RichSpan[],
    styleLegend: "Setting style",
    setWith: "Set with",
    /** The Set with control before a shape is chosen. Figma only draws it chosen ("Set with Round"). */
    shape: "Shape",
    shapePanel: "Center Stone Shape",
    style: "Style",
    withStone: "with stone:",
    chooseSetting: "Choose Setting",
    addSetting: "Add Setting",
    empty: "No settings matching your selection. Try adjusting your filters.",
    /**
     * Promo cards as each frame places them. Desktop (3565:101274): a single card closing row 1 (after 3 settings), a
     * two-column card opening row 4 (after 11) and a single card second in row 7 (after 22). Mobile (3587:125289):
     * a single card fourth (after 3), then a full-width card after 9. Figma's copy is the placeholder
     * "Promotional Headline" with Latin filler.
     */
    promos: [
      {
        _key: "consult",
        after: { desktop: 3, mobile: 3 },
        width: { desktop: "single", mobile: "single" },
        title: "Not Sure Where to Start?",
        body: "Talk to us about settings, stones and sizing before you choose.",
        cta: { label: "Learn More", href: "/contact/" },
        image: { desktop: "builder-promo-hands-d", mobile: "builder-promo-hands-m", alt: "A hand wearing a pear-shaped halo ring resting on another hand" },
      },
      {
        _key: "guarantee",
        after: { desktop: 11, mobile: 9 },
        width: { desktop: "wide", mobile: "wide" },
        title: "The Sky Guarantee",
        body: "Every ring comes with our lifetime warranty and 30-day returns.",
        cta: { label: "Learn More", href: "/the-sky-guarantee/" },
        image: { desktop: "builder-promo-couple-d", alt: "A couple holding hands outdoors, one wearing a halo engagement ring" },
      },
      {
        _key: "education",
        after: { desktop: 22, mobile: null },
        width: { desktop: "single", mobile: "single" },
        title: "Learn the 4Cs",
        body: "How cut, color, clarity and carat shape a diamond.",
        cta: { label: "Learn More", href: "/education/the-4cs-of-diamonds/" },
        image: { desktop: "builder-promo-hands-2-d", alt: "Two hands, one wearing a diamond ring" },
      },
    ] as PromoCard[],
  },
  setting: {
    centerShape: "Center Stone Shape",
    material: "Material",
    chooseThis: "Choose This Setting",
    removeSetting: "Remove Setting",
    info: "Your Setting Info",
    quickCheckout: { title: "Quick Checkout", body: "Pick the origin and size of your center stone, and we’ll curate a diamond perfectly suited to your ring." },
    consultant: {
      title: "Meet With Our Consultant",
      body: "Book a personalized consultation with one of our jewelry experts in our showroom or in a one-on-one online session.",
      virtual: "Virtual",
      inPerson: "In-Person",
      bookNow: "Book Now",
    },
    paired: "Perfectly Paired Wedding Bands",
    shownWith: (carat: string) => `Shown with ${carat} ct`,
    cards: {
      width: { label: "Width", note: "Measured at the base of the ring" },
      tcw: { label: "Approx. TCW", note: "The setting’s average total carat weight" },
      accent: { label: "Accent Gems", color: "Color", clarity: "Clarity", note: "Side stones average color & clarity" },
      profile: { label: "Profile" },
    },
  },
  stones: {
    seo: { title: "Design Your Own Ring: Choose a Stone", description: "Choose a natural or lab-grown diamond or a gemstone by shape and quality." },
    heading: [span("Select "), em("your"), span(" stone shape "), em("and"), span(" Quality")] as RichSpan[],
    origins: [
      { value: "natural", label: "Natural" },
      { value: "lab-grown", label: "Lab-Grown" },
    ] as Option<StoneOrigin>[],
    shapeLegend: "Stone shape",
    shape: "Shape",
    cut: "Cut",
    color: "Color",
    clarity: "Clarity",
    carat: "Carat",
    price: "Price",
    certificate: "Certificate",
    type: "Type",
    allColors: "All Colors",
    allTypes: "All Types",
    advanced: "Advanced Filters",
    polish: "Polish",
    symmetry: "Symmetry",
    fluorescence: "Fluorescence",
    table: "Table(%)",
    depth: "Depth(%)",
    ratio: "L/W Ratio",
    treatment: "Treatment",
    showing: "Showing",
    of: "of",
    withSetting: "with setting:",
    completeRing: "Complete Ring",
    empty: "No stones matching your selection. Try adjusting your filters.",
    stats: { carat: "Carat", color: "Color", clarity: "Clarity", ratio: "Ratio" },
    /** Help copy for the Cut / Color / Clarity modal (3565:101513 to 101515; mobile 3587:126684 to 126686). */
    help: {
      cut: "A diamond’s cut evaluates its proportions and how effectively it reflects light. Cut grades range from “Excellent” to “Poor.” Diamonds with excellent cuts display remarkable fire, brilliance, and scintillation.",
      color:
        "Color describes the natural hue found in a diamond. The less color a diamond has, the rarer and more valuable it tends to be. Diamonds are graded on a standard color scale ranging from D (completely colorless) to J (nearly colorless).",
      clarity:
        "Most diamonds contain imperfections, such as internal flaws or surface blemishes. These are graded on a scale from FL (flawless) to I1–I3 (included). FL diamonds are the rarest and most difficult to come by.",
    },
  },
  stone: {
    completeYourRing: "Complete Your Ring",
    removeStone: "Remove Stone",
    diamondInfo: "Your Diamond Info",
    stoneInfo: "Your Stone Info",
    diamondSpecs: "Diamond Specs",
    stoneSpecs: "Stone Specs",
    sizeGuide: "Diamond Carat Size Guide",
    viewCertificate: "View Certificate",
    ratio: "Ratio",
  },
  installments: "Pay in 12 interest free payments of",
  learnMore: "Learn more",
  info: "Info",
  viewMore: "View More",
  /** Cards before View More: the desktop frame draws 24 settings, the mobile frame 15; the stone frames 16. */
  settingsPageSize: { desktop: 24, mobile: 15 },
  pageSize: 16,
};
