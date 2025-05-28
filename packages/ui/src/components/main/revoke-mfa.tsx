"use client";
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { revokeMFAMutationFn } from "@repo/ui/lib/api";
import { toast } from "sonner";
import { Button } from "@repo/ui/components/ui/button";

const RevokeMfa = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: revokeMFAMutationFn,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      toast("Success", {
        description: response.message,
      });
    },
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    onError: (error: any) => {
      toast.error("Error", {
        description: error.message,
      });
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleClick = useCallback(() => {
    mutate();
  }, []);

  return (
    <Button
      disabled={isPending}
      className="h-[35px] !text-[#c40006d3] !bg-red-100 shadow-none mr-1"
      onClick={handleClick}
    >
      {isPending && <Loader className="animate-spin" />}
      Revoke Access
    </Button>
  );
};

export { RevokeMfa };
