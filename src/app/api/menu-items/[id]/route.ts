import { NextRequest, NextResponse } from "next/server";

import {
  menuItemsCollection,
  parseObjectId,
  serializeMenuItem,
} from "@/lib/menu-items";
import { requireAdmin } from "@/lib/auth";
import { menuItemInputSchema } from "@/lib/validation";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const objectId = parseObjectId(id);
  if (!objectId) {
    return NextResponse.json({ message: "Invalid id." }, { status: 400 });
  }

  const collection = await menuItemsCollection();
  const item = await collection.findOne({ _id: objectId });

  if (!item) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ item: serializeMenuItem(item) });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response as NextResponse;
  }

  const { id } = await context.params;
  const objectId = parseObjectId(id);
  if (!objectId) {
    return NextResponse.json({ message: "Invalid id." }, { status: 400 });
  }

  const body = await request.json();
  const parsed = menuItemInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const collection = await menuItemsCollection();
  const result = await collection.findOneAndUpdate(
    { _id: objectId },
    {
      $set: {
        ...parsed.data,
        gstPercent: parsed.data.gstPercent ?? 0,
        stock: parsed.data.stock ?? 0,
        imageUrl: parsed.data.imageUrl || "",
        imagePublicId: parsed.data.imagePublicId || "",
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (!result) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ item: serializeMenuItem(result) });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(_request);
  if (!auth.ok) {
    return auth.response as NextResponse;
  }

  const { id } = await context.params;
  const objectId = parseObjectId(id);
  if (!objectId) {
    return NextResponse.json({ message: "Invalid id." }, { status: 400 });
  }

  const collection = await menuItemsCollection();
  const result = await collection.deleteOne({ _id: objectId });

  if (!result.deletedCount) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
