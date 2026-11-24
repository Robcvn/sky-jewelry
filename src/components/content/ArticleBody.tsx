import { Picture } from "@/components/ui/Picture";
import { cx } from "@/components/ui/shared";
import { TableScroll } from "@/components/ui/TableScroll";
import type { ArticleBlock } from "@/content/article";
import type { Product } from "@/content/products";
import { FigureAction, Gallery, GradeScale, Qualities } from "./ArticleBlocks";
import { ARTICLE_SIZES, BULLET_ITEM, BULLET_LIST } from "./articleStyles";

type Kind = "resource" | "post";

const HEADING = {
  2: "type-heading-lg ui-desktop:type-heading-2xl",
  3: "type-heading-md ui-desktop:type-heading-xl",
  // Post Detail's H4 (3565:102017) is heading-lg; the mobile frame draws none, so it steps down to heading-sm.
  4: "type-heading-sm ui-desktop:type-heading-lg",
} as const;

/**
 * The space above each block, as measured in the frames. Resource Detail (3565:101773): 56 above an H2, 48 above an
 * H3 or any figure, 28 under an H2 and 24 under an H3. Post Detail (3565:102017): 48 above headings and figures, 24
 * under headings and between text blocks. Mobile (3587:129748 / 3587:130026): 32 above, 16 under.
 */
function spaceAbove(block: ArticleBlock, previous: ArticleBlock | undefined, kind: Kind) {
  if (!previous) return "";
  if (previous._type === "heading") {
    return previous.level === 2 && kind === "resource" ? "mt-space-4 ui-desktop:mt-space-7" : "mt-space-4 ui-desktop:mt-space-6";
  }
  if (block._type === "heading" || block._type === "qualities") {
    return block._type !== "qualities" && block.level !== 2 ? "mt-space-8 ui-desktop:mt-space-11" : kind === "resource" ? "mt-space-8 ui-desktop:mt-space-12" : "mt-space-8 ui-desktop:mt-space-11";
  }
  // Consecutive paragraphs are one Figma text box with its paragraph spacing, 20px on desktop (post 3565:102017: a
  // seven-line box of p-lg is 228 tall); separate boxes, as after a heading, stay 24 apart.
  if (block._type === "paragraph" && previous._type === "paragraph") return "mt-space-4 ui-desktop:mt-space-5";
  if (block._type === "paragraph" || block._type === "list") return "mt-space-4 ui-desktop:mt-space-6";
  return "mt-space-8 ui-desktop:mt-space-11";
}

/** The article text of a resource or post: its blocks in order, with the type and spacing of the frame it comes from. */
export function ArticleBody({ body, kind, products = {}, story = false }: { body: ArticleBlock[]; kind: Kind; products?: Record<string, Product[]>; story?: boolean }) {
  return (
    <div className="flex flex-col text-primary-leather">
      {body.map((block, index) => {
        const space = spaceAbove(block, body[index - 1], kind);
        switch (block._type) {
          case "heading": {
            const Tag = `h${block.level}` as "h2" | "h3" | "h4";
            return (
              <Tag key={block._key} id={block.nav ? block._key : undefined} className={cx(HEADING[block.level], "scroll-mt-space-6", space)}>
                {block.text}
              </Tag>
            );
          }
          case "paragraph":
            return (
              <p key={block._key} className={cx("type-p-md-regular ui-desktop:type-p-lg-regular", space)}>
                {block.text}
              </p>
            );
          case "figure":
            return (
              <figure key={block._key} className={cx("flex flex-col gap-space-3 ui-desktop:gap-space-4", space)}>
                {/* 4:3 (824 x 618); the post's necklace photo is taller on desktop (824 x 680). */}
                <div className={cx("relative overflow-hidden rounded-4 bg-secondary-ivory", block.shape === "tall" ? "aspect-[4/3] ui-desktop:aspect-[824/680]" : "aspect-[4/3]")}>
                  <Picture image={block.image} sizes={ARTICLE_SIZES} className="absolute inset-0 size-full object-cover" />
                  {block.products ? (
                    <FigureAction label={block.products.label} icon="plus" products={block.products.handles.flatMap((handle) => products[handle] ?? [])} />
                  ) : block.action ? (
                    <FigureAction label={block.action.label} icon={block.action.icon} href={block.action.href} trailing={story} />
                  ) : null}
                </div>
                {block.caption ? <figcaption className="type-body-sm-medium ui-desktop:type-body-md-medium">{block.caption}</figcaption> : null}
              </figure>
            );
          case "gallery":
            return (
              <div key={block._key} className={space}>
                <Gallery items={block.items} label={block.items.map((item) => item.caption).join(", ")} />
              </div>
            );
          case "gradeScale":
            return (
              <div key={block._key} className={space}>
                <GradeScale block={block} />
              </div>
            );
          case "list":
            return (
              // Figma: the label is an overline (overline-sm, capitals), 24px above the items on desktop.
              <div key={block._key} className={cx("flex flex-col gap-space-3 ui-desktop:gap-space-6", space)}>
                {block.label ? <p className="type-overline-sm-medium">{block.label}</p> : null}
                <ul role="list" className={cx("type-p-md-regular", BULLET_LIST)}>
                  {block.items.map((item) => (
                    <li key={item} className={BULLET_ITEM}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "table":
            return (
              // Figma (Frame 250, 3565:102017): a 1px gold outline with 8px corners around the cells; the header row filled
              // secondary/ivory, 32px tall; 36px rows on skin; one 1px black-alpha-20 line between cells (header cells ruled
              // on the right, body cells on the top and right). The last column is double width. The mobile frame has no
              // table, so it keeps its desktop layout and scrolls sideways there (a focusable region).
              <TableScroll key={block._key} label={block.caption} className={space}>
                <div className="min-w-[34rem] overflow-hidden rounded-8 border border-secondary-gold">
                  <table className="w-full border-separate border-spacing-0 text-left text-primary-leather">
                    <caption className="sr-only">{block.caption}</caption>
                    <thead>
                      <tr>
                        {block.columns.map((column, columnIndex) => (
                          <th
                            key={column}
                            scope="col"
                            className={cx(
                              "type-overline-2xs-medium h-space-8 border-black-alpha-20 bg-secondary-ivory px-space-3 not-last:border-r",
                              columnIndex === block.columns.length - 1 ? "w-2/5" : "w-1/5",
                            )}
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row) => (
                        <tr key={row[0]}>
                          {row.map((cell, cellIndex) =>
                            cellIndex === 0 ? (
                              <th key={cellIndex} scope="row" className="type-ui-xs-regular h-space-9 border-t border-black-alpha-20 bg-secondary-skin px-space-3 font-normal not-last:border-r">
                                {cell}
                              </th>
                            ) : (
                              <td key={cellIndex} className="type-ui-xs-regular h-space-9 border-t border-black-alpha-20 bg-secondary-skin px-space-3 not-last:border-r">
                                {cell}
                              </td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TableScroll>
            );
          case "qualities":
            return (
              <div key={block._key} className={cx("hidden ui-desktop:block", space)}>
                <Qualities heading={block.heading} />
              </div>
            );
        }
      })}
    </div>
  );
}
