/*
 * What the Product Detail page says about a product, worked out from its Shopify data (options, tags) and,
 * where the catalogue has no source, the sample data in src/content/product-detail.ts.
 */
import type { IconName } from "@/components/ui/Icon";
import type { ImageRef } from "@/components/ui/Picture";
import { metalById, parseMetal, type MetalId } from "@/content/metals";
import { gradeScales, sampleDiamondGrades, sampleGemstoneColor, shapeDimensions } from "@/content/product-detail";
import { imagesFor, isFineJewelry, productHref, type Product, type ProductVariant } from "@/content/products";

/** What the piece is called in "Pendant Info" and "Pendant Details". */
export function pieceNoun(product: Product) {
  const title = product.name.toLowerCase();
  if (product.category === "necklaces") return title.includes("pendant") ? "Pendant" : "Necklace";
  if (product.category === "rings") return title.includes("band") ? "Band" : "Ring";
  if (product.category === "earrings") return "Earring";
  if (product.category === "bracelets") return "Bracelet";
  return "Product";
}

export function pieceIcon(product: Product): IconName {
  return ({ necklaces: "necklace", rings: "setting", earrings: "earrings", bracelets: "bracelets" } as Record<string, IconName>)[product.category] ?? "setting";
}

export const metalsOf = (product: Product) => [...new Set(product.variants.map((variant) => variant.metal))];

export const caratsFor = (product: Product, metal: MetalId) =>
  [...new Set(product.variants.filter((variant) => variant.metal === metal && variant.carat !== null).map((variant) => variant.carat!))].sort((a, b) => a - b);

/** The variant for a metal and carat: exact match, else the metal's variant with the same carat, else its first. */
export function findVariant(product: Product, metal: MetalId, carat: number | null) {
  return (
    product.variants.find((variant) => variant.metal === metal && variant.carat === carat) ??
    product.variants.find((variant) => variant.metal === metal) ??
    product.variants[0]
  );
}

/** Reads ?metal=14k-white-gold&carat=1.00 from the URL. Unknown values fall back to the default variant. */
export function variantFromQuery(product: Product, search: string): ProductVariant {
  const params = new URLSearchParams(search);
  const metal = parseMetal(params.get("metal"));
  const carat = Number(params.get("carat"));
  const first = product.variants[0];
  if (!metal || !metalsOf(product).includes(metal)) {
    return Number.isFinite(carat) && params.has("carat") ? findVariant(product, first.metal, carat) : first;
  }
  return findVariant(product, metal, params.has("carat") && Number.isFinite(carat) ? carat : first.carat);
}

/** The query Product Detail reads for a metal and carat: metal=14k-white-gold&carat=1.00. */
export function metalCaratQuery(metal: MetalId, carat: number | null) {
  const params = new URLSearchParams({ metal });
  if (carat !== null) params.set("carat", carat.toFixed(2));
  return params.toString();
}

/** A variant's query on Product Detail; none for the default (first) variant. */
export function variantQuery(product: Product, variant: ProductVariant) {
  const first = product.variants[0];
  if (variant === first || (variant.metal === first.metal && variant.carat === first.carat)) return "";
  return metalCaratQuery(variant.metal, variant.carat);
}

/**
 * A product's page opened on a variant, in the address format that page reads (Task 27): Product Detail takes
 * variantQuery (nothing for the default variant); a ring or earring setting's page takes ?metal=, as the builders'
 * own cards link. Canonical links stay on productHref.
 */
export function variantHref(product: Product, variant: ProductVariant) {
  const path = productHref(product);
  if (isFineJewelry(product.category)) {
    const query = variantQuery(product, variant);
    return query ? `${path}?${query}` : path;
  }
  if (product.category === "engagement-rings" || product.category === "earring-settings") return `${path}?${new URLSearchParams({ metal: variant.metal })}`;
  return path;
}

/** The loose round diamond photo from Figma's gallery, shown for pieces with a round diamond. */
const STONE_PHOTO: ImageRef = { desktop: "diamond-round-d", mobile: "diamond-round-m", alt: "A round diamond seen from above" };
export const stonePhoto = (product: Product) => (product.diamondType && product.shape === "round" ? STONE_PHOTO : null);

/**
 * The metal's photos in Figma's gallery order: the main photo, then photos of the piece being worn, then the
 * other views (side, angled, close-up). Desktop and mobile use the same order.
 */
export function galleryPhotos(product: Product, metal: MetalId) {
  const [main, ...rest] = imagesFor(product, metal);
  const worn = (image: ImageRef) => /-worn$/.test(image.desktop);
  return [main, ...rest.filter(worn), ...rest.filter((image) => !worn(image))];
}

/** Desktop gallery: Figma's grid (3565:98309) is main photo, stone, worn, side view: the stone goes second. */
export function desktopGallery(product: Product, metal: MetalId) {
  const photos = galleryPhotos(product, metal);
  const stone = stonePhoto(product);
  return stone ? [photos[0], stone, ...photos.slice(1)] : photos;
}

type StoneKind = "single" | "pair" | "line";

export type StoneFacts = {
  kind: StoneKind;
  type: string;
  carat: number;
  diamond: boolean;
  color: { grade: string; short: string; position: number } | null;
  clarity: { grade: string; short: string; position: number } | null;
  cut: string | null;
  dimensions: { length: number; width: number; ratio: number } | null;
  lab: string | null;
  shape: string | null;
};

/** Stone facts for a variant, or null for pieces without a stone (plain bands and chains). */
export function stoneFacts(product: Product, variant: ProductVariant): StoneFacts | null {
  if (variant.carat === null) return null;
  const gemstone = product.styles.includes("gemstone");
  if (!product.diamondType && !gemstone) return null;
  const kind: StoneKind = product.category === "earrings" ? "pair" : product.category === "bracelets" || product.name.includes("Band") ? "line" : "single";

  const grades = product.diamondType ? sampleDiamondGrades[product.diamondType] : null;
  const colorIndex = grades ? gradeScales.color.options.indexOf(grades.color) : -1;
  const clarityIndex = grades ? gradeScales.clarity.options.indexOf(grades.clarity) : -1;

  // Size of one stone, from its weight (earrings: half the pair's weight). Lines of small stones get none.
  const shape = product.shape ? shapeDimensions[product.shape] : undefined;
  const stoneCarat = kind === "pair" ? variant.carat / 2 : variant.carat;
  const width = shape ? shape.widthAt1ct * Math.cbrt(stoneCarat) : 0;

  return {
    kind,
    type: product.diamondType === "lab-grown" ? "Lab-Grown Diamond" : product.diamondType === "natural" ? "Natural Diamond" : `${sampleGemstoneColor} Sapphire`,
    carat: variant.carat,
    diamond: Boolean(product.diamondType),
    color: grades
      ? { grade: grades.color, short: gradeScales.color.grades[grades.color]?.short ?? "", position: 0.66 - (colorIndex - 0) * 0.08 }
      : gemstone
        ? { grade: sampleGemstoneColor, short: "", position: 0 }
        : null,
    clarity: grades ? { grade: grades.clarity, short: gradeScales.clarity.grades[grades.clarity]?.short ?? "", position: 0.62 - clarityIndex * 0.07 } : null,
    cut: grades?.cut ?? null,
    dimensions: shape && kind !== "line" ? { length: width * shape.ratio, width, ratio: shape.ratio } : null,
    lab: grades?.lab ?? null,
    shape: product.shape,
  };
}

export const metalLabel = (metal: MetalId) => metalById(metal).label;
