/**
 * The earrings builder's catalogue at build time: earring settings and matched pairs of diamonds.
 *
 * Settings are the catalogue's products of type "Earring Settings" (tag "earring-setting"); pairs are Shopify
 * products tagged "stone-pair", one product per pair with a quantity of 1, whose shared grades and each stone's
 * own weight, measurements and price are tags (src/content/earrings-seed.ts writes them, this file reads them).
 * Until Rob imports shopify/earrings-import.csv, Shopify has neither, so the missing setting and the whole pair list
 * come from the local seed, run through the same mappers. The build log says which source was used, in an
 * "[earrings]" line the deploy workflow checks.
 */
import type { ImageRef } from "@/components/ui/Picture";
import { DEFAULT_SETTING_SPECS, STONE_PHOTOS, type StonePhoto } from "@/content/builder-seed";
import { EARRING_SETTING_TAG, earringSettingSeeds, pairDescription, pairSeeds, pairTags, STONE_PAIR_TYPE, type SeedPair } from "@/content/earrings-seed";
import { shapeLabel } from "@/content/builder";
import type { Product } from "@/content/products";
import type { RingSetting, Stone } from "./builder";
import { getCatalog } from "./catalog";
import { seedToShopify } from "./mockCatalog";
import { imageStem, mapShopifyProduct, STONE_PAIR_TAG, tagValue } from "./shopify/mapProduct";
import type { ShopifyProduct } from "./shopify/types";

/**
 * An earring setting, shaped as the ring builder's settings so their filters, cards and quick view serve both.
 * It has no setting style and no ring specs: style is null and specs are the ring builder's defaults, unused here.
 */
export type EarringSetting = RingSetting;

/**
 * A matched pair. At its own level it is shaped as a Stone, so Step 2 filters and sorts pairs with the ring
 * builder's stone filters: carat is the pair's total weight, price the pair's price, table, depth and ratio the
 * two stones' average, and length, width and height the first stone's. `stones` holds each diamond as a Stone of
 * its own (its weight, measurements and price), for the cards, the Diamond Info blocks and the qualities.
 */
export type StonePair = Stone & { stones: [Stone, Stone] };

/** The product type pairs are stored under (the bag recognises their cart lines by it, or by the tag). */
export { STONE_PAIR_TYPE };

/** The site's own files for each stone photo, as the ring builder's (src/lib/builder.ts). */
const STONE_IMAGES: Partial<Record<StonePhoto, Omit<ImageRef, "alt">>> = {
  "stone-diamond-round": { desktop: "diamond-round-d", mobile: "diamond-round-m" },
  "stone-diamond-cushion": { desktop: "shape-cushion-sq" },
  "stone-diamond-emerald": { desktop: "shape-emerald-sq" },
  "stone-diamond-radiant": { desktop: "shape-radiant-sq" },
  "stone-diamond-marquise": { desktop: "shape-marquise-sq" },
};

const usd = (amount: number) => ({ amount: amount.toFixed(1), currencyCode: "USD" });

/** A seed pair as the Storefront API would return it once imported. */
function pairToShopify(pair: SeedPair): ShopifyProduct {
  const image = pair.photo ? { url: `${pair.photo}.jpg`, altText: STONE_PHOTOS[pair.photo], width: null, height: null } : null;
  return {
    id: "",
    handle: pair.handle,
    title: pair.title,
    description: pairDescription(pair),
    productType: STONE_PAIR_TYPE,
    vendor: "Sky Jewelry",
    tags: pairTags(pair),
    availableForSale: true,
    featuredImage: image,
    images: { nodes: image ? [image] : [] },
    priceRange: { minVariantPrice: usd(pair.price) },
    options: [],
    variants: { nodes: [{ id: "", title: "", sku: pair.sku, availableForSale: true, price: usd(pair.price), selectedOptions: [], image: image ? { url: image.url } : null }] },
  };
}

const number = (tags: string[], prefix: string) => Number(tagValue(tags, prefix));
const origin = (value: string | null): Stone["origin"] | null => (value === "natural" || value === "lab-grown" ? value : null);

/** "0.63ct J VVS1 Round Natural Diamond": one stone of a pair, named as the ring builder names its stones. */
export const pairStoneTitle = (stone: Pick<Stone, "carat" | "color" | "clarity" | "shape" | "origin">) =>
  `${stone.carat.toFixed(2)}ct ${stone.color} ${stone.clarity} ${shapeLabel(stone.shape)} ${stone.origin === "natural" ? "Natural" : "Lab-Grown"} Diamond`;

