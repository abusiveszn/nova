import { Router, Request, Response } from "express";
import { TeamRoom, TeamMessage } from "../models/Team";

const router = Router();

// Rooms
router.get("/rooms", async (_req: Request, res: Response) => {
  try {
    const rooms = await TeamRoom.find().sort({ createdAt: -1 });
    return res.status(200).json(rooms);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/rooms", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `room_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    if (!data.inviteCode) {
      data.inviteCode = `INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    const room = await TeamRoom.create(data);
    return res.status(201).json(room);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Messages
router.get("/messages", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.query;
    const filter = roomId ? { roomId: String(roomId) } : {};
    const messages = await TeamMessage.find(filter).sort({ createdAt: 1 });
    return res.status(200).json(messages);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/messages", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    const message = await TeamMessage.create(data);
    return res.status(201).json(message);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
