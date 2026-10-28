import { Router, Request, Response } from "express";
import { Application } from "../models/Application";

const router = Router();

// GET all applications
router.get("/", async (_req: Request, res: Response) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    return res.status(200).json(applications);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST create application
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    const app = await Application.create(data);
    return res.status(201).json(app);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PATCH update status
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Application.findOneAndUpdate(
      { id },
      {
        status,
        updatedAt: Date.now(),
        respondedAt: Date.now(),
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Application not found" });
    }
    return res.status(200).json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
