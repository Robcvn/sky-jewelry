import Link from "next/link";
import { iconData } from "@/icons/icon-data";
import { cx } from "@/components/ui/shared";

const wordmark = iconData["sky-wordmark"];
const [, , VIEW_WIDTH, VIEW_HEIGHT] = wordmark.viewBox.split(" ").map(Number);

/** The Sky Jewelry wordmark from Figma (sky-logo-default-brown), linked to the home page. */
export function Logo({ width, className }: { width: number; className?: string }) {
  return (
    <Link href="/" className={cx("inline-flex shrink-0 text-primary-leather", className)}>
      <svg
        width={width}
        height={(width * VIEW_HEIGHT) / VIEW_WIDTH}
        viewBox={wordmark.viewBox}
        fill="none"
        aria-hidden="true"
        focusable="false"
        dangerouslySetInnerHTML={{ __html: wordmark.body }}
      />
      <span className="sr-only">Sky Jewelry home</span>
    </Link>
  );
}
