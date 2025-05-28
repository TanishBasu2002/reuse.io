import { Suspense } from "react";
import { SignUp } from "@repo/ui/components/auth/sign-up";

const Page = () => {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
};

export default Page;
