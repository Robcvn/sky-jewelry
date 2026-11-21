/**
 * The editorial documents Sanity holds, each with its Sanity id and type and its local version from the content files
 * (the fallback, and the source of the import file). Ids are stable and contain no period (Sanity keeps documents
 * whose id has a period, such as drafts, out of public reads), so re-importing updates documents in place.
 *
 * Three documents differ from their content files in shape, as the files themselves derive them:
 *  - siteSettings gathers the announcement bar's and footer's text, the sample contact details and the demo notice.
 *    Their links, icons and the sale's end time stay in code (src/content/site.ts) and are added back on the way in.
 *  - A landing page section that is one of Home's, unchanged (Design Your Own, customer stories, reviews, FAQs), is
 *    stored as a "homeSection" reference, so it is edited once, on Home, as the content files share it today.
 *  - The support page's contact lines are "{address}", "{email}" and "{phone}": the site settings' values, filled in
 *    when the site builds (src/content/support.ts copies them from the footer's contact details).
 */
import { blogPage, blogPosts, type BlogPost } from "@/content/blog";
import { educationCenterPage, educationResources, type EducationResource } from "@/content/education";
import { homePage, type HomePage, type HomeSection } from "@/content/home";
import { diamondsPage } from "@/content/landing/diamonds";
import { engagementRingsPage } from "@/content/landing/engagement-rings";
import { fineJewelryPage } from "@/content/landing/fine-jewelry";
import { gemstonesPage } from "@/content/landing/gemstones";
import type { LandingPage, PageSection } from "@/content/landing/types";
import { weddingBandsPage } from "@/content/landing/wedding-bands";
import { privacyPolicy, shippingInfo, termsOfUse, type LegalDoc } from "@/content/legal";
import { ourStoryPage } from "@/content/our-story";
import { announcementBar, siteFooter, type AnnouncementBarContent, type FooterContent } from "@/content/site";
import { supportPage } from "@/content/support";

export type Contact = FooterContent["contact"];

/** Site settings: the editable text of the announcement bar and footer, the sample contact details, the demo notice. */
export type SiteSettings = {
  _type: "siteSettings";
  announcementBar: Pick<AnnouncementBarContent, "mode" | "messages"> & { countdown: { label: string; restartDays: number } };
  contact: Contact;
  footer: Pick<FooterContent, "newsletter" | "description" | "copyright" | "demoNotice"> & {
    privacyLine: Pick<FooterContent["privacyLine"], "before" | "middle" | "after">;
  };
};

export const localSiteSettings = (): SiteSettings => ({
  _type: "siteSettings",
  announcementBar: {
    mode: announcementBar.mode,
    messages: announcementBar.messages,
    countdown: { label: announcementBar.countdown.label, restartDays: announcementBar.countdown.restartDays },
  },
  contact: siteFooter.contact,
  footer: {
    newsletter: siteFooter.newsletter,
    privacyLine: { before: siteFooter.privacyLine.before, middle: siteFooter.privacyLine.middle, after: siteFooter.privacyLine.after },
    description: siteFooter.description,
    copyright: siteFooter.copyright,
    demoNotice: siteFooter.demoNotice,
  },
});

/** The announcement bar and footer with the settings' text; links, icons and the sale's end time stay as in code. */
export function applySiteSettings(settings: SiteSettings): { announcementBar: AnnouncementBarContent; siteFooter: FooterContent; contact: Contact } {
  const bar = settings.announcementBar;
  const footer = settings.footer;
  return {
    announcementBar: {
      ...announcementBar,
      mode: bar.mode,
      messages: bar.messages,
      countdown: { ...announcementBar.countdown, label: bar.countdown.label, restartDays: bar.countdown.restartDays },
    },
    siteFooter: {
      ...siteFooter,
      newsletter: footer.newsletter,
      privacyLine: { ...siteFooter.privacyLine, before: footer.privacyLine.before, middle: footer.privacyLine.middle, after: footer.privacyLine.after },
      description: footer.description,
      contact: settings.contact,
      copyright: footer.copyright,
      demoNotice: footer.demoNotice,
    },
    contact: settings.contact,
  };
}

/* ---------- Landing pages: sections shared with Home ---------- */

/** What a landing page may change on a Home section it reuses: its key and the landing spacing flags. */
const SECTION_OVERRIDES = ["_key", "landing", "flushTop"] as const;
export type HomeSectionRef = { _type: "homeSection"; _key: string; section: string; landing?: boolean; flushTop?: "desktop" | "mobile" | "both" };

