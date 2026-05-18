import { Suspense } from "react";

import AuthForm from "@/app/components/AuthForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <Suspense>
        <AuthForm
          mode="login"
          title="Sign in"
          description="Log in to place orders and manage your account."
        />
      </Suspense>
    </div>
  );
}
