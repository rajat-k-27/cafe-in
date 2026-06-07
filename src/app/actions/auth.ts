"use server";

import { signSessionToken, setSessionCookieServerAction } from "@/lib/auth";
import { createUser, ensureAdminUser, findUserByEmail, serializeUser, verifyPassword } from "@/lib/users";
import { loginSchema, registerSchema } from "@/lib/validation";

export async function loginAction(formData: unknown) {
  const parsed = loginSchema.safeParse(formData);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Invalid login details." };
  }

  const { email, password, role } = parsed.data;

  if (role === "admin") {
    await ensureAdminUser();
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return { ok: false, message: "Invalid credentials." };
  }

  if (role === "admin" && user.role !== "admin") {
    return { ok: false, message: "Admin access only." };
  }

  const isValid = await verifyPassword(user.passwordHash, password);
  if (!isValid) {
    return { ok: false, message: "Invalid credentials." };
  }

  const token = await signSessionToken({
    id: user._id.toHexString(),
    email: user.email,
    role: user.role,
  });

  await setSessionCookieServerAction(token);
  return { ok: true, user: serializeUser(user) };
}

export async function registerAction(formData: unknown) {
  const parsed = registerSchema.safeParse(formData);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Invalid registration details." };
  }

  const { email, password } = parsed.data;
  const existing = await findUserByEmail(email);

  if (existing) {
    return { ok: false, message: "Email already registered." };
  }

  const user = await createUser(email, password, "user");
  if (!user) {
    return { ok: false, message: "Could not create user." };
  }

  return { ok: true, user: serializeUser(user) };
}
