/*
 * The earrings builder's sample catalogue: its stud earring setting and its matched pairs of diamonds.
 * One source for two things, like builder-seed.ts:
 *   1. shopify/earrings-import.csv (npm run shopify:earrings), which Rob imports into the Shopify store;
 *   2. the local catalogue the build uses until those products are in Shopify (src/lib/earrings.ts).
 * Kept apart from the Fine Jewelry products and the ring builder: the setting's product type is "Earring Settings"
 * (tag "earring-setting") and each pair's is "Stone Pairs" (tag "stone-pair"). Neither carries "fine-jewelry",
 * "earrings", "setting" or "loose-stone", so they stay out of the four Fine Jewelry collections, the ring
 * builder's settings and its 132 stones.
 *
 * SAMPLE DATA: grades, measurements, lead times and prices are invented for the portfolio build. Each stone of a
 * pair is priced with the ring builder's diamond formula (builder-seed.ts); a pair costs the sum of its two stones.
 * This file has no runtime imports, so the Node script can load it.
 */
import { cap, CERTS, CLARITIES, COLORS, CUTS, DIAMOND_PHOTO, diamondPrice, FINISH, FLUORESCENCE, measurements, slug, STONE_PHOTOS, type StonePhoto } from "./builder-seed.ts";
import type { PhotoName, SeedProduct } from "./catalog-seed";

/* ------------------------------------------------------------------ the setting */

/** The tag every earring setting carries (Step 1 lists these). */
export const EARRING_SETTING_TAG = "earring-setting";
/** The tag every matched pair carries. */
export const STONE_PAIR_TAG = "stone-pair";
export const EARRING_SETTING_TYPE = "Earring Settings";
export const STONE_PAIR_TYPE = "Stone Pairs";

/**
 * The earring settings. Figma has one earring setting photo: the yellow gold four prong studs drawn on every
 * earrings frame (front 2c4665eb, with their backs 1cf600c8, and worn 1b0245e0). They are the same three photos as
 * the Fine Jewelry four prong studs (catalog-seed.ts "studs"), so the setting reuses those files. Figma has no
 * other earring setting photo (the one other photo on Step 1, 7b59aede, is the solitaire pendant's). Yellow gold
 * only, in 14K and 18K, as the studs are; its 14K price is Figma's $720.
 */
const STUDS: PhotoName[] = ["earrings-solitaire-studs-yellow-gold", "earrings-solitaire-studs-yellow-gold-angled", "earrings-solitaire-studs-yellow-gold-worn"];

export const earringSettingSeeds: SeedProduct[] = [
  {
    handle: "four-prong-custom-diamond-stud-earrings",
    type: EARRING_SETTING_TYPE,
    title: "Four Prong Custom Diamond Stud Earrings in {metal}",
    description: "A pair of four-prong stud settings with push backs, ready for the matched diamonds you choose.",
    styles: [],
    shipsInDays: 7,
    metals: { "14k-yellow-gold": STUDS, "18k-yellow-gold": STUDS },
    prices: 720,
    tags: [EARRING_SETTING_TAG],
  },
];

/* ------------------------------------------------------------------ matched pairs */

/** One diamond of a pair: what differs between the two. */
export type SeedPairStone = {
  carat: number;
  length: number;
  width: number;
  height: number;
  table: number;
  depth: number;
  ratio: number;
  price: number;
};

export type SeedPair = {
  sku: string;
  handle: string;
  title: string;
  origin: "natural" | "lab-grown";
  shape: string;
  /** Both stones share their grades and their lab. */
  color: string;
  clarity: string;
  cut: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  certificate: string;
  stones: [SeedPairStone, SeedPairStone];
  /** Total carat weight of the pair. */
  carat: number;
  /** The two stones' prices added. */
  price: number;
  shipsInDays: number;
  photo: StonePhoto | null;
};

/** Ten shapes, three pairs of each in each tab. Shapes with a Figma photo come first; the rest show the shape's line drawing. */
const PAIR_SHAPES = ["round", "oval", "emerald", "cushion", "radiant", "princess", "marquise", "pear", "asscher", "heart"];
/** The first stone's weight; the second weighs the same or up to 0.03ct more, as matched pairs do. */
const PAIR_CARATS = [0.5, 0.25, 0.63, 0.4, 0.75, 0.33, 1, 0.55, 0.9, 1.25, 0.3, 1.5, 0.7, 0.45, 1.1];
const PAIR_DELTA = [0.02, 0, 0.01, 0.03];

const round = (value: number, decimals: number) => Number(value.toFixed(decimals));

