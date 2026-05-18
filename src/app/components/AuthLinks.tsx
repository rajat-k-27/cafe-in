import Link from "next/link";

import { getSessionFromCookies } from "@/lib/auth";

export default async function AuthLinks() {
  const session = await getSessionFromCookies();

  if (!session) {
    return (
      <div className="flex items-center gap-4 text-sm font-semibold text-amber-800">
        <Link className="hover:text-amber-950" href="/login">
          Login
        </Link>
        <Link className="hover:text-amber-950" href="/register">
          Register
        </Link>
        <Link className="hover:text-amber-950" href="/admin/login">
          Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm font-semibold text-amber-800">
      {session.role === "user" ? (
        <Link className="hover:text-amber-950" href="/orders">
          Orders
        </Link>
      ) : (
        <Link className="hover:text-amber-950" href="/admin/orders">
          Admin orders
        </Link>
      )}
      <form action="/api/auth/logout" method="post">
        <button
          type="submit"
          className="rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800 transition hover:border-amber-300"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
