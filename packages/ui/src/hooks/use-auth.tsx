"use client";
import { useQuery } from "@tanstack/react-query";
import { getUserSessionQueryFn } from "@repo/ui/lib/api";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getUserSessionQueryFn,
    staleTime: Number.POSITIVE_INFINITY,
  });
  return query;
};

export default useAuth;
