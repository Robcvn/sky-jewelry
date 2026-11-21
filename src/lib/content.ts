/**
 * Build-time editorial content. Reads the published documents from Sanity (src/lib/sanity.ts) and converts each back
 * to the shape its content file has (src/lib/cms/convert.ts), so the pages render exactly as they do from the files.
 * Falls back to the local content files, document by document, when Sanity isn't configured, can't be reached, is
 * empty or lacks a document, and says so in the build log, as the catalogue does:
 *   [content] 45 documents from Sanity, 0 from local files.
 * The deploy workflow fails when that line shows any local fallback.
 */
import type { blogPage, BlogPost } from "@/content/blog";
import type { educationCenterPage, EducationResource } from "@/content/education";
import type { HomePage, HomeSection } from "@/content/home";
import type { LandingPage } from "@/content/landing/types";
import type { LegalDoc } from "@/content/legal";
import type { ourStoryPage } from "@/content/our-story";
import { blogTeaser, siteFooter as localFooter, type AnnouncementBarContent, type BlogTeaser, type FooterContent } from "@/content/site";
import type { supportPage } from "@/content/support";
import { fromSanity } from "@/lib/cms/convert";
import {
  applySiteSettings,
  COLLECTION_TYPES,
  EDITORIAL_TYPES,
  landingFromStored,
  localDocuments,
  supportFromStored,
  supportToStored,
  type Contact,
  type HomeSectionRef,
  type LocalDocument,
  type SiteSettings,
} from "@/lib/cms/documents";
import { sanityConfig, sanityQuery } from "@/lib/sanity";

export type EditorialContent = {
  announcementBar: AnnouncementBarContent;
  siteFooter: FooterContent;
  contact: Contact;
  homePage: HomePage;
  /** The Education menu's "Explore Our Blog": the posts Home's blog row lists (the same three, in code). */
  menuPosts: BlogTeaser[];
  landing: Record<"engagement-rings" | "diamonds" | "gemstones" | "wedding-bands" | "fine-jewelry", LandingPage>;
  educationCenterPage: typeof educationCenterPage;
  educationResources: EducationResource[];
  blogPage: typeof blogPage;
  blogPosts: BlogPost[];
  supportPage: typeof supportPage;
  legal: Record<"privacy-policy" | "terms-of-use" | "shipping", LegalDoc>;
  ourStoryPage: typeof ourStoryPage;
};

type SanityDocument = { _id: string; _type: string; [key: string]: unknown };

let content: Promise<EditorialContent> | undefined;

/** One read per build worker: every page shares the same content. */
export function getEditorialContent(): Promise<EditorialContent> {
  content ??= loadContent();
  return content;
}

async function readSanity(): Promise<{ documents: SanityDocument[] } | { reason: string }> {
  const config = sanityConfig();
  if (!config) return { reason: "Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET)" };
  try {
    // Published documents only: drafts have ids in the "drafts." path, and the API version reads the published perspective.
    const documents = await sanityQuery<SanityDocument[]>(config, `*[_type in $types && !(_id in path("drafts.**"))]`, { types: EDITORIAL_TYPES });
    if (!Array.isArray(documents)) return { reason: "Sanity's answer had no documents list" };
    if (!documents.length) return { reason: `the Sanity dataset "${config.dataset}" has no editorial documents yet` };
    return { documents };
  } catch (error) {
    return { reason: error instanceof Error ? error.message : String(error) };
  }
}

