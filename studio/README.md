# Sky Jewelry studio

Sanity Studio for the site's editorial content: project `74lb1xq2`, dataset `production` (public read). It has its own
`package.json`, so the site's dependencies stay as they are. Products, prices and the bag stay in Shopify. Photos stay in
the site's repository; a document names a photo by its key.

## What it edits

| Document | Content file it mirrors | Notes |
|---|---|---|
| Site settings | `src/content/site.ts` | Announcement bar, footer text, sample contact details (footer, contact dropdown, support page), demo notice. Links and icons stay in code. |
| Home | `src/content/home.ts` | Its sections, in order. |
| Landing pages (5) | `src/content/landing/*.ts` | A section reused unchanged from Home is a "Section from Home": edit it on Home. |
| Education Center, Education resources (18) | `src/content/education.ts` | Topics stay in code (filters and addresses use them). |
| Blog, Blog posts and customer stories (13) | `src/content/blog.ts` | A story has Kind = story. The Education menu shows the posts Home's blog row lists. |
| Support and guarantee | `src/content/support.ts` | Its contact lines are `{address}`, `{email}` and `{phone}`: Site settings' contact details, filled in when the site builds. |
| Legal pages (3) | `src/content/legal.ts` | |
| Our Story | `src/content/our-story.ts` | |

The site reads the published documents when it builds (`src/lib/content.ts`). If Sanity is unreachable, empty or lacks a
document, the build uses the content file instead and says so (`[content] … from local files`), and the deploy stops.

## Commands

Run them in this folder (`studio/`). Node 22.12 or newer.

```sh
npm install                      # once: the studio's own dependencies
npx sanity login                 # opens a browser to log in to Sanity
npx sanity datasets import import/production.ndjson --dataset production --replace
npx sanity deploy --url sky-site # builds and publishes the studio at https://sky-site.sanity.studio
npm run dev                      # the studio on http://localhost:3333 (log in in the browser)
npm run build                    # builds the studio into dist/, publishes nothing
npm run validate                 # checks the models
```

`--replace` updates documents with the same id. The ids are stable (`homePage`, `post-lab-vs-natural`, ...), so an import
never makes duplicates. It also replaces whatever editors have changed in those documents: once editing has started in
the studio, don't import again unless that is the point.

## The import file

`import/production.ndjson` is written from the content files by `npm run sanity:import-file` at the site's root. The
script checks that every document converts to Sanity's shape and back unchanged, writes one published document per line
(no drafts), and writes `schemaTypes/lists.generated.ts` (photo keys, icons, Home's sections, education topics) so the
studio offers exactly what the site can show.

To see what the site builds from the file before importing it, without touching Sanity:

```sh
node scripts/serve-sanity-import.mjs &      # at the site's root: a stand-in that answers with the file
NEXT_PUBLIC_SANITY_PROJECT_ID=74lb1xq2 NEXT_PUBLIC_SANITY_DATASET=production SANITY_API_URL=http://127.0.0.1:4400 npm run build
```
