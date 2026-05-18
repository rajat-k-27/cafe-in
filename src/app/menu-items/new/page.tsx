import { redirect } from "next/navigation";

import MenuItemForm from "@/app/menu-items/MenuItemForm";
import { getSessionFromCookies } from "@/lib/auth";

export default async function NewMenuItemPage() {
  const session = await getSessionFromCookies();
  if (session?.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
          New item
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-amber-950">
          Add a menu item
        </h1>
        <p className="mt-2 text-sm text-amber-900/70">
          Capture pricing and availability in one place.
        </p>
      </div>
      <MenuItemForm mode="create" />
    </div>
  );
}
