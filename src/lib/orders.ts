import { Collection, ObjectId, WithId } from "mongodb";

import { getDb } from "@/lib/db";

export type OrderItemSnapshot = {
  menuItemId: ObjectId;
  name: string;
  price: number;
  gstPercent: number;
  quantity: number;
};

export type OrderDocument = {
  userId: ObjectId;
  item: OrderItemSnapshot;
  address: string;
  phone: string;
  notes?: string;
  subTotal: number;
  gstAmount: number;
  total: number;
  status: "placed" | "cancelled";
  createdAt: Date;
  updatedAt?: Date;
};

export type OrderRecord = WithId<OrderDocument>;

export async function ordersCollection(): Promise<Collection<OrderDocument>> {
  const db = await getDb();
  return db.collection<OrderDocument>("orders");
}

export function serializeOrder(order: OrderRecord) {
  return {
    id: order._id.toHexString(),
    item: {
      menuItemId: order.item.menuItemId.toHexString(),
      name: order.item.name,
      price: order.item.price,
      gstPercent: order.item.gstPercent,
      quantity: order.item.quantity,
    },
    address: order.address,
    phone: order.phone,
    notes: order.notes ?? "",
    subTotal: order.subTotal,
    gstAmount: order.gstAmount,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt ? order.updatedAt.toISOString() : "",
  };
}
