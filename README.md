# Sky Jewelry

A full jewelry storefront built from a Figma design and matched to it at desktop (1440) and mobile (390). Portfolio project by Rob Coven.

**Live demo:** https://robcvn.github.io/sky-jewelry/

## What's in it

- Product lists, product pages, a bag and account pages
- A ring builder (start with a setting or a stone) and an earrings builder
- Education center, blog, search, and a landing page per category
- Editorial content editable in Sanity; products and the bag run on Shopify

## Stack

Next.js (App Router, static export) · TypeScript · Tailwind CSS · Shopify Storefront API · Sanity · GitHub Pages

## How it works

- Pages are generated at build time from the Shopify catalogue and Sanity content.
- GitHub Actions redeploys on every push to main, when content is published in Sanity, and when the catalogue changes (checked hourly).
- `/styleguide/components` shows every component and lists each place the build differs from the design, with the reason.

## Run it locally

    npm install
    npm run dev

Copy `.env.example` to `.env.local` and fill in the Shopify values to connect Shopify and Sanity; without them the site uses the sample data in the repo. The heading font (BD Megalona) is licensed and not included: add its seven `.woff2` files to `src/fonts/bd-megalona/` (names in `src/fonts/index.ts`) first.

## Demo notes

This is a demonstration, not a store. Products, prices, reviews and contact details are sample content, and checkout is switched off.
