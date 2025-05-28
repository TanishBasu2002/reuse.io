"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, addHours, isBefore, startOfHour, addDays } from "date-fns";
import type { CreateAuctionInput, User } from "@repo/ui/types/index";
import { toast } from "sonner";
import { createAuction } from "@repo/ui/lib/chat";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Textarea } from "@repo/ui/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { cn } from "@repo/ui/lib/utils";
import { Calendar } from "@repo/ui/components/ui/calendar";

interface CreateAuctionFormProps {
  currentUser: User | null;
}

export function CreateAuctionForm({ currentUser }: CreateAuctionFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Default times: start in 1 hour, end in 1 day
  const defaultStartTime = addHours(startOfHour(new Date()), 1);
  const defaultEndTime = addDays(defaultStartTime, 1);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    imageUrl?: string;
    startPrice: number;
    createdBy: string;
  }>({
    title: "",
    description: "",
    imageUrl: "",
    startPrice: 0,
    createdBy: currentUser?.id || "",
  });

  const [startDate, setStartDate] = useState<Date>(defaultStartTime);
  const [endDate, setEndDate] = useState<Date>(defaultEndTime);
  const [startTimeStr, setStartTimeStr] = useState<string>(
    format(defaultStartTime, "HH:mm"),
  );
  const [endTimeStr, setEndTimeStr] = useState<string>(
    format(defaultEndTime, "HH:mm"),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Login required", {
        description: "Please login to create an auction",
      });
      router.push("/chat");
      return;
    }

    // Validate form
    if (!formData.title || !formData.description || formData.startPrice <= 0) {
      toast.error("Missing information", {
        description: "Please fill in all required fields",
      });
      return;
    }

    // Combine dates and times
    const startTimeParts = startTimeStr.split(":");
    const startDateTime = new Date(startDate);
    startDateTime.setHours(
      Number.parseInt(startTimeParts[0] ?? "0", 10),
      Number.parseInt(startTimeParts[1] ?? "0", 10),
      0,
    );

    const endTimeParts = endTimeStr.split(":");
    const endDateTime = new Date(endDate);
    endDateTime.setHours(
      Number.parseInt(endTimeParts[0] ?? "0", 10),
      Number.parseInt(endTimeParts[1] ?? "0", 10),
      0,
    );

    // Validate dates
    const now = new Date();
    if (isBefore(startDateTime, now)) {
      toast.error("Invalid start time", {
        description: "Start time must be in the future",
      });
      return;
    }

    if (isBefore(endDateTime, startDateTime)) {
      toast.error("Invalid end time", {
        description: "End time must be after start time",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Update form data with processed dates
      const auctionData: CreateAuctionInput = {
        ...formData,
        startTime: startDateTime,
        endTime: endDateTime,
        createdBy: currentUser.id,
      };

      const newAuction = await createAuction(auctionData);

      toast("Auction created successfully!", {
        description: "Your auction has been published",
      });

      // Redirect to the new auction page
      router.push(`/auction/${newAuction.id}`);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      toast.error("Failed to create auction", {
        description: error.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "startPrice") {
        return { ...prev, startPrice: Number.parseFloat(value) };
      }
      // Prevent startTime/endTime from being set as string
      if (name === "startTime" || name === "endTime") {
        return prev;
      }
      return { ...prev, [name]: value };
    });
  };

  if (!currentUser) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Login Required</h3>
            <p className="text-muted-foreground mb-4">
              Please login to create an auction
            </p>
            <Button onClick={() => router.push("/chat")}>Go to Login</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Auction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter auction title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your item"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ""}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="startPrice">Starting Price ($)</Label>
              <Input
                id="startPrice"
                name="startPrice"
                type="number"
                value={formData.startPrice || ""}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      disabled={(date) => isBefore(date, new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTimeStr}
                  onChange={(e) => setStartTimeStr(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      disabled={(date) => isBefore(date, startDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTimeStr}
                  onChange={(e) => setEndTimeStr(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Auction"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