const withoutOverrides = (section: object) => Object.fromEntries(Object.entries(section).filter(([key]) => !(SECTION_OVERRIDES as readonly string[]).includes(key)));
const sameJson = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** A landing page as stored in Sanity: Home's sections it reuses unchanged become references. */
export function landingToStored(page: LandingPage, home: HomePage): Omit<LandingPage, "sections"> & { sections: Array<PageSection | HomeSectionRef> } {
  return {
    ...page,
    sections: page.sections.map((section) => {
      const source = home.sections.find((candidate) => candidate._type === section._type && sameJson(withoutOverrides(candidate), withoutOverrides(section)));
      if (!source || (section as { only?: string }).only) return section;
      const extra = section as { landing?: boolean; flushTop?: HomeSectionRef["flushTop"] };
      return { _type: "homeSection", _key: section._key, section: source._key, ...(extra.landing ? { landing: true } : {}), ...(extra.flushTop ? { flushTop: extra.flushTop } : {}) };
    }),
  };
}

/** A stored landing page with its Home references filled in from `home` (Sanity's Home, or the local one). */
export function landingFromStored(page: { sections: Array<PageSection | HomeSectionRef> } & Omit<LandingPage, "sections">, home: HomePage, warn: (message: string) => void): LandingPage {
  const sections: PageSection[] = [];
  for (const section of page.sections) {
    if (section._type !== "homeSection") {
      sections.push(section as PageSection);
      continue;
    }
    const ref = section as HomeSectionRef;
    const source = home.sections.find((candidate) => candidate._key === ref.section);
    if (!source) {
      warn(`[content] WARNING: the ${page.slug} landing page refers to a Home section "${ref.section}" that Home doesn't have; it is left out.`);
      continue;
    }
    sections.push({ ...(source as HomeSection), _key: ref._key, ...(ref.landing ? { landing: true } : {}), ...(ref.flushTop ? { flushTop: ref.flushTop } : {}) } as PageSection);
  }
  return { ...page, sections };
}

/* ---------- The support page: its contact lines come from the site settings ---------- */

/**
 * In Sanity, the support page names the contact details instead of repeating them: "{address}", "{email}" and
 * "{phone}" stand for the site settings' values, filled in when the site builds. A field that is exactly one of the
 * contact details becomes its placeholder (in the content file they are copied from the footer's contact details).
 */
const CONTACT_FIELDS = ["address", "email", "phone"] as const;
const mapStrings = <T,>(value: T, map: (text: string) => string): T => {
  if (typeof value === "string") return map(value) as T;
  if (Array.isArray(value)) return value.map((item) => mapStrings(item, map)) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, key === "_key" || key === "_type" ? item : mapStrings(item, map)])) as T;
  return value;
};
export const supportToStored = <T,>(page: T, contact: Contact): T =>
  mapStrings(page, (text) => {
    const field = CONTACT_FIELDS.find((name) => contact[name] === text);
    return field ? `{${field}}` : text;
  });
export const supportFromStored = <T,>(page: T, contact: Contact): T =>
  mapStrings(page, (text) => CONTACT_FIELDS.reduce((out, field) => out.split(`{${field}}`).join(contact[field]), text));

/* ---------- The documents ---------- */

export const LANDING_PAGES = { engagementRingsPage, diamondsPage, gemstonesPage, weddingBandsPage, fineJewelryPage };
export const LEGAL_PAGES = { privacyPolicy, termsOfUse, shippingInfo };

export type LocalDocument = { id: string; type: string; title: string; value: object };

/** Every editorial document in its local version, with its Sanity id and type. */
export function localDocuments(): LocalDocument[] {
  return [
    { id: "siteSettings", type: "siteSettings", title: "Site settings", value: localSiteSettings() },
    { id: "homePage", type: "homePage", title: "Home", value: homePage },
    ...Object.values(LANDING_PAGES).map((page) => ({ id: `landingPage-${page.slug}`, type: "landingPage", title: page.seo.title, value: page })),
    { id: "educationCenterPage", type: "educationCenterPage", title: "Education Center", value: educationCenterPage },
    ...educationResources.map((resource: EducationResource) => ({ id: resource._id, type: "resource", title: resource.title, value: resource })),
    { id: "blogPage", type: "blogPage", title: "Blog", value: blogPage },
    ...blogPosts.map((post: BlogPost) => ({ id: post._id, type: "post", title: post.title, value: post })),
    { id: "supportPage", type: "supportPage", title: "Support and guarantee", value: supportPage },
    ...Object.values(LEGAL_PAGES).map((doc: LegalDoc) => ({ id: `legalPage-${doc.slug}`, type: "legalPage", title: doc.title, value: doc })),
    { id: "ourStoryPage", type: "ourStoryPage", title: "Our Story", value: ourStoryPage },
  ];
}

/** Document types where editors may add documents that the content files don't have. */
export const COLLECTION_TYPES = ["resource", "post"] as const;
export const EDITORIAL_TYPES = [...new Set(localDocuments().map((doc) => doc.type))];
