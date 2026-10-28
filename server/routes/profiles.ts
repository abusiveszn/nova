import { Router, Request, Response } from "express";
import { Builder } from "../models/Builder";
import { Company } from "../models/Company";

const router = Router();

// GET all builders
router.get("/builders", async (_req: Request, res: Response) => {
  try {
    const builders = await Builder.find().sort({ reputationScore: -1 });
    return res.status(200).json(builders);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT update builder
router.put("/builders/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updated = await Builder.findOneAndUpdate(
      { userId },
      { ...req.body, updatedAt: new Date().toISOString() },
      { new: true, upsert: true }
    );
    return res.status(200).json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET all companies
router.get("/companies", async (_req: Request, res: Response) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    return res.status(200).json(companies);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT update company
router.put("/companies/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updated = await Company.findOneAndUpdate(
      { userId },
      { ...req.body, updatedAt: new Date().toISOString() },
      { new: true, upsert: true }
    );
    return res.status(200).json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
