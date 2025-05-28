"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { User } from "@repo/ui/types/index";
import { Button } from "@repo/ui/components/ui/button";
import { CreateAuctionForm } from "@repo/ui/components/chat/create-auction-form";

export default function CreateAuctionPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user from localStorage
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    if (userId && userName) {
      setCurrentUser({
        id: userId,
        name: userName,
      } as User);
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Button
        variant="outline"
        onClick={() => router.push("/auctions")}
        className="mb-6"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Auctions
      </Button>

      <h1 className="text-3xl font-bold mb-8">Create New Auction</h1>

      <CreateAuctionForm currentUser={currentUser} />
    </div>
  );
}
