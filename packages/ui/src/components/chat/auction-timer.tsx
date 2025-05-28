"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { isPast, intervalToDuration, parseISO } from "date-fns";
import { Badge } from "@repo/ui/components/ui/badge";

interface AuctionTimerProps {
  startTime: Date | string;
  endTime: Date | string;
  status: "PENDING" | "ACTIVE" | "ENDED";
}

export function AuctionTimer({
  startTime,
  endTime,
  status,
}: AuctionTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState(status);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const start =
      typeof startTime === "string" ? parseISO(startTime) : startTime;
    const end = typeof endTime === "string" ? parseISO(endTime) : endTime;

    const updateTimer = () => {
      const now = new Date();

      // Check if auction should be ended
      if (isPast(end)) {
        setCurrentStatus("ENDED");
        setTimeLeft("Auction ended");
        return;
      }

      // Check if auction should be active
      if (isPast(start) && !isPast(end)) {
        setCurrentStatus("ACTIVE");

        // Calculate time left
        const duration = intervalToDuration({
          start: now,
          end: end,
        });

        const formatTimeUnit = (value: number | undefined) =>
          value !== undefined ? value.toString().padStart(2, "0") : "00";

        setTimeLeft(
          `${formatTimeUnit(duration.days)}d ${formatTimeUnit(duration.hours)}h ${formatTimeUnit(duration.minutes)}m ${formatTimeUnit(duration.seconds)}s`,
        );
      }

      // If auction is pending
      if (!isPast(start)) {
        setCurrentStatus("PENDING");

        // Calculate time until start
        const duration = intervalToDuration({
          start: now,
          end: start,
        });

        const formatTimeUnit = (value: number | undefined) =>
          value !== undefined ? value.toString().padStart(2, "0") : "00";

        setTimeLeft(
          `Starts in ${formatTimeUnit(duration.days)}d ${formatTimeUnit(duration.hours)}h ${formatTimeUnit(duration.minutes)}m ${formatTimeUnit(duration.seconds)}s`,
        );
      }
    };

    // Initial update
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, status]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Badge
            variant={
              currentStatus === "ACTIVE"
                ? "default"
                : currentStatus === "PENDING"
                  ? "outline"
                  : "secondary"
            }
          >
            {currentStatus}
          </Badge>
          <span className="font-mono font-medium">{timeLeft}</span>
        </div>
      </CardContent>
    </Card>
  );
}
