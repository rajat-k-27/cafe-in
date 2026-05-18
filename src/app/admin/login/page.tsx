import { Suspense } from "react";

import AuthForm from "@/app/components/AuthForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <Suspense>
        <AuthForm
          mode="admin"
          title="Admin login"
          description="Admins can add, edit, and manage menu items."
        />
      </Suspense>
      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-xs text-amber-900">
        <p className="font-semibold text-amber-950">Demo admin access</p>
        <p className="mt-2">Email: admin@gmail.com</p>
        <p>Password: admin1234</p>
        {/* <p className="mt-2 text-amber-700">
          Admin can manage stock, pricing, and availability.
        </p> */}
      </div>
    </div>
  );
}
