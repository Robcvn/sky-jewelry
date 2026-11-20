import type { CSSProperties } from "react";
import { cx, withBasePath } from "./shared";

type GradeScaleProps = {
  /** e.g. "Color grade". */
  label: string;
  options: string[];
  selected: string;
  className?: string;
};

/**
 * Figma "Slider Option" row, read-only: one segment per grade with a 2px top border (gold, leather when
 * selected) and a 20px white thumb over the selected grade. Figma's option is 32 tall on mobile and 36 on desktop:
 * 10 / 12 above the label counting the 2px border, the 14 / 16 label (a block, so the card's line height doesn't
 * stretch the row) and 8 below. Figma draws it static, so it is a labelled list
 * with the current grade marked, not a control.
 */
export function GradeScale({ label, options, selected, className }: GradeScaleProps) {
  return (
    // Figma's Slider frame is fixed at 44: 8 above the options, and on mobile 4 under the 32px options.
    <ol aria-label={label} className={cx("relative flex h-[2.75rem] items-start gap-0.5 pt-space-2", className)}>
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <li
            key={option}
            aria-current={isSelected ? "true" : undefined}
            className={cx(
              "relative flex-1 border-t-2 px-0.5 pt-space-2 pb-space-2 text-center ui-desktop:pt-2.5",
              isSelected ? "border-primary-leather text-primary-leather" : "border-secondary-gold text-black-alpha-70",
            )}
          >
            {isSelected ? (
              <span
                aria-hidden="true"
                className="absolute -top-[11px] left-1/2 size-space-5 -translate-x-1/2 rounded-full border border-primary-leather bg-base-white shadow-md"
              />
            ) : null}
            <span className="type-ui-2xs-medium block ui-desktop:type-ui-xs-regular">{option}</span>
            {isSelected ? <span className="sr-only"> (this diamond)</span> : null}
          </li>
        );
      })}
    </ol>
  );
}

type QualityCardProps = {
  title: string;
  grade: string;
  options: string[];
  /** The drawing and its height as a percentage of the panel, per layout (Figma sizes each one per frame). */
  illustration: { src: string; height: { mobile: number; desktop: number } };
  description: string;
  className?: string;
};

/**
 * Figma "Your Diamond's Qualities" card: ivory, "Color — I" (grade in hazel), a 16:9 skin frame with the
 * diagram, the grade scale and a paragraph.
 */
export function QualityCard({ title, grade, options, illustration, description, className }: QualityCardProps) {
  return (
    <article className={cx("flex h-full flex-col gap-space-4 rounded-4 bg-secondary-ivory p-space-4 text-primary-leather ui-desktop:gap-space-6 ui-desktop:p-space-6", className)}>
      <h3 className="type-heading-sm flex gap-space-2 ui-desktop:type-heading-md">
        <span>{title}</span>
        <span aria-hidden="true">—</span>
        <span className="sr-only">: </span>
        <span className="text-primary-hazel">{grade}</span>
      </h3>
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-4 border border-black-alpha-5 bg-secondary-skin">
        {/* eslint-disable-next-line @next/next/no-img-element -- a static SVG diagram exported from Figma */}
        <img
          src={withBasePath(illustration.src)}
          alt=""
          width={267}
          height={198}
          className="h-(--drawing-m) w-auto max-w-none ui-desktop:h-(--drawing-d)"
          style={{ "--drawing-m": `${illustration.height.mobile}%`, "--drawing-d": `${illustration.height.desktop}%` } as CSSProperties}
        />
      </div>
      <GradeScale label={`${title} grade scale`} options={options} selected={grade} />
      <p className="type-p-xs-regular">{description}</p>
    </article>
  );
}
