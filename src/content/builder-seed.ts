/*
 * The ring builder's sample catalogue: the ring settings added for the builder and the loose stones.
 * One source for two things, like catalog-seed.ts:
 *   1. shopify/builder-import.csv (npm run shopify:builder), which Rob imports into the Shopify store;
 *   2. the local catalogue the build uses until those products are in Shopify (src/lib/builder.ts).
 * The 43 products of catalog-seed.ts, including the four engagement rings from Home's best sellers, are not
 * repeated here and their CSV rows are never rewritten.
 *
 * SAMPLE DATA: names, grades, measurements, lead times and prices are invented for the portfolio build.
 * Prices come from the formulas below. This file has no runtime imports, so the Node script can load it.
 */
import type { PhotoName, SeedProduct } from "./catalog-seed";

/* ------------------------------------------------------------------ settings */

export type SettingSpecs = {
  /** Band width in mm at the base of the ring. */
  width: number;
  /** Approximate total carat weight of the accent stones; 0 when the setting has none. */
  tcw: number;
  profile: "low" | "medium" | "high";
};

/**
 * Ring settings added for the builder. Each is built around a ring photo that exists in Figma (the same photos
 * the Fine Jewelry catalogue uses), and offers a metal only where Figma has that photo in that colour; platinum
 * and 18K reuse the photo of their colour, as in catalog-seed.ts. The first, the vine setting, is the ring every
 * builder frame draws. Its 14K price is Figma's $1,250.
 * Tags: "setting", "style:<style>" and the specs "width:", "tcw:" and "profile:"; all read from the Storefront API's
 * tags field, so no metafields are needed.
 */
const SETTINGS: Array<SeedProduct & { specs: SettingSpecs }> = [
  {
    handle: "vine-engagement-ring-setting",
    type: "Engagement Rings",
    title: "Vine Engagement Ring Setting in {metal}",
    description: "A band of twisting vines with marquise accent diamonds, ready for the center stone you choose.",
    styles: ["natural"],
    shipsInDays: 7,
    metals: {
      "14k-white-gold": ["ring-vine-white-gold"],
      "14k-yellow-gold": ["ring-vine-yellow-gold"],
      "14k-rose-gold": ["ring-vine-rose-gold"],
      platinum: ["ring-vine-white-gold"],
      "18k-yellow-gold": ["ring-vine-yellow-gold"],
      "18k-white-gold": ["ring-vine-white-gold"],
      "18k-rose-gold": ["ring-vine-rose-gold"],
    },
    prices: 1250,
    specs: { width: 1.8, tcw: 0.12, profile: "medium" },
  },
  {
    handle: "classic-solitaire-engagement-ring-setting",
    type: "Engagement Rings",
    title: "Classic Solitaire Engagement Ring Setting in {metal}",
    description: "A slim four-prong band that leaves the center stone to speak for itself.",
    styles: ["solitaire"],
    shipsInDays: 5,
    metals: {
      "14k-white-gold": ["ring-round-solitaire-white-gold"],
      "14k-yellow-gold": ["ring-round-solitaire-yellow-gold", "ring-round-solitaire-yellow-gold-closeup"],
      platinum: ["ring-round-solitaire-white-gold"],
      "18k-yellow-gold": ["ring-round-solitaire-yellow-gold", "ring-round-solitaire-yellow-gold-closeup"],
    },
    prices: 890,
    specs: { width: 1.6, tcw: 0, profile: "high" },
  },
  {
    handle: "petite-solitaire-engagement-ring-setting",
    type: "Engagement Rings",
    title: "Petite Solitaire Engagement Ring Setting in {metal}",
    description: "A fine yellow gold band with a low basket for the center stone.",
    styles: ["solitaire"],
    shipsInDays: 5,
    metals: { "14k-yellow-gold": ["ring-oval-solitaire-yellow-gold"], "18k-yellow-gold": ["ring-oval-solitaire-yellow-gold"] },
    prices: 950,
    specs: { width: 1.4, tcw: 0, profile: "low" },
  },
  {
    handle: "pave-engagement-ring-setting",
    type: "Engagement Rings",
    title: "Pavé Engagement Ring Setting in {metal}",
    description: "A band lined with small pavé-set diamonds on each side of the center stone.",
    styles: ["pave"],
    shipsInDays: 7,
    metals: { "14k-yellow-gold": ["ring-pave-emerald-yellow-gold"], "18k-yellow-gold": ["ring-pave-emerald-yellow-gold"] },
    prices: 1450,
    specs: { width: 1.8, tcw: 0.24, profile: "medium" },
  },
  {
    handle: "round-halo-engagement-ring-setting",
    type: "Engagement Rings",
    title: "Round Halo Engagement Ring Setting in {metal}",
    description: "A circle of small diamonds that frames the center stone, on a rose gold band.",
    styles: ["halo"],
    shipsInDays: 10,
    metals: { "14k-rose-gold": ["ring-round-halo-rose-gold"], "18k-rose-gold": ["ring-round-halo-rose-gold"] },
    prices: 1650,
    specs: { width: 1.7, tcw: 0.3, profile: "high" },
  },
  {
    handle: "marquise-side-stone-engagement-ring-setting",
    type: "Engagement Rings",
    title: "Marquise Side-Stone Engagement Ring Setting in {metal}",
    description: "Marquise accent diamonds sit on each side of the center stone.",
    styles: ["side-stone"],
    shipsInDays: 7,
    metals: { "14k-white-gold": ["ring-side-stone-white-gold"], platinum: ["ring-side-stone-white-gold"] },
    prices: 1550,
    specs: { width: 1.9, tcw: 0.2, profile: "medium" },
  },
];

