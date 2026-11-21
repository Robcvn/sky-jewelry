/**
 * The editorial documents. Each mirrors a content file of the site (named on each), so the site reads it back in the
 * same shape. Products, prices and the bag stay in Shopify. Photos stay in the site's repository: a document names a
 * photo by its key.
 */
import { defineField, defineType } from "sanity";
import type { Rule } from "sanity";
import { articleBlocks, legalBlocks } from "./blocks";
import { choice, icon, image, items, num, req, reqText, richText, seo, str, strings, subtopic, text, topic } from "./fields";
import { homeSectionTypes, landingSectionTypes, sectionMembers } from "./sections";

const slug = (description: string) =>
  req("slug", "Address name", {
    description,
    validation: (rule: Rule) => rule.required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { name: "lowercase words joined by hyphens" }),
  });
const group = (name: string, title: string, fields: ReturnType<typeof defineField>[], collapsed = false) =>
  defineField({ name, title, type: "object", options: { collapsible: true, collapsed }, fields });

/* ---------- Site settings (src/content/site.ts: announcement bar and footer text) ---------- */

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  description: "The announcement bar, the footer's text, the sample contact details and the demo notice. Links and icons stay in code.",
  fields: [
    group("announcementBar", "Announcement bar", [
      choice("mode", "Shows", ["countdown", "messages"], { validation: (rule) => rule.required(), description: "countdown: the sale timer (every Figma frame shows it); messages: the rotating messages." }),
      strings("messages", "Messages", { validation: (rule) => rule.required().min(1) }),
      group("countdown", "Sale countdown", [
        req("label", "Label"),
        num("restartDays", "Restarts every (days)", { description: "The sale ends a few days after each build, and restarts after this many days.", validation: (rule) => rule.required().min(1) }),
      ]),
    ]),
    defineField({
      name: "contact",
      title: "Contact details (sample)",
      type: "object",
      description: "Shown in the footer, the header's contact dropdown and the support page (where {address}, {email} and {phone} stand for them).",
      options: { collapsible: true, collapsed: false },
      fields: [
      req("address", "Address"),
      req("phone", "Phone"),
      req("email", "Email", { validation: (rule: Rule) => rule.required().email() }),
      ],
    }),
    group("footer", "Footer", [
      group("newsletter", "Newsletter", [
        req("headingBefore", "Heading, before the italic words"),
        req("headingItalic", "Heading, italic words"),
        req("headingAfter", "Heading, after the italic words"),
        req("emailLabel", "Email field label"),
        req("submitLabel", "Button label"),
        reqText("consent", "Consent line"),
        req("invalidEmail", "Invalid email message"),
        req("successHeading", "Thank-you heading"),
        reqText("successBody", "Thank-you text"),
      ]),
      group("privacyLine", "Privacy line", [str("before", "Before “Privacy Policy”"), str("middle", "Between the links"), str("after", "After “Contact Us”")]),
      reqText("description", "Description"),
      req("copyright", "Copyright line"),
      reqText("demoNotice", "Demo notice", { description: "Says this is a portfolio build with sample content." }),
    ]),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

/* ---------- Home and the landing pages (src/content/home.ts, src/content/landing/*.ts) ---------- */

export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  fields: [seo(), defineField({ name: "sections", title: "Sections", type: "array", of: sectionMembers(homeSectionTypes), validation: (rule) => rule.required().min(1) })],
  preview: { prepare: () => ({ title: "Home" }) },
});

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing page",
  type: "document",
  description: "Engagement Rings, Wedding Bands, Diamonds, Gemstones and Fine Jewelry. Their addresses are fixed in the site.",
  fields: [
    defineField({ ...slug("The page's address, fixed by the site (such as diamonds)."), readOnly: true }),
    seo(),
    defineField({ name: "sections", title: "Sections", type: "array", of: sectionMembers(landingSectionTypes), validation: (rule) => rule.required().min(1) }),
  ],
  preview: { select: { title: "seo.title", subtitle: "slug" }, prepare: ({ title, subtitle }) => ({ title, subtitle: `/${subtitle}/` }) },
  orderings: [{ title: "Address", name: "slug", by: [{ field: "slug", direction: "asc" }] }],
});

/* ---------- Education (src/content/education.ts) ---------- */

