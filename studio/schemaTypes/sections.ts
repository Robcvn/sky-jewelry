/**
 * Page sections, as in src/content/home.ts (Home's sections) and src/content/landing/types.ts (the landing pages').
 * Each has a _type and _key, as in the content files; the site picks the component by _type.
 */
import { defineArrayMember, defineField, defineType } from "sanity";
import { bool, choice, cta, icon, image, items, num, only, req, reqText, richText, str, strings, text } from "./fields";
import { HOME_SECTIONS } from "./lists.generated";

/** A section preview: its heading's words (rich text pieces), and what kind of section it is. */
const preview = (kind: string, select: Record<string, string> = {}) => ({
  select: { s0: "heading.0.text", s1: "heading.1.text", s2: "heading.2.text", s3: "heading.3.text", plain: "heading", ...select },
  prepare: (value: Record<string, unknown>) => {
    const words = [value.s0, value.s1, value.s2, value.s3].filter((part) => typeof part === "string").join("");
    const title = (typeof value.plain === "string" ? value.plain : words) || (value.title as string) || kind;
    return { title: title.replace(/\s+/g, " ").trim(), subtitle: [kind, value.only && `${value.only} only`].filter(Boolean).join(" · ") };
  },
});
const landingFlag = () => bool("landing", "Landing page spacing", "Spaced as on the landing pages (the Figma landing frames).");
const flushTop = () => choice("flushTop", "No gap above", ["desktop", "mobile", "both"], { description: "Butts the section against the one above." });

/* ---------- Home's sections ---------- */

export const homeHero = defineType({
  name: "homeHero",
  title: "Hero",
  type: "object",
  fields: [
    req("overline", "Overline"),
    richText("heading", "Heading"),
    reqText("body", "Text"),
    image("image", "Photo"),
    items("links", "Buttons", [icon("icon", "Icon"), icon("mobileIcon", "Mobile icon"), req("label", "Label"), req("mobileLabel", "Mobile label"), req("href", "Address")], { select: { title: "label", subtitle: "href" } }),
    only(),
  ],
  preview: preview("Hero", { only: "only" }),
});

export const categoryStrip = defineType({
  name: "categoryStrip",
  title: "Category strip",
  type: "object",
  fields: [req("label", "Label"), items("categories", "Categories", [req("label", "Label"), req("href", "Address"), image("image", "Photo")], { select: { title: "label", subtitle: "href" } }), only()],
  preview: { select: { title: "label" }, prepare: ({ title }) => ({ title, subtitle: "Category strip" }) },
});

export const designYourOwn = defineType({
  name: "designYourOwn",
  title: "Design Your Own",
  type: "object",
  fields: [
    richText("heading", "Heading"),
    reqText("body", "Text"),
    items("cards", "Cards", [icon(), req("title", "Title"), reqText("body", "Text"), cta()], { select: { title: "title", subtitle: "cta.href" } }),
    image("diamond", "Diamond photo"),
    image("setting", "Setting photo"),
    only(),
  ],
  preview: preview("Design Your Own", { only: "only" }),
});

export const featureGrid = defineType({
  name: "featureGrid",
  title: "Feature grid",
  type: "object",
  fields: [
    req("heading", "Heading"),
    bool("padTop", "Space above"),
    choice("mobileCaption", "Mobile caption", ["rule-title"], { description: "rule-title: a gold rule over the title." }),
    items("cards", "Cards", [req("title", "Title"), req("href", "Address"), image("image", "Photo"), bool("wide", "Wide")], { select: { title: "title", subtitle: "href" } }),
    req("ctaLabel", "Button label"),
    only(),
  ],
  preview: preview("Feature grid", { only: "only" }),
});

export const heroModule = defineType({
  name: "heroModule",
  title: "Photo module",
  type: "object",
  fields: [
    str("overline", "Overline"),
    richText("heading", "Heading"),
    reqText("body", "Text"),
    cta("cta", "Button", true),
    image("image", "Photo"),
    bool("inert", "Button shown but not a link", "For a button with nothing to connect to yet (such as live chat)."),
    flushTop(),
    choice("mobileTitleGap", "Mobile title gap", ["tight"], { description: "tight: 12px from title to text on mobile." }),
    landingFlag(),
    only(),
  ],
  preview: preview("Photo module", { only: "only" }),
});

