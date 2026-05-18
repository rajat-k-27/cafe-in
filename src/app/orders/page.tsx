import { redirect } from "next/navigation";

import { getSessionFromCookies } from "@/lib/auth";
import { ordersCollection, serializeOrder } from "@/lib/orders";
import { parseUserId } from "@/lib/users";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect("/login?returnTo=/orders");
  }

  const userId = parseUserId(session.id);
  if (!userId) {
    redirect("/login");
  }

  const collection = await ordersCollection();
  const orders = await collection.find({ userId }).sort({ createdAt: -1 }).toArray();
  const serialized = orders.map(serializeOrder);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
          Your orders
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-amber-950">
          Order history
        </h1>
        <p className="mt-2 text-sm text-amber-900/70">
          Track recent orders and totals in one place.
        </p>
      </div>

      <div className="rounded-3xl border border-amber-100 bg-white/80 p-8 shadow-[0_25px_60px_-45px_rgba(79,44,26,0.45)]">
        {serialized.length === 0 ? (
          <div className="text-sm text-amber-900/70">
            No orders yet. Place your first order.
          </div>
        ) : (
          <div className="space-y-4">
            {serialized.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-amber-100 bg-white px-5 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-amber-950">
                      {order.item.name} · Qty {order.item.quantity}
                    </p>
                    <p className="text-xs text-amber-700">
                      GST {order.item.gstPercent}% · {formatPrice(order.total)}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {order.status}
                  </span>
                </div>
                <div className="mt-3 text-xs text-amber-900/70">
                  Delivered to: {order.address} · Phone: {order.phone}
                </div>
                {order.notes && (
                  <div className="mt-2 text-xs text-amber-900/70">
                    Notes: {order.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
