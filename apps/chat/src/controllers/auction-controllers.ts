// src/controllers/auctionController.ts
import type { Request, Response } from "express";
import * as auctionService from "../services/auction-service";
import type { CreateAuctionInput, CreateBidInput } from "../types";

export const createAuction = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const auctionData: CreateAuctionInput = req.body;
    const auction = await auctionService.createAuction(auctionData);
    res.status(201).json(auction);
  } catch (error) {
    console.error("Error creating auction:", error);
    res.status(500).json({ error: "Failed to create auction" });
  }
};

export const getAuctions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const auctions = await auctionService.getAuctions();
    res.status(200).json(auctions);
  } catch (error) {
    console.error("Error fetching auctions:", error);
    res.status(500).json({ error: "Failed to fetch auctions" });
  }
};

export const getAuction = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const auction = await auctionService.getAuctionById(id);

    if (!auction) {
      res.status(404).json({ error: "Auction not found" });
      return;
    }

    res.status(200).json(auction);
  } catch (error) {
    console.error("Error fetching auction:", error);
    res.status(500).json({ error: "Failed to fetch auction" });
  }
};

export const placeBid = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const bidData: CreateBidInput = {
      ...req.body,
      auctionId: id,
    };

    const bid = await auctionService.createBid(bidData);
    res.status(201).json(bid);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    console.error("Error placing bid:", error);
    res.status(400).json({ error: error.message || "Failed to place bid" });
  }
};

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const user = await auctionService.createUser(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await auctionService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
