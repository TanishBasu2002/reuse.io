import React, { Suspense } from "react";
import { ForgotPassword } from "@repo/ui/components/auth/forgot-password";

const Page = () => {
  return (
    <Suspense>
      <ForgotPassword />
    </Suspense>
  );
};

export default Page;
