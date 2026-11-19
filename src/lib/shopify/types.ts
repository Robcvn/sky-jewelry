/** The parts of the Storefront API response this site reads. */
export type Money = { amount: string; currencyCode: string };

export type ShopifyImage = { url: string; altText: string | null; width: number | null; height: number | null };

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: Array<{ name: string; value: string }>;
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
  priceRange: { minVariantPrice: Money };
  options: Array<{ name: string; optionValues: Array<{ name: string }> }>;
  variants: { nodes: ShopifyVariant[] };
};

export type ShopifyCollection = { id: string; handle: string; title: string; description: string };

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: { id: string; title: string; product: { handle: string; title: string } };
};

/** Deliberately has no checkoutUrl: checkout on this site is simulated and never goes to Shopify. */
export type ShopifyCart = {
  id: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: { nodes: ShopifyCartLine[] };
};

export type CartLineInput = { merchandiseId: string; quantity: number };
export type CartLineUpdateInput = { id: string; quantity: number };
