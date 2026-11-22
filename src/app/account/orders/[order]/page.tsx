import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { BackToOrders, OrderCard, OrderInfo, OrderSummary, ProductOrderDetail, RepairRequests } from "@/components/account/OrderParts";
import { accountContent, orders } from "@/content/account";
import { resolveOrder } from "@/lib/account";
import { getCatalog } from "@/lib/catalog";

type Params = { params: Promise<{ order: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return orders.map((order) => ({ order: order.number }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { order } = await params;
  return {
    title: accountContent.orders.orderNumber(order),
    description: "The details of a Sky Jewelry order.",
    robots: { index: false, follow: false },
  };
}

/**
 * Account - Order Details (3565:98015; 1280px 4430:61649; mobile 3587:124461). The Order Price card sits beside the
 * pieces when the page column is at least 800px wide (the 1440 frame, 822px) and below them when narrower (the 1280
 * frame, 716px).
 */
export default async function AccountOrderDetails({ params }: Params) {
  const { order: number } = await params;
  const source = orders.find((order) => order.number === number);
  if (!source) notFound();
  const { products } = await getCatalog();
  const order = resolveOrder(source, products);
  const d = accountContent.detail;

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <AccountShell active="orders" current={false}>
        <div className="flex flex-col gap-space-6 ui-desktop:gap-space-10">
          <BackToOrders />
          <OrderCard order={order} compact headingLevel="h2" />
          {/* Figma: 32px under the card on desktop, where the rest of the page is 40 apart. */}
          <div className="@container ui-desktop:-mt-space-2">
            <div className="flex flex-col gap-space-6 @min-[50rem]:grid @min-[50rem]:grid-cols-[minmax(0,1fr)_18.25rem] @min-[50rem]:items-start @min-[50rem]:gap-space-13">
              <section aria-labelledby="order-pieces">
                <h2 id="order-pieces" className="sr-only">
                  {d.pieces}
                </h2>
                <ul className="flex flex-col gap-space-3 ui-desktop:gap-space-6">
                  {order.lines.map((line) => (
                    <ProductOrderDetail key={line.key} line={line} />
                  ))}
                </ul>
              </section>
              <OrderSummary order={order} />
            </div>
          </div>
          <hr className="-mb-px hidden border-black-alpha-20 ui-desktop:block" />
          <section aria-label={`${d.shipmentMethod}, ${d.payment.toLowerCase()} and addresses`}>
            <OrderInfo order={order} />
          </section>
          <hr className="-mb-px border-black-alpha-20" />
          <RepairRequests />
        </div>
      </AccountShell>
    </main>
  );
}
