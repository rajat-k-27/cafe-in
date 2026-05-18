import { NextRequest, NextResponse } from "next/server";

import { menuItemsCollection, serializeMenuItem } from "@/lib/menu-items";
import { requireAdmin } from "@/lib/auth";
import { menuItemInputSchema } from "@/lib/validation";

export async function GET() {
  const collection = await menuItemsCollection();
  const items = await collection.find().sort({ createdAt: -1 }).toArray();

  return NextResponse.json({ items: items.map(serializeMenuItem) });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const body = await request.json();
  const parsed = menuItemInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const now = new Date();
  const collection = await menuItemsCollection();
  const result = await collection.insertOne({
    ...parsed.data,
    gstPercent: parsed.data.gstPercent ?? 0,
    stock: parsed.data.stock ?? 0,
    imageUrl: parsed.data.imageUrl || "",
    imagePublicId: parsed.data.imagePublicId || "",
    createdAt: now,
    updatedAt: now,
  });

  const created = await collection.findOne({ _id: result.insertedId });

  if (!created) {
    return NextResponse.json(
      { message: "Item created but could not be loaded." },
      { status: 500 }
    );
  }

  return NextResponse.json({ item: serializeMenuItem(created) }, { status: 201 });
}
