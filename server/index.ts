import express, { Request, Response } from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sendCodeHandler from "./api/send-code";
import verifyCodeHandler from "./api/verify-code";
import { connectToDatabase, getDbStatus } from "./db";
import { seedDatabaseIfEmpty } from "./seedDatabase";
import authRoutes from "./routes/auth";
import projectsRoutes from "./routes/projects";
import profilesRoutes from "./routes/profiles";
import applicationsRoutes from "./routes/applications";
import investmentsRoutes from "./routes/investments";
import teamsRoutes from "./routes/teams";
import { User } from "./models/User";
import { Project } from "./models/Project";
import { Builder } from "./models/Builder";
import { Company } from "./models/Company";
import { Application } from "./models/Application";
import {
  InvestmentProject,
  InvestmentAgreement,
  InvestorInquiry,
} from "./models/Investment";
import { TeamRoom, TeamMessage } from "./models/Team";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4001;

// Initialize MongoDB connection asynchronously
connectToDatabase()
  .then(async () => {
    console.log("[Server] Database connected successfully. Running auto-seed check...");
    await seedDatabaseIfEmpty();
  })
  .catch((err) => {
    console.warn(
      `[Server] MongoDB connection not established at startup (${err.message}). Application will retry on incoming API requests.`
    );
  });

// MongoDB Health & Status check endpoint
app.get("/api/db-status", async (_req: Request, res: Response) => {
  const status = getDbStatus();
  let counts: Record<string, number> = {};

  if (status.connected) {
    try {
      const [
        users,
        builders,
        companies,
        projects,
        applications,
        investmentProjects,
        investmentAgreements,
        teamRooms,
        teamMessages,
      ] = await Promise.all([
        User.countDocuments(),
        Builder.countDocuments(),
        Company.countDocuments(),
        Project.countDocuments(),
        Application.countDocuments(),
        InvestmentProject.countDocuments(),
        InvestmentAgreement.countDocuments(),
        TeamRoom.countDocuments(),
        TeamMessage.countDocuments(),
      ]);
      counts = {
        users,
        builders,
        companies,
        projects,
        applications,
        investmentProjects,
        investmentAgreements,
        teamRooms,
        teamMessages,
      };
    } catch (e: any) {
      console.warn("Could not retrieve collection counts:", e.message);
    }
  }

  return res.status(200).json({
    ...status,
    collections: counts,
  });
});

// Reseed endpoint for administrative/developer utility
app.post("/api/seed", async (_req: Request, res: Response) => {
  try {
    await seedDatabaseIfEmpty();
    return res.status(200).json({ success: true, message: "Database seeded successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// REST API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/profiles", profilesRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/investor", investmentsRoutes);
app.use("/api/team", teamsRoutes);

// Proxy Express requests directly to Vercel serverless handlers
app.post("/api/send-code", async (req: Request, res: Response) => {
  try {
    await sendCodeHandler(req, res);
  } catch (error) {
    console.error("Error in /api/send-code handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/verify-code", async (req: Request, res: Response) => {
  try {
    await verifyCodeHandler(req, res);
  } catch (error) {
    console.error("Error in /api/verify-code handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Debug endpoint to fetch verification details (for local test validation)
app.get("/api/debug-code", (req: Request, res: Response) => {
  const allowLocalEmail =
    process.env.ALLOW_LOCAL_EMAIL === "1" ||
    process.env.ALLOW_LOCAL_EMAIL?.toLowerCase() === "true";

  if (!allowLocalEmail) {
    return res.status(403).json({ error: "debug endpoint disabled" });
  }
  const email = (req.query.email || "").toString().toLowerCase().trim();
  if (!email) return res.status(400).json({ error: "email required" });

  return res.status(200).json({
    message:
      "Stateless OTP tokens are enabled. Look at your server console/terminal log to find the generated code.",
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
