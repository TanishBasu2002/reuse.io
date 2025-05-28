"use client";

import { useState, type SetStateAction } from "react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Auction, User } from "@repo/ui/types/index";
import { toast } from "sonner";
import { placeBid } from "@repo/ui/lib/chat";

interface BidFormProps {
  auction: Auction;
  currentUser: User | null;
}

export function BidForm({ auction, currentUser }: BidFormProps) {
  const [bidAmount, setBidAmount] = useState<string>(
    (auction.currentPrice + 1).toFixed(2),
  );
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Login required", {
        description: "Please login to place a bid",
      });
      router.push("/chat");
      return;
    }

    if (auction.status !== "ACTIVE") {
      toast.error("Cannot place bid", {
        description: "This auction is not currently active",
      });
      return;
    }

    const amount = Number.parseFloat(bidAmount);

    if (Number.isNaN(amount) || amount <= auction.currentPrice) {
      toast.error("Invalid bid amount", {
        description: `Bid must be higher than current price: $${auction.currentPrice.toFixed(2)}`,
      });
      return;
    }

    try {
      setSubmitting(true);
      await placeBid(auction.id, amount, currentUser.id);
      toast("Bid placed successfully!", {
        description: `Your bid of $${amount.toFixed(2)} has been accepted`,
      });
      setBidAmount((amount + 1).toFixed(2));
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      toast.error("Bid failed", {
        description: error.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled =
    submitting ||
    auction.status !== "ACTIVE" ||
    !currentUser ||
    (auction.user && auction.user.id === currentUser?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place a Bid</CardTitle>
      </CardHeader>
      <CardContent>
        {auction.user && auction.user.id === currentUser?.id ? (
          <p className="text-center text-muted-foreground py-2">
            You cannot bid on your own auction
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bidAmount">Bid Amount ($)</Label>
                <div className="flex mt-1.5">
                  <Input
                    id="bidAmount"
                    type="number"
                    value={bidAmount}
                    onChange={(e: {
                      target: { value: SetStateAction<string> };
                    }) => setBidAmount(e.target.value)}
                    min={auction.currentPrice + 0.01}
                    step="0.01"
                    disabled={isDisabled}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isDisabled} className="ml-2">
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Bidding...
                      </>
                    ) : (
                      "Place Bid"
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-sm">
                <p className="font-medium">
                  Current price:{" "}
                  <span className="text-primary">
                    ${auction.currentPrice.toFixed(2)}
                  </span>
                </p>
                <p className="text-muted-foreground mt-1">
                  {auction.status === "ACTIVE"
                    ? "Your bid must be higher than the current price"
                    : auction.status === "PENDING"
                      ? "This auction hasn't started yet"
                      : "This auction has ended"}
                </p>
                {!currentUser && (
                  <p className="text-yellow-600 dark:text-yellow-500 mt-2">
                    Please log in to place a bid
                  </p>
                )}
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
