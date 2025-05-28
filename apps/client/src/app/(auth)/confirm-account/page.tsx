import React, { Suspense } from "react";
import { ConfirmAccount } from "@repo/ui/components/auth/confirm-account";

const Page = () => {
  return (
    <Suspense>
      <ConfirmAccount />
    </Suspense>
  );
};

export default Page;
