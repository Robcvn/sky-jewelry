import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostView } from "@/components/content/PostView";
import { withBasePath } from "@/components/ui/shared";
import { blogPosts, postBySlug, postHref } from "@/content/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.filter((post) => post.kind !== "story").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = postBySlug((await params).slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, alternates: { canonical: withBasePath(postHref(post)) } };
}

/** Post Detail: see PostView. Stories have their own route, /stories/<slug>/. */
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = postBySlug((await params).slug);
  if (!post || post.kind === "story") notFound();
  return <PostView post={post} />;
}