export const educationCenterPage = defineType({
  name: "educationCenterPage",
  title: "Education Center",
  type: "document",
  fields: [
    seo(),
    group("hero", "Hero", [image("image", "Photo")]),
    req("title", "Title"),
    reqText("body", "Text"),
    req("topicsLabel", "Topics label"),
    req("allTopics", "“All topics” label"),
    num("pageSize", "Resources per page", { validation: (rule) => rule.required().min(1) }),
    group("featured", "Featured education", [
      req("heading", "Heading"),
      reqText("body", "Text"),
      req("lead", "Lead resource", { description: "The address name (slug) of the resource shown large." }),
      image("leadImage", "Lead photo"),
      items("items", "More featured resources", [req("slug", "Resource address name"), image("image", "Photo")], { select: { title: "slug" } }),
    ]),
    group("detail", "Resource pages", [req("back", "Back link label"), req("next", "Next resource label"), req("readNow", "Read button label"), image("hero", "Hero photo"), image("nextImage", "Next resource photo")], true),
  ],
  preview: { prepare: () => ({ title: "Education Center" }) },
});

export const resource = defineType({
  name: "resource",
  title: "Education resource",
  type: "document",
  fields: [
    req("title", "Title"),
    slug("Its address: /education/<address name>/."),
    topic(),
    subtopic(),
    defineField({ name: "date", title: "Date", type: "date", validation: (rule) => rule.required() }),
    reqText("excerpt", "Excerpt"),
    text("subtitle", "Subtitle"),
    image("image", "Photo"),
    str("navLabel", "Short label", { description: "Its label in the Education menu and lists." }),
    str("next", "Next resource", { description: "The address name of the resource its “Next” link opens." }),
    defineField({ name: "body", title: "Body", type: "array", of: articleBlocks, validation: (rule) => rule.required().min(1) }),
  ],
  preview: { select: { title: "title", topic: "topic", date: "date" }, prepare: ({ title, topic: id, date }) => ({ title, subtitle: [id, date].filter(Boolean).join(" · ") }) },
  orderings: [
    { title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
    { title: "Topic", name: "topic", by: [{ field: "topic", direction: "asc" }, { field: "title", direction: "asc" }] },
  ],
});

/* ---------- Blog and customer stories (src/content/blog.ts) ---------- */

export const blogPage = defineType({
  name: "blogPage",
  title: "Blog",
  type: "document",
  fields: [
    seo(),
    req("title", "Title"),
    reqText("body", "Text"),
    num("pageSize", "Posts per page", { validation: (rule) => rule.required().min(1) }),
    req("readMore", "“Read more” label"),
    req("allTopics", "“All topics” label"),
    req("back", "Back link label"),
    req("alsoRead", "“Also read” heading"),
    req("viewAll", "“View all” label"),
    req("storyBack", "Story pages: back link label"),
    req("storyEyebrow", "Story pages: eyebrow"),
  ],
  preview: { prepare: () => ({ title: "Blog" }) },
});

export const post = defineType({
  name: "post",
  title: "Blog post or customer story",
  type: "document",
  fields: [
    choice("kind", "Kind", ["story"], { description: "story: a customer story (/stories/…). Empty: a blog post (/blog/…)." }),
    req("title", "Title"),
    slug("Its address: /blog/<address name>/, or /stories/<address name>/ for a story."),
    req("topic", "Topic", { description: "As shown, such as Style or Diamonds (stories: Stories)." }),
    defineField({ name: "date", title: "Date", type: "date", validation: (rule) => rule.required() }),
    req("readTime", "Read time", { description: "As shown, such as “4 Min Read”." }),
    reqText("excerpt", "Excerpt"),
    group("thumbnail", "Menu thumbnail", [req("src", "Image file", { description: "The file's address under /images/, as in the site's repository." }), str("alt", "Alt text")], true),
    image("image", "Card photo"),
    image("hero", "Hero photo"),
    image("featuredImage", "Featured photo"),
    defineField({ name: "body", title: "Body", type: "array", of: articleBlocks, validation: (rule) => rule.required().min(1) }),
  ],
  preview: { select: { title: "title", kind: "kind", date: "date", topic: "topic" }, prepare: ({ title, kind, date, topic: label }) => ({ title, subtitle: [kind === "story" ? "Story" : "Post", label, date].filter(Boolean).join(" · ") }) },
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
});

/* ---------- Support and guarantee page (src/content/support.ts) ---------- */

const PLACEHOLDERS = "{address}, {email} or {phone} shows Site settings' contact details.";
const cardFields = (withAction: boolean) => [
  icon(),
  req("title", "Title"),
  reqText("body", "Text", { description: PLACEHOLDERS }),
  ...(withAction ? [str("action", "Button label", { description: PLACEHOLDERS })] : []),
  str("source", "Where the design states this", { description: "For the claims check: the Figma frame or the claim it repeats." }),
];

export const supportPage = defineType({
  name: "supportPage",
  title: "Support and guarantee",
  type: "document",
  description: "/the-sky-guarantee/: Support, The Sky Guarantee and FAQs. In any text here, {address}, {email} and {phone} show Site settings' contact details.",
  fields: [
    seo(),
    group("hero", "Hero", [
      image("image", "Photo"),
      group("title", "Title", [richText("desktop", "Desktop"), richText("mobile", "Mobile")]),
      reqText("body", "Text"),
    ]),
    req("navLabel", "Section menu label"),
    group("contact", "Contact (mobile only)", [
      req("heading", "Heading"),
      req("nav", "Section menu label"),
      req("locationsHeading", "Locations heading"),
      req("address", "Address", { description: "{address}: Site settings' address (or any text)." }),
      req("hoursLabel", "Hours label"),
      strings("hours", "Hours"),
      items("cards", "Cards", cardFields(true), { select: { title: "title", subtitle: "body" } }),
      req("formHeading", "Form heading"),
      items("fields", "Form fields", [req("label", "Label"), choice("type", "Type", ["text", "email", "tel"]), str("autoComplete", "Autocomplete")], { select: { title: "label", subtitle: "type" } }),
      req("messageLabel", "Message label"),
      req("submit", "Button label"),
    ]),
    group("offerings", "Support offerings", [req("heading", "Heading"), req("nav", "Section menu label"), reqText("body", "Text"), items("cards", "Cards", cardFields(false), { select: { title: "title", subtitle: "body" } })]),
    group("services", "Additional services", [req("heading", "Heading"), req("nav", "Section menu label"), reqText("body", "Text"), items("cards", "Cards", cardFields(true), { select: { title: "title", subtitle: "body" } })]),
    group("faqs", "FAQs", [
      req("heading", "Heading"),
      req("nav", "Section menu label"),
      reqText("body", "Text"),
      num("openOnDesktop", "Open on desktop", { description: "The answer open at first on desktop, counting from 0." }),
      items("items", "Questions", [req("question", "Question"), reqText("answer", "Answer"), str("source", "Where the design states this")], { select: { title: "question", subtitle: "answer" } }),
    ]),
  ],
  preview: { prepare: () => ({ title: "Support and guarantee" }) },
});

/* ---------- Legal pages (src/content/legal.ts) ---------- */

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  description: "Privacy Policy, Terms of Use and Shipping Info: sample text for a portfolio demonstration.",
  fields: [
    req("title", "Title"),
    defineField({ ...slug("Its address, fixed by the site (such as privacy-policy)."), readOnly: true }),
    defineField({ name: "updated", title: "Last updated", type: "date", validation: (rule) => rule.required() }),
    seo(false),
    items("intro", "Introduction", [text("text", "Text"), strings("items", "List")], { select: { title: "text", items: "items" }, prepare: ({ title, items: list }) => ({ title: title || (Array.isArray(list) ? list[0] : "") || "Introduction" }) }),
    defineField({ name: "body", title: "Body", type: "array", of: legalBlocks, validation: (rule) => rule.required().min(1) }),
  ],
  preview: { select: { title: "title", subtitle: "slug" }, prepare: ({ title, subtitle }) => ({ title, subtitle: `/${subtitle}/` }) },
});

