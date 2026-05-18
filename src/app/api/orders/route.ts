import { NextRequest, NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { menuItemsCollection, parseObjectId } from "@/lib/menu-items";
import { ordersCollection, serializeOrder } from "@/lib/orders";
import { orderInputSchema } from "@/lib/validation";
import { parseUserId } from "@/lib/users";

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if (!auth.ok) {
    return auth.response as NextResponse;
  }

  const session = auth.session!;
  const userId = parseUserId(session.id);
  if (!userId) {
    return NextResponse.json({ message: "Invalid user." }, { status: 400 });
  }

  const collection = await ordersCollection();
  const orders = await collection.find({ userId }).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ orders: orders.map(serializeOrder) });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if (!auth.ok) {
    return auth.response as NextResponse;
  }

  const body = await request.json();
  const parsed = orderInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid order details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const session = auth.session!;
  const userId = parseUserId(session.id);
  if (!userId) {
    return NextResponse.json({ message: "Invalid user." }, { status: 400 });
  }

  const menuItemId = parseObjectId(parsed.data.menuItemId);
  if (!menuItemId) {
    return NextResponse.json({ message: "Invalid menu item." }, { status: 400 });
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
    return NextResponse.json(
      { message: "This item is out of stock." },
      { status: 400 }
    );
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
    return NextResponse.json({ message: "Order created but not found." }, { status: 500 });
  }

  return NextResponse.json({ order: serializeOrder(created) }, { status: 201 });
}
