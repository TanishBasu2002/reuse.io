"use client";

import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";
import type { Auction } from "@repo/ui/types/index";
import { getAuctions } from "@repo/ui/lib/chat";
import { AuctionCard } from "@repo/ui/components/chat/auction-card";
import {
  connectSocket,
  onAuctionUpdated,
  onNewAuction,
} from "@repo/ui/lib/socket";

export function AuctionList() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuctions = async () => {
      try {
        const fetchedAuctions = await getAuctions();
        setAuctions(fetchedAuctions);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load auctions:", error);
        setLoading(false);
      }
    };

    loadAuctions();

    // Connect to socket and listen for updates
    const userId = localStorage.getItem("userId");
    if (userId) {
      connectSocket(userId);

      // Listen for new auctions
      onNewAuction((newAuction: Auction) => {
        setAuctions((prevAuctions) => [newAuction, ...prevAuctions]);
      });

      // Listen for auction updates
      onAuctionUpdated((updatedAuction: Auction) => {
        setAuctions((prevAuctions: Auction[]) =>
          prevAuctions.map((auction: Auction) =>
            auction.id === updatedAuction.id ? updatedAuction : auction,
          ),
        );
      });
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No auctions available</h3>
        <p className="text-muted-foreground mt-2">
          Check back later or create a new auction
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
}
