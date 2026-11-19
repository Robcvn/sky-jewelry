// Writes shopify/products-seed.csv from the sample catalogue (src/content/catalog-seed.ts), in Shopify's
// product CSV format (columns as in Shopify's current product_template.csv, a subset in the same order).
// Run: npm run shopify:seed. Node 24 strips the TypeScript types when importing the .ts files.
// Layout, as in Shopify's template: one row per variant; the first row also carries the product fields and
// option names; extra photos go on further rows with only the handle and image columns.
// Product images: Shopify downloads them from public URLs during import. By default they come from the
// public GitHub repo (shopify/images/), so push before importing. Override with SEED_IMAGE_BASE.
import fs from "node:fs";
import { expandSeed, seedProducts, seedRanks } from "../src/content/catalog-seed.ts";
import { metalById } from "../src/content/metals.ts";

const IMAGE_BASE = process.env.SEED_IMAGE_BASE ?? "https://raw.githubusercontent.com/Robcvn/sky-jewelry/main/shopify/images";

const columns = [
  "Title", "URL handle", "Description", "Vendor", "Product category", "Type", "Tags",
  "Published on online store", "Status", "SKU", "Option1 name", "Option1 value", "Option2 name", "Option2 value",
  "Price", "Compare-at price", "Charge tax", "Inventory tracker", "Continue selling when out of stock",
  "Requires shipping", "Fulfillment service", "Product image URL", "Image position", "Image alt text",
  "Variant image URL", "SEO title", "SEO description",
];

const csvCell = (value) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
const imageUrl = (photo) => `${IMAGE_BASE}/${photo}.jpg`;
const caratValue = (carat) => `${carat.toFixed(2)}ct`;

const ranks = seedRanks();
const rows = [];
const missing = new Set();
for (const [index, seed] of seedProducts.entries()) {
  const product = expandSeed(seed, (id) => metalById(id).label, ranks[index]);
  const hasCarat = product.variants.some((variant) => variant.carat !== null);
  const lines = Math.max(product.variants.length, product.images.length);

  for (let line = 0; line < lines; line += 1) {
    const variant = product.variants[line];
    const image = product.images[line];
    const row = { "URL handle": seed.handle };
    if (line === 0) {
      Object.assign(row, {
        Title: product.title,
        Description: `<p>${seed.description}</p>`,
        Vendor: "Sky Jewelry",
        Type: seed.type,
        Tags: product.tags.join(", "),
        // Headless site: products are made available to the Headless channel after import, not the Online Store.
        "Published on online store": "FALSE",
        Status: "active",
        "Option1 name": "Metal",
        "Option2 name": hasCarat ? "Carat Weight" : "",
        "SEO title": `${product.title} | Sky Jewelry`,
        "SEO description": seed.description,
      });
    }
    if (variant) {
      Object.assign(row, {
        SKU: variant.sku,
        "Option1 value": metalById(variant.metal).label,
        "Option2 value": hasCarat ? caratValue(variant.carat) : "",
        Price: variant.price.toFixed(2),
        "Charge tax": "TRUE",
        // Not tracked, so sample products never sell out.
        "Inventory tracker": "",
        "Continue selling when out of stock": "deny",
        "Requires shipping": "TRUE",
        "Fulfillment service": "manual",
        "Variant image URL": imageUrl(variant.photo),
      });
    }
    if (image) Object.assign(row, { "Product image URL": imageUrl(image.photo), "Image position": line + 1, "Image alt text": image.alt });
    rows.push(row);
  }
  for (const { photo } of product.images) if (!fs.existsSync(`shopify/images/${photo}.jpg`)) missing.add(photo);
}

if (missing.size) {
  console.error(`Missing photos in shopify/images: ${[...missing].join(", ")}`);
  process.exit(1);
}

const csv = [columns.join(","), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\n") + "\n";
fs.mkdirSync("shopify", { recursive: true });
fs.writeFileSync("shopify/products-seed.csv", csv);
const variants = rows.filter((row) => row.SKU).length;
console.log(`Wrote shopify/products-seed.csv: ${seedProducts.length} products, ${variants} variants, ${rows.length} rows`);
