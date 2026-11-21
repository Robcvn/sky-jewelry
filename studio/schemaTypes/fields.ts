/**
 * Field helpers shared by the models. The models mirror the site's content files (src/content/*.ts) field for field,
 * so the import file (npm run sanity:import-file at the site's root) fits them and the site reads them back unchanged.
 * Arrays of objects that have no _type in the content files use an item type named "<field>Item", as the import file
 * does (src/lib/cms/convert.ts).
 */
import { defineArrayMember, defineField, type FieldDefinition } from "sanity";
import type { Rule } from "sanity";
import { EDUCATION_TOPICS, ICON_NAMES, IMAGE_KEYS } from "./lists.generated";

type Extra = Partial<Omit<FieldDefinition, "name" | "type">> & Record<string, unknown>;

export const itemType = (field: string) => `${field}Item`;

const imageKeyOptions = { list: IMAGE_KEYS.map((key) => ({ title: key, value: key })) };

/** A photo from the repository, by its key (the site's image manifests), with alt text. */
export const image = (name: string, title?: string, extra: Extra = {}) =>
  defineField({
    name,
    title,
    type: "object",
    options: { collapsible: true, collapsed: false },
    fields: [
      defineField({ name: "desktop", title: "Photo", type: "string", description: "The photo's key. On mobile too, unless a mobile photo is set.", options: imageKeyOptions, validation: (rule) => rule.required() }),
      defineField({ name: "mobile", title: "Mobile photo", type: "string", description: "Optional: a different crop below 1024px.", options: imageKeyOptions }),
      defineField({ name: "alt", title: "Alt text", type: "string", description: "What the photo shows, for screen readers. Leave empty for a decorative photo." }),
    ],
    preview: { select: { title: "desktop", subtitle: "alt" } },
    ...extra,
  } as FieldDefinition);

/** Headings with italic words and line breaks: the site's rich text pieces. */
export const richText = (name: string, title?: string, extra: Extra = {}) =>
  defineField({
    name,
    title,
    type: "array",
    of: [defineArrayMember({ type: "textSpan" }), defineArrayMember({ type: "break" })],
    validation: (rule) => rule.required().min(1),
    ...extra,
  } as FieldDefinition);

export const str = (name: string, title?: string, extra: Extra = {}) => defineField({ name, title, type: "string", ...extra } as FieldDefinition);
export const req = (name: string, title?: string, extra: Extra = {}) => str(name, title, { validation: (rule: Rule) => rule.required(), ...extra });
export const text = (name: string, title?: string, extra: Extra = {}) => defineField({ name, title, type: "text", rows: 3, ...extra } as FieldDefinition);
export const reqText = (name: string, title?: string, extra: Extra = {}) => text(name, title, { validation: (rule: Rule) => rule.required(), ...extra });
export const bool = (name: string, title?: string, description?: string) => defineField({ name, title, type: "boolean", description } as FieldDefinition);
export const num = (name: string, title?: string, extra: Extra = {}) => defineField({ name, title, type: "number", ...extra } as FieldDefinition);
export const strings = (name: string, title?: string, extra: Extra = {}) => defineField({ name, title, type: "array", of: [defineArrayMember({ type: "string" })], ...extra } as FieldDefinition);
export const choice = (name: string, title: string, values: string[], extra: Extra = {}) =>
  str(name, title, { options: { list: values, layout: values.length <= 3 ? "radio" : "dropdown", direction: "horizontal" }, ...extra });
export const icon = (name = "icon", title = "Icon", extra: Extra = {}) => str(name, title, { options: { list: [...ICON_NAMES] }, ...extra });
export const topic = (name = "topic") => str(name, "Topic", { options: { list: EDUCATION_TOPICS.map(({ value, title }) => ({ value, title })) }, validation: (rule: Rule) => rule.required() });
export const subtopic = () => str("subtopic", "Subtopic", { options: { list: EDUCATION_TOPICS.flatMap((topic) => topic.subtopics.map((sub) => ({ value: sub.value, title: `${topic.title}: ${sub.title}` }))) } });

/** A link: its label and the site address it opens (an address on this site, such as /blog/). */
export const cta = (name = "cta", title = "Button", context = false, extra: Extra = {}) =>
  defineField({
    name,
    title,
    type: "object",
    options: { collapsible: true, collapsed: false },
    fields: [
      req("label", "Label"),
      str("href", "Address", { description: "A site address such as /education/ (empty: shown but not a link)." }),
      ...(context ? [str("context", "Context for screen readers", { description: "Added to the label for screen readers, such as “the 4Cs of diamonds”." })] : []),
    ],
    ...extra,
  } as FieldDefinition);

export const seo = (withTitle = true) =>
  defineField({
    name: "seo",
    title: "Search engines",
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [...(withTitle ? [req("title", "Page title")] : []), reqText("description", "Description")],
  });

/** An array of objects with no _type in the content files: one inline item type named "<field>Item". */
export const items = (name: string, title: string, fields: FieldDefinition[], preview?: { select: Record<string, string>; prepare?: (value: Record<string, unknown>) => { title?: string; subtitle?: string } }, extra: Extra = {}) =>
  defineField({
    name,
    title,
    type: "array",
    of: [defineArrayMember({ type: "object", name: itemType(name), title: title.replace(/s$/, ""), fields, ...(preview ? { preview } : {}) })],
    ...extra,
  } as FieldDefinition);

/** Where a landing page shows a section only on one breakpoint (Figma draws it on one frame). */
export const only = () => choice("only", "Only on", ["desktop", "mobile"], { description: "Empty: on both." });
