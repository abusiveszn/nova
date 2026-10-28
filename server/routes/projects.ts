import { Router, Request, Response } from "express";
import { Project } from "../models/Project";

const router = Router();

// GET all projects
router.get("/", async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (err: any) {
    console.error("Error fetching projects:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST create project
router.post("/", async (req: Request, res: Response) => {
  try {
    const projectData = req.body;
    if (!projectData.id) {
      projectData.id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    const project = await Project.create(projectData);
    return res.status(201).json(project);
  } catch (err: any) {
    console.error("Error creating project:", err);
    return res.status(500).json({ error: err.message });
  }
});

// PUT update project
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Project.findOneAndUpdate(
      { id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.status(200).json(updated);
  } catch (err: any) {
    console.error("Error updating project:", err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE project
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.status(200).json({ success: true, id });
  } catch (err: any) {
    console.error("Error deleting project:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
