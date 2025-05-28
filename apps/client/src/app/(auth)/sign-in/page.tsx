import { Suspense } from "react";
import { Login } from "@repo/ui/components/auth/sign-in";

export default function HomePage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
