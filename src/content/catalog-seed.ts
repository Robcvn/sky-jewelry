/*
 * The sample catalogue, as one source for three things:
 *   1. shopify/products-seed.csv (npm run shopify:seed), imported into the Shopify store;
 *   2. the mock catalogue the build falls back to when Shopify is unavailable (src/content/products.ts);
 *   3. the product photos (shopify/images, turned into WebP by npm run images:products).
 * Photos are only ones that exist in Figma. A product offers a metal only where Figma has a photo of that
 * design in that colour (platinum reuses the white gold photo). Titles follow Figma's pattern,
 * "14K Yellow Gold Four Prong Solitaire 0.80ct Lab-Grown Pendant": {metal} and {carat} change with the variant.
 * Sample content: names, prices and lead times are invented for the portfolio build.
 */
import type { MetalId } from "./metals";

/** "Earring Settings": the earrings builder's settings (src/content/earrings-seed.ts), kept out of the Fine Jewelry collections. */
export type ProductTypeName = "Rings" | "Necklaces" | "Earrings" | "Bracelets" | "Engagement Rings" | "Earring Settings";
export type DiamondType = "natural" | "lab-grown";

/** Product photos (shopify/images/<name>.jpg). Extra views of a photo share its name as a prefix. */
export const PHOTOS = {
  "ring-white-gold": "Ring in white gold with a round diamond",
  "ring-rose-gold": "Ring in rose gold with a round diamond",
  "ring-vine-white-gold": "Vine ring in white gold with a round diamond, angled view",
  "ring-vine-yellow-gold": "Vine ring in yellow gold with a round diamond, angled view",
  "ring-vine-rose-gold": "Vine ring in rose gold with a round diamond, angled view",
  "ring-round-solitaire-white-gold": "Round solitaire ring in white gold",
  "ring-round-solitaire-yellow-gold": "Round solitaire ring in yellow gold, worn on the hand",
  "ring-round-solitaire-yellow-gold-closeup": "Round solitaire ring in yellow gold, close-up on the hand",
  "ring-side-stone-white-gold": "Side-stone ring in white gold with a round diamond",
  "ring-round-halo-rose-gold": "Round halo ring in rose gold",
  "ring-pave-emerald-yellow-gold": "Pavé ring in yellow gold with an emerald-cut diamond",
  "ring-oval-solitaire-yellow-gold": "Oval solitaire ring in yellow gold",
  "ring-oval-sapphire-yellow-gold": "Oval blue sapphire ring in yellow gold",
  "ring-twig-band-yellow-gold": "Twig band in yellow gold with small diamonds",
  "ring-classic-band-yellow-gold": "Classic band in yellow gold",
  "ring-classic-band-yellow-gold-angled": "Classic band in yellow gold, angled view",
  "ring-flush-set-band-yellow-gold": "Flush-set diamond band in yellow gold",
  "ring-flush-set-band-yellow-gold-angled": "Flush-set diamond band in yellow gold, angled view",
  "necklace-solitaire-pendant-yellow-gold": "Four prong solitaire pendant on a yellow gold chain",
  "necklace-solitaire-pendant-yellow-gold-angled": "Four prong solitaire pendant on a yellow gold chain, angled view",
  "necklace-solitaire-pendant-yellow-gold-worn": "Solitaire pendants worn layered",
  "necklace-paperclip-chain-yellow-gold": "Paperclip chain necklace in yellow gold",
  "earrings-solitaire-studs-yellow-gold": "Four prong solitaire stud earrings in yellow gold",
  "earrings-solitaire-studs-yellow-gold-angled": "Four prong solitaire stud earrings in yellow gold, side view",
  "earrings-solitaire-studs-yellow-gold-worn": "Solitaire stud earring worn",
  "bracelet-beaded-tennis-yellow-gold": "Beaded bezel tennis bracelet in yellow gold",
} as const;

export type PhotoName = keyof typeof PHOTOS;

