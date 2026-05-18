import { redirect } from "next/navigation";

import OrderForm from "@/app/orders/OrderForm";
import { getSessionFromCookies } from "@/lib/auth";
import { menuItemsCollection, serializeMenuItem } from "@/lib/menu-items";

export const dynamic = "force-dynamic";

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams?: { itemId?: string };
}) {
  const session = await getSessionFromCookies();
  if (!session) {
    const returnTo = searchParams?.itemId
      ? `/orders/new?itemId=${searchParams.itemId}`
      : "/orders/new";
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const collection = await menuItemsCollection();
  const items = await collection.find({ isAvailable: true }).sort({ name: 1 }).toArray();
  const serialized = items.map(serializeMenuItem);

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
          New order
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-amber-950">
          Place an order
        </h1>
        <p className="mt-2 text-sm text-amber-900/70">
          Choose your menu item, add delivery details, and confirm.
        </p>
      </div>
      <OrderForm items={serialized} />
    </div>
  );
}
