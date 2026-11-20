// Writes shopify/builder-import.csv: the ring builder's NEW products only (the ring settings and loose stones of
// src/content/builder-seed.ts), in the same Shopify product CSV format as shopify/products-seed.csv.
// It never reads or rewrites products-seed.csv, and writes no other file. Run: npm run shopify:builder.
// Settings: one row per metal variant, as the existing catalogue. Stones: one product each, tracked by Shopify
// with a quantity of 1 and "deny" when out of stock, so a stone can be sold once.
// Images: Shopify downloads them from public URLs during import (shopify/images/ in the public GitHub repo by
// default, so push before importing). Override with SEED_IMAGE_BASE.
import fs from "node:fs";
import { expandSeed, seedProducts } from "../src/content/catalog-seed.ts";
import { settingSeeds, stoneSeeds, stoneTags, stoneDescription, STONE_PHOTOS } from "../src/content/builder-seed.ts";
import { metalById } from "../src/content/metals.ts";

const OUT = "shopify/builder-import.csv";
const IMAGE_BASE = process.env.SEED_IMAGE_BASE ?? "https://raw.githubusercontent.com/Robcvn/sky-jewelry/main/shopify/images";

const columns = [
  "Title", "URL handle", "Description", "Vendor", "Product category", "Type", "Tags",
  "Published on online store", "Status", "SKU", "Option1 name", "Option1 value", "Option2 name", "Option2 value",
  "Price", "Compare-at price", "Charge tax", "Inventory tracker", "Inventory quantity", "Continue selling when out of stock",
  "Requires shipping", "Fulfillment service", "Product image URL", "Image position", "Image alt text",
  "Variant image URL", "SEO title", "SEO description",
];

const csvCell = (value) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
const imageUrl = (photo) => `${IMAGE_BASE}/${photo}.jpg`;

const rows = [];
const missing = new Set();
const existingHandles = new Set(seedProducts.map((seed) => seed.handle));

// Settings continue the engagement rings' "Best Match" order after the ones already in the store.
const existingRings = seedProducts.filter((seed) => seed.type === "Engagement Rings").length;
for (const [index, seed] of settingSeeds.entries()) {
  if (existingHandles.has(seed.handle)) throw new Error(`${seed.handle} is already in products-seed.csv`);
  const product = expandSeed(seed, (id) => metalById(id).label, existingRings + index + 1);
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
        "Published on online store": "FALSE",
        Status: "active",
        "Option1 name": "Metal",
        "SEO title": `${product.title} | Sky Jewelry`,
        "SEO description": seed.description,
      });
    }
    if (variant) {
      Object.assign(row, {
        SKU: variant.sku,
        "Option1 value": metalById(variant.metal).label,
        Price: variant.price.toFixed(2),
        "Charge tax": "TRUE",
        // Not tracked, as the rest of the jewellery catalogue: settings are made to order.
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

const handles = new Set();
for (const stone of stoneSeeds) {
  if (handles.has(stone.handle) || existingHandles.has(stone.handle)) throw new Error(`Duplicate handle ${stone.handle}`);
  handles.add(stone.handle);
  const description = stoneDescription(stone);
  rows.push({
    Title: stone.title,
    "URL handle": stone.handle,
    Description: `<p>${description}</p>`,
    Vendor: "Sky Jewelry",
    Type: "Loose Stones",
    Tags: stoneTags(stone).join(", "),
    "Published on online store": "FALSE",
    Status: "active",
    SKU: stone.sku,
    Price: stone.price.toFixed(2),
    "Charge tax": "TRUE",
    // One of each stone: Shopify tracks it and stops selling it once it is bought.
    "Inventory tracker": "shopify",
    "Inventory quantity": 1,
    "Continue selling when out of stock": "deny",
    "Requires shipping": "TRUE",
    "Fulfillment service": "manual",
    ...(stone.photo ? { "Product image URL": imageUrl(stone.photo), "Image position": 1, "Image alt text": STONE_PHOTOS[stone.photo] } : {}),
    "SEO title": `${stone.title} | Sky Jewelry`,
    "SEO description": description,
  });
  if (stone.photo && !fs.existsSync(`shopify/images/${stone.photo}.jpg`)) missing.add(stone.photo);
}

if (missing.size) {
  console.error(`Missing photos in shopify/images: ${[...missing].join(", ")}`);
  process.exit(1);
}

const csv = [columns.join(","), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\n") + "\n";
fs.writeFileSync(OUT, csv);
const settingVariants = rows.filter((row) => row.Type !== "Loose Stones" && row.SKU && !handles.has(row["URL handle"])).length;
console.log(`Wrote ${OUT}: ${settingSeeds.length} settings (${settingVariants} variants), ${stoneSeeds.length} stones, ${rows.length} rows`);
