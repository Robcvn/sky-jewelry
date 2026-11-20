import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/components/ui/shared";
import { accountContent, customer, type AccountNavId } from "@/content/account";

type AccountShellProps = {
  /** The menu item to highlight. */
  active: AccountNavId;
  /** True when the page is the menu item's own page (Order Details highlights Orders without being it). */
  current?: boolean;
  children: ReactNode;
};

/**
 * The account pages' frame: "Welcome, <first name>" (heading-caps-xl over a leather rule on desktop, heading-caps-lg
 * on mobile), then the side menu (desktop: Figma "Menu Item" links in a column with a leather rule on its right) or
 * the line tabs (mobile: Figma "Tabs - Line"), then the page. Log Out has no drawn destination: shown, inert.
 *
 * Desktop grid: the menu spans columns 1 to 3 plus one gutter (318px at 1440, 278px in the 1280 frame), the page
 * columns 5 to 12 (822px / 716px), as both Figma widths draw it.
 */
export function AccountShell({ active, current = true, children }: AccountShellProps) {
  const items = accountContent.nav;
  return (
    <div className="site-container pt-space-11 pb-space-11 text-primary-leather ui-desktop:pt-space-15 ui-desktop:pb-space-15">
      {/* Figma's rule is an inside stroke within the 40px padding, so 39px sits above the 1px border. */}
      <h1 className="type-heading-caps-lg text-center ui-desktop:type-heading-caps-xl ui-desktop:border-b ui-desktop:border-primary-leather ui-desktop:pb-[2.4375rem]">
        {accountContent.greeting(customer.firstName)}
      </h1>

      <nav aria-label={`${accountContent.navLabel} pages`} className="mt-space-8 ui-desktop:hidden">
        <ul className="flex justify-between border-b border-black-alpha-20">
          {items.map((item) => (
            <li key={item._key} className="-mb-px flex">
              {item.href ? (
                <Link
                  href={item.href}
                  aria-current={item._key === active && current ? "page" : undefined}
                  className={cx(
                    "type-overline-xs-medium ui-transition flex min-h-space-8 items-center border-b",
                    item._key === active ? "border-primary-leather" : "border-transparent ui-hover:text-black-alpha-60",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="type-overline-xs-medium flex min-h-space-8 items-center border-b border-transparent">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-space-8 ui-desktop:site-grid ui-desktop:mt-0">
        <aside className="hidden border-r border-primary-leather pt-space-10 pr-space-10 ui-desktop:col-span-3 ui-desktop:mr-[calc(var(--grid-gutter)*-1)] ui-desktop:block">
          <nav aria-label={`${accountContent.navLabel} pages`}>
            <ul className="flex flex-col gap-space-2">
              {items.map((item) => {
                const style = cx(
                  "type-ui-sm-medium flex rounded-4 py-space-2 pr-space-4 pl-space-2",
                  item._key === active ? "bg-secondary-ivory" : item.href && "ui-transition ui-hover:bg-secondary-ivory",
                );
                return (
                  <li key={item._key}>
                    {item.href ? (
                      <Link href={item.href} aria-current={item._key === active && current ? "page" : undefined} className={style}>
                        <span className="px-1">{item.label}</span>
                      </Link>
                    ) : (
                      <span className={style}>
                        <span className="px-1">{item.label}</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        <div className="min-w-0 ui-desktop:col-span-8 ui-desktop:col-start-5 ui-desktop:pt-space-10">{children}</div>
      </div>
    </div>
  );
}
