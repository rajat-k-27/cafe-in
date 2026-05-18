import { NextRequest, NextResponse } from "next/server";

import { signSessionToken, setSessionCookie } from "@/lib/auth";
import { ensureAdminUser, findUserByEmail, serializeUser, verifyPassword } from "@/lib/users";
import { loginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid login details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { email, password, role } = parsed.data;

  if (role === "admin") {
    await ensureAdminUser();
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
  }

  if (role === "admin" && user.role !== "admin") {
    return NextResponse.json({ message: "Admin access only." }, { status: 403 });
  }

  const isValid = await verifyPassword(user.passwordHash, password);
  if (!isValid) {
    return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
  }

  const token = await signSessionToken({
    id: user._id.toHexString(),
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({ user: serializeUser(user) });
  setSessionCookie(response, token);
  return response;
}
