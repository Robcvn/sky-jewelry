import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { OrderCard } from "@/components/account/OrderParts";
import { accountContent, orders } from "@/content/account";
import { resolveOrder } from "@/lib/account";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: accountContent.orders.title,
  description: "Your Sky Jewelry orders.",
  robots: { index: false, follow: false },
};

/** Account - Orders (3565:97997, mobile 3587:124427): the mock orders, newest first. */
export default async function AccountOrders() {
  const { products } = await getCatalog();
  const resolved = orders.map((order) => resolveOrder(order, products));
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <AccountShell active="orders">
        <section aria-labelledby="previous-orders" className="flex flex-col gap-space-6 ui-desktop:gap-space-8">
          <h2 id="previous-orders" className="type-heading-md">
            {accountContent.orders.heading}
          </h2>
          <ul className="flex flex-col gap-space-6 ui-desktop:gap-space-8">
            {resolved.map((order) => (
              <li key={order._id}>
                <OrderCard order={order} />
              </li>
            ))}
          </ul>
        </section>
      </AccountShell>
    </main>
  );
}
