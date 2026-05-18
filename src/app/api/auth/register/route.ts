import { NextRequest, NextResponse } from "next/server";

import { createUser, findUserByEmail, serializeUser } from "@/lib/users";
import { registerSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid registration details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const existing = await findUserByEmail(email);

  if (existing) {
    return NextResponse.json(
      { message: "Email already registered." },
      { status: 409 }
    );
  }

  const user = await createUser(email, password, "user");
  if (!user) {
    return NextResponse.json({ message: "Could not create user." }, { status: 500 });
  }

  return NextResponse.json({ user: serializeUser(user) }, { status: 201 });
}
