"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@repo/ui/types/index";
import { Button } from "@repo/ui/components/ui/button";
import { Plus } from "lucide-react";
import { AuctionList } from "@repo/ui/components/chat/auction-list";

export default function AuctionsPage() {
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Auctions</h1>

        <Button onClick={() => router.push("/auction/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Auction
        </Button>
      </div>

      <AuctionList />
    </div>
  );
}
