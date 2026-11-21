/**
 * Rich text pieces, and the blocks of education resources, blog posts and legal pages (src/content/article.ts and
 * src/content/legal.ts). "textSpan" is the site's "span" (Sanity's own "span" type is reserved).
 */
import { defineArrayMember, defineField, defineType } from "sanity";
import { bool, choice, image, items, num, req, reqText, str, strings, text } from "./fields";

export const textSpan = defineType({
  name: "textSpan",
  title: "Text",
  type: "object",
  fields: [
    req("text", "Text", { description: "Spaces count: end a piece with a space when the next one follows on." }),
    bool("italic", "Italic"),
    bool("desktopOnly", "Desktop only"),
    bool("mobileOnly", "Mobile only"),
    bool("alternative", "Mobile alternative", "The mobile wording of a desktop-only piece: screen readers read the words once."),
  ],
  preview: {
    select: { title: "text", italic: "italic", desktopOnly: "desktopOnly", mobileOnly: "mobileOnly" },
    prepare: ({ title, italic, desktopOnly, mobileOnly }) => ({
      title: `“${title ?? ""}”`,
      subtitle: [italic && "italic", desktopOnly && "desktop only", mobileOnly && "mobile only"].filter(Boolean).join(", "),
    }),
  },
});

export const lineBreak = defineType({
  name: "break",
  title: "Line break",
  type: "object",
  fields: [bool("mobileOnly", "Mobile only")],
  preview: { select: { mobileOnly: "mobileOnly" }, prepare: ({ mobileOnly }) => ({ title: "Line break", subtitle: mobileOnly ? "mobile only" : "" }) },
});

/** A table row: arrays of arrays aren't possible in Sanity, so each row is an object with its cells. */
export const tableRow = defineType({
  name: "row",
  title: "Row",
  type: "object",
  fields: [strings("cells", "Cells")],
  preview: { select: { cells: "cells" }, prepare: ({ cells }) => ({ title: (cells ?? []).join(" · ") }) },
});

/* ---------- Education resources and blog posts ---------- */

export const heading = defineType({
  name: "heading",
  title: "Heading",
  type: "object",
  fields: [
    num("level", "Level", { options: { list: [2, 3, 4] }, initialValue: 2, validation: (rule) => rule.required() }),
    req("text", "Text"),
    str("nav", "Short label", { description: "Optional: the heading's label in the page's section menu." }),
  ],
  preview: { select: { title: "text", level: "level" }, prepare: ({ title, level }) => ({ title, subtitle: `Heading ${level ?? ""}` }) },
});

export const paragraph = defineType({
  name: "paragraph",
  title: "Paragraph",
  type: "object",
  fields: [reqText("text", "Text", { rows: 5 })],
  preview: { select: { title: "text" }, prepare: ({ title }) => ({ title, subtitle: "Paragraph" }) },
});

export const figure = defineType({
  name: "figure",
  title: "Photo",
  type: "object",
  fields: [
    image("image", "Photo"),
    text("caption", "Caption"),
    choice("shape", "Shape", ["tall"], { description: "Empty: the usual landscape photo." }),
    defineField({
      name: "products",
      title: "Products beside the photo",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [str("label", "Label"), strings("handles", "Shopify product handles")],
    }),
    defineField({ name: "action", title: "Button on the photo", type: "object", options: { collapsible: true, collapsed: true }, fields: [str("label", "Label"), str("icon", "Icon"), str("href", "Address")] }),
  ],
  preview: { select: { title: "image.alt", subtitle: "image.desktop" }, prepare: ({ title, subtitle }) => ({ title: title || "Photo", subtitle }) },
});

export const gallery = defineType({
  name: "gallery",
  title: "Photo row",
  type: "object",
  fields: [items("items", "Photos", [image("image", "Photo"), str("caption", "Caption")], { select: { title: "caption", subtitle: "image.desktop" } })],
  preview: { select: { items: "items" }, prepare: ({ items: list }) => ({ title: "Photo row", subtitle: `${(list ?? []).length} photos` }) },
});

export const gradeScale = defineType({
  name: "gradeScale",
  title: "Grade scale",
  type: "object",
  fields: [
    req("label", "Label"),
    image("image", "Photo"),
    image("loupe", "Loupe photo"),
    req("initial", "Grade shown first"),
    items("options", "Grades", [req("value", "Value"), req("label", "Label"), text("description", "Description")], { select: { title: "label", subtitle: "description" } }),
  ],
  preview: { select: { title: "label" }, prepare: ({ title }) => ({ title, subtitle: "Grade scale" }) },
});

export const qualities = defineType({
  name: "qualities",
  title: "Diamond qualities cards",
  type: "object",
  fields: [req("heading", "Heading")],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title, subtitle: "Diamond qualities cards" }) },
});

export const list = defineType({
  name: "list",
  title: "List",
  type: "object",
  fields: [str("label", "Label", { description: "Optional: a line above the list." }), strings("items", "Items", { validation: (rule) => rule.required().min(1) })],
  preview: { select: { label: "label", items: "items" }, prepare: ({ label, items: list }) => ({ title: label || (list ?? [])[0] || "List", subtitle: `List, ${(list ?? []).length} items` }) },
});

export const table = defineType({
  name: "table",
  title: "Table",
  type: "object",
  fields: [
    str("caption", "Caption"),
    strings("columns", "Column headings", { validation: (rule) => rule.required().min(1) }),
    defineField({ name: "rows", title: "Rows", type: "array", of: [defineArrayMember({ type: "row" })] }),
  ],
  preview: { select: { title: "caption", columns: "columns" }, prepare: ({ title, columns }) => ({ title: title || "Table", subtitle: (columns ?? []).join(" · ") }) },
});

/** The blocks an education resource or blog post body may hold. */
export const articleBlocks = ["heading", "paragraph", "figure", "gallery", "gradeScale", "qualities", "list", "table"].map((type) => defineArrayMember({ type }));

/* ---------- Legal pages ---------- */

const legalText = (name: string, title: string) =>
  defineType({ name, title, type: "object", fields: [reqText("text", "Text", { rows: name === "p" ? 5 : 2 })], preview: { select: { title: "text" }, prepare: ({ title: value }) => ({ title: value, subtitle: title }) } });

export const legalH2 = legalText("h2", "Heading");
export const legalH3 = legalText("h3", "Subheading");
export const legalP = legalText("p", "Paragraph");
export const legalLabel = legalText("label", "Label");
export const legalBlocks = ["h2", "h3", "p", "label", "list", "table"].map((type) => defineArrayMember({ type }));

export const blockTypes = [textSpan, lineBreak, tableRow, heading, paragraph, figure, gallery, gradeScale, qualities, list, table, legalH2, legalH3, legalP, legalLabel];
