"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { MenuItem } from "@/lib/menu-items";

type MenuItemsClientProps = {
  initialItems: MenuItem[];
  isAdmin: boolean;
  isLoggedIn: boolean;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function MenuItemsClient({
  initialItems,
  isAdmin,
  isLoggedIn,
}: MenuItemsClientProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = (id: string) => {
    if (!confirm("Delete this menu item?")) {
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    });
  };

  return (
    <div className="rounded-3xl border border-amber-100 bg-white/80 p-8 shadow-[0_25px_60px_-45px_rgba(79,44,26,0.45)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-amber-950">Menu items</h2>
          <p className="mt-1 text-sm text-amber-900/70">
            Track pricing, availability, and seasonal rotations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800">
            {items.length} items
          </span>
          {isAdmin ? (
            <Link
              href="/menu-items/new"
              className="inline-flex items-center justify-center rounded-full bg-amber-800 px-5 py-2 text-sm font-semibold text-amber-50 shadow-md shadow-amber-900/20 transition hover:bg-amber-900"
            >
              Add item
            </Link>
          ) : (
            <Link
              href="/orders/new"
              className="inline-flex items-center justify-center rounded-full border border-amber-200 px-5 py-2 text-sm font-semibold text-amber-800 transition hover:border-amber-300"
            >
              Place order
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-amber-700">
            <tr>
              <th className="py-3">Image</th>
              <th className="py-3">Item</th>
              <th className="py-3">Category</th>
              <th className="py-3">Price</th>
              <th className="py-3">Stock</th>
              <th className="py-3">Availability</th>
              <th className="py-3">Seasonal</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100">
            {items.map((item) => (
              <tr key={item.id} className="text-amber-950">
                <td className="py-4">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-12 w-12 rounded-xl border border-amber-100 object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl border border-dashed border-amber-200 bg-amber-50" />
                  )}
                </td>
                <td className="py-4 font-semibold">{item.name}</td>
                <td className="py-4 text-amber-900/80">{item.category}</td>
                <td className="py-4 text-amber-900/80">
                  <div>{formatPrice(item.price)}</div>
                  <div className="text-xs text-amber-700">
                    GST {item.gstPercent}%
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.stock > 0
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {item.stock > 0 ? `${item.stock} left` : "Out of stock"}
                  </span>
                </td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.isAvailable
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Paused"}
                  </span>
                </td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.isSeasonal
                        ? "bg-amber-200 text-amber-900"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {item.isSeasonal ? "Seasonal" : "Year-round"}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {isAdmin ? (
                      <>
                        <Link
                          href={`/menu-items/${item.id}/edit`}
                          className="rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800 transition hover:border-amber-300"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={isPending}
                          className="rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800 transition hover:border-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </>
                    ) : isLoggedIn ? (
                      <Link
                        href={`/orders/new?itemId=${item.id}`}
                        className={`rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800 transition hover:border-amber-300 ${
                          item.isAvailable && item.stock > 0
                            ? ""
                            : "pointer-events-none opacity-50"
                        }`}
                      >
                        {item.stock > 0 ? "Order" : "Out of stock"}
                      </Link>
                    ) : (
                      <Link
                        href={`/login?returnTo=${encodeURIComponent(
                          `/orders/new?itemId=${item.id}`
                        )}`}
                        className={`rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800 transition hover:border-amber-300 ${
                          item.isAvailable && item.stock > 0
                            ? ""
                            : "pointer-events-none opacity-50"
                        }`}
                      >
                        {item.stock > 0 ? "Login to order" : "Out of stock"}
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!items.length && (
          <div className="py-10 text-center text-sm text-amber-900/70">
            No items yet. Add the first menu item to get started.
          </div>
        )}
      </div>
    </div>
  );
}
