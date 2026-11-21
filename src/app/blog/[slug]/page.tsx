import type { Metadata } from "next";
import { withBasePath } from "@/components/ui/shared";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/content/ArticleBody";
import { PostHeader } from "@/components/content/ContentSections";
import { BlogRow } from "@/components/home/BlogRow";
import { BestSellersSection } from "@/components/sections/BestSellers";
import { em, span } from "@/components/ui/RichText";
import { blogPage as page, blogPosts, postBySlug, postHref, postTopicId } from "@/content/blog";
import { contentBestSellers } from "@/content/education";
import { getCatalog, pickProducts } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = postBySlug((await params).slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, alternates: { canonical: withBasePath(postHref(post)) } };
}

/**
 * Post Detail (Figma 3565:102017, mobile 3587:130026): the header and photo, the article (its "Featured Products"
 * button opens the Featured Product Flyout with real catalogue products), the best sellers and "You Should also Read".
 */
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = postBySlug((await params).slug);
  if (!post) notFound();

  // The flyout's products, read from Shopify at build time like every product row.
  const handles = post.body.flatMap((block) => (block._type === "figure" && block.products ? block.products.handles : []));
  const { products: catalog } = await getCatalog();
  const products = Object.fromEntries(handles.map((handle) => [handle, pickProducts(catalog, [handle])]));

  // "You Should also Read": the three newest other posts.
  const others = [...blogPosts].filter((item) => item._id !== post._id).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <article>
        <PostHeader
          title={post.title}
          topic={{ label: post.topic, href: `/blog/?topic=${postTopicId(post.topic)}` }}
          date={post.date}
          readTime={post.readTime}
          image={post.hero}
          back={{ label: page.back, href: "/blog/" }}
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
          cta: { label: page.viewAll, href: "/blog/" },
          postIds: others.map((item) => item._id),
        }}
      />
    </main>
  );
}
