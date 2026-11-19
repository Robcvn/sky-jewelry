import { shopifyConfig } from "./config";

export class ShopifyError extends Error {
  constructor(message: string, readonly details?: unknown) {
    super(message);
    this.name = "ShopifyError";
  }
}

type GraphQLResponse<T> = { data?: T; errors?: Array<{ message: string }> };

/**
 * Sends one Storefront API GraphQL request. Works at build time and in the browser.
 * No fetch cache option is set, so every static build reads fresh data.
 */
export async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>, timeoutMs = 10_000): Promise<T> {
  const config = shopifyConfig();
  if (!config) throw new ShopifyError("Shopify is not configured (missing store domain or Storefront token).");

  let response: Response;
  try {
    response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": config.token,
      },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    throw new ShopifyError(`Could not reach Shopify: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!response.ok) throw new ShopifyError(`Shopify answered ${response.status} ${response.statusText}.`);

  const body = (await response.json()) as GraphQLResponse<T>;
  if (body.errors?.length) throw new ShopifyError(body.errors.map((error) => error.message).join("; "), body.errors);
  if (!body.data) throw new ShopifyError("Shopify returned no data.");
  return body.data;
}