export const settingSeeds: Array<SeedProduct & { specs: SettingSpecs }> = SETTINGS.map((seed) => ({
  ...seed,
  tags: ["engagement-rings", "setting", `width:${seed.specs.width.toFixed(1)}`, `tcw:${seed.specs.tcw.toFixed(2)}`, `profile:${seed.specs.profile}`],
}));

/** The four engagement rings already in the store carry no builder tags (their rows must not change): their style is read from the handle. */
export const EXISTING_SETTING_STYLES: Record<string, string> = {
  "channel-set-ring": "channel-set",
  "halo-ring": "halo",
  "side-stone-ring": "side-stone",
  "eternity-ring": "pave",
};

/** Specs for a setting with no spec tags (the four existing rings), by style. */
export const DEFAULT_SETTING_SPECS: Record<string, SettingSpecs> = {
  "channel-set": { width: 2.2, tcw: 0.25, profile: "low" },
  halo: { width: 1.7, tcw: 0.3, profile: "high" },
  "side-stone": { width: 1.9, tcw: 0.2, profile: "medium" },
  pave: { width: 1.8, tcw: 0.5, profile: "medium" },
  default: { width: 1.8, tcw: 0, profile: "medium" },
};

/* ------------------------------------------------------------------ stones */

/** Stone photos that exist in Figma (shopify/images/<name>.jpg): the builder's round diamond, the Diamonds landing page's shapes and the colour tiles. */
export const STONE_PHOTOS = {
  "stone-diamond-round": "A round diamond seen from above",
  "stone-diamond-cushion": "A cushion-cut diamond",
  "stone-diamond-emerald": "An emerald-cut diamond",
  "stone-diamond-radiant": "A radiant-cut diamond",
  "stone-diamond-marquise": "A marquise-cut diamond",
  "stone-yellow-cushion": "A yellow cushion-cut stone",
  "stone-pink-asscher": "A pink asscher-cut stone",
  "stone-purple-pear": "A purple pear-shaped stone",
  "stone-blue-oval": "A pale blue oval stone",
  "stone-red-oval": "A red oval stone",
} as const;
export type StonePhoto = keyof typeof STONE_PHOTOS;

