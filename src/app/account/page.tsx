import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { ProfileView } from "@/components/account/ProfileView";
import { accountContent } from "@/content/account";

export const metadata: Metadata = {
  title: accountContent.profile.title,
  description: "Your Sky Jewelry account details and address book.",
  // A personal page: nothing for search engines.
  robots: { index: false },
};

/** Account - Profile. Figma draws no sign-in: the account shows the mock customer (Deviations). */
export default function AccountProfile() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <AccountShell active="profile">
        <ProfileView />
      </AccountShell>
    </main>
  );
}
