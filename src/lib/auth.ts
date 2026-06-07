import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

export type SessionUser = {
  id: string;
  email: string;
  role: "admin" | "user";
};

const COOKIE_NAME = "cafe_session";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_SECRET in environment variables.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(user: SessionUser) {
  return new SignJWT({ role: user.role, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || !payload.email || !payload.role) {
      return null;
    }

    return {
      id: payload.sub,
      email: String(payload.email),
      role: payload.role === "admin" ? "admin" : "user",
    } as SessionUser;
  } catch {
    return null;
  }
}

export async function getSessionFromCookies() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function setSessionCookieServerAction(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function clearSessionCookieServerAction() {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function requireAdmin(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return { ok: false, response: Response.json({ message: "Unauthorized." }, { status: 401 }) };
  }
  if (session.role !== "admin") {
    return { ok: false, response: Response.json({ message: "Forbidden." }, { status: 403 }) };
  }
  return { ok: true, session };
}

export async function requireUser(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return { ok: false, response: Response.json({ message: "Unauthorized." }, { status: 401 }) };
  }
  return { ok: true, session };
}