export type SeedStone = {
  sku: string;
  handle: string;
  title: string;
  kind: "diamond" | "gemstone";
  origin: "natural" | "lab-grown";
  shape: string;
  carat: number;
  /** Diamonds: D to J. Gemstones: the colour slug (blue, green...). */
  color: string;
  clarity: string;
  cut: string;
  /** Gemstones only. */
  gem?: string;
  treatment?: string;
  certificate: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  /** Table and depth as a percentage of the width. */
  table: number;
  depth: number;
  /** Length-to-width ratio and the measurements in mm. */
  ratio: number;
  length: number;
  width: number;
  height: number;
  shipsInDays: number;
  price: number;
  /** null when Figma has no photo of this shape (diamonds) or of this colour in this shape (gemstones). */
  photo: StonePhoto | null;
};

/** Width in mm of a 1 carat stone, and the range of its length-to-width ratio, by shape. Size scales with the cube root of the weight. */
const SHAPE: Record<string, { w: number; ratio: [number, number]; table: [number, number]; depth: [number, number] }> = {
  round: { w: 6.45, ratio: [1, 1.01], table: [54, 60], depth: [59.5, 62.8] },
  oval: { w: 5.6, ratio: [1.35, 1.5], table: [56, 64], depth: [58, 64] },
  emerald: { w: 5.3, ratio: [1.3, 1.45], table: [60, 70], depth: [62, 70] },
  princess: { w: 5.5, ratio: [1, 1.04], table: [66, 76], depth: [68, 76] },
  cushion: { w: 5.6, ratio: [1, 1.15], table: [58, 68], depth: [62, 70] },
  radiant: { w: 5.4, ratio: [1.2, 1.35], table: [62, 72], depth: [62, 70] },
  asscher: { w: 5.5, ratio: [1, 1.03], table: [58, 68], depth: [62, 70] },
  marquise: { w: 5.1, ratio: [1.85, 2.1], table: [54, 62], depth: [58, 64] },
  heart: { w: 6.5, ratio: [0.95, 1.05], table: [54, 62], depth: [56, 62] },
  pear: { w: 5.6, ratio: [1.45, 1.65], table: [54, 62], depth: [58, 64] },
};

/**
 * PRICE FORMULA, diamonds (USD, rounded to $10):
 *   base x carat^1.8 x color x clarity x cut x shape
 *   base: $5,200 natural, $1,150 lab-grown (a 1.00ct G VS1 Excellent round)
 *   color: D 1.30, E 1.20, F 1.10, G 1.00, H 0.90, I 0.80, J 0.70
 *   clarity: FL 1.45, IF 1.30, VVS1 1.18, VVS2 1.10, VS1 1.00, VS2 0.92, SI1 0.80
 *   cut: Excellent 1.00, Very Good 0.92, Good 0.84; shape: round 1.00, every other shape 0.85
 */
const DIAMOND_BASE = { natural: 5200, "lab-grown": 1150 };
const COLOR_FACTOR: Record<string, number> = { D: 1.3, E: 1.2, F: 1.1, G: 1, H: 0.9, I: 0.8, J: 0.7 };
const CLARITY_FACTOR: Record<string, number> = { FL: 1.45, IF: 1.3, VVS1: 1.18, VVS2: 1.1, VS1: 1, VS2: 0.92, SI1: 0.8 };
const CUT_FACTOR: Record<string, number> = { excellent: 1, "very-good": 0.92, good: 0.84 };
const round10 = (value: number) => Math.max(10, Math.round(value / 10) * 10);

export const diamondPrice = (origin: "natural" | "lab-grown", shape: string, carat: number, color: string, clarity: string, cut: string) =>
  round10(DIAMOND_BASE[origin] * carat ** 1.8 * COLOR_FACTOR[color] * CLARITY_FACTOR[clarity] * CUT_FACTOR[cut] * (shape === "round" ? 1 : 0.85));

