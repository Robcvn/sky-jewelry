import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { cx } from "./shared";

type StatusMarkerProps = {
  children: ReactNode;
  size?: "md" | "sm";
  completed?: boolean;
  /** Figma Delivered=True, the final step. Shown only when completed. */
  delivered?: boolean;
  className?: string;
};

/** Figma "Status Marker" for order tracking. */
export function StatusMarker({ children, size = "md", completed = false, delivered = false, className }: StatusMarkerProps) {
  const showDelivered = completed && delivered;

  return (
    <div
      className={cx(
        "flex text-primary-leather",
        size === "md" ? "flex-col items-start gap-space-2" : "items-center gap-space-2",
        className,
      )}
    >
      <span aria-hidden="true" className="relative flex size-space-2 shrink-0 items-center justify-center">
        <span
          className={cx(
            "absolute flex items-center justify-center rounded-full border",
            showDelivered ? "size-space-4 border-primary-leather bg-primary-leather text-base-white" : "size-space-2",
            !showDelivered && (completed ? "border-primary-leather bg-primary-leather" : "border-secondary-gold bg-base-white"),
          )}
        >
          {showDelivered ? <Icon name="gemstone" size={12} /> : null}
        </span>
      </span>
      <span className="type-ui-sm-regular">
        {children}
        <span className="sr-only">{completed ? ", completed" : ", not yet reached"}</span>
      </span>
    </div>
  );
}