export const productCarousel = defineType({
  name: "productCarousel",
  title: "Product carousel",
  type: "object",
  fields: [req("overline", "Overline"), richText("heading", "Heading"), strings("productIds", "Shopify product handles", { description: "In the order shown." }), only()],
  preview: preview("Product carousel", { only: "only" }),
});

export const customerStories = defineType({
  name: "customerStories",
  title: "Customer stories",
  type: "object",
  fields: [
    richText("heading", "Heading"),
    cta(),
    items("stories", "Stories", [req("title", "Title"), reqText("body", "Text"), req("href", "Address"), image("image", "Photo")], { select: { title: "title", subtitle: "href" } }),
    req("storyCtaLabel", "Story button label"),
    only(),
  ],
  preview: preview("Customer stories", { only: "only" }),
});

export const educationCenter = defineType({
  name: "educationCenter",
  title: "Education Center",
  type: "object",
  fields: [
    richText("heading", "Heading"),
    reqText("body", "Text"),
    cta(),
    defineField({
      name: "featured",
      title: "Featured resource",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [req("topic", "Topic label"), req("title", "Title"), reqText("body", "Text"), req("href", "Address"), req("ctaLabel", "Button label"), image("image", "Photo")],
    }),
    items("resources", "More resources", [req("topic", "Topic label"), req("title", "Title"), req("href", "Address"), image("image", "Photo")], { select: { title: "title", subtitle: "topic" } }),
    only(),
  ],
  preview: preview("Education Center", { only: "only" }),
});

export const reviews = defineType({
  name: "reviews",
  title: "Reviews",
  type: "object",
  fields: [
    richText("heading", "Heading"),
    num("rating", "Average rating", { validation: (rule) => rule.required().min(0).max(5) }),
    req("reviewCount", "Review count", { description: "As shown, such as “Based on 1,200 reviews”." }),
    items("reviews", "Reviews", [req("name", "Name", { description: "Sample names only." }), num("rating", "Rating", { validation: (rule) => rule.required().min(1).max(5) }), req("date", "Date as shown"), reqText("body", "Review")], { select: { title: "name", subtitle: "body" } }),
    landingFlag(),
    only(),
  ],
  preview: preview("Reviews", { only: "only" }),
});

export const blogRow = defineType({
  name: "blogRow",
  title: "Blog row",
  type: "object",
  fields: [str("overline", "Overline"), richText("heading", "Heading"), cta(), strings("postIds", "Posts", { description: "Blog post document ids, in order (such as post-lab-vs-natural)." }), only()],
  preview: preview("Blog row", { only: "only" }),
});

export const about = defineType({
  name: "about",
  title: "About",
  type: "object",
  fields: [richText("heading", "Heading"), reqText("body", "Text"), cta("cta", "Button", true), image("image", "Photo"), only()],
  preview: preview("About", { only: "only" }),
});

export const faqs = defineType({
  name: "faqs",
  title: "FAQs",
  type: "object",
  fields: [
    richText("heading", "Heading"),
    reqText("body", "Text"),
    cta(),
    num("openOnDesktop", "Open on desktop", { description: "The answer open at first on desktop, counting from 0." }),
    items("items", "Questions", [req("question", "Question"), strings("answer", "Answer", { description: "One entry per paragraph.", validation: (rule) => rule.required().min(1) })], { select: { title: "question" } }),
    landingFlag(),
    only(),
  ],
  preview: preview("FAQs", { only: "only" }),
});

/* ---------- The landing pages' own sections ---------- */

export const ctaCallout = defineType({
  name: "ctaCallout",
  title: "Promo band",
  type: "object",
  fields: [req("eyebrow", "Eyebrow"), req("title", "Title"), cta(), only()],
  preview: { select: { title: "title", only: "only" }, prepare: ({ title, only: where }) => ({ title, subtitle: ["Promo band", where && `${where} only`].filter(Boolean).join(" · ") }) },
});

export const tileCarousel = defineType({
  name: "tileCarousel",
  title: "Tiles",
  type: "object",
  fields: [
    str("overline", "Overline"),
    richText("heading", "Heading"),
    choice("layout", "Layout", ["carousel", "grid"], { validation: (rule) => rule.required(), description: "carousel: arrows on desktop; grid: a static 4-up row on desktop." }),
    items("items", "Tiles", [req("title", "Title"), text("body", "Text"), str("priceLabel", "Price line"), str("href", "Address", { description: "Empty: drawn but not a link." }), image("image", "Photo")], { select: { title: "title", subtitle: "href" } }),
    only(),
  ],
  preview: preview("Tiles", { only: "only" }),
});