export type SeedProduct = {
  handle: string;
  type: ProductTypeName;
  /** Title with {metal} and {carat} placeholders, filled from the default (first) variant. */
  title: string;
  description: string;
  /** Sub-types from the Fine Jewelry menu (?type=diamond, stackable, gold, gemstone, cocktail...). */
  styles: string[];
  diamondType?: DiamondType;
  shape?: "round" | "oval" | "emerald";
  /** Chain or bracelet length in inches, e.g. "16-18". */
  length?: string;
  shipsInDays: number;
  /** Photos for each metal, main photo first. The first metal is the default. */
  metals: Partial<Record<MetalId, PhotoName[]>>;
  /** Price in USD for each carat weight (14K gold), the default first; or one price when there is no carat option. */
  prices: Record<string, number> | number;
  /** Extra Shopify tags. */
  tags?: string[];
  /** Kept from the first import so re-importing updates the same variants. */
  sku?: string;
  /** Alt text for the main photo, when the photo's own description isn't specific enough. */
  alt?: string;
};

const vine = (metals: MetalId[]) =>
  Object.fromEntries(
    metals.map((id) => [id, [id.includes("rose") ? "ring-vine-rose-gold" : id.includes("yellow") ? "ring-vine-yellow-gold" : "ring-vine-white-gold"]]),
  ) as SeedProduct["metals"];

const pendant: PhotoName[] = ["necklace-solitaire-pendant-yellow-gold", "necklace-solitaire-pendant-yellow-gold-angled", "necklace-solitaire-pendant-yellow-gold-worn"];
const studs: PhotoName[] = ["earrings-solitaire-studs-yellow-gold", "earrings-solitaire-studs-yellow-gold-angled", "earrings-solitaire-studs-yellow-gold-worn"];
const roundSolitaireYellow: PhotoName[] = ["ring-round-solitaire-yellow-gold", "ring-round-solitaire-yellow-gold-closeup"];

