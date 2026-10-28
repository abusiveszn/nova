import { Router, Request, Response } from "express";
import { User } from "../models/User";
import { Builder } from "../models/Builder";
import { Company } from "../models/Company";

const router = Router();

// Register user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, hash, name, phone, registeredRole } = req.body;
    if (!email || !hash || !name) {
      return res.status(400).json({ error: "Missing required fields (email, hash, name)" });
    }

    const emailLower = email.toLowerCase().trim();
    const existing = await User.findOne({ email: emailLower });
    if (existing) {
      return res.status(409).json({ error: "User already exists with this email" });
    }

    const safeRegisteredRole =
      registeredRole === "admin" ? "builder" : registeredRole || "builder";

    const newUser = await User.create({
      email: emailLower,
      hash,
      name,
      phone: phone || "",
      registeredRole: safeRegisteredRole,
      verifiedAt: new Date().toISOString(),
    });

    const isCompanyRole = ["investor", "founder", "enterprise", "Enterprise"].includes(
      registeredRole
    );
    const userId = `user_${Date.now()}`;

    if (isCompanyRole) {
      await Company.create({
        userId,
        role: "company",
        registeredRole,
        fullName: name,
        username: emailLower.split("@")[0] || `company_${Date.now()}`,
        email: emailLower,
        companyName: name,
        industry: registeredRole === "investor" ? "Venture Capital" : "Technology",
        companySize: "1-10",
        website: "",
        bio: "",
        postedProjects: 0,
      });
    } else {
      await Builder.create({
        userId,
        role: "builder",
        fullName: name,
        username: emailLower.split("@")[0] || `builder_${Date.now()}`,
        email: emailLower,
        skills: [],
        experienceLevel: "beginner",
        bio: "",
        portfolioLinks: [],
        availabilityStatus: "available",
        hoursPerWeek: 40,
        reputationScore: 0,
        completedProjects: 0,
      });
    }

    return res.status(201).json({
      success: true,
      user: {
        email: newUser.email,
        name: newUser.name,
        registeredRole: newUser.registeredRole,
        phone: newUser.phone,
        verifiedAt: newUser.verifiedAt,
      },
      userId,
    });
  } catch (err: any) {
    console.error("Error in /api/auth/register:", err);
    return res.status(500).json({ error: err.message || "Failed to register user" });
  }
});

// Login user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, hash } = req.body;
    if (!email || !hash) {
      return res.status(400).json({ error: "Email and password hash are required" });
    }

    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower });

    if (!user) {
      return res.status(404).json({ error: "No account found for this email" });
    }

    if (user.hash !== hash) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Retrieve corresponding profile
    const builder = await Builder.findOne({ email: emailLower });
    const company = await Company.findOne({ email: emailLower });

    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        registeredRole: user.registeredRole,
        phone: user.phone,
        verifiedAt: user.verifiedAt,
      },
      profile: builder || company || null,
    });
  } catch (err: any) {
    console.error("Error in /api/auth/login:", err);
    return res.status(500).json({ error: err.message || "Failed to log in" });
  }
});

// Get user account by email
router.get("/user/:email", async (req: Request, res: Response) => {
  try {
    const rawEmail = Array.isArray(req.params.email) ? req.params.email[0] : req.params.email;
    if (!rawEmail) {
      return res.status(400).json({ error: "Email parameter is required" });
    }
    const emailLower = rawEmail.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      email: user.email,
      name: user.name,
      registeredRole: user.registeredRole,
      phone: user.phone,
      verifiedAt: user.verifiedAt,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Reset password
router.put("/reset-password", async (req: Request, res: Response) => {
  try {
    const { email, hash } = req.body;
    if (!email || !hash) {
      return res.status(400).json({ error: "Email and new password hash required" });
    }

    const emailLower = email.toLowerCase().trim();
    const user = await User.findOneAndUpdate(
      { email: emailLower },
      { hash },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
