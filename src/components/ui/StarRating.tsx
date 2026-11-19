import { Icon } from "./Icon";
import { cx } from "./shared";

/** Five 16px "Star Filled" icons in secondary/gold. The visible stars are hidden from screen readers in favour of the text. */
export function StarRating({ rating = 5, className }: { rating?: number; className?: string }) {
  return (
    <span className={cx("flex items-center gap-space-1 text-secondary-gold", className)}>
      {Array.from({ length: 5 }, (_, index) => (
        <Icon key={index} name="star-filled" size={16} className={index < Math.round(rating) ? undefined : "opacity-30"} />
      ))}
      <span className="sr-only">{`Rated ${rating} out of 5`}</span>
    </span>
  );
}