/** Maps a Storefront API product tagged "stone-pair" to a StonePair. Pairs missing a required tag are skipped. */
export function mapPair(product: ShopifyProduct): StonePair | null {
  const { tags } = product;
  const variant = product.variants.nodes[0];
  const pairOrigin = origin(tagValue(tags, "origin"));
  const shape = tagValue(tags, "shape");
  const price = Number(variant?.price.amount);
  if (!variant || tagValue(tags, "stone") !== "diamond" || !pairOrigin || !shape || !Number.isFinite(price)) return null;

  const photo = product.featuredImage ? imageStem(product.featuredImage.url) : "";
  const local = STONE_IMAGES[photo as StonePhoto];
  const image = local ? { ...local, alt: product.featuredImage?.altText || STONE_PHOTOS[photo as StonePhoto] } : null;
  const shipsIn = number(tags, "ships-in");
  const shared = {
    sku: variant.sku ?? "",
    handle: product.handle,
    kind: "diamond" as const,
    origin: pairOrigin,
    shape,
    color: tagValue(tags, "color") ?? "",
    clarity: tagValue(tags, "clarity") ?? "",
    cut: tagValue(tags, "cut") ?? "",
    certificate: tagValue(tags, "cert") ?? "",
    polish: tagValue(tags, "polish") ?? "",
    symmetry: tagValue(tags, "symmetry") ?? "",
    fluorescence: tagValue(tags, "fluor") ?? "none",
    shipsInDays: Number.isFinite(shipsIn) && shipsIn > 0 ? shipsIn : 7,
    variantId: variant.id || null,
    available: variant.availableForSale,
    image,
  };

  const part = (key: "a" | "b"): Stone | null => {
    const [length, width, height] = (tagValue(tags, `${key}-mm`) ?? "").split("x").map(Number);
    const values = { carat: number(tags, `${key}-carat`), table: number(tags, `${key}-table`), depth: number(tags, `${key}-depth`), ratio: number(tags, `${key}-ratio`), price: number(tags, `${key}-price`) };
    if (![...Object.values(values), length, width, height].every(Number.isFinite)) return null;
    const stone = { ...shared, ...values, length, width, height };
    return { ...stone, title: pairStoneTitle(stone), description: product.description };
  };
  const a = part("a");
  const b = part("b");
  if (!a || !b) return null;

  const average = (key: "table" | "depth" | "ratio", decimals: number) => Number(((a[key] + b[key]) / 2).toFixed(decimals));
  return {
    ...shared,
    title: product.title,
    description: product.description,
    carat: Number((a.carat + b.carat).toFixed(2)),
    price,
    table: average("table", 1),
    depth: average("depth", 1),
    ratio: average("ratio", 2),
    length: a.length,
    width: a.width,
    height: a.height,
    stones: [a, b],
  };
}

function toSetting(product: Product): EarringSetting {
  return { handle: product.slug, product, style: null, listed: product.tags.includes(EARRING_SETTING_TAG), specs: DEFAULT_SETTING_SPECS.default };
}

/** Category slug of the earring settings (Shopify product type "Earring Settings"). */
export const EARRING_SETTING_CATEGORY = "earring-settings";

export type EarringsCatalog = { settings: EarringSetting[]; pairs: StonePair[] };

let earrings: Promise<EarringsCatalog> | undefined;

async function loadEarrings(): Promise<EarringsCatalog> {
  const { products, raw } = await getCatalog();

  // Settings: the catalogue's earring settings, in "Best Match" order, plus any seed setting Shopify doesn't have yet.
  const fromShopify = products.filter((product) => product.category === EARRING_SETTING_CATEGORY);
  const local = earringSettingSeeds
    .filter((seed) => !fromShopify.some((product) => product.slug === seed.handle))
    .map((seed) => mapShopifyProduct(seedToShopify(seed, earringSettingSeeds.indexOf(seed) + 1)))
    .filter((product): product is Product => product !== null);
  const settings = [...fromShopify, ...local].sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name)).map(toSetting);

  // Pairs: Shopify's, once any are there; otherwise the local seed.
  const shopifyPairs = raw.filter((product) => product.tags.includes(STONE_PAIR_TAG)).map(mapPair).filter((pair): pair is StonePair => pair !== null);
  const pairs = shopifyPairs.length ? shopifyPairs : pairSeeds.map((seed) => mapPair(pairToShopify(seed))).filter((pair): pair is StonePair => pair !== null);

  const listed = settings.filter((setting) => setting.listed).length;
  const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;
  console.info(
    `[earrings] ${plural(listed, "listed setting")} of ${plural(settings.length, "setting page")} (${local.length} from the local seed), ${plural(pairs.length, "pair")} from ${shopifyPairs.length ? "Shopify" : "the local seed"}.` +
      (local.length || !shopifyPairs.length ? " Import shopify/earrings-import.csv to move them to Shopify." : ""),
  );
  return { settings, pairs };
}

/** One per build: every earrings builder page shares it. */
export function getEarringsCatalog() {
  earrings ??= loadEarrings();
  return earrings;
}