function pairs(origin: "natural" | "lab-grown"): SeedPair[] {
  const lab = origin === "lab-grown";
  return Array.from({ length: 30 }, (_, i) => {
    const shape = PAIR_SHAPES[i % PAIR_SHAPES.length];
    const n = i + (lab ? 500 : 400);
    const caratA = PAIR_CARATS[(i * (lab ? 7 : 4) + (lab ? 3 : 0)) % PAIR_CARATS.length];
    const caratB = round(caratA + PAIR_DELTA[i % PAIR_DELTA.length], 2);
    const color = COLORS[(i * 3 + (lab ? 2 : 0)) % 7];
    const clarity = CLARITIES[(i * 5 + (lab ? 4 : 2)) % 7];
    const cut = CUTS[(i + (lab ? 2 : 0)) % CUTS.length];
    const certificate = CERTS[origin][i % 5];
    // Same proportions from the same seed number; the second stone's table and depth differ a little.
    const a = measurements(shape, caratA, n);
    const b = measurements(shape, caratB, n);
    const tableB = round(a.table + 0.5, 1);
    const depthB = round(a.depth - 0.3, 1);
    const stoneA: SeedPairStone = { carat: caratA, ...a, price: diamondPrice(origin, shape, caratA, color, clarity, cut) };
    const stoneB: SeedPairStone = {
      carat: caratB,
      length: b.length,
      width: b.width,
      height: round((b.width * depthB) / 100, 2),
      table: tableB,
      depth: depthB,
      ratio: b.ratio,
      price: diamondPrice(origin, shape, caratB, color, clarity, cut),
    };
    const carat = round(caratA + caratB, 2);
    const sku = `SKY-${lab ? "LP" : "NP"}${String(i + 1).padStart(3, "0")}`;
    // Figma's title: "IGI 1.61 Total Carat Round Diamonds".
    const title = `${certificate} ${carat.toFixed(2)} Total Carat ${cap(shape)} Diamonds`;
    return {
      sku,
      handle: `${slug(title)}-${sku.slice(4).toLowerCase()}`,
      title,
      origin,
      shape,
      color,
      clarity,
      cut,
      polish: FINISH[(i + 1) % FINISH.length],
      symmetry: FINISH[(i * 2 + 3) % FINISH.length],
      fluorescence: FLUORESCENCE[(i + (lab ? 3 : 0)) % FLUORESCENCE.length],
      certificate,
      stones: [stoneA, stoneB],
      carat,
      price: stoneA.price + stoneB.price,
      shipsInDays: [5, 7, 10, 7, 5][i % 5],
      photo: DIAMOND_PHOTO[shape] ?? null,
    };
  });
}

/** 60 matched pairs: 30 natural and 30 lab-grown, three of each of the ten shapes in each. Each pair is one of a kind. */
export const pairSeeds: SeedPair[] = [...pairs("natural"), ...pairs("lab-grown")];

const PARTS = ["a", "b"] as const;

/** The Shopify tags a pair is stored with. src/lib/earrings.ts reads the same tags back. */
export function pairTags(pair: SeedPair) {
  return [
    STONE_PAIR_TAG,
    "stone:diamond",
    `origin:${pair.origin}`,
    `shape:${pair.shape}`,
    `carat:${pair.carat.toFixed(2)}`,
    `color:${pair.color}`,
    `clarity:${pair.clarity}`,
    `cut:${pair.cut}`,
    `cert:${pair.certificate}`,
    `polish:${pair.polish}`,
    `symmetry:${pair.symmetry}`,
    `fluor:${pair.fluorescence}`,
    `ships-in:${pair.shipsInDays}`,
    ...pair.stones.flatMap((stone, index) => {
      const part = PARTS[index];
      return [
        `${part}-carat:${stone.carat.toFixed(2)}`,
        `${part}-mm:${stone.length.toFixed(2)}x${stone.width.toFixed(2)}x${stone.height.toFixed(2)}`,
        `${part}-table:${stone.table.toFixed(1)}`,
        `${part}-depth:${stone.depth.toFixed(1)}`,
        `${part}-ratio:${stone.ratio.toFixed(2)}`,
        `${part}-price:${stone.price}`,
      ];
    }),
  ];
}

export const pairDescription = (pair: SeedPair) =>
  `A matched pair of ${pair.shape} ${pair.origin === "natural" ? "natural" : "lab-grown"} diamonds of ${pair.stones[0].carat.toFixed(2)} and ${pair.stones[1].carat.toFixed(2)} carats, color ${pair.color}, clarity ${pair.clarity}, both graded by ${pair.certificate}.`;

export { STONE_PHOTOS };
