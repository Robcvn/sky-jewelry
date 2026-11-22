"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useIsDesktop } from "@/components/ui/useIsDesktop";
import { Icon } from "@/components/ui/Icon";
import { cx } from "@/components/ui/shared";
import { announcementBar, type AnnouncementBarContent } from "@/content/site";
import { useDragScroll } from "@/components/ui/useDragScroll";

function subscribeToSeconds(onTick: () => void) {
  const timer = window.setInterval(onTick, 1000);
  return () => window.clearInterval(timer);
}

/** Current time in whole seconds on the client, null while rendering on the server. */
function useNowInSeconds() {
  return useSyncExternalStore(
    subscribeToSeconds,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
}

/** Seconds until the sale ends; once the mock end date has passed, the sale restarts every `restartDays`. */
function secondsLeft(now: number, end: number, restartDays: number) {
  const period = restartDays * 86400;
  if (now < end || period <= 0) return Math.max(0, end - now);
  return period - ((now - end) % period);
}

function Countdown({ label, endsAt, restartDays }: AnnouncementBarContent["countdown"]) {
  const now = useNowInSeconds();
  const end = Math.floor(new Date(endsAt).getTime() / 1000);
  const left = now === null ? null : secondsLeft(now, end, restartDays);
  const parts =
    left === null
      ? null
      : {
          D: Math.floor(left / 86400),
          H: Math.floor((left % 86400) / 3600),
          M: Math.floor((left % 3600) / 60),
          S: left % 60,
        };
  const units = (["D", "H", "M", "S"] as const).map((unit) => ({
    unit,
    value: parts ? String(parts[unit]).padStart(2, "0") : "--",
  }));

  return (
    <p className="flex items-center gap-space-2 ui-desktop:gap-space-4">
      <span>{label}</span>
      <span aria-hidden="true" className="h-space-3 w-px bg-white-alpha-20" />
      <span aria-hidden="true" className="flex items-center gap-space-1">
        {units.map(({ unit, value }, index) => (
          <span key={unit} className="flex items-center gap-space-1">
            {index > 0 ? <span className="text-white-alpha-50">:</span> : null}
            <span className="flex items-center gap-0.5 tabular-nums">
              {value}
              <span className="text-white-alpha-60">{unit}</span>
            </span>
          </span>
        ))}
      </span>
      <span className="sr-only">
        {parts
          ? `Sale ends in ${parts.D} days, ${parts.H} hours and ${parts.M} minutes.`
          : "Sale countdown."}
      </span>
    </p>
  );
}

type AnnouncementBarProps = {
  content?: AnnouncementBarContent;
  /** Overrides the content's mode, for the style guide. */
  mode?: AnnouncementBarContent["mode"];
  breakpoint?: "desktop" | "mobile";
  label?: string;
};

/** Figma "Top Bar": the announcement bar above the header. */
export function AnnouncementBar({ content = announcementBar, mode, breakpoint, label = "Announcements" }: AnnouncementBarProps) {
  const activeMode = mode ?? content.mode;
  const isDesktop = useIsDesktop();
  // On mobile the messages are wider than the bar, so the row scrolls and needs to be reachable by keyboard.
  const scrollable = breakpoint ? breakpoint === "mobile" : !isDesktop;
  const messagesRef = useDragScroll<HTMLDivElement>();

  return (
    <aside
      aria-label={label}
      data-breakpoint={breakpoint}
      className="type-overline-xs-medium relative flex min-h-[1.875rem] items-center bg-primary-leather text-secondary-skin"
    >
      <Link
        href={content.contact.mobileHref}
        className="ui-focus:outline-base-white absolute top-0 left-space-3 flex size-[1.875rem] items-center justify-center text-secondary-skin ui-desktop:hidden"
      >
        <Icon name="text-message" size={20} />
        <span className="sr-only">{content.contact.label}</span>
      </Link>
      <Link
        href={content.contact.href}
        className="ui-transition ui-focus:outline-base-white absolute top-0 left-space-6 hidden py-space-2 text-secondary-ivory hover:text-base-white ui-desktop:inline-flex"
      >
        {content.contact.label}
      </Link>

      {activeMode === "countdown" ? (
        <div className="flex w-full justify-center px-space-11 py-space-2">
          <Countdown {...content.countdown} />
        </div>
      ) : (
        <div className="relative w-full min-w-0 py-space-2 pl-space-11 ui-desktop:px-space-11">
          <div
            ref={messagesRef}
            role={scrollable ? "group" : undefined}
            aria-label={scrollable ? "Announcement messages, scroll for more" : undefined}
            tabIndex={scrollable ? 0 : undefined}
            className="ui-focus:outline-base-white overflow-x-auto [scrollbar-width:none] ui-desktop:overflow-visible [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex w-max gap-space-4 px-space-4 ui-desktop:mx-auto ui-desktop:gap-space-6 ui-desktop:px-0">
              {content.messages.map((message) => (
                <li key={message} className="whitespace-nowrap">
                  {message}
                </li>
              ))}
            </ul>
          </div>
          <span
            aria-hidden="true"
            className={cx(
              "pointer-events-none absolute inset-y-0 left-space-11 w-space-5 bg-linear-to-r from-primary-leather to-transparent ui-desktop:hidden",
            )}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-space-5 bg-linear-to-l from-primary-leather to-transparent ui-desktop:hidden"
          />
        </div>
      )}
    </aside>
  );
}
