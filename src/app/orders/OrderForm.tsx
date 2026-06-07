"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useState, useTransition } from "react";
import { createOrderAction } from "@/app/actions/orders";

import type { MenuItem } from "@/lib/menu-items";

type OrderFormProps = {
  items: MenuItem[];
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function OrderForm({ items }: OrderFormProps) {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("itemId") || "";
  const router = useRouter();
  const [form, setForm] = useState({
    menuItemId: preselected,
    quantity: "1",
    address: "",
    phone: "",
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedItem = items.find((item) => item.id === form.menuItemId);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await createOrderAction({
        menuItemId: form.menuItemId,
        quantity: form.quantity,
        address: form.address,
        phone: form.phone,
        notes: form.notes,
      });

      if (!result.ok) {
        setError(result.message || "Order failed.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/orders");
        router.refresh();
      }, 2000);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-amber-100 bg-white/80 p-8 shadow-[0_25px_60px_-45px_rgba(79,44,26,0.45)]"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-amber-900" htmlFor="menuItemId">
            Menu item
          </label>
          <select
            id="menuItemId"
            name="menuItemId"
            value={form.menuItemId}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-amber-950 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
          >
            <option value="" disabled>
              Select a menu item
            </option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {formatPrice(item.price)} · GST {item.gstPercent}%
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-amber-900" htmlFor="quantity">
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-amber-950 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-amber-900" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-amber-950 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-amber-900" htmlFor="address">
            Delivery address
          </label>
          <input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-amber-950 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-amber-900" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-amber-950 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
          />
        </div>
      </div>

      {selectedItem && (
        <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Selected: {selectedItem.name} · {formatPrice(selectedItem.price)} · GST {selectedItem.gstPercent}%
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      {success && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
          Your order has been successfully placed! Redirecting...
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending || success}
          className="inline-flex items-center justify-center rounded-full bg-amber-800 px-6 py-3 text-sm font-semibold text-amber-50 shadow-md shadow-amber-900/20 transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Place order
        </button>
      </div>
    </form>
  );
}
