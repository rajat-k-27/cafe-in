import { Collection, ObjectId, WithId } from "mongodb";

import { getDb } from "@/lib/db";

export type MenuItemDocument = {
  name: string;
  category: string;
  price: number;
  gstPercent: number;
  stock: number;
  isAvailable: boolean;
  isSeasonal: boolean;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MenuItemRecord = WithId<MenuItemDocument>;

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  gstPercent: number;
  stock: number;
  isAvailable: boolean;
  isSeasonal: boolean;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt: string;
  updatedAt: string;
};

export async function menuItemsCollection(): Promise<Collection<MenuItemDocument>> {
  const db = await getDb();
  return db.collection<MenuItemDocument>("menu_items");
}

export function serializeMenuItem(item: MenuItemRecord): MenuItem {
  return {
    id: item._id.toHexString(),
    name: item.name,
    category: item.category,
    price: item.price,
    gstPercent: item.gstPercent ?? 0,
    stock: item.stock ?? 0,
    isAvailable: item.isAvailable,
    isSeasonal: item.isSeasonal,
    imageUrl: item.imageUrl ?? "",
    imagePublicId: item.imagePublicId ?? "",
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export function parseObjectId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return new ObjectId(id);
}
