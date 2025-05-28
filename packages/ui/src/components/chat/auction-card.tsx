import { formatDistanceToNow, isPast, parseISO } from "date-fns";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

import { Clock, Gavel, User } from "lucide-react";
import type { Auction } from "@repo/ui/types/index";
import { Badge } from "@repo/ui/components/ui/badge";

interface AuctionCardProps {
  auction: Auction;
}

export function AuctionCard({ auction }: AuctionCardProps) {
  // Format dates
  const startTime =
    typeof auction.startTime === "string"
      ? parseISO(auction.startTime)
      : auction.startTime;

  const endTime =
    typeof auction.endTime === "string"
      ? parseISO(auction.endTime)
      : auction.endTime;

  const isEnded = isPast(endTime);
  const isPending = auction.status === "PENDING";
  const isActive = auction.status === "ACTIVE";

  // Calculate time remaining or time passed
  const timeText = isEnded
    ? `Ended ${formatDistanceToNow(endTime, { addSuffix: true })}`
    : isPending
      ? `Starts ${formatDistanceToNow(startTime, { addSuffix: true })}`
      : `Ends ${formatDistanceToNow(endTime, { addSuffix: true })}`;

  return (
    <Link href={`/auction/${auction.id}`}>
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="line-clamp-2">{auction.title}</CardTitle>
            <Badge
              variant={
                isActive ? "default" : isPending ? "outline" : "secondary"
              }
              className="ml-2 shrink-0"
            >
              {auction.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-32 mb-4 bg-muted rounded-md flex items-center justify-center overflow-hidden">
            {auction.imageUrl ? (
              <img
                src={auction.imageUrl}
                alt={auction.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Gavel className="h-12 w-12 text-muted-foreground/40" />
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {auction.description}
          </p>

          <div className="flex items-center text-sm space-x-1 text-muted-foreground mb-2">
            <User className="h-3.5 w-3.5" />
            <span>{auction.user?.name || "Unknown"}</span>
          </div>

          <div className="flex items-center text-sm space-x-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeText}</span>
          </div>
        </CardContent>

        <CardFooter>
          <div className="w-full flex justify-between items-center">
            <div className="text-sm">Current Price</div>
            <div className="text-lg font-bold">
              ${auction.currentPrice.toFixed(2)}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
