// Writes shopify/earrings-import.csv: the earrings builder's NEW products only (the earring setting and the matched
// diamond pairs of src/content/earrings-seed.ts), in the same Shopify product CSV format as shopify/builder-import.csv.
// It never reads or rewrites the other import files, and writes no other file. Run: npm run shopify:earrings.
// Setting: one row per metal variant, as the ring settings. Pairs: one product each (both diamonds), tracked by
// Shopify with a quantity of 1 and "deny" when out of stock, so a pair can be sold once.
// Product types "Earring Settings" and "Stone Pairs", and their tags, keep these products out of the four Fine
// Jewelry collections, the ring builder's settings (type "Engagement Rings") and its stones (tag "loose-stone").
// Images: Shopify downloads them from public URLs during import (shopify/images/ in the public GitHub repo by
// default, so push before importing). Override with SEED_IMAGE_BASE.
import fs from "node:fs";
import { expandSeed, seedProducts } from "../src/content/catalog-seed.ts";
import { settingSeeds, stoneSeeds } from "../src/content/builder-seed.ts";
import { earringSettingSeeds, pairDescription, pairSeeds, pairTags, STONE_PAIR_TYPE, STONE_PHOTOS } from "../src/content/earrings-seed.ts";
import { metalById } from "../src/content/metals.ts";

const OUT = "shopify/earrings-import.csv";
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
// Every handle and SKU already in the store's other import files: none may be reused.
const taken = new Set([...seedProducts.map((seed) => seed.handle), ...settingSeeds.map((seed) => seed.handle), ...stoneSeeds.map((stone) => stone.handle)]);
const takenSkus = new Set(stoneSeeds.map((stone) => stone.sku));

for (const [index, seed] of earringSettingSeeds.entries()) {
  if (taken.has(seed.handle)) throw new Error(`${seed.handle} is already in another import file`);
  taken.add(seed.handle);
  const product = expandSeed(seed, (id) => metalById(id).label, index + 1);
  if (product.tags.some((tag) => tag === "fine-jewelry" || tag === "setting" || tag === "loose-stone")) throw new Error(`${seed.handle} carries a tag of another catalogue`);
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
        // Not tracked, as the ring settings: settings are made to order.
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

for (const pair of pairSeeds) {
  if (taken.has(pair.handle)) throw new Error(`Duplicate handle ${pair.handle}`);
  if (takenSkus.has(pair.sku)) throw new Error(`Duplicate SKU ${pair.sku}`);
  taken.add(pair.handle);
  takenSkus.add(pair.sku);
  const description = pairDescription(pair);
  rows.push({
    Title: pair.title,
    "URL handle": pair.handle,
    Description: `<p>${description}</p>`,
    Vendor: "Sky Jewelry",
    Type: STONE_PAIR_TYPE,
    Tags: pairTags(pair).join(", "),
    "Published on online store": "FALSE",
    Status: "active",
    SKU: pair.sku,
    Price: pair.price.toFixed(2),
    "Charge tax": "TRUE",
    // One of each pair: Shopify tracks it and stops selling it once it is bought.
    "Inventory tracker": "shopify",
    "Inventory quantity": 1,
    "Continue selling when out of stock": "deny",
    "Requires shipping": "TRUE",
    "Fulfillment service": "manual",
    ...(pair.photo ? { "Product image URL": imageUrl(pair.photo), "Image position": 1, "Image alt text": STONE_PHOTOS[pair.photo] } : {}),
    "SEO title": `${pair.title} | Sky Jewelry`,
    "SEO description": description,
  });
  if (pair.photo && !fs.existsSync(`shopify/images/${pair.photo}.jpg`)) missing.add(pair.photo);
}

if (missing.size) {
  console.error(`Missing photos in shopify/images: ${[...missing].join(", ")}`);
  process.exit(1);
}

const csv = [columns.join(","), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\n") + "\n";
fs.writeFileSync(OUT, csv);
const settingVariants = rows.filter((row) => row.SKU && row.Type !== STONE_PAIR_TYPE && !pairSeeds.some((pair) => pair.handle === row["URL handle"])).length;
const natural = pairSeeds.filter((pair) => pair.origin === "natural").length;
console.log(`Wrote ${OUT}: ${earringSettingSeeds.length} setting (${settingVariants} variants), ${pairSeeds.length} pairs (${natural} natural, ${pairSeeds.length - natural} lab-grown), ${rows.length} rows`);