/**
 * PRICE FORMULA, gemstones (USD, rounded to $10):
 *   base x carat^1.4 x clarity x origin
 *   base per carat: ruby $2,200, emerald $1,800, sapphire $1,400, moissanite $450
 *   clarity: EC 1.20, EC1 1.10, EC2 1.00, SI 0.90, MI 0.80, VI1 0.70, VI2 0.60; origin: natural 1.00, lab-grown 0.35
 */
const GEM_BASE: Record<string, number> = { ruby: 2200, emerald: 1800, sapphire: 1400, moissanite: 450 };
const GEM_CLARITY_FACTOR: Record<string, number> = { EC: 1.2, EC1: 1.1, EC2: 1, SI: 0.9, MI: 0.8, VI1: 0.7, VI2: 0.6 };
export const gemPrice = (origin: "natural" | "lab-grown", gem: string, carat: number, clarity: string) =>
  round10(GEM_BASE[gem] * carat ** 1.4 * GEM_CLARITY_FACTOR[clarity] * (origin === "natural" ? 1 : 0.35));

const cap = (text: string) => text.replace(/(^|[\s-])([a-z])/g, (_, lead: string, letter: string) => lead + letter.toUpperCase());
const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
/** A repeatable value between 0 and 1 for stone `n` and a salt: no Math.random, so every build makes the same catalogue. */
const fraction = (n: number, salt: number) => {
  const x = Math.sin(n * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const between = ([min, max]: [number, number], t: number, decimals: number) => Number((min + (max - min) * t).toFixed(decimals));

function measurements(shape: string, carat: number, n: number) {
  const spec = SHAPE[shape];
  const ratio = between(spec.ratio, fraction(n, 1), 2);
  const depth = between(spec.depth, fraction(n, 2), 1);
  const table = between(spec.table, fraction(n, 3), 1);
  const width = Number((spec.w * Math.cbrt(carat)).toFixed(2));
  return { ratio, depth, table, width, length: Number((width * ratio).toFixed(2)), height: Number(((width * depth) / 100).toFixed(2)) };
}

/** 46 diamonds for each origin. Shapes repeat so that those Figma has photos for (round, cushion, emerald, radiant, marquise) come up most. */
const DIAMOND_SHAPES = [
  "round", "oval", "round", "cushion", "emerald", "round", "princess", "radiant", "round", "pear", "marquise", "round", "asscher", "oval", "cushion",
  "round", "heart", "emerald", "round", "princess", "radiant", "round", "oval", "cushion", "marquise", "round", "pear", "emerald", "round", "asscher",
  "oval", "round", "cushion", "radiant", "princess", "round", "heart", "marquise", "oval", "round", "pear", "emerald", "cushion", "round", "asscher", "radiant",
];
const DIAMOND_CARATS = [1, 0.5, 1.5, 0.7, 2, 0.63, 1.2, 0.9, 2.5, 1.01, 0.8, 3, 1.7, 0.55, 1.31, 4, 0.75, 2.2, 1.1, 5, 0.6, 1.8, 6];
const COLORS = ["J", "I", "H", "G", "F", "E", "D"];
const CLARITIES = ["SI1", "VS2", "VS1", "VVS2", "VVS1", "IF", "FL"];
const CUTS = ["excellent", "excellent", "very-good", "excellent", "good", "very-good"];
const FINISH = ["excellent", "very-good", "excellent", "good", "excellent", "very-good", "excellent"];
const FLUORESCENCE = ["none", "none", "faint", "none", "medium", "faint", "strong", "none"];
const CERTS = { natural: ["GIA", "GIA", "AGS", "GIA", "IGI"], "lab-grown": ["IGI", "IGI", "GIA", "IGI", "AGS"] };
const DIAMOND_PHOTO: Record<string, StonePhoto> = {
  round: "stone-diamond-round",
  cushion: "stone-diamond-cushion",
  emerald: "stone-diamond-emerald",
  radiant: "stone-diamond-radiant",
  marquise: "stone-diamond-marquise",
};

function diamonds(origin: "natural" | "lab-grown"): SeedStone[] {
  const lab = origin === "lab-grown";
  // Natural diamonds stop at 4.00ct; lab-grown run to 6.00ct, the top of Figma's carat slider.
  const carats = lab ? DIAMOND_CARATS : DIAMOND_CARATS.filter((carat) => carat <= 4);
  return DIAMOND_SHAPES.map((shape, i) => {
    const n = i + (lab ? 100 : 0);
    const carat = carats[(i * (lab ? 5 : 3)) % carats.length];
    const color = COLORS[(i * 3 + (lab ? 2 : 0)) % 7];
    const clarity = CLARITIES[(i * 5 + (lab ? 4 : 2)) % 7];
    const cut = CUTS[(i + (lab ? 2 : 0)) % CUTS.length];
    const sku = `SKY-${lab ? "LD" : "ND"}${String(i + 1).padStart(3, "0")}`;
    const title = `${carat.toFixed(2)}ct ${color} ${clarity} ${cap(shape)} ${lab ? "Lab-Grown" : "Natural"} Diamond`;
    return {
      sku,
      handle: `${slug(title)}-${sku.slice(4).toLowerCase()}`,
      title,
      kind: "diamond",
      origin,
      shape,
      carat,
      color,
      clarity,
      cut,
      certificate: CERTS[origin][i % 5],
      polish: FINISH[(i + 1) % FINISH.length],
      symmetry: FINISH[(i * 2 + 3) % FINISH.length],
      fluorescence: FLUORESCENCE[(i + (lab ? 3 : 0)) % FLUORESCENCE.length],
      ...measurements(shape, carat, n),
      shipsInDays: [3, 5, 7, 5, 10][i % 5],
      price: diamondPrice(origin, shape, carat, color, clarity, cut),
      photo: DIAMOND_PHOTO[shape] ?? null,
    };
  });
}

/**
 * 20 gemstones for each origin: colour, type and shape (moissanite is lab-grown only; see gemstones()). Entries with a star use a photo that exists in Figma
 * (the colour tiles: yellow cushion, pink asscher, purple pear, blue oval, red oval); the rest are there so every
 * colour, type and shape option has results, and show the shape drawing instead of a photo.
 */
const GEMS: Array<[color: string, gem: string, shape: string, photo?: StonePhoto]> = [
  ["yellow", "sapphire", "cushion", "stone-yellow-cushion"],
  ["pink", "sapphire", "asscher", "stone-pink-asscher"],
  ["purple", "sapphire", "pear", "stone-purple-pear"],
  ["blue", "sapphire", "oval", "stone-blue-oval"],
  ["red", "ruby", "oval", "stone-red-oval"],
  ["green", "emerald", "emerald"],
  ["orange", "sapphire", "round"],
  ["white", "moissanite", "round"],
  ["black", "sapphire", "princess"],
  ["blue", "sapphire", "oval", "stone-blue-oval"],
  ["green", "sapphire", "radiant"],
  ["red", "ruby", "heart"],
  ["yellow", "sapphire", "cushion", "stone-yellow-cushion"],
  ["blue", "sapphire", "marquise"],
  ["pink", "sapphire", "asscher", "stone-pink-asscher"],
  ["white", "moissanite", "oval"],
  ["purple", "sapphire", "pear", "stone-purple-pear"],
  ["green", "emerald", "emerald"],
  ["red", "ruby", "oval", "stone-red-oval"],
  ["blue", "sapphire", "round"],
];
const GEM_CARATS = [1, 1.5, 0.75, 2, 1.2, 2.5, 0.9, 3, 1.8, 0.6];
const GEM_CUTS = ["FAC", "EX", "VG", "GD", "F", "CAB"];
const GEM_CLARITIES = ["EC", "EC1", "EC2", "SI", "MI", "VI1", "VI2"];
const TREATMENTS = ["none", "heating", "oiling", "diffusion", "irradiation", "filling", "waxing", "lasering"];

function gemstones(origin: "natural" | "lab-grown"): SeedStone[] {
  const lab = origin === "lab-grown";
  return GEMS.map(([color, listedGem, shape, photo], i) => {
    // Moissanite is made in a lab: the natural list has white sapphires in those two places.
    const gem = !lab && listedGem === "moissanite" ? "sapphire" : listedGem;
    const n = i + (lab ? 300 : 200);
    const carat = GEM_CARATS[(i * 3 + (lab ? 1 : 0)) % GEM_CARATS.length];
    const clarity = GEM_CLARITIES[(i * 3 + (lab ? 1 : 0)) % 7];
    const sku = `SKY-${lab ? "LG" : "NG"}${String(i + 1).padStart(3, "0")}`;
    const name = gem === "moissanite" ? "Moissanite" : `${cap(color)} ${cap(gem)}`;
    const title = `${carat.toFixed(2)}ct ${cap(shape)} ${lab ? "Lab-Grown" : "Natural"} ${name}`;
    return {
      sku,
      handle: `${slug(title)}-${sku.slice(4).toLowerCase()}`,
      title,
      kind: "gemstone",
      origin,
      shape,
      carat,
      color,
      clarity,
      cut: GEM_CUTS[(i + (lab ? 3 : 0)) % GEM_CUTS.length],
      gem,
      treatment: TREATMENTS[(i + (lab ? 5 : 0)) % TREATMENTS.length],
      certificate: ["GIA", "IGI", "AGS"][(i + (lab ? 1 : 0)) % 3],
      polish: FINISH[(i + 2) % FINISH.length],
      symmetry: FINISH[(i + 4) % FINISH.length],
      fluorescence: "none",
      ...measurements(shape, carat, n),
      shipsInDays: [5, 7, 10][i % 3],
      price: gemPrice(origin, gem, carat, clarity),
      photo: photo ?? null,
    };
  });
}

/** Every loose stone: 46 natural diamonds, 46 lab-grown diamonds, 20 natural and 20 lab-grown gemstones (132). */
export const stoneSeeds: SeedStone[] = [...diamonds("natural"), ...diamonds("lab-grown"), ...gemstones("natural"), ...gemstones("lab-grown")];

/** The Shopify tags a stone is stored with. src/lib/builder.ts reads the same tags back. */
export function stoneTags(stone: SeedStone) {
  return [
    "loose-stone",
    `stone:${stone.kind}`,
    `origin:${stone.origin}`,
    `shape:${stone.shape}`,
    `carat:${stone.carat.toFixed(2)}`,
    `color:${stone.color}`,
    `clarity:${stone.clarity}`,
    `cut:${stone.cut}`,
    ...(stone.gem ? [`gem:${stone.gem}`] : []),
    ...(stone.treatment ? [`treatment:${stone.treatment}`] : []),
    `cert:${stone.certificate}`,
    `polish:${stone.polish}`,
    `symmetry:${stone.symmetry}`,
    `fluor:${stone.fluorescence}`,
    `table:${stone.table.toFixed(1)}`,
    `depth:${stone.depth.toFixed(1)}`,
    `ratio:${stone.ratio.toFixed(2)}`,
    `mm:${stone.length.toFixed(2)}x${stone.width.toFixed(2)}x${stone.height.toFixed(2)}`,
    `ships-in:${stone.shipsInDays}`,
  ];
}

export const stoneDescription = (stone: SeedStone) =>
  stone.kind === "diamond"
    ? `A ${stone.carat.toFixed(2)} carat ${stone.shape} ${stone.origin === "natural" ? "natural" : "lab-grown"} diamond, color ${stone.color}, clarity ${stone.clarity}, graded by ${stone.certificate}.`
    : `A ${stone.carat.toFixed(2)} carat ${stone.shape} ${stone.origin === "natural" ? "natural" : "lab-grown"} ${stone.gem}, graded by ${stone.certificate}.`;

/** PhotoName is re-exported so the CSV script can type the settings' photos. */
export type { PhotoName };
