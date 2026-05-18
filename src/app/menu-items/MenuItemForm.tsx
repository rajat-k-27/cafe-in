"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useState, useTransition } from "react";

import type { MenuItem } from "@/lib/menu-items";

type MenuItemFormProps = {
  mode: "create" | "edit";
  initialItem?: MenuItem;
};

type FormState = {
  name: string;
  category: string;
  price: string;
  gstPercent: string;
  stock: string;
  isAvailable: boolean;
  isSeasonal: boolean;
  imageUrl: string;
  imagePublicId: string;
};

const categoryOptions = [
  "Coffee",
  "Tea",
  "Cold Brew",
  "Pastry",
  "Sandwich",
  "Seasonal",
  "Other",
];

export default function MenuItemForm({ mode, initialItem }: MenuItemFormProps) {
  const [form, setForm] = useState<FormState>({
    name: initialItem?.name ?? "",
    category: initialItem?.category ?? "",
    price: initialItem ? initialItem.price.toString() : "",
    gstPercent: initialItem ? initialItem.gstPercent.toString() : "5",
    stock: initialItem ? initialItem.stock.toString() : "20",
    isAvailable: initialItem?.isAvailable ?? true,
    isSeasonal: initialItem?.isSeasonal ?? false,
    imageUrl: initialItem?.imageUrl ?? "",
    imagePublicId: initialItem?.imagePublicId ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch(
        mode === "create"
          ? "/api/menu-items"
          : `/api/menu-items/${initialItem?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            category: form.category,
            price: form.price,
            gstPercent: form.gstPercent,
            stock: form.stock,
            isAvailable: form.isAvailable,
            isSeasonal: form.isSeasonal,
            imageUrl: form.imageUrl,
            imagePublicId: form.imagePublicId,
          }),
        }
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.message || "Something went wrong.");
        return;
      }

      router.push("/menu-items");
      router.refresh();
    });
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const signResponse = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "cafe-menu" }),
      });

      if (!signResponse.ok) {
        setUploadError("Unable to start upload.");
        return;
      }

      const signPayload = await signResponse.json();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signPayload.apiKey);
      formData.append("timestamp", signPayload.timestamp.toString());
      formData.append("signature", signPayload.signature);
      formData.append("folder", signPayload.folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signPayload.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        setUploadError("Upload failed. Try again.");
        return;
      }

      const uploaded = await uploadResponse.json();
      setForm((prev) => ({
        ...prev,
        imageUrl: uploaded.secure_url,
        imagePublicId: uploaded.public_id,
      }));
    } catch {
      setUploadError("Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-amber-100 bg-white/80 p-8 shadow-[0_25px_60px_-45px_rgba(79,44,26,0.45)]"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-amber-900" htmlFor="name">
            Item name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Honey oat latte"
            required
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-amber-950 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold text-amber-900"
            htmlFor="category"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-amber-950 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
          >
            <option value="" disabled>
              Select category
            </option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-amber-900" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="250"
            required
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-amber-950 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-amber-900" htmlFor="stock">
            Stock quantity
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            min="0"
            step="1"
            placeholder="20"
            required
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-amber-950 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold text-amber-900"
            htmlFor="gstPercent"
          >
            GST percent
          </label>
          <input
            id="gstPercent"
            name="gstPercent"
            type="number"
            value={form.gstPercent}
            onChange={handleChange}
            min="0"
            max="28"
            step="1"
            placeholder="5"
            required
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-amber-950 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <label className="flex items-center gap-3 text-sm font-semibold text-amber-900">
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
            className="h-4 w-4 rounded border-amber-300 text-amber-800 focus:ring-amber-200"
          />
          Available for order
        </label>

        <label className="flex items-center gap-3 text-sm font-semibold text-amber-900">
          <input
            type="checkbox"
            name="isSeasonal"
            checked={form.isSeasonal}
            onChange={handleChange}
            className="h-4 w-4 rounded border-amber-300 text-amber-800 focus:ring-amber-200"
          />
          Seasonal item
        </label>

        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-amber-900" htmlFor="image">
            Item image
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            {form.imageUrl ? (
              <img
                src={form.imageUrl}
                alt="Uploaded menu item"
                className="h-20 w-20 rounded-2xl border border-amber-100 object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-amber-200 text-xs text-amber-600">
                No image
              </div>
            )}
            <div>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="text-sm text-amber-900 file:mr-4 file:rounded-full file:border-0 file:bg-amber-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-amber-900 hover:file:bg-amber-300"
              />
              <p className="mt-2 text-xs text-amber-900/70">
                Upload a square image for best results.
              </p>
            </div>
          </div>
          {uploadError && (
            <p className="mt-3 text-xs font-semibold text-amber-700">
              {uploadError}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full bg-amber-800 px-6 py-3 text-sm font-semibold text-amber-50 shadow-md shadow-amber-900/20 transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mode === "create" ? "Create item" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/menu-items")}
          className="inline-flex items-center justify-center rounded-full border border-amber-200 px-6 py-3 text-sm font-semibold text-amber-800 transition hover:border-amber-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
