"use client";

import { useMemo, useRef } from "react";
import { useQuery } from "@/components/builder/useQuery";
import { Dropdown } from "@/components/ui/Dropdown";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PaginationRow } from "@/components/ui/PaginationRow";
import { type ImageRef } from "@/components/ui/Picture";
import { PostCard } from "@/components/ui/PostCard";
import { ScrollArea } from "@/components/ui/Scrollbar";
import { cx } from "@/components/ui/shared";

/** Mobile swipe rows that run on past the right margin to the screen's edge, as the Education frames draw them. */
const BLEED = "-mr-(--grid-margin) ui-desktop:mr-0 ui-desktop:overflow-visible";

export type ListItem = {
  id: string;
  href: string;
  title: string;
  excerpt: string;
  topic: string;
  topicLabel: string;
  subtopic?: string;
  /** ISO date */
  date: string;
  readTime?: string;
  image: ImageRef;
};

export type ListTopic = { id: string; label: string; icon?: IconName; subtopics?: Array<{ id: string; label: string }> };

type ContentListProps = {
  /** "education": topic tiles and subtopic badges, the toolbar on desktop only, resource cards. "blog": the toolbar at both widths, post cards. */
  kind: "education" | "blog";
  items: ListItem[];
  topics: ListTopic[];
  pageSize: number;
  labels: { allTopics: string; topicsLabel?: string; results: string };
};

const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
];

/** The list's state in the URL, as the product lists keep theirs: ?topic=&subtopic=a,b&sort=oldest&page=2. */
function parse(search: string, topics: ListTopic[]) {
  const params = new URLSearchParams(search);
  const topic = topics.find((item) => item.id === params.get("topic")) ?? null;
  const subtopics = (params.get("subtopic") ?? "")
    .split(",")
    .filter((id) => topic?.subtopics?.some((item) => item.id === id));
  const sort = params.get("sort") === "oldest" ? "oldest" : "latest";
  const page = Math.max(1, Number(params.get("page")) || 1);
  return { topic: topic?.id ?? null, subtopics, sort, page } as const;
}

function serialize(state: { topic: string | null; subtopics: string[]; sort: string; page: number }) {
  const params = new URLSearchParams();
  if (state.topic) params.set("topic", state.topic);
  if (state.subtopics.length) params.set("subtopic", state.subtopics.join(","));
  if (state.sort !== "latest") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));
  return params;
}

/**
 * The Education Center's and the Blog's results (Figma Education Center - Dropdown 6963:54748 and - Subtopics
 * 6963:55696, mobile 7074:91849; Blog List 3565:101703, mobile 3587:129657): the topic tiles and subtopic badges
 * (education), "Showing N of M", the Topic and Sort dropdowns, the card grid and the pagination row. Topic, subtopics,
 * sort and page live in the URL. Controls with nothing to act on are left out: subtopic badges until a topic with
 * subtopics is chosen, and the pagination row when everything fits on one page.
 */
