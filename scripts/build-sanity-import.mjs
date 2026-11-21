// Writes the Sanity import file from the editorial content files: studio/import/production.ndjson, one published
// document per line, with stable ids (re-importing with --replace updates the same documents, never duplicates them).
// Also writes the studio's fixed lists (studio/schemaTypes/lists.generated.ts): image keys, icon names, Home's
// section keys and the education topics, so the studio offers exactly what the site can show.
// Run: npm run sanity:import-file. It checks, and stops on, any problem:
//  - every document converts to Sanity's shape and back to exactly the content file's value (src/lib/cms/convert.ts);
//  - no draft ids, no ids with a period, unique _key values in every array;
//  - contact details: only the sample phone, email and address.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fromSanity, sameContent, toSanity } from "../src/lib/cms/convert.ts";
import { applySiteSettings, landingFromStored, landingToStored, localDocuments, supportFromStored, supportToStored } from "../src/lib/cms/documents.ts";
import { homePage } from "../src/content/home.ts";
import { siteFooter } from "../src/content/site.ts";
import { educationTopics } from "../src/content/education.ts";
import { iconData } from "../src/icons/icon-data.ts";
import { builderImageManifest } from "../src/content/builder-image-manifest.ts";
import { educationImageManifest } from "../src/content/education-image-manifest.ts";
import { imageManifest } from "../src/content/image-manifest.ts";
import { landingImageManifest } from "../src/content/landing-image-manifest.ts";
import { pagesImageManifest } from "../src/content/pages-image-manifest.ts";
import { pdpImageManifest } from "../src/content/pdp-image-manifest.ts";
import { productGalleryManifest } from "../src/content/product-gallery-manifest.ts";
import { productImageManifest } from "../src/content/product-image-manifest.ts";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const OUT = path.join(ROOT, "studio/import/production.ndjson");
const LISTS = path.join(ROOT, "studio/schemaTypes/lists.generated.ts");
const problems = [];

/* ---------- Documents ---------- */
const documents = [];
for (const doc of localDocuments()) {
  const stored = doc.type === "landingPage" ? landingToStored(doc.value, homePage) : doc.type === "supportPage" ? supportToStored(doc.value, siteFooter.contact) : doc.value;
  const fields = Object.fromEntries(Object.entries(stored).filter(([key]) => key !== "_id" && key !== "_type"));
  const sanity = { _id: doc.id, _type: doc.type, ...toSanity(fields) };
  documents.push(sanity);

  // Round trip: what the build will make of this document once it is in Sanity.
  let back = fromSanity(sanity, doc.value);
  if (doc.type === "landingPage") back = landingFromStored(back, homePage, (message) => problems.push(message));
  if (doc.type === "supportPage") back = supportFromStored(back, siteFooter.contact);
  if (doc.type === "siteSettings") {
    const applied = applySiteSettings(back);
    if (JSON.stringify(applied.siteFooter) !== JSON.stringify(siteFooter)) problems.push("siteSettings: the footer doesn't come back as in src/content/site.ts");
  }
  if (!sameContent(back, doc.value)) problems.push(`${doc.id}: does not come back from Sanity with the same content`);
  else if (JSON.stringify(back) !== JSON.stringify(doc.value)) problems.push(`${doc.id}: comes back with the same content but a different key order`);
}

/* ---------- Checks ---------- */
for (const doc of documents) {
  if (doc._id.startsWith("drafts.") || doc._id.includes(".")) problems.push(`${doc._id}: ids must not be drafts or contain a period`);
  (function walk(value, where) {
    if (Array.isArray(value)) {
      const keys = value.filter((item) => item && typeof item === "object" && !Array.isArray(item)).map((item) => item._key);
      if (keys.some((key) => key === undefined)) problems.push(`${doc._id} ${where}: an array item has no _key`);
      if (new Set(keys).size !== keys.length) problems.push(`${doc._id} ${where}: duplicate _key values (${keys.join(", ")})`);
      value.forEach((item, index) => walk(item, `${where}[${index}]`));
    } else if (value && typeof value === "object") {
      for (const [key, item] of Object.entries(value)) walk(item, `${where}.${key}`);
    }
  })(doc, "");
}
if (new Set(documents.map((doc) => doc._id)).size !== documents.length) problems.push("duplicate document ids");

// Personal data: the only phone numbers and email addresses are the site's sample ones.
const text = JSON.stringify(documents);
const sample = siteFooter.contact;
const emails = [...new Set(text.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? [])].filter((email) => email !== sample.email);
const phones = [...new Set(text.match(/\+?\d[\d ().-]{8,}\d/g) ?? [])].filter((phone) => phone.replace(/\D/g, "") !== sample.phone.replace(/\D/g, "") && !/^\d{4}-\d{2}-\d{2}/.test(phone));
const support = documents.find((doc) => doc._id === "supportPage");
for (const field of ["address", "email", "phone"]) {
  if (JSON.stringify(support).includes(JSON.stringify(sample[field]).slice(1, -1))) problems.push(`supportPage: repeats the ${field} instead of naming it ({${field}})`);
}
if (emails.length) problems.push(`email addresses other than the sample one: ${emails.join(", ")}`);
if (phones.length) problems.push(`phone numbers other than the sample one: ${phones.join(", ")}`);

if (problems.length) {
  console.error(`[sanity] The import file was not written:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}

/* ---------- Write ---------- */
documents.sort((a, b) => a._id.localeCompare(b._id));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, documents.map((doc) => JSON.stringify(doc)).join("\n") + "\n");

const imageKeys = [...new Set(Object.keys({ ...imageManifest, ...productImageManifest, ...productGalleryManifest, ...pdpImageManifest, ...landingImageManifest, ...builderImageManifest, ...educationImageManifest, ...pagesImageManifest }))].sort();
const lists = `// Generated by npm run sanity:import-file from the site's content files. Do not edit by hand.
/** Every photo the site has (src/content/*image-manifest.ts): a document refers to a photo by its key. */
export const IMAGE_KEYS = ${JSON.stringify(imageKeys, null, 2)} as const;

/** The site's icons (src/icons/icon-data.ts). */
export const ICON_NAMES = ${JSON.stringify(Object.keys(iconData).sort(), null, 2)} as const;

/** Home's sections, by key: what a landing page's "Section from Home" can show. */
export const HOME_SECTIONS = ${JSON.stringify(homePage.sections.map((section) => ({ value: section._key, title: `${section._key} (${section._type})` })), null, 2)};

/** The education topics and subtopics (src/content/education.ts; they stay in code, as filters and addresses use them). */
export const EDUCATION_TOPICS = ${JSON.stringify(educationTopics.map((topic) => ({ value: topic.id, title: topic.label, subtopics: topic.subtopics.map((sub) => ({ value: sub.id, title: sub.label })) })), null, 2)};
`;
fs.writeFileSync(LISTS, lists);

const counts = documents.reduce((all, doc) => ({ ...all, [doc._type]: (all[doc._type] ?? 0) + 1 }), {});
console.log(`[sanity] Wrote ${path.relative(ROOT, OUT)}: ${documents.length} documents (${Object.entries(counts).map(([type, count]) => `${count} ${type}`).join(", ")}), ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB.`);
console.log(`[sanity] Every document converts to Sanity and back unchanged. Wrote ${path.relative(ROOT, LISTS)}: ${imageKeys.length} image keys, ${Object.keys(iconData).length} icons.`);
