/**
 * The ring builder's catalogue at build time: ring settings and loose stones.
 *
 * Settings are the "Engagement Rings" products of the catalogue (src/lib/catalog.ts): the four already in the
 * store plus the ones in src/content/builder-seed.ts. Stones are Shopify products tagged "loose-stone", one
 * product per stone with a quantity of 1; their grades and measurements are tags, read here.
 * Until Rob imports shopify/builder-import.csv, Shopify has neither the new settings nor any stones, so each
 * missing setting and the whole stone list come from the local seed, run through the same mappers. The build
 * log says which source was used.
 */
import type { ImageRef } from "@/components/ui/Picture";
import {
  DEFAULT_SETTING_SPECS,
  EXISTING_SETTING_STYLES,
  settingSeeds,
  STONE_PHOTOS,
  stoneDescription,
  stoneSeeds,
  stoneTags,
  type SeedStone,
  type SettingSpecs,
  type StonePhoto,
} from "@/content/builder-seed";
import type { Product } from "@/content/products";
import { getCatalog } from "./catalog";
import { seedToShopify } from "./mockCatalog";
import { imageStem, LOOSE_STONE_TAG, mapShopifyProduct, tagValue } from "./shopify/mapProduct";
import type { ShopifyProduct } from "./shopify/types";

export type RingSetting = {
  handle: string;
  /** The catalogue product: its variants are the metals, with a price each. */
  product: Product;
  /** Setting style slug (solitaire, pave...), or null when the product has none. */
  style: string | null;
  /**
   * Whether Step 1 lists it: only products tagged "setting". The store's four engagement rings (Channel Set, Halo,
   * Side-Stone, Eternity) are not tagged, because their photos are the vine ring's; they keep their setting pages,
   * which Home's best sellers link to.
   */
  listed: boolean;
  specs: SettingSpecs;
};

export type Stone = Omit<SeedStone, "photo"> & {
  /** Shopify variant id, or null while the stone only exists in the local seed. */
  variantId: string | null;
  available: boolean;
  description: string;
  /** The stone's photo, or null when Figma has none for it: the card then shows the shape drawing. */
  image: ImageRef | null;
};

/** The site's own files for each stone photo (the Shopify image is matched by file name, as for products). */
const STONE_IMAGES: Record<StonePhoto, Omit<ImageRef, "alt">> = {
  "stone-diamond-round": { desktop: "diamond-round-d", mobile: "diamond-round-m" },
  "stone-diamond-cushion": { desktop: "shape-cushion-sq" },
  "stone-diamond-emerald": { desktop: "shape-emerald-sq" },
  "stone-diamond-radiant": { desktop: "shape-radiant-sq" },
  "stone-diamond-marquise": { desktop: "shape-marquise-sq" },
  "stone-yellow-cushion": { desktop: "color-yellow-sq" },
  "stone-pink-asscher": { desktop: "color-pink-sq" },
  "stone-purple-pear": { desktop: "color-purple-sq" },
  "stone-blue-oval": { desktop: "color-blue-sq" },
  "stone-red-oval": { desktop: "color-red-sq" },
};

const usd = (amount: number) => ({ amount: amount.toFixed(1), currencyCode: "USD" });

/** A seed stone as the Storefront API would return it once imported. */
function stoneToShopify(stone: SeedStone): ShopifyProduct {
  const image = stone.photo ? { url: `${stone.photo}.jpg`, altText: STONE_PHOTOS[stone.photo], width: null, height: null } : null;
  return {
    id: "",
    handle: stone.handle,
    title: stone.title,
    description: stoneDescription(stone),
    productType: "Loose Stones",
    vendor: "Sky Jewelry",
    tags: stoneTags(stone),
    availableForSale: true,
    featuredImage: image,
    images: { nodes: image ? [image] : [] },
    priceRange: { minVariantPrice: usd(stone.price) },
    options: [],
    variants: { nodes: [{ id: "", title: "", sku: stone.sku, availableForSale: true, price: usd(stone.price), selectedOptions: [], image: image ? { url: image.url } : null }] },
  };
}

const number = (tags: string[], prefix: string) => Number(tagValue(tags, prefix));

