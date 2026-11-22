/**
 * Typed Shopify Storefront API client: catalogue reads for the static build, and cart functions for the
 * client-side cart (a later task). There is no checkout here on purpose: checkout stays simulated.
 */
import { ShopifyError, shopifyFetch } from "./client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
  COLLECTION_HANDLES_QUERY,
  COLLECTION_PRODUCTS_QUERY,
  COLLECTIONS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
  SHOP_QUERY,
  STONE_AVAILABILITY_QUERY,
} from "./queries";
import type {
  CartLineInput,
  CartLineUpdateInput,
  ShopifyCart,
  ShopifyCollection,
  ShopifyCollectionMembers,
  ShopifyProduct,
} from "./types";

export { ShopifyError } from "./client";
export { shopifyConfig, SHOPIFY_API_VERSION } from "./config";
export type * from "./types";

export async function getShopName() {
  const data = await shopifyFetch<{ shop: { name: string } }>(SHOP_QUERY);
  return data.shop.name;
}

/** Products, optionally filtered with Shopify's search syntax (e.g. "tag:best-seller"). */
export async function getProducts({ first = 100, query }: { first?: number; query?: string } = {}) {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(PRODUCTS_QUERY, { first, query });
  return data.products.nodes;
}

export async function getProductByHandle(handle: string) {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data.product;
}

export async function getCollections(first = 50) {
  const data = await shopifyFetch<{ collections: { nodes: ShopifyCollection[] } }>(COLLECTIONS_QUERY, { first });
  return data.collections.nodes;
}

export async function getCollectionProducts(handle: string, first = 100) {
  const data = await shopifyFetch<{
    collection: (ShopifyCollection & { products: { nodes: ShopifyProduct[] } }) | null;
  }>(COLLECTION_PRODUCTS_QUERY, { handle, first });
  return data.collection;
}

/**
 * A collection's handle, title and the handles of its products, or null when the collection doesn't exist (or isn't on
 * the Headless channel).
 */
export async function getCollectionMembers(handle: string, first = 250): Promise<ShopifyCollectionMembers | null> {
  const data = await shopifyFetch<{ collection: { handle: string; title: string; products: { nodes: Array<{ handle: string }> } } | null }>(
    COLLECTION_HANDLES_QUERY,
    { handle, first },
  );
  const collection = data.collection;
  return collection ? { handle: collection.handle, title: collection.title, products: collection.products.nodes.map((product) => product.handle) } : null;
}

/** Handles of the products in a collection, or null when the collection doesn't exist (or isn't on the Headless channel). */
export async function getCollectionProductHandles(handle: string, first = 250) {
  return (await getCollectionMembers(handle, first))?.products ?? null;
}

/**
 * Whether a product (a loose stone) can still be bought: false when it is sold out or no longer on the channel.
 * Read-only; used in the browser by Step 3.
 */
export async function getStoneAvailability(handle: string) {
  const data = await shopifyFetch<{ product: { availableForSale: boolean; variants: { nodes: Array<{ id: string; availableForSale: boolean }> } } | null }>(
    STONE_AVAILABILITY_QUERY,
    { handle },
  );
  const product = data.product;
  return Boolean(product && product.availableForSale && (product.variants.nodes[0]?.availableForSale ?? true));
}

type CartPayload = { cart: ShopifyCart | null; userErrors: Array<{ field: string[] | null; message: string }> };

function cartOrThrow(payload: CartPayload) {
  if (payload.userErrors.length) throw new ShopifyError(payload.userErrors.map((error) => error.message).join("; "), payload.userErrors);
  if (!payload.cart) throw new ShopifyError("Shopify returned no cart.");
  return payload.cart;
}

export async function getCart(cartId: string) {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(CART_QUERY, { cartId });
  return data.cart;
}

export async function createCart(lines: CartLineInput[] = []) {
  const data = await shopifyFetch<{ cartCreate: CartPayload }>(CART_CREATE_MUTATION, { lines });
  return cartOrThrow(data.cartCreate);
}

export async function addCartLines(cartId: string, lines: CartLineInput[]) {
  const data = await shopifyFetch<{ cartLinesAdd: CartPayload }>(CART_LINES_ADD_MUTATION, { cartId, lines });
  return cartOrThrow(data.cartLinesAdd);
}

export async function updateCartLines(cartId: string, lines: CartLineUpdateInput[]) {
  const data = await shopifyFetch<{ cartLinesUpdate: CartPayload }>(CART_LINES_UPDATE_MUTATION, { cartId, lines });
  return cartOrThrow(data.cartLinesUpdate);
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<{ cartLinesRemove: CartPayload }>(CART_LINES_REMOVE_MUTATION, { cartId, lineIds });
  return cartOrThrow(data.cartLinesRemove);
}
