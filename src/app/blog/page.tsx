import type { Metadata } from "next";
import { withBasePath } from "@/components/ui/shared";
import { ContentList, type ListItem, type ListTopic } from "@/components/content/ContentList";
import { FeaturedPost } from "@/components/content/ContentSections";
import { GuaranteeIconsSection } from "@/components/sections/LandingSections";
import { postHref, postTopicId } from "@/content/blog";
import { getEditorialContent } from "@/lib/content";
import { guaranteeIcons } from "@/content/landing/shared";

export async function generateMetadata(): Promise<Metadata> {
  const { blogPage: page } = await getEditorialContent();
  return { title: page.seo.title, description: page.seo.description, alternates: { canonical: withBasePath("/blog/") } };
}

/**
 * The Blog List (Figma 3565:101703, mobile 3587:129657): the heading, the featured post, the Topic and Sort menus over
 * the post grid (topic, sort and page in the URL) and the Sky Jewelry Guarantee.
 */
export default async function BlogPage() {
  const { blogPage: page, blogPosts } = await getEditorialContent();
  // The newest post is featured; the grid lists the rest.
  const [featured, ...rest] = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  const items: ListItem[] = rest.map((post) => ({
    id: post._id,
    href: postHref(post),
    title: post.title,
    excerpt: post.excerpt,
    topic: postTopicId(post.topic),
    topicLabel: post.topic,
    date: post.date,
    readTime: post.readTime,
    image: post.image,
  }));

  /** The Topic menu lists the topics the grid's posts actually have, in the order they first appear. */
  const topics: ListTopic[] = [...new Set(rest.map((post) => post.topic))].map((label) => ({ id: postTopicId(label), label }));

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="site-container flex flex-col pt-space-11 text-primary-leather ui-desktop:pt-space-15">
        {/* Figma's title stack (3565:101707, mobile 3587:129658): centred, with a 1px gold rule 24 / 40px under the line
            (the stroke inside that padding) and 24 / 48px above the featured post. */}
        <header className="flex flex-col items-center gap-space-3 border-b border-secondary-gold pb-[calc(var(--spacing-space-6)-1px)] text-center ui-desktop:gap-space-4 ui-desktop:pb-[calc(var(--spacing-space-10)-1px)]">
          <h1 className="type-heading-caps-lg ui-desktop:type-heading-caps-2xl">{page.title}</h1>
          <p className="type-body-sm-regular ui-desktop:type-body-lg-regular">{page.body}</p>
        </header>
        <div className="mt-space-6 ui-desktop:mt-space-11">
          <FeaturedPost
            title={featured.title}
            excerpt={featured.excerpt}
            topic={featured.topic}
            date={featured.date}
            readTime={featured.readTime}
            href={postHref(featured)}
            image={featured.featuredImage}
            cta={page.readMore}
          />
        </div>
        <section aria-label="Posts" className="pt-space-11 pb-space-11 ui-desktop:pt-space-15 ui-desktop:pb-space-15">
          <ContentList kind="blog" items={items} topics={topics} pageSize={page.pageSize} labels={{ allTopics: page.allTopics, results: "Posts" }} />
        </section>
      </div>
      <GuaranteeIconsSection content={guaranteeIcons("guarantee")} fill="ivory" />
    </main>
  );
}