export const guaranteeIcons = defineType({
  name: "guaranteeIcons",
  title: "Guarantee icons",
  type: "object",
  fields: [req("overline", "Overline"), richText("heading", "Heading"), items("items", "Icons", [icon(), req("title", "Title"), reqText("body", "Text")], { select: { title: "title", subtitle: "body" } }), only()],
  preview: preview("Guarantee icons", { only: "only" }),
});

export const featureCardRow = defineType({
  name: "featureCardRow",
  title: "Feature cards",
  type: "object",
  fields: [
    richText("heading", "Heading", { validation: undefined, description: "Optional. Without one, the hidden heading below names the section." }),
    str("srHeading", "Hidden heading", { description: "Read by screen readers when there is no visible heading." }),
    text("body", "Text"),
    choice("mobile", "Mobile", ["carousel", "grid"], { validation: (rule) => rule.required() }),
    bool("compact", "Compact captions"),
    req("ctaLabel", "Button label"),
    items("cards", "Cards", [req("title", "Title"), text("body", "Text"), req("href", "Address"), image("image", "Photo")], { select: { title: "title", subtitle: "href" } }),
    only(),
  ],
  preview: preview("Feature cards", { only: "only", title: "srHeading" }),
});

export const bestSellers = defineType({
  name: "bestSellers",
  title: "Best sellers",
  type: "object",
  fields: [str("overline", "Overline"), richText("heading", "Heading"), items("rows", "Rows", [str("title", "Row title"), strings("handles", "Shopify product handles")], { select: { title: "title" } }), only()],
  preview: preview("Best sellers", { only: "only" }),
});

export const buttonCardPair = defineType({
  name: "buttonCardPair",
  title: "Button cards",
  type: "object",
  fields: [
    str("overline", "Overline"),
    richText("heading", "Heading", { validation: undefined, description: "Optional." }),
    str("label", "Name for screen readers", { description: "When there is no heading." }),
    items(
      "cards",
      "Cards",
      [
        icon(),
        req("title", "Title"),
        text("body", "Text"),
        defineField({ name: "cta", title: "Button", type: "object", fields: [req("label", "Label"), str("href", "Address"), bool("inert", "Shown but not a link")] }),
        image("image", "Photo"),
      ],
      { select: { title: "title", subtitle: "cta.label" } },
    ),
    only(),
  ],
  preview: preview("Button cards", { only: "only", title: "label" }),
});

export const diamondInspection = defineType({
  name: "diamondInspection",
  title: "Diamond inspection",
  type: "object",
  fields: [richText("heading", "Heading"), reqText("body", "Text"), strings("steps", "Steps"), cta("cta", "Button", true), image("image", "Photo"), only()],
  preview: preview("Diamond inspection", { only: "only" }),
});

/** A landing page section that is one of Home's, unchanged: edited once, on Home. */
export const homeSectionRef = defineType({
  name: "homeSection",
  title: "Section from Home",
  type: "object",
  description: "Shows one of Home's sections here, as it is on Home: edit it on the Home page.",
  fields: [
    str("section", "Home section", { options: { list: HOME_SECTIONS }, validation: (rule) => rule.required() }),
    landingFlag(),
    flushTop(),
  ],
  preview: { select: { section: "section" }, prepare: ({ section }) => ({ title: `From Home: ${section}`, subtitle: "Section from Home (edit it on Home)" }) },
});

export const homeSectionTypes = ["homeHero", "categoryStrip", "designYourOwn", "featureGrid", "heroModule", "productCarousel", "customerStories", "educationCenter", "reviews", "blogRow", "about", "faqs"];
export const landingSectionTypes = [...homeSectionTypes, "ctaCallout", "tileCarousel", "guaranteeIcons", "featureCardRow", "bestSellers", "buttonCardPair", "diamondInspection", "homeSection"];
export const sectionMembers = (types: string[]) => types.map((type) => defineArrayMember({ type }));

export const sectionTypes = [homeHero, categoryStrip, designYourOwn, featureGrid, heroModule, productCarousel, customerStories, educationCenter, reviews, blogRow, about, faqs, ctaCallout, tileCarousel, guaranteeIcons, featureCardRow, bestSellers, buttonCardPair, diamondInspection, homeSectionRef];
