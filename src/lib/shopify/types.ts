/** The parts of the Storefront API response this site reads. */
export type Money = { amount: string; currencyCode: string };

export type ShopifyImage = { url: string; altText: string | null; width: number | null; height: number | null };

export type ShopifyVariant = {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  price: Money;
  selectedOptions: Array<{ name: string; value: string }>;
  image: { url: string } | null;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  priceRange: { minVariantPrice: Money };
  options: Array<{ name: string; optionValues: Array<{ name: string }> }>;
  variants: { nodes: ShopifyVariant[] };
};

export type ShopifyCollection = { id: string; handle: string; title: string; description: string };

type DiscountAllocation = { discountedAmount: Money };

export type CartAttribute = { key: string; value: string };

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  /** Line attributes: a built ring's two lines share a ring id and its size (src/lib/bag.ts). */
  attributes?: CartAttribute[];
  /** subtotalAmount is before line discounts; totalAmount after them. */
  cost: { amountPerQuantity: Money; subtotalAmount: Money; totalAmount: Money };
  discountAllocations: DiscountAllocation[];
  merchandise: {
    id: string;
    title: string;
    availableForSale: boolean;
    selectedOptions: Array<{ name: string; value: string }>;
    image: { url: string } | null;
    product: { handle: string; title: string; productType: string; tags: string[] };
  };
};

/** Deliberately has no checkoutUrl: checkout on this site is simulated and never goes to Shopify. */
export type ShopifyCart = {
  id: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  /** Cart-level (order) discounts. Line discounts are on each line. */
  discountAllocations: DiscountAllocation[];
  lines: { nodes: ShopifyCartLine[] };
};

export type CartLineInput = { merchandiseId: string; quantity: number; attributes?: CartAttribute[] };
export type CartLineUpdateInput = { id: string; quantity: number };
