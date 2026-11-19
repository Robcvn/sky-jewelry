import { ButtonLink } from "@/components/ui/Button";
import { Carousel } from "@/components/ui/Carousel";
import { PostCard } from "@/components/ui/PostCard";
import { RichText, plainText } from "@/components/ui/RichText";
import { blogPosts, postHref } from "@/content/blog";
import type { BlogRow as BlogRowContent } from "@/content/home";
import { SECTION_HEADING, SECTION_HEADING_EM, SECTION_Y } from "./styles";

/** Figma Home section 10: the latest three blog posts. A row on desktop, swipeable on mobile. */
export function BlogRow({ content }: { content: BlogRowContent }) {
  const headingId = `${content._key}-heading`;
  const posts = content.postIds.map((id) => blogPosts.find((post) => post._id === id)).filter((post) => post !== undefined);
  const viewAll = (
    <ButtonLink href={content.cta.href} variant="secondary" size="sm">
      {content.cta.label}
    </ButtonLink>
  );

  return (
    <section aria-labelledby={headingId} className={`flex flex-col gap-space-6 ui-desktop:gap-space-11 ${SECTION_Y}`}>
      <div className="site-container flex items-end justify-between gap-space-6 text-primary-leather">
        <div className="flex flex-col gap-space-2">
          <p className="type-overline-sm-medium">{content.overline}</p>
          <h2 id={headingId} className={SECTION_HEADING}>
            <RichText value={content.heading} emClassName={SECTION_HEADING_EM} />
          </h2>
        </div>
        <div className="hidden shrink-0 ui-desktop:block">{viewAll}</div>
      </div>
      <Carousel
        label={plainText(content.heading)}
        desktop="grid"
        gridClassName="ui-desktop:grid-cols-3"
        itemClassName="w-[18rem] ui-desktop:w-auto"
        items={posts.map((post) => ({
          key: post._id,
          node: (
            <PostCard
              title={post.title}
              excerpt={post.excerpt}
              topic={post.topic}
              date={post.date}
              readTime={post.readTime}
              href={postHref(post)}
              image={post.image}
              sizes={{ desktop: "calc(33vw - 80px)", mobile: "288px" }}
            />
          ),
        }))}
      />
      <div className="flex justify-center pt-space-2 ui-desktop:hidden">{viewAll}</div>
    </section>
  );
}
