import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostView } from "@/components/content/PostView";
import { withBasePath } from "@/components/ui/shared";
import { postHref } from "@/content/blog";
import { getEditorialContent, postBySlug } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getEditorialContent()).blogPosts.filter((post) => post.kind === "story").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = postBySlug(await getEditorialContent(), (await params).slug);
  if (!post) return {};
  return { title: `${post.title}: Customer Story`, description: post.excerpt, alternates: { canonical: withBasePath(postHref(post)) } };
}

/** A customer story (Figma "Post Detail / Stories" 6287:176402), one of the six Home names: see PostView. */
export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = postBySlug(await getEditorialContent(), (await params).slug);
  if (!post || post.kind !== "story") notFound();
  return <PostView post={post} />;
}
