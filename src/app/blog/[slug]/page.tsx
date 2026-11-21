import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostView } from "@/components/content/PostView";
import { withBasePath } from "@/components/ui/shared";
import { postHref } from "@/content/blog";
import { getEditorialContent, postBySlug } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getEditorialContent()).blogPosts.filter((post) => post.kind !== "story").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = postBySlug(await getEditorialContent(), (await params).slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, alternates: { canonical: withBasePath(postHref(post)) } };
}

/** Post Detail: see PostView. Stories have their own route, /stories/<slug>/. */
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = postBySlug(await getEditorialContent(), (await params).slug);
  if (!post || post.kind === "story") notFound();
  return <PostView post={post} />;
}
