import { format, parseISO } from "date-fns";

import { ArrowDownRight } from "lucide-react";
import type { Bid } from "@repo/ui/types/index";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";

interface BidHistoryProps {
  bids: Bid[];
}

export function BidHistory({ bids }: BidHistoryProps) {
  if (bids.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bid History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">No bids yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bid History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <ul className="divide-y">
            {bids.map((bid) => {
              const bidTime =
                typeof bid.createdAt === "string"
                  ? parseISO(bid.createdAt)
                  : bid.createdAt;

              return (
                <li
                  key={bid.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center">
                    <ArrowDownRight className="h-4 w-4 text-green-500 mr-2" />
                    <div>
                      <p className="font-medium">
                        {bid.user?.name || "Unknown user"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(bidTime, "MMM dd, yyyy HH:mm")}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">
                    ${bid.amount.toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
