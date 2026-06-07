"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { loginAction, registerAction } from "@/app/actions/auth";

type AuthFormProps = {
  mode: "login" | "admin" | "register";
  title: string;
  description: string;
};

export default function AuthForm({ mode, title, description }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/menu-items";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      let result;
      if (mode === "register") {
        result = await registerAction({ email, password });
      } else {
        result = await loginAction({ email, password, role: mode === "admin" ? "admin" : "user" });
      }

      if (!result.ok) {
        setError(result.message || "Something went wrong.");
        return;
      }

      if (mode === "register") {
        router.push("/login");
        return;
      }

      router.push(returnTo);
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-amber-100 bg-white/80 p-8 shadow-[0_25px_60px_-45px_rgba(79,44,26,0.45)]"
    >
      <h1 className="text-2xl font-semibold text-amber-950">{title}</h1>
      <p className="mt-2 text-sm text-amber-900/70">{description}</p>

      <div className="mt-6 grid gap-4">
        <div>
          <label className="text-sm font-semibold text-amber-900" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-amber-950 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
          />
        </div>
        <div>
          <label
            className="text-sm font-semibold text-amber-900"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
            }}
            required
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-amber-950 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full bg-amber-800 px-6 py-3 text-sm font-semibold text-amber-50 shadow-md shadow-amber-900/20 transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mode === "register" ? "Create account" : "Sign in"}
        </button>
      </div>
    </form>
  );
}
