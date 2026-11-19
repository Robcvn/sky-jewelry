/*
 * Blog posts, shaped like Sanity "post" documents. Shared by the Education mega menu and the Home blog row.
 * Figma shows placeholder posts ("Post Title", Latin excerpts); these titles and excerpts replace them.
 */
import type { ImageRef } from "@/components/ui/Picture";

export type BlogPost = {
  _id: string;
  _type: "post";
  title: string;
  slug: string;
  topic: string;
  /** ISO date */
  date: string;
  readTime: string;
  excerpt: string;
  /** 64px thumbnail in the mega menu */
  thumbnail: { src: string; alt: string };
  /** 4:3 card image on Home */
  image: ImageRef;
};

export const blogPosts: BlogPost[] = [
  {
    _id: "post-choosing-a-setting",
    _type: "post",
    title: "How to Choose the Right Engagement Ring Setting",
    slug: "how-to-choose-the-right-engagement-ring-setting",
    topic: "Engagement",
    date: "2026-10-28",
    readTime: "5 Min Read",
    excerpt: "Solitaire, halo or bezel: how each setting frames the stone, and what suits everyday wear.",
    thumbnail: { src: "/images/education/blog-thumb-1.jpg", alt: "" },
    image: { desktop: "story-face-post", alt: "A woman resting her hand on her cheek, wearing a pear-shaped diamond ring" },
  },
  {
    _id: "post-lab-vs-natural",
    _type: "post",
    title: "Lab-Grown or Natural: What Sets Them Apart",
    slug: "lab-grown-or-natural-what-sets-them-apart",
    topic: "Diamonds",
    date: "2026-09-16",
    readTime: "4 Min Read",
    excerpt: "Both are real diamonds. Here is how they differ in origin, price and how they are graded.",
    thumbnail: { src: "/images/education/blog-thumb-2.jpg", alt: "" },
    image: { desktop: "story-arms-post", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" },
  },
  {
    _id: "post-stacking-rings",
    _type: "post",
    title: "Stacking Rings: Mixing Metals and Shapes",
    slug: "stacking-rings-mixing-metals-and-shapes",
    topic: "Style",
    date: "2026-08-05",
    readTime: "3 Min Read",
    excerpt: "Simple rules for pairing bands with your engagement ring, from contrast metals to matching curves.",
    thumbnail: { src: "/images/education/blog-thumb-3.jpg", alt: "" },
    image: { desktop: "story-hand-post", alt: "A hand wearing several stacked gold rings" },
  },
];

export const postHref = (post: BlogPost) => `/blog/${post.slug}/`;
