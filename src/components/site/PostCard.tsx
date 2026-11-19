import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/components/ui/shared";
import type { BlogTeaser } from "@/content/site";

const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Figma "Post Card": a 64px thumbnail, topic and date, and the post title. The whole card is one link. */
export function PostCard({ post }: { post: BlogTeaser }) {
  return (
    <Link href={post.href} className="group flex w-full items-center gap-space-2">
      <Image
        src={withBasePath(post.image.src)}
        alt={post.image.alt}
        width={64}
        height={64}
        className="size-space-13 shrink-0 rounded-4 object-cover"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-space-1">
        <span className="type-overline-xs-medium flex items-center gap-space-2 text-black-alpha-60">
          <span>{post.topic}</span>
          <span aria-hidden="true" className="h-2.5 w-px bg-black-alpha-20" />
          <time dateTime={post.date}>{DATE.format(new Date(post.date))}</time>
        </span>
        <span className="type-ui-sm-medium ui-transition-fast text-primary-leather group-hover:text-black-alpha-60">{post.title}</span>
      </span>
    </Link>
  );
}
