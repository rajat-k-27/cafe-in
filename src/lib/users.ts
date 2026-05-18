import bcrypt from "bcryptjs";
import { Collection, ObjectId, WithId } from "mongodb";

import { getDb } from "@/lib/db";

export type UserDocument = {
  email: string;
  passwordHash: string;
  role: "admin" | "user";
  createdAt: Date;
};

export type UserRecord = WithId<UserDocument>;

export async function usersCollection(): Promise<Collection<UserDocument>> {
  const db = await getDb();
  return db.collection<UserDocument>("users");
}

export async function findUserByEmail(email: string) {
  const collection = await usersCollection();
  return collection.findOne({ email: email.toLowerCase() });
}

export async function createUser(
  email: string,
  password: string,
  role: "admin" | "user"
) {
  const collection = await usersCollection();
  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date();
  const result = await collection.insertOne({
    email: email.toLowerCase(),
    passwordHash,
    role,
    createdAt: now,
  });

  return collection.findOne({ _id: result.insertedId });
}

export async function verifyPassword(hash: string, password: string) {
  return bcrypt.compare(password, hash);
}

export async function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return null;
  }

  const existing = await findUserByEmail(adminEmail);
  if (existing) {
    return existing;
  }

  return createUser(adminEmail, adminPassword, "admin");
}

export function serializeUser(user: UserRecord) {
  return {
    id: user._id.toHexString(),
    email: user.email,
    role: user.role,
  };
}

export function parseUserId(id: string) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return new ObjectId(id);
}
