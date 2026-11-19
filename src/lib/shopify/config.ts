/**
 * Shopify Storefront API settings. The domain and the public Storefront token come from the environment
 * (.env.local locally, repository secrets in CI). The token is a public, read-mostly Storefront token,
 * but it still stays out of the repository.
 */
export const SHOPIFY_API_VERSION = "2026-10";

export function shopifyConfig() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN?.trim();
  if (!domain || !token) return null;
  return { endpoint: `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, token };
}