async function loadContent(): Promise<EditorialContent> {
  const local = localDocuments();
  const read = await readSanity();
  const remote = new Map("documents" in read ? read.documents.map((doc) => [doc._id, doc]) : []);
  const warnings: string[] = [];
  const fromLocal: LocalDocument[] = [];
  let fromSanityCount = 0;

  /** The document as the site uses it: Sanity's, converted to the local shape, or the local one. */
  const resolve = (doc: LocalDocument): unknown => {
    const stored = remote.get(doc.id);
    if (!stored || stored._type !== doc.type) {
      fromLocal.push(doc);
      return doc.value;
    }
    fromSanityCount += 1;
    return fromSanity(stored, doc.value);
  };
  const byType = (type: string) => local.filter((doc) => doc.type === type);
  const one = (id: string) => resolve(local.find((doc) => doc.id === id)!);

  // Collections: the local documents in their order, then any that exist only in Sanity (newest first).
  const collection = <T>(type: (typeof COLLECTION_TYPES)[number]): T[] => {
    const known = byType(type);
    const items = known.map((doc) => resolve(doc) as T);
    const extra = [...remote.values()].filter((doc) => doc._type === type && !known.some((item) => item.id === doc._id));
    extra.sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")));
    for (const doc of extra) {
      fromSanityCount += 1;
      items.push(fromSanity(doc, known[0]?.value) as T);
    }
    return items;
  };

  const settings = applySiteSettings(one("siteSettings") as SiteSettings);
  const homePage = one("homePage") as HomePage;
  const landing = Object.fromEntries(
    byType("landingPage").map((doc) => {
      const page = resolve(doc) as LandingPage & { sections: Array<LandingPage["sections"][number] | HomeSectionRef> };
      return [(doc.value as LandingPage).slug, landingFromStored(page, homePage, (message) => warnings.push(message))];
    }),
  ) as EditorialContent["landing"];
  // The support page's contact lines: the site settings' details, whether the page came from Sanity or the local file.
  const supportPage = supportFromStored(supportToStored(one("supportPage") as EditorialContent["supportPage"], localFooter.contact), settings.contact);
  const legal = Object.fromEntries(byType("legalPage").map((doc) => [(doc.value as LegalDoc).slug, resolve(doc)])) as EditorialContent["legal"];

  const blogPosts = collection<BlogPost>("post");
  const blogRow = homePage.sections.find((section) => section._type === "blogRow");
  const menuPosts = (blogRow?.postIds ?? []).map((id) => blogPosts.find((post) => post._id === id)).filter((post) => post !== undefined).map((post) => blogTeaser(post));

  const result: EditorialContent = {
    ...settings,
    homePage,
    menuPosts,
    landing,
    educationCenterPage: one("educationCenterPage") as EditorialContent["educationCenterPage"],
    educationResources: collection<EducationResource>("resource"),
    blogPage: one("blogPage") as EditorialContent["blogPage"],
    blogPosts,
    supportPage,
    legal,
    ourStoryPage: one("ourStoryPage") as EditorialContent["ourStoryPage"],
  };

  if (fromLocal.length) {
    const reason = "reason" in read ? read.reason : `Sanity has no published ${fromLocal.length === 1 ? "document" : "documents"} with ${fromLocal.length === 1 ? "this id" : "these ids"}: ${fromLocal.map((doc) => doc.id).join(", ")}`;
    console.warn(`\n[content] WARNING: using the local content files for ${fromLocal.length} of ${local.length} documents, because ${reason}.\n`);
  }
  for (const warning of warnings) console.warn(warning);
  console.info(`[content] ${fromSanityCount} documents from Sanity, ${fromLocal.length} from local files.`);
  return result;
}

/* ---------- Lookups the pages use ---------- */

export const postBySlug = (content: EditorialContent, slug: string) => content.blogPosts.find((post) => post.slug === slug) ?? null;
export const resourceBySlug = (content: EditorialContent, slug: string) => content.educationResources.find((resource) => resource.slug === slug) ?? null;

/** A Home section by its _key (landing, support and search pages reuse Home's sections). */
export function homeSectionOf<T extends HomeSection["_type"]>(home: HomePage, type: T, key: string): Extract<HomeSection, { _type: T }> {
  const section = home.sections.find((item) => item._type === type && item._key === key);
  if (!section) throw new Error(`Home has no ${type} section "${key}"`);
  return section as Extract<HomeSection, { _type: T }>;
}
