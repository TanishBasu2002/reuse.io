import { Suspense } from "react";
import { VerifyMfa } from "@repo/ui/components/auth/verify";

const Page = () => {
  return (
    <Suspense>
      <VerifyMfa />
    </Suspense>
  );
};

export default Page;
