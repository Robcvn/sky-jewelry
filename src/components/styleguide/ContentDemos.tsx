"use client";

import { useState, type ReactNode } from "react";
import { FigureAction, Gallery, GradeScale as ArticleGradeScale, Qualities } from "@/components/content/ArticleBlocks";
import { TopicTile } from "@/components/content/ContentList";
import { FeaturedPost, NextResource } from "@/components/content/ContentSections";
import { Dropdown } from "@/components/ui/Dropdown";
import { PaginationRow } from "@/components/ui/PaginationRow";
import { Picture } from "@/components/ui/Picture";
import { PostCard } from "@/components/ui/PostCard";
import type { ArticleBlock } from "@/content/article";
import { blogPosts } from "@/content/blog";
import { educationResources, educationTopics } from "@/content/education";

function Demo({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`flex min-w-0 flex-col items-start gap-space-2 ${className ?? ""}`}>
      <div className="w-full">{children}</div>
      <figcaption className="type-ui-2xs-regular text-black-alpha-70">{label}</figcaption>
    </figure>
  );
}

const fourCs = educationResources[0];
const clarity = fourCs.body.find((block): block is Extract<ArticleBlock, { _type: "gradeScale" }> => block._type === "gradeScale")!;
const colours = fourCs.body.find((block): block is Extract<ArticleBlock, { _type: "gallery" }> => block._type === "gallery")!;
const layering = blogPosts[0];
const table = layering.body.find((block): block is Extract<ArticleBlock, { _type: "table" }> => block._type === "table")!;

/**
 * Task 19's new pieces (Education Center 3565:101629, Resource Detail 3565:101773, Blog List 3565:101703, Post Detail
 * 3565:102017 and their mobile frames), each at the forced breakpoint. The section menu (desktop list, mobile floating
 * menu) and the Featured Product Flyout are shown on their pages: the menu is fixed to the screen on mobile and the flyout
 * needs Shopify products.
 */
export function ContentDemos({ bp }: { bp: "desktop" | "mobile" }) {
  const D = bp === "desktop";
  const [topic, setTopic] = useState("diamonds");
  const [sub, setSub] = useState<string[]>(["the-4cs"]);
  const [page, setPage] = useState(1);
  return (
    <div data-breakpoint={bp} className="flex flex-col gap-space-11">
      <Demo label="Topic tiles (Figma Radio Button, 195 x 90 / 112 x 66) and subtopic badges (Badge as a toggle, 22 / 30 tall)">
        <div className="flex flex-col gap-space-4">
          <div role="radiogroup" aria-label={`Topics demo, ${bp}`} className="flex gap-space-2 overflow-x-auto ui-desktop:gap-space-4">
            {[{ id: "", label: "All Topics", icon: "grid-box-large" as const }, ...educationTopics.slice(0, 2)].map((item) => (
              <div key={item.id} className={D ? "w-[12.1875rem] shrink-0 [&>label]:w-full" : ""}>
                <TopicTile icon={item.icon} checked={topic === item.id} onChange={() => setTopic(item.id)}>
                  {item.label}
                </TopicTile>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-space-2">
            {educationTopics[0].subtopics.map((item) => {
              const on = sub.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSub(on ? sub.filter((id) => id !== item.id) : [...sub, item.id])}
                  className={`type-overline-xs-medium inline-flex min-h-[1.875rem] cursor-pointer items-center rounded-full border bg-secondary-skin px-space-3 ui-desktop:min-h-[1.375rem] ui-desktop:px-2.5 ${on ? "border-primary-leather" : "border-black-alpha-20"}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </Demo>
      <div className="flex flex-wrap items-start gap-space-8">
        <Demo label="Dropdown, grouped options (Topic menu, 6963:54748: a Menu Group Label per topic)">
          <div className="h-[26rem] w-[18rem]">
            <Dropdown
              size="sm"
              width="auto"
              label={`Topic demo, ${bp}`}
              valuePrefix="Topic"
              displayValue="All Topics"
              options={educationTopics.slice(0, 2).flatMap((item) => item.subtopics.map((s) => ({ value: `${item.id}:${s.id}`, label: s.label, group: item.label })))}
              panelWidth="w-70"
            />
          </div>
        </Demo>
        <Demo label="Post Card, resource (topic in a Badge, no date)">
          <div className={D ? "w-[25rem]" : "w-[21.875rem]"}>
            <PostCard variant="resource" title={fourCs.title} excerpt={fourCs.excerpt} topic="Diamonds" href="#content-pages" image={fourCs.image} sizes={{ desktop: "400px", mobile: "350px" }} />
          </div>
        </Demo>
      </div>
      <Demo label="Pagination row (Prev / numbers / Next; Prev and Next disabled at the ends)">
        <div className={D ? "w-[78rem] max-w-full" : "w-[21.875rem]"}>
          <PaginationRow pageCount={2} currentPage={page} onPageChange={setPage} label={`Pagination demo, ${bp}`} />
        </div>
      </Demo>
      <Demo label="Featured post (Blog List)">
        <div className={D ? "w-[78rem] max-w-full" : "w-[21.875rem]"}>
          <FeaturedPost title={layering.title} excerpt={layering.excerpt} topic={layering.topic} date={layering.date} readTime={layering.readTime} href="#content-pages" image={layering.featuredImage} cta="Read More" />
        </div>
      </Demo>
      <Demo label="Article blocks: colour samples (a swipe row on mobile), grade scale with the loupe, a photo with Button - Overlay (a link here, as &ldquo;Customize this ring&rdquo;; with products it opens the Featured Product Flyout), the table">
        <div className={`flex flex-col gap-space-11 ${D ? "w-[51.5rem]" : "w-[21.875rem]"}`}>
          <Gallery items={colours.items} label={`Colour samples demo, ${bp}`} />
          <ArticleGradeScale block={clarity} />
          <div className="relative aspect-[4/3] overflow-hidden rounded-4">
            <Picture image={{ desktop: "edu-arms-43", alt: "" }} sizes={{ desktop: "824px", mobile: "350px" }} className="absolute inset-0 size-full object-cover" />
            <FigureAction label="Customize this ring" icon="sparkle" href="/design-your-own/" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-primary-leather">
              <caption className="sr-only">{table.caption}</caption>
              <thead>
                <tr>
                  {table.columns.map((column, index) => (
                    <th key={column} scope="col" className={`type-overline-2xs-medium h-space-8 border border-black-alpha-20 bg-secondary-skin px-space-3 ${index === table.columns.length - 1 ? "w-2/5" : "w-1/5"}`}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td key={index} className="type-ui-xs-regular h-space-9 border border-black-alpha-20 bg-secondary-skin px-space-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Demo>
      {D ? (
        <Demo label="Your Diamond's Qualities (desktop only): the ring builder's cut, color and clarity explainer as a card">
          <div className="w-[51.5rem]">
            <Qualities heading="Your Diamond’s Qualities" />
          </div>
        </Demo>
      ) : null}
      <Demo label="Next Resource">
        <div className={D ? "w-[51.5rem]" : "w-[21.875rem]"}>
          <NextResource label="Next Resource" title="Diamond Shapes" body={educationResources[5].excerpt} href="#content-pages" image={{ desktop: "edu-thumb-sq", alt: "" }} cta="Read Now" />
        </div>
      </Demo>
    </div>
  );
}
