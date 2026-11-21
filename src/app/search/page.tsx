import type { Metadata } from "next";
import { SearchResults } from "@/components/search/SearchResults";
import { withBasePath } from "@/components/ui/shared";
import { builderContent } from "@/content/builder";
import { searchContent as text } from "@/content/search";
import { buildSearchIndex } from "@/lib/searchIndex";

export const metadata: Metadata = { title: text.seo.title, description: text.seo.description, alternates: { canonical: withBasePath("/search/") }, robots: { index: false } };

/**
 * Search Results (Figma 4931:73092, mobile 4979:47760). The index is made here at build time; the page reads ?q=
 * and searches it in the browser (static export: no search service, no server).
 */
export default async function SearchPage() {
  const index = await buildSearchIndex();
  const promos = builderContent.settings.promos.filter((promo) => text.promos.some((slot) => slot.key === promo._key));
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <SearchResults index={index} promos={promos} />
    </main>
  );
}
