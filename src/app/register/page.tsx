import { Suspense } from "react";

import AuthForm from "@/app/components/AuthForm";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <Suspense>
        <AuthForm
          mode="register"
          title="Create account"
          description="Register once to place cafe orders."
        />
      </Suspense>
    </div>
  );
}
