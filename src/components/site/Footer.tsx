import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { siteFooter, type FooterContent } from "@/content/site";
import { DemoNotice } from "./DemoNotice";
import { Newsletter } from "./Newsletter";

type FooterProps = {
  content?: FooterContent;
  breakpoint?: "desktop" | "mobile";
  newsletterPreview?: "error" | "success";
  label?: string;
};

const LINK = "ui-focus:outline-base-white rounded-4 hover:underline";

export function Footer({ content = siteFooter, breakpoint, newsletterPreview, label = "Site footer" }: FooterProps) {
  const { privacyLine } = content;

  return (
    <footer aria-label={label} data-breakpoint={breakpoint} className="bg-primary-blue text-secondary-ivory">
      <div className="site-container flex flex-col items-center gap-space-8 pt-space-11 pb-space-6 ui-desktop:gap-space-15 ui-desktop:pt-space-15 ui-desktop:pb-space-8">
        <div className="w-full max-w-[38rem]">
          <Newsletter
            content={content.newsletter}
            previewState={newsletterPreview}
            footnote={
              // Figma's desktop frame: gold text, ivory links; the mobile frame swaps them. Links underlined (D9).
              <p className="type-body-xs-regular text-center text-secondary-ivory ui-desktop:text-secondary-gold">
                {privacyLine.before}
                <Link href={privacyLine.privacy.href} className={`${LINK} text-secondary-gold underline ui-desktop:text-secondary-ivory`}>
                  {privacyLine.privacy.label}
                </Link>
                {privacyLine.middle}
                <Link href={privacyLine.contact.href} className={`${LINK} text-secondary-gold underline ui-desktop:text-secondary-ivory`}>
                  {privacyLine.contact.label}
                </Link>
                {privacyLine.after}
              </p>
            }
          />
        </div>

        <hr className="w-full border-0 border-t border-secondary-gold" />

        <div className="flex w-full flex-col gap-space-8 ui-desktop:flex-row ui-desktop:justify-between ui-desktop:gap-space-13">
          <div className="flex flex-col gap-space-6 ui-desktop:max-w-[25rem] ui-desktop:flex-1 ui-desktop:gap-space-8">
            <p className="type-body-xs-regular max-w-[21.4375rem] ui-desktop:type-body-sm-regular">{content.description}</p>
            <address className="type-body-xs-regular flex flex-col gap-space-2 not-italic">
              <span className="flex items-center gap-space-2">
                <Icon name="map-pin" size={20} className="text-secondary-gold" />
                {content.contact.address}
              </span>
              <a href={`tel:${content.contact.phone.replace(/[^+\d]/g, "")}`} className={`${LINK} flex w-fit items-center gap-space-2`}>
                <Icon name="phone" size={20} className="text-secondary-gold" />
                {content.contact.phone}
              </a>
              <a href={`mailto:${content.contact.email}`} className={`${LINK} flex w-fit items-center gap-space-2`}>
                <Icon name="mail" size={20} className="text-secondary-gold" />
                {content.contact.email}
              </a>
            </address>
            <ul className="flex items-center gap-space-4">
              {content.social.map((item) => (
                <li key={item._key}>
                  <a href={item.href} className="ui-focus:outline-base-white flex rounded-4 text-secondary-gold hover:text-secondary-ivory">
                    <Icon name={item.icon} size={24} label={item.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-space-6 ui-desktop:max-w-[38.125rem] ui-desktop:flex-[1.5]">
            {content.columns.map((column) => (
              <nav key={column._key} aria-labelledby={`footer-${column._key}`} className="flex flex-col gap-space-4 ui-desktop:gap-space-8">
                <h2 id={`footer-${column._key}`} className="type-overline-xs-medium text-secondary-gold">
                  {column.title}
                </h2>
                <ul className="flex flex-col gap-space-2">
                  {column.links.map((link) => (
                    <li key={link._key} className="flex">
                      <Link href={link.href} className={`${LINK} type-ui-xs-medium`}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-space-4 border-t border-secondary-gold pt-space-6 ui-desktop:flex-row ui-desktop:items-center ui-desktop:justify-between ui-desktop:pt-space-8">
          {/* One line: the copyright, then "Portfolio demo", which shows the demo notice in a popover (Task 27, Deviations). */}
          <p className="type-body-xs-regular relative">
            {content.copyright}
            {" · "}
            <DemoNotice label={content.demoLabel} notice={content.demoNotice} />
          </p>
          <ul aria-label="Accepted payment methods" className="flex items-center gap-space-4 text-secondary-gold">
            {content.payments.map((payment) => (
              <li key={payment._key} className="flex">
                <Icon name={payment.icon} size={32} label={payment.label} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
