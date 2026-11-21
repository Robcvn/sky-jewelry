/*
 * Search Results (Figma desktop 4931:73092, mobile 4979:47760), shaped like a Sanity document. The query comes from
 * the URL (/search/?q=), as the header's search panel (4904:66278) and the mobile search screen (4979:47688) send it.
 */
import { em, span, type RichSpan } from "@/components/ui/RichText";

export type SearchType = "products" | "education" | "stories" | "faqs";

export const searchContent = {
  _type: "searchPage" as const,
  seo: { title: "Search", description: "Search Sky Jewelry’s jewelry, education, customer stories and FAQs." },
  label: "Search the site",
  closeLabel: "Close search",
  clearLabel: "Clear search",
  /** "112 RESULTS for Diamond": caps with an italic "for", as drawn. */
  heading: (count: number, query: string): RichSpan[] => [span(`${count} ${count === 1 ? "Result" : "Results"} `), em("for"), span(` ${query}`)],
  /** The filter chips (desktop) and the type options (mobile sheet), in the frame's order, with each section's heading. */
  types: [
    { value: "products", chip: "Products", heading: "Products" },
    { value: "education", chip: "Education", heading: "Education" },
    { value: "stories", chip: "Stories", heading: "Customer Stories" },
    { value: "faqs", chip: "FAQs", heading: "FAQs" },
  ] as Array<{ value: SearchType; chip: string; heading: string }>,
  clearFilters: "Clear Filters",
  filters: "Filters",
  filtersHeading: "Filters",
  typeLabel: "Type",
  sortLabel: "Sort by",
  apply: "Apply",
  viewMore: "View More",
  storyCta: "Read Story",
  /**
   * How many of each section show before View More, and how many each View More adds. Desktop: the frame's four rows
   * of products (13, with the two promo cards), three education and story cards, five FAQs. Mobile: the mobile
   * frame's four products, four education cards, the six stories and five FAQs, each View More adding as many again
   * (the mobile frame draws no View More; it is added so every result can be reached on a phone).
   */
  pageSize: {
    desktop: { products: 13, education: 3, stories: 3, faqs: 5 },
    more: { products: 16, education: 3, stories: 3, faqs: 5 },
    mobile: { products: 4, education: 4, stories: 6, faqs: 5 },
  },
  /**
   * The builder's Promo Cards (Design System "Promo Card" MD and LG, as drawn here): Learn the 4Cs in the single slot
   * after three products, The Sky Guarantee across two columns after seven. Desktop only, as drawn.
   */
  promos: [
    { key: "education", after: 3 },
    { key: "guarantee", after: 7 },
  ],
  /** No query, or nothing found: the product list's drawn empty state with the mobile search screen's popular searches. */
  empty: {
    noQuery: "Search for jewelry, education, customer stories and FAQs.",
    noResults: (query: string) => `No results for “${query}”. Try another search.`,
    popularHeading: "Popular searches",
    /**
     * The mobile search screen's five (4979:47688), with two sample terms matched to the mock catalogue: "Moissanite
     * Engagement Rings" is "Moissanite" and "Gemstone Bracelet" is "Bracelets", since the drawn terms found nothing
     * (Corrected design oversights). Every term must find at least one result (search.mjs checks it).
     */
    popular: ["Diamond Engagement Rings", "Lab-Grown Diamonds", "Moissanite", "Diamond Rings", "Bracelets"],
  },
};
