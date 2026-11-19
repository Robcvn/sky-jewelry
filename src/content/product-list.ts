/*
 * Copy and options for the Fine Jewelry product list pages, from the Figma "Product List" frames
 * (desktop 3565:98087, mobile 3587:126753), the Filters sheet (5746:89744) and the Empty state frames.
 * Shaped like Sanity documents so it can move into a schema later.
 */
import type { IconName } from "@/components/ui/Icon";
import { span, type RichSpan } from "@/components/ui/RichText";
import type { FineJewelryCategory } from "./products";

export type CategoryTab = { _key: FineJewelryCategory; label: string; icon: IconName; title: string; description: string };

export type SortOption = { value: string; label: string; shortLabel: string };

export const productListContent = {
  _type: "productListPage" as const,
  overline: "Fine Jewelry",
  heading: [span("Select "), span("your", true), span(" Perfect Piece")] as RichSpan[],
  categories: [
    {
      _key: "rings",
      label: "Rings",
      icon: "setting",
      title: "Rings",
      description: "Diamond, gemstone and gold rings, from stackable bands to statement cocktail rings.",
    },
    {
      _key: "necklaces",
      label: "Necklaces",
      icon: "necklace",
      title: "Necklaces",
      description: "Solitaire pendants and gold chains in a range of lengths.",
    },
    {
      _key: "earrings",
      label: "Earrings",
      icon: "earrings",
      title: "Earrings",
      description: "Diamond stud earrings in natural and lab-grown diamonds.",
    },
    {
      _key: "bracelets",
      label: "Bracelets",
      icon: "bracelets",
      title: "Bracelets",
      description: "Diamond tennis bracelets in natural and lab-grown diamonds.",
    },
  ] satisfies CategoryTab[],
  /** The menu's ?type= sub-types, shown as a removable chip. */
  styleLabels: {
    stackable: "Stackable",
    diamond: "Diamond",
    gemstone: "Gemstone",
    pearl: "Pearl",
    gold: "Gold",
    cocktail: "Cocktail",
    initial: "Initial",
    hoop: "Hoop",
    cross: "Cross",
    "cuban-chain": "Cuban Chain",
    chain: "Chain",
  } as Record<string, string>,
  filters: {
    title: "Filters",
    category: "Category",
    metal: "Metal",
    metalPanel: "Select Metal",
    diamondType: "Diamond Type",
    diamondTypes: [
      { value: "natural", label: "Natural" },
      { value: "lab-grown", label: "Lab-Grown" },
    ],
    diamondTypeHelp: "Natural diamonds are mined; lab-grown diamonds are made above ground. Both are real diamonds.",
    carat: "Carat Weight",
    caratShort: "Carat",
    caratHelp: "Carat is a diamond's weight. For earrings and bracelets it is the total of all the stones.",
    length: "Length",
    chainLength: "Chain Length",
    price: "Price",
    shipsBy: "Ships by",
    anyDate: "Any Date",
    sortBy: "Sort by",
    all: "All",
    clearFilters: "Clear Filters",
    clear: "Clear",
    apply: "Apply",
  },
  /** Necklace lengths from the Filters sheet; bracelet lengths are not in Figma (flagged). */
  lengths: {
    necklaces: ["10-14", "14-16", "16-18", "18-20", "20-22", "22-24", "24-28"],
    bracelets: ["6-7", "7-8"],
  } as Partial<Record<FineJewelryCategory, string[]>>,
  sortOptions: [
    { value: "best-match", label: "Best Match", shortLabel: "Best Match" },
    { value: "price-asc", label: "Price (low to high)", shortLabel: "Price (Asc.)" },
    { value: "price-desc", label: "Price (high to low)", shortLabel: "Price (Desc.)" },
  ] satisfies SortOption[],
  viewMore: "View More",
  pageSize: 16,
  empty: "No products matching your selection. Try adjusting your filters or search.",
  card: {
    info: "Info",
    addToBag: "Add to Bag",
    installments: "Pay in 12 interest-free installments of",
    learnMore: "Learn more",
    caratWeight: "Carat Weight",
    metal: "Metal",
    stone: "Stone",
  },
};
