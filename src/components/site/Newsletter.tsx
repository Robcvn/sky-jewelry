"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, InputMessage } from "@/components/ui/Input";
import { siteFooter, type FooterContent } from "@/content/site";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type NewsletterProps = {
  content?: FooterContent["newsletter"];
  /** Style guide only: show Figma's error or confirmation state. */
  previewState?: "error" | "success";
};

/** Footer newsletter signup. Front end only: it validates the email and sends nothing anywhere. */
export function Newsletter({ content = siteFooter.newsletter, previewState }: NewsletterProps) {
  const id = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [email, setEmail] = useState(previewState === "error" ? "jsmith123@gmail" : "");
  const [status, setStatus] = useState<"idle" | "error" | "success">(previewState ?? "idle");
  const errorId = `${id}-error`;
  const inputId = `${id}-email`;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error");
      document.getElementById(inputId)?.focus();
      return;
    }
    // Mock only: nothing is stored or sent.
    setStatus("success");
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  if (status === "success") {
    return (
      <div className="flex w-full flex-col gap-space-4 text-center" role="status">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="type-heading-caps-md text-secondary-ivory focus:outline-none ui-desktop:type-heading-caps-lg ui-desktop:text-secondary-skin"
        >
          {content.successHeading}
        </h2>
        <p className="type-body-xs-medium text-secondary-ivory">{content.successBody}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-space-6 text-center">
      <h2 id={`${id}-heading`} className="type-heading-caps-md text-secondary-ivory ui-desktop:type-heading-caps-lg">
        {content.headingBefore}
        <span className="type-heading-italic-md normal-case ui-desktop:type-heading-italic-lg">{content.headingItalic}</span>
        {content.headingAfter}
      </h2>
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-space-2 text-left">
        <div className="flex items-start gap-space-2 ui-desktop:gap-space-4">
          <div className="min-w-0 flex-1">
            <Input
              id={inputId}
              dark
              size="responsive"
              type="email"
              name="email"
              autoComplete="email"
              label={content.emailLabel}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status === "error") setStatus("idle");
              }}
              error={status === "error"}
              aria-describedby={status === "error" ? errorId : undefined}
            />
          </div>
          <span className="flex ui-desktop:hidden">
            <Button type="submit" size="sm" overlay variant="secondary" shape="square">
              {content.submitLabel}
            </Button>
          </span>
          <span className="hidden ui-desktop:flex">
            <Button type="submit" size="md" overlay variant="secondary" shape="square">
              {content.submitLabel}
            </Button>
          </span>
        </div>
        <div aria-live="polite">
          {status === "error" ? (
            <InputMessage id={errorId} status="error">
              {content.invalidEmail}
            </InputMessage>
          ) : null}
        </div>
      </form>
      <p className="type-body-xs-medium text-secondary-ivory ui-desktop:text-secondary-gold">{content.consent}</p>
    </div>
  );
}
