import { StarRating } from "./StarRating";

const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

type ReviewCardProps = { name: string; rating: number; date: string; body: string };

/** Figma "Review Card": reviewer name, stars and date, a hairline, then the review. */
export function ReviewCard({ name, rating, date, body }: ReviewCardProps) {
  return (
    <article className="flex h-full flex-col gap-space-5 rounded-4 bg-secondary-skin p-space-5 text-primary-leather ui-desktop:gap-space-6 ui-desktop:p-space-6">
      <div className="flex items-start justify-between gap-space-6">
        <div className="flex flex-col gap-space-2">
          <h3 className="type-heading-sm">{name}</h3>
          <StarRating rating={rating} />
        </div>
        <time dateTime={date} className="type-overline-xs-medium shrink-0 text-black-alpha-60">
          {DATE.format(new Date(date))}
        </time>
      </div>
      <hr className="border-0 border-t border-black-alpha-20" />
      <p className="type-p-xs-regular ui-desktop:type-p-sm-regular">{body}</p>
    </article>
  );
}
