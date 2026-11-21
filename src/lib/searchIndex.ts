/*
 * The search index, made at build time and handed to /search/, which searches it in the browser (no search
 * service, no server). Each item keeps what its card shows and one lowercase `haystack`: its title, type, topic, tags
 * and text. A query matches when every one of its words appears somewhere in that haystack (see src/lib/search.ts).
 *
 * Searched: the Fine Jewelry products, the listed ring settings and the listed earring setting (Products); the 18
 * resources and the blog posts that aren't stories (Education); the six stories (Customer Stories); the support page's
 * and Home's FAQs (FAQs). Not searched: loose stones and stone pairs (they are the builders' own lists).
 */
import type { ImageRef } from "@/components/ui/Picture";
import type { ArticleBlock } from "@/content/article";
import { postHref } from "@/content/blog";
import { resourceHref, topicById } from "@/content/education";
import { metalById } from "@/content/metals";
import { isFineJewelry, FINE_JEWELRY_CATEGORIES, variantName, type Product } from "@/content/products";
import { getEditorialContent, homeSectionOf } from "@/lib/content";
import { getBuilderCatalog } from "./builder";
import { getCatalog } from "./catalog";
import { getEarringsCatalog } from "./earrings";
import { normalize } from "./search";

export type SearchProduct = {
  id: string;
  kind: "product" | "setting" | "earring-setting";
  product: Product;
  /** The ring settings' "with stone" note: the cheapest available stone, as the setting list adds it. */
  withStone: number | null;
  haystack: string;
};
export type SearchEducation = { id: string; kind: "resource" | "post"; title: string; topic: string; excerpt: string; href: string; image: ImageRef; square: ImageRef; date: string; readTime: string | null; haystack: string };
export type SearchStory = { id: string; title: string; excerpt: string; href: string; image: ImageRef; haystack: string };
export type SearchFaq = { id: string; question: string; answer: string; haystack: string };
export type SearchIndex = { products: SearchProduct[]; education: SearchEducation[]; stories: SearchStory[]; faqs: SearchFaq[] };

const CATEGORY_LABEL: Record<string, string> = { rings: "Rings", necklaces: "Necklaces", earrings: "Earrings", bracelets: "Bracelets" };

/** Every bit of text in an article: headings, paragraphs, captions, labels, list items and table cells. */
function articleText(body: ArticleBlock[]) {
  return body
    .flatMap((block) => {
      switch (block._type) {
        case "heading":
        case "paragraph":
          return [block.text];
        case "figure":
          return [block.caption ?? "", block.image.alt];
        case "gallery":
          return block.items.map((item) => item.caption);
        case "gradeScale":
          return [block.label, ...block.options.map((option) => `${option.label} ${option.description}`)];
        case "list":
          return [block.label ?? "", ...block.items];
        case "table":
          return [block.caption, ...block.columns, ...block.rows.flat()];
        case "qualities":
          return [block.heading];
      }
    })
    .join(" ");
}

const hay = (...parts: Array<string | null | undefined | string[]>) => normalize(parts.flat().filter(Boolean).join(" "));

/** Home's 4:3 card photos and the square and 4:5 versions the search cards use. */
const square = (image: ImageRef): ImageRef => ({ desktop: image.desktop.replace(/-post$/, "-sq") as ImageRef["desktop"], alt: image.alt });
const storyCard = (image: ImageRef): ImageRef => ({ desktop: image.desktop.replace(/-post$/, "-d") as ImageRef["desktop"], mobile: image.desktop.replace(/-post$/, "-m") as ImageRef["desktop"], alt: image.alt });

function productHaystack(product: Product, type: string[]) {
  const metals = [...new Set(product.variants.map((variant) => metalById(variant.metal)?.label ?? ""))];
  return hay(product.name, product.variants.map((variant) => variantName(product, variant)), type, product.tags, product.styles, product.diamondType ?? "", product.shape ?? "", metals, product.description);
}

