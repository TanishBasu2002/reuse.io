"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ChevronLeft } from "lucide-react";
import type { Auction, User, Bid } from "@repo/ui/types/index";
import { getAuctionById } from "@repo/ui/lib/chat";
import {
  connectSocket,
  joinAuctionRoom,
  leaveAuctionRoom,
  onAuctionUpdated,
  onNewBid,
} from "@repo/ui/lib/socket";
import { toast } from "sonner";
import { Button } from "@repo/ui/components/ui/button";
import { AuctionTimer } from "@repo/ui/components/chat/auction-timer";
import { BidForm } from "@repo/ui/components/chat/bid-form";
import { BidHistory } from "@repo/ui/components/chat/bid-history";

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
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

    // Load auction data
    const loadAuction = async () => {
      try {
        const auctionData = await getAuctionById(id ? id : "");
        setAuction(auctionData);
        setLoading(false);

        // Connect to socket if needed
        if (userId) {
          connectSocket(userId);
          if (id) {
            joinAuctionRoom(id);
          }

          // Listen for bid updates
          onNewBid((newBid) => {
            if (newBid.auctionId === id) {
              setAuction((prev) => {
                if (!prev) return prev;

                const updatedBids = [newBid, ...(prev.bids || [])];
                return {
                  ...prev,
                  currentPrice: newBid.amount,
                  bids: updatedBids,
                };
              });

              // Show toast for new bids (except own bids)
              if (newBid.userId !== userId) {
                toast("New bid placed!", {
                  description: `${newBid.user?.name || "Someone"} placed a bid of $${newBid.amount.toFixed(2)}`,
                });
              }
            }
          });

          // Listen for auction updates
          onAuctionUpdated((updatedAuction) => {
            if (updatedAuction.id === id) {
              setAuction((prev) => {
                if (!prev) return updatedAuction;
                return {
                  ...updatedAuction,
                  bids: prev.bids, // Keep the bids we already have
                };
              });
            }
          });
        }
      } catch (error) {
        console.error("Failed to load auction:", error);
        toast.error("Error", {
          description: "Failed to load auction details",
        });
        setLoading(false);
      }
    };

    // Cleanup
    return () => {
      if (id) {
        leaveAuctionRoom(id);
      }
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Auction Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The auction you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => router.push("/auctions")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Auctions
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Button
        variant="outline"
        onClick={() => router.push("/auctions")}
        className="mb-6"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Auctions
      </Button>

      <h1 className="text-3xl font-bold mb-6">{auction.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Auction Image */}
          <div className="h-64 md:h-96 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {auction.imageUrl ? (
              <img
                src={auction.imageUrl}
                alt={auction.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No image available</p>
              </div>
            )}
          </div>

          {/* Auction Timer */}
          <AuctionTimer
            startTime={auction.startTime}
            endTime={auction.endTime}
            status={auction.status}
          />

          {/* Auction Details */}
          <div className="prose dark:prose-invert max-w-none">
            <h2>Description</h2>
            <p>{auction.description}</p>

            <div className="mt-4 not-prose">
              <p className="text-sm text-muted-foreground">
                Listed by{" "}
                <span className="font-medium">
                  {auction.user?.name || "Unknown"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Bid Form */}
          <BidForm auction={auction} currentUser={currentUser} />

          {/* Bid History */}
          <BidHistory bids={auction.bids || []} />
        </div>
      </div>
    </div>
  );
}
