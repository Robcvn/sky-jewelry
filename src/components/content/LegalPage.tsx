import { ScrollArea } from "@/components/ui/Scrollbar";
import { cx } from "@/components/ui/shared";
import type { LegalBlock, LegalDoc } from "@/content/legal";
import { formatDate } from "./ContentSections";

/**
 * Figma "Legal Template" (desktop 3565:102087, mobile 3587:130116): the title (heading-2xl / heading-lg) and "Last
 * updated", the opening text, the Table of Contents (an ordered list of links in a gold-bordered box), then each section:
 * H2 (heading-lg / heading-md), "In short:" and other H3s (heading-md / heading-sm), paragraphs (p-md / p-sm), a medium
 * label, bulleted lists and the three-column table (rows ruled in gold; it scrolls sideways on mobile, with a scrollbar).
 * Spacing as drawn: 48 between blocks (mobile 32), 24 under an H2 (16) and before an H3, 12 under an H3.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const sections = doc.body.filter((block): block is Extract<LegalBlock, { _type: "h2" }> => block._type === "h2");
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <article className="site-container pt-space-11 pb-space-11 text-primary-leather ui-desktop:pt-space-15 ui-desktop:pb-space-15">
        <div className="mx-auto flex max-w-[51.5rem] flex-col gap-space-8 ui-desktop:gap-space-11">
          <header className="flex flex-col items-center gap-space-4 text-center">
            <h1 className="type-heading-lg ui-desktop:type-heading-2xl">{doc.title}</h1>
            <p className="type-overline-xs-medium">
              Last updated <time dateTime={doc.updated}>{formatDate(doc.updated)}</time>
            </p>
          </header>

          <div className="flex flex-col gap-space-10">
            <div className="type-p-sm-regular flex flex-col gap-space-4 ui-desktop:type-p-md-regular">
              {doc.intro.map((part) =>
                "items" in part ? (
                  <ul key={part._key} className="list-disc pl-space-6">
                    {part.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={part._key}>{part.text}</p>
                ),
              )}
            </div>
            <nav aria-labelledby={`${doc.slug}-toc`} className="flex flex-col gap-space-4 rounded-8 border border-secondary-gold p-space-5 ui-desktop:p-space-6">
              <h2 id={`${doc.slug}-toc`} className="type-overline-xs-medium">
                Table of Contents
              </h2>
              <ol className="type-p-sm-regular list-decimal pl-space-6 ui-desktop:type-p-md-regular">
                {sections.map((section) => (
                  <li key={section._key}>
                    <a href={`#${section._key}`} className="ui-transition-fast underline-offset-2 hover:underline">
                      {section.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {splitSections(doc.body).map((group) => (
            <section key={group[0]._key} aria-labelledby={group[0]._key} className="flex flex-col">
              {group.map((block, index) => (
                <Block key={block._key} block={block} previous={group[index - 1]} />
              ))}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}

/** Each H2 starts a section. */
function splitSections(body: LegalBlock[]) {
  const groups: LegalBlock[][] = [];
  for (const block of body) {
    if (block._type === "h2" || !groups.length) groups.push([block]);
    else groups[groups.length - 1].push(block);
  }
  return groups;
}

function space(block: LegalBlock, previous: LegalBlock | undefined) {
  if (!previous) return "";
  if (previous._type === "h2") return "mt-space-4 ui-desktop:mt-space-6";
  if (previous._type === "h3") return "mt-space-3";
  return "mt-space-6";
}

function Block({ block, previous }: { block: LegalBlock; previous?: LegalBlock }) {
  const gap = space(block, previous);
  switch (block._type) {
    case "h2":
      return (
        <h2 id={block._key} className="type-heading-md scroll-mt-space-6 ui-desktop:type-heading-lg">
          {block.text}
        </h2>
      );
    case "h3":
      return <h3 className={cx("type-heading-sm ui-desktop:type-heading-md", gap)}>{block.text}</h3>;
    case "p":
      return <p className={cx("type-p-sm-regular ui-desktop:type-p-md-regular", gap)}>{block.text}</p>;
    case "label":
      return <p className={cx("type-p-sm-medium ui-desktop:type-p-md-medium", gap)}>{block.text}</p>;
    case "list":
      return (
        <ul className={cx("type-p-sm-regular list-disc pl-space-6 ui-desktop:type-p-md-regular", gap)}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className={gap}>
          {/* Figma: 200 / 472 / 120 columns 16 apart on desktop; 136 / 200 / 96 on mobile, wider than the screen, so it scrolls. */}
          <ScrollArea label={block.caption} regionClassName="ui-desktop:overflow-visible" scrollbarClassName="mt-space-6 ui-desktop:hidden">
            <table className="w-[30rem] shrink-0 border-collapse text-left ui-desktop:w-full">
              <caption className="sr-only">{block.caption}</caption>
              <thead>
                <tr className="border-t border-secondary-gold">
                  {block.columns.map((column, index) => (
                    <th key={column} scope="col" className={cx("type-overline-xs-medium py-space-3 align-top", COLS[index])}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row[0]} className="border-t border-secondary-gold">
                    {row.map((cell, index) => (
                      <td key={index} className={cx("type-body-xs-regular py-space-3 align-top ui-desktop:type-body-sm-regular", COLS[index])}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      );
  }
}

const COLS = ["w-[8.5rem] pr-space-4 ui-desktop:w-[12.5rem]", "w-[12.5rem] pr-space-4 ui-desktop:w-auto", "w-[6rem] ui-desktop:w-[7.5rem]"];
