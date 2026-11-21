/**
 * Sanity Studio for the Sky Jewelry site's editorial content: project 74lb1xq2, dataset production (public read).
 * Products, prices and the bag stay in Shopify; photos stay in the site's repository (documents name them by key).
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { FIXED_TYPES, SINGLETONS } from "./schemaTypes/documents";

const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem().title("Site settings").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem().title("Home").id("homePage").child(S.document().schemaType("homePage").documentId("homePage")),
      S.documentTypeListItem("landingPage").title("Landing pages"),
      S.divider(),
      S.listItem().title("Education Center").id("educationCenterPage").child(S.document().schemaType("educationCenterPage").documentId("educationCenterPage")),
      S.documentTypeListItem("resource").title("Education resources"),
      S.divider(),
      S.listItem().title("Blog").id("blogPage").child(S.document().schemaType("blogPage").documentId("blogPage")),
      S.listItem()
        .title("Blog posts")
        .id("posts")
        .child(S.documentList().title("Blog posts").schemaType("post").filter('_type == "post" && kind != "story"').defaultOrdering([{ field: "date", direction: "desc" }])),
      S.listItem()
        .title("Customer stories")
        .id("stories")
        .child(S.documentList().title("Customer stories").schemaType("post").filter('_type == "post" && kind == "story"').defaultOrdering([{ field: "date", direction: "desc" }])),
      S.divider(),
      S.listItem().title("Support and guarantee").id("supportPage").child(S.document().schemaType("supportPage").documentId("supportPage")),
      S.listItem().title("Our Story").id("ourStoryPage").child(S.document().schemaType("ourStoryPage").documentId("ourStoryPage")),
      S.documentTypeListItem("legalPage").title("Legal pages"),
    ]);

export default defineConfig({
  name: "default",
  title: "Sky Jewelry",
  projectId: "74lb1xq2",
  dataset: "production",
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: "2026-11-21" })],
  schema: { types: schemaTypes },
  document: {
    // One fixed document each, with the type's name as its id (the ids the import file and the site use).
    singletons: SINGLETONS,
    // Landing and legal pages are a fixed set (the site defines their addresses): no "create new" for them.
    newDocumentOptions: (previous) => previous.filter((item) => !FIXED_TYPES.includes(item.templateId)),
    // The site's build falls back to its local files for a missing page, and the deploy stops: so the fixed pages
    // and the singletons can't be deleted, duplicated or unpublished here.
    actions: (previous, context) =>
      [...FIXED_TYPES, ...SINGLETONS].includes(context.schemaType) ? previous.filter(({ action }) => !["delete", "duplicate", "unpublish"].includes(action ?? "")) : previous,
  },
});
