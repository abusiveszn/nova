import { Router, Request, Response } from "express";
import {
  InvestmentProject,
  InvestmentAgreement,
  InvestorInquiry,
} from "../models/Investment";

const router = Router();

// Projects
router.get("/projects", async (_req: Request, res: Response) => {
  try {
    const projects = await InvestmentProject.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Agreements
router.get("/agreements", async (req: Request, res: Response) => {
  try {
    const { investorId } = req.query;
    const filter = investorId ? { investorId: String(investorId) } : {};
    const agreements = await InvestmentAgreement.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(agreements);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/agreements", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `agr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    const agreement = await InvestmentAgreement.create(data);
    return res.status(201).json(agreement);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Inquiries
router.get("/inquiries", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;
    const filter = projectId ? { projectId: String(projectId) } : {};
    const inquiries = await InvestorInquiry.find(filter).sort({ createdAt: 1 });
    return res.status(200).json(inquiries);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/inquiries", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    const inquiry = await InvestorInquiry.create(data);
    return res.status(201).json(inquiry);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