export function ContentList({ kind, items, topics, pageSize, labels }: ContentListProps) {
  const [search, setQuery] = useQuery();
  const state = parse(search, topics);
  const set = (patch: Partial<typeof state>) => setQuery(serialize({ ...state, page: 1, ...patch }));
  const gridRef = useRef<HTMLUListElement>(null);
  const education = kind === "education";
  const topic = topics.find((item) => item.id === state.topic) ?? null;

  const matches = useMemo(() => {
    const filtered = items.filter((item) => (!state.topic || item.topic === state.topic) && (!state.subtopics.length || (item.subtopic && state.subtopics.includes(item.subtopic))));
    return filtered.sort((a, b) => (state.sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  }, [items, state.topic, state.subtopics, state.sort]);
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
  const page = Math.min(state.page, pageCount);
  const shown = matches.slice((page - 1) * pageSize, page * pageSize);
  const showing = `Showing ${shown.length} of ${matches.length}`;

  const toPage = (next: number) => {
    setQuery(serialize({ ...state, page: next }));
    gridRef.current?.closest("section")?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  // Topic dropdown: the blog lists its topics; the education one groups each topic's subtopics under it, as Figma draws it.
  const topicOptions = education
    ? topics.flatMap((item) => (item.subtopics ?? []).map((sub) => ({ value: `${item.id}:${sub.id}`, label: sub.label, group: item.label })))
    : [{ value: "", label: labels.allTopics }, ...topics.map((item) => ({ value: item.id, label: item.label }))];
  const topicValue = education ? (state.topic && state.subtopics.length === 1 ? `${state.topic}:${state.subtopics[0]}` : "") : (state.topic ?? "");
  const topicDisplay = topic ? (education && state.subtopics.length === 1 ? (topic.subtopics?.find((sub) => sub.id === state.subtopics[0])?.label ?? topic.label) : topic.label) : labels.allTopics;
  const chooseTopic = (value: string) => {
    if (!education) return set({ topic: value || null, subtopics: [] });
    const [topicId, subId] = value.split(":");
    set({ topic: topicId, subtopics: subId ? [subId] : [] });
  };

  const topicDropdown = (
    <Dropdown
      size="sm"
      width="auto"
      label="Topic"
      valuePrefix="Topic"
      plain
      displayValue={topicDisplay}
      options={topicOptions}
      value={topicValue}
      onChange={chooseTopic}
      clearable={education && Boolean(state.topic)}
      onClear={() => set({ topic: null, subtopics: [] })}
      panelWidth={education ? "w-70" : "w-max min-w-full"}
      panelAlign="end"
      className={cx(!education && "flex-1 ui-desktop:flex-none")}
    />
  );
  const sortDropdown = (
    <Dropdown
      size="sm"
      width="auto"
      label="Sort by"
      valuePrefix="Sort by"
      plain
      options={SORTS}
      value={state.sort}
      onChange={(sort) => set({ sort: sort as "latest" | "oldest" })}
      panelWidth="w-max min-w-full"
      panelAlign="end"
      className={cx(!education && "flex-1 ui-desktop:flex-none")}
    />
  );

  return (
    // Figma: 48 between the tiles, the toolbar, the grid and the pagination on desktop; on mobile 24 (education) and 32 (blog).
    <div className={cx("flex flex-col text-primary-leather ui-desktop:gap-space-11", education ? "gap-space-6" : "gap-space-8")}>
      {education ? (
        <div className="flex flex-col gap-space-4 ui-desktop:gap-space-6">
          <p id="topics-label" className="type-overline-xs-medium">
            {labels.topicsLabel}
          </p>
          <div className="flex flex-col gap-space-4">
            {/* Figma: six 195 x 90 tiles across the row on desktop; a swipe row of 112 x 66 tiles with a scrollbar on mobile,
                running on past the right margin to the screen's edge (3587:129570; the scrollbar keeps the column width). */}
            <ScrollArea label={labels.topicsLabel ?? "Topics"} regionClassName={BLEED} scrollbarClassName="mt-space-4 ui-desktop:hidden">
              <div role="radiogroup" aria-labelledby="topics-label" className="flex w-max gap-space-2 pr-(--grid-margin) ui-desktop:w-full ui-desktop:gap-space-4 ui-desktop:pr-0">
                <TopicTile icon="grid-box-large" checked={!state.topic} onChange={() => set({ topic: null, subtopics: [] })}>
                  {labels.allTopics}
                </TopicTile>
                {topics.map((item) => (
                  <TopicTile key={item.id} icon={item.icon ?? "plus"} checked={state.topic === item.id} onChange={() => set({ topic: item.id, subtopics: [] })}>
                    {item.label}
                  </TopicTile>
                ))}
              </div>
            </ScrollArea>
            {topic?.subtopics?.length ? (
              // Mobile (7074:91849): the badges run to the screen's edge too, with no scrollbar under them.
              <ScrollArea label={`${topic.label} subtopics`} regionClassName={BLEED} scrollbarClassName="hidden">
                <div role="group" aria-label={`${topic.label} subtopics`} className="flex w-max gap-space-2 pr-(--grid-margin) ui-desktop:w-auto ui-desktop:flex-wrap ui-desktop:pr-0">
                  {topic.subtopics.map((sub) => {
                    const on = state.subtopics.includes(sub.id);
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => set({ subtopics: on ? state.subtopics.filter((id) => id !== sub.id) : [...state.subtopics, sub.id] })}
                        className={cx(
                          // Figma "Badge" as a toggle: on desktop the 22px caps pill; on mobile (7074:91849) a 30px chip with 4px
                          // corners and the label as typed (ui-2xs-medium). Chosen ones have the leather outline.
                          "type-ui-2xs-medium ui-transition-fast inline-flex min-h-[1.875rem] shrink-0 cursor-pointer items-center rounded-4 border bg-secondary-skin px-space-3 whitespace-nowrap ui-desktop:type-overline-xs-medium ui-desktop:min-h-[1.375rem] ui-desktop:rounded-full ui-desktop:px-2.5",
                          on ? "border-primary-leather" : "border-black-alpha-20 hover:border-black-alpha-50",
                        )}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Toolbar: desktop "Showing" left and the dropdowns right; the blog's mobile frame puts the dropdowns first and "Showing" under them; the education mobile frame has none. */}
      <div className={cx(education ? "hidden ui-desktop:flex" : "flex", "flex-col gap-space-4 ui-desktop:flex-row ui-desktop:items-center ui-desktop:justify-between")}>
        <p aria-live="polite" className="type-body-xs-regular order-2 ui-desktop:order-none">
          {showing}
        </p>
        <div className="order-1 flex items-center gap-space-4 ui-desktop:order-none">
          {topicDropdown}
          {sortDropdown}
        </div>
      </div>
      {education ? (
        <p aria-live="polite" className="sr-only ui-desktop:hidden">
          {showing}
        </p>
      ) : null}

      <h2 className="sr-only">{labels.results}</h2>
      {shown.length ? (
        <ul ref={gridRef} data-results className="grid grid-cols-1 gap-y-space-8 ui-desktop:grid-cols-3 ui-desktop:gap-x-space-6 ui-desktop:gap-y-space-11">
          {shown.map((item) => (
            <li key={item.id}>
              <PostCard
                variant={education ? "resource" : "post"}
                title={item.title}
                excerpt={item.excerpt}
                topic={item.topicLabel}
                date={item.date}
                readTime={item.readTime}
                href={item.href}
                image={item.image}
                sizes={{ desktop: "(width > 90rem) min(calc(33.34vw - 80px), 560px), (width >= 90rem) 25rem, 28vw", mobile: "calc(100vw - 40px)" }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="type-body-sm-regular">Nothing here yet. Try another topic.</p>
      )}

      {pageCount > 1 ? <PaginationRow pageCount={pageCount} currentPage={page} onPageChange={toPage} label={`${labels.results} pages`} className="pt-space-1 ui-desktop:pt-0" /> : null}
    </div>
  );
}

/** Figma's "Radio Button" topic tile: a bordered 195 x 90 tile with a 48px icon (mobile 112 x 66 with a 32px icon). */
export function TopicTile({ icon, checked, onChange, children }: { icon: IconName; checked: boolean; onChange: () => void; children: string }) {
  return (
    <label
      className={cx(
        // Figma's stroke is inside the tile: 8 / 12px to the icon less the 1px border.
        "ui-transition relative flex w-28 shrink-0 cursor-pointer flex-col items-center gap-space-1 rounded-4 border bg-secondary-skin px-space-2 py-[calc(var(--spacing-space-2)-1px)] text-center ui-desktop:w-auto ui-desktop:flex-1 ui-desktop:py-[calc(var(--spacing-space-3)-1px)]",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-leather",
        checked ? "border-primary-leather" : "border-black-alpha-20 hover:border-black-alpha-50",
      )}
    >
      <input type="radio" name="education-topic" checked={checked} onChange={onChange} className="sr-only" />
      <Icon name={icon} size={48} className="size-8 ui-desktop:size-12" />
      <span className="type-ui-2xs-medium ui-desktop:type-overline-xs-medium">{children}</span>
    </label>
  );
}
