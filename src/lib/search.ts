/*
 * Site search matching, shared by the build-time index (src/lib/searchIndex.ts) and the results page. Plain and
 * predictable: case- and accent-insensitive, curly quotes made straight, and every word of the query must appear
 * somewhere in the item's text, in its own form or its singular or plural (a simple s / es rule). No fuzzy matching and
 * no ranking.
 */
export const normalize = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/** The query's words (split on spaces). */
export const queryWords = (query: string) => normalize(query).split(" ").filter(Boolean);

/**
 * The forms a query word may take in the text. A singular already finds its plural (text is searched for the word
 * anywhere, so "diamond" is found in "diamonds"); a plural also tries its singular: without "es" ("watches" to
 * "watch") and without "s" ("diamonds" to "diamond"). Short words and "ss" endings are left alone ("is", "glass").
 */
export const wordForms = (word: string) => {
  const forms = [word];
  if (word.length > 4 && word.endsWith("es")) forms.push(word.slice(0, -2));
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) forms.push(word.slice(0, -1));
  return forms;
};

/** True when every word appears in the haystack, in one of its forms. An empty query matches nothing. */
export const matches = (haystack: string, words: string[]) => words.length > 0 && words.every((word) => wordForms(word).some((form) => haystack.includes(form)));
