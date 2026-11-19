"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { cx } from "@/components/ui/shared";

export type BagNotice = { id: number; tone: "success" | "error"; text: string };

/**
 * TEMPORARY stand-in for the bag panel (a later task): a short "Added to bag" confirmation at the bottom of
 * the screen. It sits in a polite live region, so screen readers announce it without moving focus, and it
 * hides after 5 seconds (or on Close). Not in Figma.
 */
export function BagToast({ notice, onDismiss }: { notice: BagNotice | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(onDismiss, 5000);
    return () => window.clearTimeout(timer);
  }, [notice, onDismiss]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-space-4 z-50 flex justify-center px-(--grid-margin)">
      {notice ? (
        <div
          key={notice.id}
          className={cx(
            "pointer-events-auto flex max-w-[30rem] items-center gap-space-3 rounded-4 border bg-secondary-skin py-space-2 pr-space-2 pl-space-4 text-primary-leather shadow-lg",
            notice.tone === "success" ? "border-primary-leather" : "border-state-error",
          )}
        >
          <Icon name={notice.tone === "success" ? "check-circle" : "warning-circle"} size={20} />
          <p className="type-ui-xs-regular flex-1">{notice.text}</p>
          <IconButton icon="close" label="Close" variant="ghost" size="sm" onClick={onDismiss} />
        </div>
      ) : null}
    </div>
  );
}