export async function buildSearchIndex(): Promise<SearchIndex> {
  const { blogPosts, educationResources, supportPage, homePage } = await getEditorialContent();
  const [{ products: catalog }, { settings, stones }, { settings: earringSettings }] = await Promise.all([getCatalog(), getBuilderCatalog(), getEarringsCatalog()]);

  // Products: Fine Jewelry in the product lists' order (category, then Best Match), then the ring settings in Step 1's
  // order, then the earring setting.
  const fine = catalog
    .filter((product) => isFineJewelry(product.category))
    .sort((a, b) => FINE_JEWELRY_CATEGORIES.indexOf(a.category as never) - FINE_JEWELRY_CATEGORIES.indexOf(b.category as never) || a.rank - b.rank);
  const cheapestStone = Math.min(...stones.filter((stone) => stone.available).map((stone) => stone.price));
  const products: SearchProduct[] = [
    ...fine.map((product) => ({ id: `product-${product.slug}`, kind: "product" as const, product, withStone: null, haystack: productHaystack(product, [CATEGORY_LABEL[product.category] ?? product.category, "Fine Jewelry"]) })),
    ...settings
      .filter((setting) => setting.listed)
      .map((setting) => ({
        id: `setting-${setting.handle}`,
        kind: "setting" as const,
        product: setting.product,
        withStone: Number.isFinite(cheapestStone) ? cheapestStone : null,
        haystack: productHaystack(setting.product, ["Engagement Rings", "Engagement Ring Settings", "Design Your Own Ring"]),
      })),
    ...earringSettings
      .filter((setting) => setting.listed)
      .map((setting) => ({ id: `earring-setting-${setting.handle}`, kind: "earring-setting" as const, product: setting.product, withStone: null, haystack: productHaystack(setting.product, ["Earrings", "Earring Settings", "Design Your Own Earrings"]) })),
  ];

  // Education: the resources and the posts that aren't stories, newest first (the Education Center's and the Blog's order).
  const education: SearchEducation[] = [
    ...educationResources.map((resource) => {
      const topic = topicById(resource.topic);
      const subtopic = topic?.subtopics.find((item) => item.id === resource.subtopic)?.label ?? "";
      return {
        id: resource._id,
        kind: "resource" as const,
        title: resource.title,
        topic: topic?.label ?? "",
        excerpt: resource.excerpt,
        href: resourceHref(resource),
        image: resource.image,
        square: square(resource.image),
        date: resource.date,
        readTime: null,
        haystack: hay(resource.title, "Education", topic?.label, subtopic, resource.excerpt, resource.subtitle, articleText(resource.body)),
      };
    }),
    ...blogPosts
      .filter((post) => post.kind !== "story")
      .map((post) => ({
        id: post._id,
        kind: "post" as const,
        title: post.title,
        topic: post.topic,
        excerpt: post.excerpt,
        href: postHref(post),
        image: post.image,
        square: square(post.image),
        date: post.date,
        readTime: post.readTime,
        haystack: hay(post.title, "Blog", post.topic, post.excerpt, articleText(post.body)),
      })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  // Customer Stories: newest first, as the Blog lists them.
  const stories: SearchStory[] = blogPosts
    .filter((post) => post.kind === "story")
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post) => ({ id: post._id, title: post.title, excerpt: post.excerpt, href: postHref(post), image: storyCard(post.image), haystack: hay(post.title, "Customer Stories", post.topic, post.excerpt, articleText(post.body)) }));

  // FAQs: the support page's, then Home's that ask something new (four of Home's five ask the same question).
  const support = supportPage.faqs.items.map((item) => ({ id: `faq-${item._key}`, question: item.question, answer: item.answer }));
  const seen = new Set(support.map((item) => normalize(item.question)));
  const home = homeSectionOf(homePage, "faqs", "faqs").items
    .filter((item) => !seen.has(normalize(item.question)))
    .map((item) => ({ id: `home-faq-${item._key}`, question: item.question, answer: item.answer.join(" ") }));
  const faqs: SearchFaq[] = [...support, ...home].map((item) => ({ ...item, haystack: hay(item.question, "FAQs", item.answer) }));

  return { products, education, stories, faqs };
}