export const seedProducts: SeedProduct[] = [
  // Engagement rings from the Home best sellers (Task 8). Kept as they were imported.
  ...(
    [
      ["channel-set-ring", "Channel Set Ring", "Diamonds set flush along the band.", "14k-white-gold", "SKY-CHASETRIN-WG"],
      ["halo-ring", "Halo Ring", "A circle of diamonds frames the stone.", "14k-rose-gold", "SKY-HALRIN-RG"],
      ["side-stone-ring", "Side-Stone Ring", "Accent stones beside the center stone.", "14k-white-gold", "SKY-SIDSTORIN-WG"],
      ["eternity-ring", "Eternity Ring", "Diamonds set all the way around.", "14k-rose-gold", "SKY-ETERIN-RG"],
    ] as const
  ).map(
    ([handle, title, description, metal, sku]): SeedProduct => ({
      handle,
      type: "Engagement Rings",
      title,
      description,
      styles: [],
      shipsInDays: 5,
      metals: { [metal]: [metal.includes("rose") ? "ring-rose-gold" : "ring-white-gold"] },
      prices: 999,
      tags: ["engagement-rings", "best-seller"],
      sku,
      alt: `${title} in ${metal.includes("rose") ? "rose" : "white"} gold with a round diamond`,
    }),
  ),

  // Rings
  {
    handle: "vine-natural-diamond-ring",
    type: "Rings",
    title: "{metal} Vine {carat} Natural Diamond Ring",
    description: "A round natural diamond held in a band of twisting gold vines.",
    styles: ["diamond"],
    diamondType: "natural",
    shape: "round",
    shipsInDays: 5,
    metals: vine(["14k-yellow-gold", "14k-white-gold", "14k-rose-gold"]),
    prices: { "0.50": 1890, "0.25": 1290 },
  },
  {
    handle: "vine-lab-grown-diamond-ring",
    type: "Rings",
    title: "{metal} Vine {carat} Lab-Grown Diamond Ring",
    description: "A round lab-grown diamond held in a band of twisting gold vines.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    shipsInDays: 3,
    metals: vine(["14k-white-gold", "14k-yellow-gold", "14k-rose-gold"]),
    prices: { "1.00": 1490, "0.50": 990 },
  },
  {
    handle: "platinum-vine-lab-grown-diamond-ring",
    type: "Rings",
    title: "{metal} Vine {carat} Lab-Grown Diamond Ring",
    description: "The vine ring with a larger lab-grown diamond, in platinum or 18K gold.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    shipsInDays: 10,
    metals: vine(["platinum", "18k-yellow-gold", "18k-rose-gold"]),
    prices: { "1.50": 1990, "1.00": 1490 },
  },
  {
    handle: "round-solitaire-lab-grown-ring",
    type: "Rings",
    title: "{metal} Round Solitaire {carat} Lab-Grown Ring",
    description: "A single round lab-grown diamond on a slim band.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    shipsInDays: 3,
    metals: { "14k-white-gold": ["ring-round-solitaire-white-gold"], "14k-yellow-gold": roundSolitaireYellow },
    prices: { "1.00": 1290, "1.50": 1790, "2.00": 2490 },
  },
  {
    handle: "round-solitaire-natural-diamond-ring",
    type: "Rings",
    title: "{metal} Round Solitaire {carat} Natural Diamond Ring",
    description: "A single round natural diamond on a slim band.",
    styles: ["diamond"],
    diamondType: "natural",
    shape: "round",
    shipsInDays: 7,
    metals: { "14k-yellow-gold": roundSolitaireYellow, "14k-white-gold": ["ring-round-solitaire-white-gold"] },
    prices: { "1.00": 3990, "0.50": 1590, "1.50": 7490 },
  },
  {
    handle: "platinum-round-solitaire-lab-grown-ring",
    type: "Rings",
    title: "{metal} Round Solitaire {carat} Lab-Grown Ring",
    description: "A larger round lab-grown solitaire in platinum or 18K yellow gold.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    shipsInDays: 10,
    metals: { platinum: ["ring-round-solitaire-white-gold"], "18k-yellow-gold": roundSolitaireYellow },
    prices: { "2.00": 2490, "3.00": 3990 },
  },
  {
    handle: "side-stone-lab-grown-ring",
    type: "Rings",
    title: "{metal} Side-Stone {carat} Lab-Grown Ring",
    description: "A round lab-grown diamond with marquise accents on each side.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    shipsInDays: 5,
    metals: { "14k-white-gold": ["ring-side-stone-white-gold"], platinum: ["ring-side-stone-white-gold"] },
    prices: { "1.50": 1890, "2.00": 2390 },
  },
  {
    handle: "side-stone-natural-diamond-ring",
    type: "Rings",
    title: "{metal} Side-Stone {carat} Natural Diamond Ring",
    description: "A round natural diamond with marquise accents on each side.",
    styles: ["diamond"],
    diamondType: "natural",
    shape: "round",
    shipsInDays: 7,
    metals: { "14k-white-gold": ["ring-side-stone-white-gold"] },
    prices: { "1.00": 4490, "1.50": 7990 },
  },
  {
    handle: "platinum-side-stone-lab-grown-ring",
    type: "Rings",
    title: "{metal} Side-Stone {carat} Lab-Grown Ring",
    description: "The side-stone ring with a larger lab-grown center diamond.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    shipsInDays: 10,
    metals: { platinum: ["ring-side-stone-white-gold"], "18k-white-gold": ["ring-side-stone-white-gold"] },
    prices: { "2.50": 2990, "3.00": 3590 },
  },
  {
    handle: "round-halo-lab-grown-ring",
    type: "Rings",
    title: "{metal} Round Halo {carat} Lab-Grown Ring",
    description: "A round lab-grown diamond framed by a halo of smaller stones.",
    styles: ["diamond", "cocktail"],
    diamondType: "lab-grown",
    shape: "round",
    shipsInDays: 3,
    metals: { "14k-rose-gold": ["ring-round-halo-rose-gold"], "18k-rose-gold": ["ring-round-halo-rose-gold"] },
    prices: { "1.00": 1390, "1.50": 1890 },
  },
  {
    handle: "round-halo-natural-diamond-ring",
    type: "Rings",
    title: "{metal} Round Halo {carat} Natural Diamond Ring",
    description: "A round natural diamond framed by a halo of smaller stones.",
    styles: ["diamond", "cocktail"],
    diamondType: "natural",
    shape: "round",
    shipsInDays: 7,
    metals: { "14k-rose-gold": ["ring-round-halo-rose-gold"] },
    prices: { "1.00": 4790, "1.50": 8290 },
  },
  {
    handle: "pave-emerald-cut-lab-grown-ring",
    type: "Rings",
    title: "{metal} Pavé Emerald-Cut {carat} Lab-Grown Ring",
    description: "An emerald-cut lab-grown diamond on a band of pavé stones.",
    styles: ["diamond", "cocktail"],
    diamondType: "lab-grown",
    shape: "emerald",
    shipsInDays: 5,
    metals: { "14k-yellow-gold": ["ring-pave-emerald-yellow-gold"] },
    prices: { "2.00": 2290, "3.00": 3290 },
  },
  {
    handle: "pave-emerald-cut-natural-diamond-ring",
    type: "Rings",
    title: "{metal} Pavé Emerald-Cut {carat} Natural Diamond Ring",
    description: "An emerald-cut natural diamond on a band of pavé stones.",
    styles: ["diamond", "cocktail"],
    diamondType: "natural",
    shape: "emerald",
    shipsInDays: 10,
    metals: { "18k-yellow-gold": ["ring-pave-emerald-yellow-gold"] },
    prices: { "1.50": 8990, "2.00": 13990 },
  },
  {
    handle: "oval-solitaire-lab-grown-ring",
    type: "Rings",
    title: "{metal} Oval Solitaire {carat} Lab-Grown Ring",
    description: "An oval lab-grown diamond on a slim band.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "oval",
    shipsInDays: 2,
    metals: { "14k-yellow-gold": ["ring-oval-solitaire-yellow-gold"] },
    prices: { "1.50": 1690, "2.00": 2190 },
  },
  {
    handle: "oval-solitaire-natural-diamond-ring",
    type: "Rings",
    title: "{metal} Oval Solitaire {carat} Natural Diamond Ring",
    description: "An oval natural diamond on a slim band.",
    styles: ["diamond"],
    diamondType: "natural",
    shape: "oval",
    shipsInDays: 7,
    metals: { "18k-yellow-gold": ["ring-oval-solitaire-yellow-gold"] },
    prices: { "1.00": 4290, "2.00": 12990 },
  },
  {
    handle: "oval-blue-sapphire-ring",
    type: "Rings",
    title: "{metal} Oval Blue Sapphire {carat} Ring",
    description: "An oval blue sapphire on a slim band.",
    styles: ["gemstone"],
    shape: "oval",
    shipsInDays: 5,
    metals: { "14k-yellow-gold": ["ring-oval-sapphire-yellow-gold"] },
    prices: { "1.00": 1490, "1.50": 2190, "2.00": 2990 },
  },
  {
    handle: "twig-diamond-stackable-band",
    type: "Rings",
    title: "{metal} Twig {carat} Natural Diamond Stackable Band",
    description: "A slim twig band set with small natural diamonds, made for stacking.",
    styles: ["stackable", "diamond"],
    diamondType: "natural",
    shipsInDays: 2,
    metals: { "14k-yellow-gold": ["ring-twig-band-yellow-gold"] },
    prices: { "0.10": 690 },
  },
  {
    handle: "classic-2mm-band",
    type: "Rings",
    title: "{metal} Classic 2mm Band",
    description: "A plain, rounded band to wear alone or stacked.",
    styles: ["gold", "stackable"],
    shipsInDays: 2,
    metals: { "14k-yellow-gold": ["ring-classic-band-yellow-gold", "ring-classic-band-yellow-gold-angled"] },
    prices: 590,
  },
  {
    handle: "classic-4mm-band",
    type: "Rings",
    title: "{metal} Classic 4mm Band",
    description: "A wider plain, rounded band in 18K gold.",
    styles: ["gold"],
    shipsInDays: 5,
    metals: { "18k-yellow-gold": ["ring-classic-band-yellow-gold", "ring-classic-band-yellow-gold-angled"] },
    prices: 1190,
  },
  {
    handle: "flush-set-natural-diamond-band",
    type: "Rings",
    title: "{metal} Flush-Set {carat} Natural Diamond Band",
    description: "Natural diamonds set flush into a smooth band.",
    styles: ["stackable", "diamond"],
    diamondType: "natural",
    shipsInDays: 3,
    metals: { "14k-yellow-gold": ["ring-flush-set-band-yellow-gold", "ring-flush-set-band-yellow-gold-angled"] },
    prices: { "0.15": 890, "0.30": 1290 },
  },
  {
    handle: "flush-set-lab-grown-diamond-band",
    type: "Rings",
    title: "{metal} Flush-Set {carat} Lab-Grown Diamond Band",
    description: "Lab-grown diamonds set flush into a smooth band.",
    styles: ["stackable", "diamond"],
    diamondType: "lab-grown",
    shipsInDays: 2,
    metals: { "14k-yellow-gold": ["ring-flush-set-band-yellow-gold", "ring-flush-set-band-yellow-gold-angled"] },
    prices: { "0.30": 690, "0.50": 890 },
  },

  // Necklaces
  {
    handle: "four-prong-solitaire-lab-grown-pendant",
    type: "Necklaces",
    title: "{metal} Four Prong Solitaire {carat} Lab-Grown Pendant",
    description: "A round lab-grown diamond in a four-prong setting on a fine cable chain.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    length: "16-18",
    shipsInDays: 3,
    metals: { "14k-yellow-gold": pendant },
    prices: { "0.80": 1200, "0.50": 890, "1.00": 1490, "1.50": 2190, "2.00": 2990, "2.50": 3790, "3.00": 4690 },
  },
  {
    handle: "four-prong-solitaire-natural-diamond-pendant",
    type: "Necklaces",
    title: "{metal} Four Prong Solitaire {carat} Natural Diamond Pendant",
    description: "A round natural diamond in a four-prong setting on a fine cable chain.",
    styles: ["diamond"],
    diamondType: "natural",
    shape: "round",
    length: "18-20",
    shipsInDays: 7,
    metals: { "14k-yellow-gold": pendant },
    prices: { "0.50": 1490, "0.75": 2490, "1.00": 3990 },
  },
  {
    handle: "four-prong-solitaire-lab-grown-pendant-18k",
    type: "Necklaces",
    title: "{metal} Four Prong Solitaire {carat} Lab-Grown Pendant",
    description: "The four-prong solitaire pendant in 18K gold, on a shorter chain.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    length: "14-16",
    shipsInDays: 5,
    metals: { "18k-yellow-gold": pendant },
    prices: { "1.00": 1790, "2.00": 3490 },
  },
  {
    handle: "four-prong-solitaire-natural-diamond-pendant-18k",
    type: "Necklaces",
    title: "{metal} Four Prong Solitaire {carat} Natural Diamond Pendant",
    description: "A larger natural diamond solitaire in 18K gold, on a longer chain.",
    styles: ["diamond"],
    diamondType: "natural",
    shape: "round",
    length: "20-22",
    shipsInDays: 10,
    metals: { "18k-yellow-gold": pendant },
    prices: { "1.50": 7990 },
  },
  {
    handle: "paperclip-chain-necklace-2-5mm",
    type: "Necklaces",
    title: "{metal} 2.5mm Paperclip Chain Necklace",
    description: "A fine paperclip-link chain to wear alone or layered.",
    styles: ["gold"],
    length: "16-18",
    shipsInDays: 2,
    metals: { "14k-yellow-gold": ["necklace-paperclip-chain-yellow-gold"] },
    prices: 690,
  },
  {
    handle: "paperclip-chain-necklace-4mm",
    type: "Necklaces",
    title: "{metal} 4mm Paperclip Chain Necklace",
    description: "A bolder paperclip-link chain.",
    styles: ["gold"],
    length: "18-20",
    shipsInDays: 3,
    metals: { "14k-yellow-gold": ["necklace-paperclip-chain-yellow-gold"] },
    prices: 990,
  },
  {
    handle: "paperclip-chain-necklace-3mm-18k",
    type: "Necklaces",
    title: "{metal} 3mm Paperclip Chain Necklace",
    description: "A paperclip-link chain in 18K gold.",
    styles: ["gold"],
    length: "20-22",
    shipsInDays: 5,
    metals: { "18k-yellow-gold": ["necklace-paperclip-chain-yellow-gold"] },
    prices: 1390,
  },
  {
    handle: "paperclip-chain-necklace-5mm",
    type: "Necklaces",
    title: "{metal} 5mm Paperclip Chain Necklace",
    description: "The widest paperclip-link chain, in a longer length.",
    styles: ["gold"],
    length: "22-24",
    shipsInDays: 7,
    metals: { "14k-yellow-gold": ["necklace-paperclip-chain-yellow-gold"] },
    prices: 1290,
  },

  // Earrings
  {
    handle: "four-prong-solitaire-lab-grown-stud-earrings",
    type: "Earrings",
    title: "{metal} Four Prong Solitaire {carat} Lab-Grown Stud Earrings",
    description: "A pair of round lab-grown diamonds in four-prong settings. Carat weight is the total for the pair.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    shipsInDays: 2,
    metals: { "14k-yellow-gold": studs },
    prices: { "1.00": 1190, "0.50": 690, "1.50": 1690, "2.00": 2290 },
  },
  {
    handle: "four-prong-solitaire-natural-diamond-stud-earrings",
    type: "Earrings",
    title: "{metal} Four Prong Solitaire {carat} Natural Diamond Stud Earrings",
    description: "A pair of round natural diamonds in four-prong settings. Carat weight is the total for the pair.",
    styles: ["diamond"],
    diamondType: "natural",
    shape: "round",
    shipsInDays: 7,
    metals: { "14k-yellow-gold": studs },
    prices: { "0.50": 1290, "1.00": 3490, "1.50": 6490 },
  },
  {
    handle: "four-prong-solitaire-lab-grown-stud-earrings-18k",
    type: "Earrings",
    title: "{metal} Four Prong Solitaire {carat} Lab-Grown Stud Earrings",
    description: "Larger lab-grown diamond studs in 18K gold. Carat weight is the total for the pair.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    shipsInDays: 5,
    metals: { "18k-yellow-gold": studs },
    prices: { "2.00": 2690, "3.00": 3990 },
  },
  {
    handle: "four-prong-solitaire-natural-diamond-stud-earrings-18k",
    type: "Earrings",
    title: "{metal} Four Prong Solitaire {carat} Natural Diamond Stud Earrings",
    description: "Natural diamond studs in 18K gold. Carat weight is the total for the pair.",
    styles: ["diamond"],
    diamondType: "natural",
    shape: "round",
    shipsInDays: 10,
    metals: { "18k-yellow-gold": studs },
    prices: { "2.00": 11990 },
  },
  {
    handle: "four-prong-solitaire-lab-grown-stud-earrings-large",
    type: "Earrings",
    title: "{metal} Four Prong Solitaire {carat} Lab-Grown Stud Earrings",
    description: "Statement-size lab-grown diamond studs. Carat weight is the total for the pair.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    shipsInDays: 7,
    metals: { "14k-yellow-gold": studs },
    prices: { "3.00": 3490, "4.00": 4590 },
  },

  // Bracelets
  {
    handle: "beaded-bezel-lab-grown-tennis-bracelet",
    type: "Bracelets",
    title: "{metal} Beaded Bezel {carat} Lab-Grown Tennis Bracelet",
    description: "A line of lab-grown diamonds in beaded bezel settings. Carat weight is the total.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    length: "6-7",
    shipsInDays: 3,
    metals: { "14k-yellow-gold": ["bracelet-beaded-tennis-yellow-gold"] },
    prices: { "1.00": 1490, "2.00": 2490, "3.00": 3490 },
  },
  {
    handle: "beaded-bezel-natural-diamond-tennis-bracelet",
    type: "Bracelets",
    title: "{metal} Beaded Bezel {carat} Natural Diamond Tennis Bracelet",
    description: "A line of natural diamonds in beaded bezel settings. Carat weight is the total.",
    styles: ["diamond"],
    diamondType: "natural",
    shape: "round",
    length: "7-8",
    shipsInDays: 7,
    metals: { "14k-yellow-gold": ["bracelet-beaded-tennis-yellow-gold"] },
    prices: { "1.00": 2990, "2.00": 5490 },
  },
  {
    handle: "beaded-bezel-lab-grown-tennis-bracelet-18k",
    type: "Bracelets",
    title: "{metal} Beaded Bezel {carat} Lab-Grown Tennis Bracelet",
    description: "The beaded bezel tennis bracelet in 18K gold. Carat weight is the total.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    length: "7-8",
    shipsInDays: 5,
    metals: { "18k-yellow-gold": ["bracelet-beaded-tennis-yellow-gold"] },
    prices: { "2.00": 2990, "3.00": 4190 },
  },
  {
    handle: "beaded-bezel-natural-diamond-tennis-bracelet-18k",
    type: "Bracelets",
    title: "{metal} Beaded Bezel {carat} Natural Diamond Tennis Bracelet",
    description: "Natural diamonds in beaded bezel settings, in 18K gold. Carat weight is the total.",
    styles: ["diamond"],
    diamondType: "natural",
    shape: "round",
    length: "6-7",
    shipsInDays: 10,
    metals: { "18k-yellow-gold": ["bracelet-beaded-tennis-yellow-gold"] },
    prices: { "3.00": 9990 },
  },
  {
    handle: "beaded-bezel-lab-grown-tennis-bracelet-large",
    type: "Bracelets",
    title: "{metal} Beaded Bezel {carat} Lab-Grown Tennis Bracelet",
    description: "A fuller line of larger lab-grown diamonds. Carat weight is the total.",
    styles: ["diamond"],
    diamondType: "lab-grown",
    shape: "round",
    length: "6-7",
    shipsInDays: 7,
    metals: { "14k-yellow-gold": ["bracelet-beaded-tennis-yellow-gold"] },
    prices: { "4.00": 4490, "5.00": 5490 },
  },
];

