/**
 * Bulleted lists in articles and legal pages, as the frames draw them (Post Detail 3565:102017, Legal Template
 * 3565:102087 / 3587:130116): 8px between items on desktop and 4px on mobile, and a small round bullet about 2px across,
 * 12px in (mobile 10px) with the text 24px in (mobile 21px). The list keeps role="list", since list-style: none drops
 * the list semantics in Safari.
 */
export const BULLET_LIST = "flex list-none flex-col gap-space-1 ui-desktop:gap-space-2";
export const BULLET_ITEM =
  "relative pl-[1.3125rem] before:absolute before:top-[calc(0.5lh-1px)] before:left-[0.5625rem] before:size-0.5 before:rounded-full before:bg-current ui-desktop:pl-space-6 ui-desktop:before:left-[0.6875rem]";

/**
 * The article photos' rendered width (824px in a 1440 frame; full column on mobile). Kept in this plain module: a
 * constant exported from a "use client" file reaches a server component as a client reference, so ArticleBody's photos
 * got undefined sizes (found in Task 30).
 */
export const ARTICLE_SIZES = { desktop: "(width >= 90rem) 51.5rem, 57vw", mobile: "calc(100vw - 40px)" };
