// Writes shopify/products-seed.csv from the mock products (src/content/products.ts), in Shopify's
// product CSV format (columns as in Shopify's current product_template.csv, a subset in the same order).
// Run: npm run shopify:seed. Node 24 strips the TypeScript types when importing the products file.
// Product images: Shopify downloads them from public URLs during import. By default they come from the
// public GitHub repo (shopify/images/), so push before importing. Override with SEED_IMAGE_BASE.
import fs from "node:fs";
import { mockProducts } from "../src/content/products.ts";

const IMAGE_BASE = process.env.SEED_IMAGE_BASE ?? "https://raw.githubusercontent.com/Robcvn/sky-jewelry/main/shopify/images";
const METAL_LABEL = { "white-gold": "White Gold", "yellow-gold": "Yellow Gold", "rose-gold": "Rose Gold" };
const TYPE_LABEL = { "engagement-rings": "Engagement Rings" };

const columns = [
  "Title", "URL handle", "Description", "Vendor", "Product category", "Type", "Tags",
  "Published on online store", "Status", "SKU", "Option1 name", "Option1 value", "Price", "Compare-at price",
  "Charge tax", "Inventory tracker", "Continue selling when out of stock", "Requires shipping", "Fulfillment service",
  "Product image URL", "Image position", "Image alt text", "SEO title", "SEO description",
];

const csvCell = (value) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const sku = (product) =>
  `SKY-${product.slug.split("-").map((part) => part.slice(0, 3).toUpperCase()).join("")}-${product.metal === "rose-gold" ? "RG" : product.metal === "yellow-gold" ? "YG" : "WG"}`;

const rows = mockProducts.map((product) => ({
  Title: product.name,
  "URL handle": product.slug,
  Description: `<p>${product.description}</p>`,
  Vendor: "Sky Jewelry",
  "Product category": "",
  Type: TYPE_LABEL[product.category] ?? product.category,
  Tags: [product.category, "best-seller", product.metal].join(", "),
  // Headless site: products are made available to the Headless channel after import, not the Online Store.
  "Published on online store": "FALSE",
  Status: "active",
  SKU: sku(product),
  "Option1 name": "Metal",
  "Option1 value": METAL_LABEL[product.metal],
  Price: product.priceFrom.toFixed(2),
  "Compare-at price": "",
  "Charge tax": "TRUE",
  // Not tracked, so sample products never sell out.
  "Inventory tracker": "",
  "Continue selling when out of stock": "deny",
  "Requires shipping": "TRUE",
  "Fulfillment service": "manual",
  "Product image URL": `${IMAGE_BASE}/ring-${product.metal === "rose-gold" ? "rose-gold" : "white-gold"}.jpg`,
  "Image position": "1",
  "Image alt text": product.image.alt,
  "SEO title": `${product.name} | Sky Jewelry`,
  "SEO description": product.description,
}));

const csv = [columns.join(","), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\n") + "\n";
fs.mkdirSync("shopify", { recursive: true });
fs.writeFileSync("shopify/products-seed.csv", csv);
console.log(`Wrote shopify/products-seed.csv: ${rows.length} products`);