/** Price multiplier for each metal over 14K gold. */
export const METAL_PRICE_FACTOR: Record<MetalId, number> = {
  "14k-white-gold": 1,
  "14k-yellow-gold": 1,
  "14k-rose-gold": 1,
  "18k-white-gold": 1.18,
  "18k-yellow-gold": 1.18,
  "18k-rose-gold": 1.18,
  platinum: 1.3,
};

const TYPE_CODE: Record<ProductTypeName, string> = { Rings: "R", Necklaces: "N", Earrings: "E", Bracelets: "B", "Engagement Rings": "G", "Earring Settings": "S" };
const METAL_CODE: Record<MetalId, string> = {
  "14k-white-gold": "14WG",
  "14k-yellow-gold": "14YG",
  "14k-rose-gold": "14RG",
  "18k-white-gold": "18WG",
  "18k-yellow-gold": "18YG",
  "18k-rose-gold": "18RG",
  platinum: "PT",
};

export const caratLabel = (carat: number) => `${carat.toFixed(2)}ct`;
export const fillTitle = (template: string, metal: string, carat: string | null) =>
  template.replace("{metal}", metal).replace("{carat}", carat ?? "").replace(/\s+/g, " ").trim();

export type ExpandedVariant = { sku: string; metal: MetalId; carat: number | null; price: number; photo: PhotoName };
export type ExpandedProduct = {
  seed: SeedProduct;
  title: string;
  tags: string[];
  variants: ExpandedVariant[];
  images: Array<{ photo: PhotoName; alt: string }>;
};

