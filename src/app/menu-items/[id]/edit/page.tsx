import { notFound, redirect } from "next/navigation";

import MenuItemForm from "@/app/menu-items/MenuItemForm";
import { getSessionFromCookies } from "@/lib/auth";
import {
  menuItemsCollection,
  parseObjectId,
  serializeMenuItem,
} from "@/lib/menu-items";

export const dynamic = "force-dynamic";

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSessionFromCookies();
  if (session?.role !== "admin") {
    redirect("/admin/login");
  }

  const { id } = await params;
  const objectId = parseObjectId(id);
  if (!objectId) {
    notFound();
  }

  const collection = await menuItemsCollection();
  const item = await collection.findOne({ _id: objectId });

  if (!item) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
          Edit item
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-amber-950">
          Update menu details
        </h1>
        <p className="mt-2 text-sm text-amber-900/70">
          Keep pricing and availability aligned with the floor team.
        </p>
      </div>
      <MenuItemForm mode="edit" initialItem={serializeMenuItem(item)} />
    </div>
  );
}
