This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Shopify (headless)

Products and prices come from a Shopify development store through the Storefront API, read once at build time. The site stays a static export. Checkout is simulated on the site; shoppers are never sent to Shopify's checkout, and no payment details are handled.

**Environment variables.** Copy `.env.example` to `.env.local` (never committed) and fill in:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | The store's `.myshopify.com` domain |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | The Headless channel's public Storefront API access token |

For the GitHub Pages build, add the same two values to the build environment (for example, repository secrets passed to `npm run build`).

**Code.** `src/lib/shopify/` holds the typed client (API version in `config.ts`), the queries, and the cart functions. `src/lib/catalog.ts` loads the catalogue for the build and maps Shopify products to the site's `Product` type.

**Fallback.** If the variables are missing, Shopify can't be reached, or it returns no products, the build uses the mock products in `src/content/products.ts` and prints a `[catalog] WARNING` line. The build never fails because of the store.

**Fresh data on every build.** Next saves build-time fetch responses in `.next/cache/fetch-cache` and would reuse them on later builds, so a change in Shopify would never show. The `prebuild` script clears that folder first, so always build with `npm run build` (not `npx next build`).

**Re-importing the seed products.**

1. Run `npm run shopify:seed` to regenerate `shopify/products-seed.csv` from `src/content/products.ts`.
2. Make sure the product photos in `shopify/images/` are pushed to GitHub. Shopify downloads them from their public raw URLs during the import. To use another host, set `SEED_IMAGE_BASE` when running the script.
3. In the Shopify admin, go to **Products → Import**, choose the CSV, and tick **Overwrite products with matching handles** to update existing ones.
4. Select the imported products and include them in the **Headless** sales channel. The CSV only controls the Online Store channel.
5. Rebuild the site.
