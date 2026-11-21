import { BlogRow } from "@/components/home/BlogRow";
import { BestSellersSection } from "@/components/sections/BestSellers";
import { em, span } from "@/components/ui/RichText";
import { blogPage as page, blogPosts, postTopicId, type BlogPost } from "@/content/blog";
import { contentBestSellers } from "@/content/education";
import { getCatalog, pickProducts } from "@/lib/catalog";
import { ArticleBody } from "./ArticleBody";
import { PostHeader } from "./ContentSections";

/**
 * Post Detail (Figma 3565:102017, mobile 3587:130026) and a customer story (Post Detail / Stories 6287:176402; no mobile
 * frame, so it follows Post Detail's mobile frame): the header and photo, the article (its "Featured Products" button
 * opens the Featured Product Flyout with real catalogue products), the best sellers and "You Should also Read".
 */
export async function PostView({ post }: { post: BlogPost }) {
  const story = post.kind === "story";
  // The flyout's products, read from Shopify at build time like every product row.
  const handles = post.body.flatMap((block) => (block._type === "figure" && block.products ? block.products.handles : []));
  const { products: catalog } = await getCatalog();
  const products = Object.fromEntries(handles.map((handle) => [handle, pickProducts(catalog, [handle])]));

  // "You Should also Read": the three newest other posts (for a story, the three newest other stories).
  const others = [...blogPosts]
    .filter((item) => item._id !== post._id && (!story || item.kind === "story"))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  const storiesHref = `/blog/?topic=${postTopicId("Stories")}`;

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <article>
        <PostHeader
          title={post.title}
          topic={story ? { label: page.storyEyebrow } : { label: post.topic, href: `/blog/?topic=${postTopicId(post.topic)}` }}
          date={story ? undefined : post.date}
          readTime={story ? undefined : post.readTime}
          image={post.hero}
          back={story ? { label: page.storyBack, href: storiesHref } : { label: page.back, href: "/blog/" }}
        />
        <div className="site-container pt-space-8 pb-space-11 ui-desktop:pt-space-11 ui-desktop:pb-space-15">
          <div className="mx-auto max-w-[51.5rem]">
            <ArticleBody body={post.body} kind="post" products={products} />
          </div>
        </div>
      </article>
      <BestSellersSection content={contentBestSellers} />
      <BlogRow
        content={{
          _type: "blogRow",
          _key: "also-read",
          heading: [span("You Should "), em("also"), span(" Read")],
          cta: { label: page.viewAll, href: story ? storiesHref : "/blog/" },
          postIds: others.map((item) => item._id),
        }}
      />
    </main>
  );
}
