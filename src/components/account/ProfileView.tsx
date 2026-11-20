"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { ButtonText } from "@/components/ui/Button";
import { TextButton, TextButtonText } from "@/components/ui/TextButton";
import { cx } from "@/components/ui/shared";
import { accountContent, customer, type AccountAddress } from "@/content/account";
import { useAddressBook } from "@/lib/accountAddresses";
import { AddressModal } from "./AddressModal";
import { AddressLines } from "./OrderParts";

const p = accountContent.profile;

/**
 * Figma "Address" card (Account - Profile): the Default badge, the address, and Edit / Remove. Editing and removing
 * aren't drawn beyond these links, so they are shown, inert (Held for review). Figma's 24px (desktop) and 20px
 * (mobile) padding is an inside stroke, so 1px less sits beside the border.
 */
export function AddressCard({ address, isDefault }: { address: AccountAddress; isDefault: boolean }) {
  return (
    <li className="flex flex-col gap-space-5 rounded-8 border border-black-alpha-20 bg-base-white p-[1.1875rem] ui-desktop:gap-space-6 ui-desktop:p-[1.4375rem]">
      {isDefault ? (
        <span className="flex">
          <Badge variant="secondary" size="sm" className="ui-desktop:hidden">
            {p.defaultBadge}
          </Badge>
          <span className="hidden ui-desktop:flex">
            <Badge variant="secondary">{p.defaultBadge}</Badge>
          </span>
        </span>
      ) : null}
      <AddressLines address={address} className="type-body-sm-regular ui-desktop:type-body-md-regular" />
      <div className="mt-auto flex gap-space-5">
        <TextButtonText size="sm" variant="caps" leadingIcon="pencil-simple-line">
          {p.editAddress}
        </TextButtonText>
        <TextButtonText size="sm" variant="caps" leadingIcon="trash">
          {p.removeAddress}
        </TextButtonText>
      </div>
    </li>
  );
}

function SectionHeader({ id, title, action, alignTop = false }: { id: string; title: string; action: ReactNode; alignTop?: boolean }) {
  return (
    <div className={cx("flex justify-between gap-space-4", alignTop ? "items-center ui-desktop:items-start" : "items-center")}>
      <h2 id={id} className="type-heading-md">
        {title}
      </h2>
      {action}
    </div>
  );
}

/**
 * Figma "Account - Profile" (3565:97935, mobile 3587:124348): Account Details, Address Book and Sky Repairs, with
 * rules between them. Account Details' Edit and Sky Repairs' Opt Out have no drawn destination: shown, inert.
 */
export function ProfileView() {
  const book = useAddressBook();
  const [modal, setModal] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-space-8 ui-desktop:gap-space-10">
      <section aria-labelledby="account-details" className="flex flex-col gap-space-6">
        <SectionHeader
          id="account-details"
          title={p.details}
          action={
            <TextButtonText size="sm" variant="caps" leadingIcon="note-pencil">
              {p.edit}
            </TextButtonText>
          }
        />
        <dl className="flex flex-col gap-space-4 ui-desktop:gap-space-6">
          {[
            { label: p.name, value: `${customer.firstName} ${customer.lastName}` },
            { label: p.email, value: customer.email },
          ].map((row) => (
            <div key={row.label} className="flex flex-col gap-1">
              <dt className="type-overline-xs-medium text-black-alpha-60">{row.label}</dt>
              <dd className="type-body-sm-medium ui-desktop:type-body-md-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <hr className="-mb-px border-black-alpha-20" />

      <section aria-labelledby="address-book" className="flex flex-col gap-space-6">
        <SectionHeader
          id="address-book"
          title={p.addressBook}
          alignTop
          action={
            <TextButton
              size="sm"
              variant="caps"
              leadingIcon="plus"
              aria-haspopup="dialog"
              onClick={() => {
                setModal((count) => count + 1);
                setOpen(true);
              }}
            >
              {p.addAddress}
            </TextButton>
          }
        />
        <ul className="grid gap-space-4 ui-desktop:grid-cols-2">
          {book.addresses.map((address) => (
            <AddressCard key={address._key} address={address} isDefault={address._key === book.defaultAddress} />
          ))}
        </ul>
      </section>

      <hr className="-mb-px border-black-alpha-20" />

      <section aria-labelledby="sky-repairs" className="flex flex-col gap-space-6 ui-desktop:flex-row ui-desktop:items-end ui-desktop:justify-between ui-desktop:gap-space-10">
        <div className="flex max-w-[36.375rem] flex-col gap-space-3 ui-desktop:gap-space-4">
          <h2 id="sky-repairs" className="type-heading-md">
            {p.repairs.heading}
          </h2>
          <p className="type-body-sm-regular ui-desktop:type-body-md-regular">{p.repairs.body}</p>
        </div>
        <ButtonText size="responsive" variant="secondary" className="w-[10rem] shrink-0">
          {p.repairs.cta}
        </ButtonText>
      </section>

      <AddressModal key={modal} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