/**
 * Expands a seed into what Shopify stores: variants (metal x carat, the default first), prices, SKUs, tags
 * and the image list. Used by the CSV generator and by the mock catalogue, so both describe the same store.
 * metalLabel is passed in so this file has no runtime imports (the Node seed script imports it directly).
 */
export function expandSeed(seed: SeedProduct, metalLabel: (id: MetalId) => string, rank: number): ExpandedProduct {
  const metals = Object.keys(seed.metals) as MetalId[];
  const carats = typeof seed.prices === "number" ? [null] : Object.keys(seed.prices).map(Number);
  const basePrice = (carat: number | null) =>
    typeof seed.prices === "number" ? seed.prices : (seed.prices as Record<string, number>)[carat!.toFixed(2)];
  const code = `SKY-${TYPE_CODE[seed.type]}${String(rank).padStart(2, "0")}`;

  const variants = metals.flatMap((metal) =>
    carats.map((carat) => ({
      sku: seed.sku ?? `${code}-${METAL_CODE[metal]}${carat === null ? "" : `-${Math.round(carat * 100)}`}`,
      metal,
      carat,
      price: METAL_PRICE_FACTOR[metal] === 1 ? basePrice(carat) : Math.round((basePrice(carat) * METAL_PRICE_FACTOR[metal]) / 10) * 10,
      photo: seed.metals[metal]![0],
    })),
  );

  const photos = [...new Set(metals.flatMap((metal) => seed.metals[metal]!))];
  const first = variants[0];
  const tags = [
    // The builders' settings are not Fine Jewelry.
    ...(seed.type === "Engagement Rings" || seed.type === "Earring Settings" ? [] : ["fine-jewelry"]),
    ...seed.styles.map((style) => `style:${style}`),
    ...(seed.diamondType ? [`diamond:${seed.diamondType}`] : []),
    ...(seed.shape ? [`shape:${seed.shape}`] : []),
    ...(seed.length ? [`length:${seed.length}`] : []),
    `ships-in:${seed.shipsInDays}`,
    ...(seed.tags ?? []),
  ];

  return {
    seed,
    title: fillTitle(seed.title, metalLabel(first.metal), first.carat === null ? null : caratLabel(first.carat)),
    tags,
    variants,
    images: photos.map((photo, index) => ({ photo, alt: (index === 0 && seed.alt) || PHOTOS[photo] })),
  };
}

/** Rank within the product type, from 1, in seed order: the "Best Match" order. */
export function seedRanks() {
  const counts: Partial<Record<ProductTypeName, number>> = {};
  return seedProducts.map((seed) => (counts[seed.type] = (counts[seed.type] ?? 0) + 1));
}