/* ---------- Our Story (src/content/our-story.ts) ---------- */

export const ourStoryPage = defineType({
  name: "ourStoryPage",
  title: "Our Story",
  type: "document",
  fields: [
    seo(),
    group("hero", "Hero", [req("overline", "Overline"), richText("title", "Title"), image("image", "Photo"), group("button", "Button (shown, not a link)", [req("label", "Label"), icon()])]),
    group("business", "A multi-generational business", [richText("heading", "Heading"), reqText("body", "Text"), strings("buttons", "Buttons (shown, not links)"), image("image", "Photo")]),
    group("apart", "What sets us apart", [richText("heading", "Heading"), reqText("body", "Text"), items("items", "Items", [req("label", "Label"), reqText("body", "Text")], { select: { title: "label" } }), image("image", "Photo")]),
    group("foundations", "Foundations", [req("overline", "Overline"), reqText("statement", "Statement")]),
  ],
  preview: { prepare: () => ({ title: "Our Story" }) },
});

export const documentTypes = [siteSettings, homePage, landingPage, educationCenterPage, resource, blogPage, post, supportPage, legalPage, ourStoryPage];
/** One fixed document each, with the type's name as its id (the ids the import file and the site use). */
export const SINGLETONS = ["siteSettings", "homePage", "educationCenterPage", "blogPage", "supportPage", "ourStoryPage"];
/** Fixed sets of documents whose addresses the site defines: edited, not created or deleted. */
export const FIXED_TYPES = ["landingPage", "legalPage"];
