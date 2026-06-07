"use server";

import { getSessionFromCookies } from "@/lib/auth";
import { menuItemsCollection, parseObjectId } from "@/lib/menu-items";
import { ordersCollection, serializeOrder } from "@/lib/orders";
import { orderInputSchema } from "@/lib/validation";
import { parseUserId } from "@/lib/users";

export async function createOrderAction(formData: unknown) {
  const session = await getSessionFromCookies();
  if (!session) {
    return { ok: false, message: "Unauthorized." };
  }

  const parsed = orderInputSchema.safeParse(formData);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Invalid order details." };
  }

  const userId = parseUserId(session.id);
  if (!userId) {
    return { ok: false, message: "Invalid user." };
  }

  const menuItemId = parseObjectId(parsed.data.menuItemId);
  if (!menuItemId) {
    return { ok: false, message: "Invalid menu item." };
  }

  const quantity = parsed.data.quantity;
  const menuCollection = await menuItemsCollection();
  const updated = await menuCollection.findOneAndUpdate(
    {
      _id: menuItemId,
      isAvailable: true,
      stock: { $gte: quantity },
    },
    { $inc: { stock: -quantity }, $set: { updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!updated) {
    return { ok: false, message: "This item is out of stock." };
  }

  const item = updated;
  const subTotal = item.price * quantity;
  const gstPercent = item.gstPercent ?? 0;
  const gstAmount = (subTotal * gstPercent) / 100;
  const total = subTotal + gstAmount;

  const collection = await ordersCollection();
  const now = new Date();
  const result = await collection.insertOne({
    userId,
    item: {
      menuItemId,
      name: item.name,
      price: item.price,
      gstPercent,
      quantity,
    },
    address: parsed.data.address,
    phone: parsed.data.phone,
    notes: parsed.data.notes || "",
    subTotal,
    gstAmount,
    total,
    status: "placed",
    createdAt: now,
    updatedAt: now,
  });

  const created = await collection.findOne({ _id: result.insertedId });
  if (!created) {
    return { ok: false, message: "Order created but not found." };
  }

  return { ok: true, order: serializeOrder(created) };
}
