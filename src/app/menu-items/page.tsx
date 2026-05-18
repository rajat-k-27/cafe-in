import MenuItemsClient from "@/app/menu-items/MenuItemsClient";
import { getSessionFromCookies } from "@/lib/auth";
import { menuItemsCollection, serializeMenuItem } from "@/lib/menu-items";

export const dynamic = "force-dynamic";

export default async function MenuItemsPage() {
  const collection = await menuItemsCollection();
  const items = await collection.find().sort({ createdAt: -1 }).toArray();
  const serialized = items.map(serializeMenuItem);
  const session = await getSessionFromCookies();
  const isAdmin = session?.role === "admin";
  const isLoggedIn = Boolean(session);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <MenuItemsClient
        initialItems={serialized}
        isAdmin={isAdmin}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