/** Maps a Storefront API product tagged "loose-stone" to a Stone. Stones missing a required tag are skipped. */
export function mapStone(product: ShopifyProduct): Stone | null {
  const { tags } = product;
  const variant = product.variants.nodes[0];
  const kind = tagValue(tags, "stone");
  const origin = tagValue(tags, "origin");
  const shape = tagValue(tags, "shape");
  const [length, width, height] = (tagValue(tags, "mm") ?? "").split("x").map(Number);
  const carat = number(tags, "carat");
  const price = Number(variant?.price.amount);
  if (!variant || (kind !== "diamond" && kind !== "gemstone") || (origin !== "natural" && origin !== "lab-grown") || !shape) return null;
  if (![carat, price, length, width, height].every(Number.isFinite)) return null;

  const photo = product.featuredImage ? imageStem(product.featuredImage.url) : "";
  const image = photo in STONE_IMAGES ? { ...STONE_IMAGES[photo as StonePhoto], alt: product.featuredImage?.altText || STONE_PHOTOS[photo as StonePhoto] } : null;
  const shipsIn = number(tags, "ships-in");

  return {
    sku: variant.sku ?? "",
    handle: product.handle,
    title: product.title,
    description: product.description,
    kind,
    origin,
    shape,
    carat,
    color: tagValue(tags, "color") ?? "",
    clarity: tagValue(tags, "clarity") ?? "",
    cut: tagValue(tags, "cut") ?? "",
    gem: tagValue(tags, "gem") ?? undefined,
    treatment: tagValue(tags, "treatment") ?? undefined,
    certificate: tagValue(tags, "cert") ?? "",
    polish: tagValue(tags, "polish") ?? "",
    symmetry: tagValue(tags, "symmetry") ?? "",
    fluorescence: tagValue(tags, "fluor") ?? "none",
    table: number(tags, "table"),
    depth: number(tags, "depth"),
    ratio: number(tags, "ratio"),
    length,
    width,
    height,
    shipsInDays: Number.isFinite(shipsIn) && shipsIn > 0 ? shipsIn : 5,
    price,
    variantId: variant.id || null,
    available: variant.availableForSale,
    image,
  };
}

function toSetting(product: Product): RingSetting {
  const style = product.styles[0] ?? EXISTING_SETTING_STYLES[product.slug] ?? null;
  const fallback = DEFAULT_SETTING_SPECS[style ?? "default"] ?? DEFAULT_SETTING_SPECS.default;
  const width = Number(tagValue(product.tags, "width"));
  const tcw = Number(tagValue(product.tags, "tcw"));
  const profile = tagValue(product.tags, "profile");
  return {
    handle: product.slug,
    product,
    style,
    listed: product.tags.includes(SETTING_TAG),
    specs: {
      width: tagValue(product.tags, "width") !== null && Number.isFinite(width) ? width : fallback.width,
      tcw: tagValue(product.tags, "tcw") !== null && Number.isFinite(tcw) ? tcw : fallback.tcw,
      profile: profile === "low" || profile === "medium" || profile === "high" ? profile : fallback.profile,
    },
  };
}

/** The tag a product needs to be listed in Step 1 (shopify/builder-import.csv gives it to the six builder settings). */
export const SETTING_TAG = "setting";

export type BuilderCatalog = { settings: RingSetting[]; stones: Stone[] };

let builder: Promise<BuilderCatalog> | undefined;

async function loadBuilder(): Promise<BuilderCatalog> {
  const { products, raw } = await getCatalog();

  // Settings: the catalogue's engagement rings, in "Best Match" order, plus any seed setting Shopify doesn't have yet.
  const rings = products.filter((product) => product.category === "engagement-rings");
  const existing = rings.length;
  const local = settingSeeds
    .filter((seed) => !rings.some((ring) => ring.slug === seed.handle))
    .map((seed) => mapShopifyProduct(seedToShopify(seed, existing + settingSeeds.indexOf(seed) + 1)))
    .filter((product): product is Product => product !== null);
  const settings = [...rings, ...local].sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name)).map(toSetting);

  // Stones: Shopify's, once any are there; otherwise the local seed.
  const fromShopify = raw.filter((product) => product.tags.includes(LOOSE_STONE_TAG)).map(mapStone).filter((stone): stone is Stone => stone !== null);
  const stones = fromShopify.length ? fromShopify : stoneSeeds.map((seed) => mapStone(stoneToShopify(seed))).filter((stone): stone is Stone => stone !== null);

  console.info(
    `[builder] ${settings.filter((setting) => setting.listed).length} listed settings of ${settings.length} setting pages (${local.length} from the local seed), ${stones.length} stones from ${fromShopify.length ? "Shopify" : "the local seed"}.` +
      (local.length || !fromShopify.length ? " Import shopify/builder-import.csv to move them to Shopify." : ""),
  );
  return { settings, stones };
}

/** One per build: every builder page shares it. */
export function getBuilderCatalog() {
  builder ??= loadBuilder();
  return builder;
}
