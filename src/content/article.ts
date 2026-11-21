/*
 * The body of an education resource or a blog post, shaped like a Sanity portable-text array of typed blocks.
 * One renderer (src/components/content/ArticleBody.tsx) draws every block type in Figma's Resource Detail and Post
 * Detail frames (desktop 3565:101773 / 3565:102017, mobile 3587:129748 / 3587:130026).
 */
import type { ImageRef } from "@/components/ui/Picture";

export type ArticleBlock =
  /** level 2 headings make the resource's topic list (desktop side list, mobile jump menu); `nav` is the side list's short label. */
  | { _type: "heading"; _key: string; level: 2 | 3 | 4; text: string; nav?: string }
  | { _type: "paragraph"; _key: string; text: string }
  /** A photo with an optional caption, or an overlay button: Featured Products (opens the flyout) or a drawn button without a page yet. */
  | {
      _type: "figure";
      _key: string;
      image: ImageRef;
      shape?: "standard" | "tall";
      caption?: string;
      products?: { label: string; handles: string[] };
      /** An overlay button on the photo that links somewhere (Post Detail's "Customize this ring"). */
      action?: { label: string; icon: "sparkle"; href: string };
    }
  /** Three photos with captions: a row on desktop, a swipe row on mobile. */
  | { _type: "gallery"; _key: string; items: Array<{ _key: string; image: ImageRef; caption: string }> }
  /** A photo (with an optional loupe) over a grade scale: choosing a grade shows what it means. */
  | {
      _type: "gradeScale";
      _key: string;
      label: string;
      image: ImageRef;
      loupe?: ImageRef;
      initial: string;
      options: Array<{ value: string; label: string; description: string }>;
    }
  /** A short label and a bulleted list. */
  | { _type: "list"; _key: string; label?: string; items: string[] }
  /** A table drawn as rows of cells (Figma: columns of Tags). */
  | { _type: "table"; _key: string; caption: string; columns: string[]; rows: string[][] }
  /** "Your Diamond's Qualities": the cut, color and clarity explainer the stone filters open. Desktop only, as drawn. */
  | { _type: "qualities"; _key: string; heading: string };

/** The level-2 headings, for the topic list and their anchors. */
export const articleSections = (body: ArticleBlock[]) =>
  body.flatMap((block) => (block._type === "heading" && block.level === 2 && block.nav ? [{ id: block._key, label: block.text, nav: block.nav }] : []));

/** Rough reading time from the words in the body (200 words a minute), as "4 min read". */
export function readTime(body: ArticleBlock[]) {
  const words = body
    .map((block) => {
      if (block._type === "paragraph" || block._type === "heading") return block.text;
      if (block._type === "list") return [block.label ?? "", ...block.items].join(" ");
      if (block._type === "table") return block.rows.flat().join(" ");
      return "";
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}
