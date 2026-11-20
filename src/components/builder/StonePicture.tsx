import { Icon } from "@/components/ui/Icon";
import { Picture } from "@/components/ui/Picture";
import { cx } from "@/components/ui/shared";
import { shapeIcon, shapeLabel } from "@/content/builder";
import type { Stone } from "@/lib/builder";

type StonePictureProps = {
  stone: Pick<Stone, "image" | "shape" | "title">;
  sizes: { desktop: string; mobile: string };
  priority?: boolean;
  className?: string;
};

/**
 * A stone's photo on the product-image tile. Figma has loose-stone photos for five diamond shapes and five
 * coloured stones only; a stone without one shows Figma's line drawing of its shape instead of a photo of a
 * different stone (an inference, listed in the report).
 */
export function StonePicture({ stone, sizes, priority, className }: StonePictureProps) {
  if (stone.image) return <Picture image={stone.image} sizes={sizes} priority={priority} className={cx("size-full object-cover mix-blend-multiply", className)} />;
  return (
    <span role="img" aria-label={`${shapeLabel(stone.shape)} stone, line drawing`} data-stone-drawing className={cx("flex size-full items-center justify-center text-primary-leather", className)}>
      <Icon name={shapeIcon(stone.shape)} size={48} className="size-2/5" />
    </span>
  );
}
