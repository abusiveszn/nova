// index.ts
import express from "express";
import cors from "cors";
import path4 from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";

// api/_utils.ts
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "node:path";
if (!process.env.VERCEL) {
  try {
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
    dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
    dotenv.config({ path: path.resolve(process.cwd(), "server/.env") });
  } catch (err) {
    console.warn("Could not load dotenv environment variables locally:", err);
  }
}
var rateLimits = /* @__PURE__ */ new Map();
var usedSignatures = /* @__PURE__ */ new Set();
var OTP_SECRET = process.env.OTP_SECRET || "default_local_otp_secret_key_123456";
if (!process.env.OTP_SECRET) {
  console.warn(
    "WARNING: OTP_SECRET environment variable is not set. Using a temporary random secret. OTPs will invalidate if the server restarts."
  );
}
function signToken(email, code, expiresAt) {
  const data = JSON.stringify({ email: email.toLowerCase().trim(), code, expiresAt });
  const signature = crypto.createHmac("sha256", OTP_SECRET).update(data).digest("hex");
  return `${Buffer.from(data).toString("base64")}.${signature}`;
}
function verifyToken(email, code, token) {
  if (!token) return { valid: false, error: "Missing verification token" };
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false, error: "Invalid token format" };
  const [dataStr, signature] = parts;
  let decodedData;
  try {
    decodedData = Buffer.from(dataStr, "base64").toString("utf8");
  } catch (e) {
    return { valid: false, error: "Invalid base64 payload in token" };
  }
  const expectedSignature = crypto.createHmac("sha256", OTP_SECRET).update(decodedData).digest("hex");
  if (signature !== expectedSignature) {
    return { valid: false, error: "Invalid verification token signature" };
  }
  let data;
  try {
    data = JSON.parse(decodedData);
  } catch (e) {
    return { valid: false, error: "Malformed payload inside token" };
  }
  if (data.email !== email.toLowerCase().trim()) {
    return { valid: false, error: "Email mismatch" };
  }
  if (String(data.code) !== String(code)) {
    return { valid: false, error: "Incorrect verification code" };
  }
  if (Date.now() > data.expiresAt) {
    return { valid: false, error: "Verification code has expired" };
  }
  return { valid: true, signature };
}
var transporter = null;
var emailMode = "local";
function getTransporter() {
  if (transporter || emailMode !== "local") return { transporter, emailMode };
  const hasResend = !!process.env.RESEND_API_KEY;
  const hasSendGrid = !!process.env.SENDGRID_API_KEY;
  const hasCustomSmtp = !!process.env.SMTP_HOST;
  const hasGmail = !!(process.env.GMAIL_USER && process.env.GMAIL_PASS);
  if (hasResend) {
    emailMode = "resend";
    transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY
      }
    });
  } else if (hasSendGrid) {
    emailMode = "sendgrid";
    transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else if (hasCustomSmtp) {
    emailMode = "custom_smtp";
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else if (hasGmail) {
    emailMode = "gmail";
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS?.replace(/\s+/g, "")
      }
    });
  } else {
    emailMode = "local";
  }
  return { transporter, emailMode };
}
if (!process.env.VERCEL) {
  const setup = getTransporter();
  if (setup.transporter) {
    setup.transporter.verify((error) => {
      if (error) {
        console.warn(`Unable to verify ${setup.emailMode} transporter:`, error.message);
        console.warn("Falling back to local logging mode for emails.");
        transporter = null;
        emailMode = "local";
      } else {
        console.log(`[Email] ${setup.emailMode} transporter verified successfully`);
      }
    });
  } else {
    console.log("[Email] No email service configured. Local email logging active.");
  }
}
async function sendVerificationEmail({ email, name, code, html, text, attachments }) {
  const setup = getTransporter();
  if (setup.emailMode === "local") {
    console.log("\n==================================================");
    console.log(`LOCAL EMAIL LOGGER: Verification code for ${email}`);
    console.log(`Code: ${code}`);
    console.log("==================================================\n");
    return { success: true, local: true };
  }
  if (!setup.transporter) {
    throw new Error("Email provider is not configured correctly.");
  }
  const fromAddress = process.env.EMAIL_FROM || process.env.GMAIL_FROM || process.env.GMAIL_USER;
  try {
    const info = await setup.transporter.sendMail({
      from: `NOVA <${fromAddress}>`,
      to: email,
      subject: "Your NOVA verification code",
      text,
      html,
      attachments
    });
    console.log(`Sent verification email via ${setup.emailMode} to ${email}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email Error] Failed to send email via ${setup.emailMode}:`, err.message);
    const allowLocal = process.env.ALLOW_LOCAL_EMAIL === "1" || process.env.ALLOW_LOCAL_EMAIL?.toLowerCase() === "true" || !process.env.NODE_ENV || process.env.NODE_ENV === "development";
    if (allowLocal) {
      console.warn(
        `[Email Fallback] Email provider authentication failed (${err.message}). Falling back to local console logging since ALLOW_LOCAL_EMAIL is active.`
      );
      console.log("\n==================================================");
      console.log(`LOCAL EMAIL LOGGER (FALLBACK): Verification code for ${email}`);
      console.log(`Code: ${code}`);
      console.log("==================================================\n");
      return { success: true, local: true, fallback: true };
    }
    throw new Error(
      `Email delivery failed via ${setup.emailMode} (${err.message}). If using Gmail, verify your 16-character App Password at https://myaccount.google.com/apppasswords.`
    );
  }
}

// api/send-code.ts
import path2 from "node:path";
import fs from "node:fs";
function generateCode() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email, name } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Email address is required" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address format" });
  }
  const emailKey = email.toLowerCase().trim();
  const now = Date.now();
  const RATE_LIMIT_WINDOW = 60 * 1e3;
  if (rateLimits.has(emailKey)) {
    const lastSent = rateLimits.get(emailKey);
    if (now - lastSent < RATE_LIMIT_WINDOW) {
      const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - lastSent)) / 1e3);
      return res.status(429).json({
        error: `Please wait ${waitTime} seconds before requesting a new code.`
      });
    }
  }
  rateLimits.set(emailKey, now);
  const code = generateCode();
  const expiresAt = now + 5 * 60 * 1e3;
  const token = signToken(emailKey, code, expiresAt);
  const siteUrl = process.env.SITE_URL || "http://localhost:5173";
  const logoPath = path2.join(process.cwd(), "public", "Picsart_26-04-10_14-37-41-214.png");
  const attachments = [];
  let logoCid = null;
  if (fs.existsSync(logoPath)) {
    logoCid = "logo@nova";
    attachments.push({
      filename: "Picsart_26-04-10_14-37-41-214.png",
      path: logoPath,
      cid: logoCid
    });
  }
  const html = `
    <div style="font-family:Inter,system-ui,Arial,sans-serif;color:#0f172a;padding:24px;background:#f8fafc;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(15,23,42,0.06);">
        <div style="padding:28px;text-align:center;background:linear-gradient(90deg,#7c3aed,#06b6d4);color:#fff;">
          ${logoCid ? `<img src="cid:${logoCid}" alt="NOVA" style="height:48px;margin-bottom:8px;object-fit:contain;"/>` : `<div style="font-weight:700;font-size:20px">NOVA</div>`}
          <div style="font-size:14px;opacity:0.95">Account verification</div>
        </div>
        <div style="padding:28px;color:#0f172a;">
          <h2 style="margin:0 0 12px;font-size:20px">Hi ${name || "there"},</h2>
          <p style="margin:0 0 18px;color:#334155">Welcome to NOVA \u2014 please use the code below to complete your sign up. The code expires in 5 minutes.</p>

          <div style="text-align:center;margin:18px 0;">
            <div style="display:inline-block;background:#0f172a;color:#fff;font-weight:700;padding:14px 22px;border-radius:10px;font-size:22px;letter-spacing:4px">${code}</div>
          </div>

          <div style="text-align:center;margin-top:6px;">
            <a href="${siteUrl}/verify?email=${encodeURIComponent(emailKey)}&code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}" style="display:inline-block;background:#7c3aed;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">Verify your account</a>
          </div>

          <hr style="border:none;border-top:1px solid #eef2ff;margin:22px 0;"/>
          <p style="font-size:12px;color:#64748b;margin:0">If you didn't request this code, you can safely ignore this email.</p>
        </div>
        <div style="padding:12px 20px;background:#f8fafc;color:#94a3b8;font-size:12px;text-align:center">NOVA \u2022 Building better matching experiences</div>
      </div>
    </div>
  `;
  const text = `Hello ${name || "user"},

Your NOVA verification code is ${code}. It expires in 5 minutes.

Verify at: ${siteUrl}/verify?email=${encodeURIComponent(emailKey)}&code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}`;
  try {
    const result = await sendVerificationEmail({
      email: emailKey,
      name,
      code,
      html,
      text,
      attachments
    });
    const isLocalAllowed = result.local || process.env.ALLOW_LOCAL_EMAIL === "1" || process.env.ALLOW_LOCAL_EMAIL?.toLowerCase() === "true" || process.env.NODE_ENV !== "production";
    return res.status(200).json({
      ok: true,
      token,
      debug: result.local,
      devCode: isLocalAllowed ? code : void 0
    });
  } catch (error) {
    console.error("Error in send-code endpoint:", error);
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      error: message || "Failed to send verification code. Please check server logs.",
      details: message
    });
  }
}

// api/verify-code.ts
async function handler2(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email, code, token } = req.body || {};
  if (!email || !code || !token) {
    return res.status(400).json({ error: "Missing required fields (email, code, token)" });
  }
  const verification = verifyToken(email, code, token);
  if (!verification.valid) {
    return res.status(400).json({ error: verification.error });
  }
  const signature = verification.signature;
  if (usedSignatures.has(signature)) {
    return res.status(400).json({ error: "Verification code has already been used" });
  }
  usedSignatures.add(signature);
  setTimeout(() => {
    usedSignatures.delete(signature);
  }, 10 * 60 * 1e3);
  return res.status(200).json({ ok: true });
}

// db.ts
import dns from "node:dns";
import mongoose from "mongoose";
import dotenv2 from "dotenv";
import path3 from "node:path";
import { fileURLToPath } from "node:url";
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch {
}
var __filename = fileURLToPath(import.meta.url);
var __dirname = path3.dirname(__filename);
dotenv2.config({ path: path3.resolve(__dirname, ".env") });
dotenv2.config({ path: path3.resolve(process.cwd(), ".env.local") });
dotenv2.config({ path: path3.resolve(process.cwd(), ".env") });
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/nova";
var cached = global.mongooseCache || {
  conn: null,
  promise: null
};
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}
async function connectToDatabase() {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5e3,
      connectTimeoutMS: 1e4
    };
    console.log(`[MongoDB] Connecting to: ${MONGODB_URI.replace(/\/\/[^@]+@/, "//***:***@")}`);
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log(`[MongoDB] Connected successfully to database: ${mongooseInstance.connection.name}`);
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error(`[MongoDB] Connection error:`, err.message);
      throw err;
    });
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
function getDbStatus() {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const readyState = mongoose.connection.readyState;
  return {
    connected: readyState === 1,
    state: states[readyState] || "unknown",
    uri: MONGODB_URI.replace(/\/\/[^@]+@/, "//***:***@")
  };
}

// models/User.ts
import mongoose2, { Schema } from "mongoose";
var UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    hash: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    registeredRole: {
      type: String,
      required: true,
      default: "builder"
    },
    verifiedAt: {
      type: String,
      default: () => (/* @__PURE__ */ new Date()).toISOString()
    }
  },
  {
    timestamps: true
  }
);
var User = mongoose2.models.User || mongoose2.model("User", UserSchema);

// models/Builder.ts
import mongoose3, { Schema as Schema2 } from "mongoose";
var BuilderSchema = new Schema2(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    role: {
      type: String,
      required: true,
      default: "builder"
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    avatarUrl: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    skills: {
      type: [String],
      default: []
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },
    bio: {
      type: String,
      default: ""
    },
    portfolioLinks: {
      type: [String],
      default: []
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "busy"],
      default: "available"
    },
    hoursPerWeek: {
      type: Number,
      default: 40
    },
    reputationScore: {
      type: Number,
      default: 0
    },
    completedProjects: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: String,
      default: () => (/* @__PURE__ */ new Date()).toISOString()
    },
    updatedAt: {
      type: String,
      default: () => (/* @__PURE__ */ new Date()).toISOString()
    }
  },
  {
    timestamps: true
  }
);
var Builder = mongoose3.models.Builder || mongoose3.model("Builder", BuilderSchema);

// models/Company.ts
import mongoose4, { Schema as Schema3 } from "mongoose";
var CompanySchema = new Schema3(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    role: {
      type: String,
      required: true,
      default: "company"
    },
    registeredRole: {
      type: String,
      default: "founder"
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    avatarUrl: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    companyName: {
      type: String,
      default: "",
      trim: true
    },
    industry: {
      type: String,
      default: "Technology"
    },
    companySize: {
      type: String,
      default: "1-10"
    },
    website: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    },
    postedProjects: {
      type: Number,
      default: 0
    },
    investmentFocus: {
      type: [String],
      default: []
    },
    investmentRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 }
    },
    previousInvestments: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: String,
      default: () => (/* @__PURE__ */ new Date()).toISOString()
    },
    updatedAt: {
      type: String,
      default: () => (/* @__PURE__ */ new Date()).toISOString()
    }
  },
  {
    timestamps: true
  }
);
var Company = mongoose4.models.Company || mongoose4.model("Company", CompanySchema);

// models/Project.ts
import mongoose5, { Schema as Schema4 } from "mongoose";
var ProjectSchema = new Schema4(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    rolesNeeded: {
      type: [String],
      default: []
    },
    experienceLevelRequired: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate"
    },
    teamSize: {
      type: Number,
      default: 3
    },
    status: {
      type: String,
      enum: ["open", "closed", "in-progress"],
      default: "open"
    },
    coverImage: {
      type: String,
      default: ""
    },
    founderId: {
      type: String,
      required: true,
      index: true
    },
    founderName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: "General"
    },
    budget: {
      type: String,
      default: ""
    },
    duration: {
      type: String,
      default: ""
    },
    tags: {
      type: [String],
      default: []
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    createdAt: {
      type: Number,
      default: () => Date.now()
    },
    updatedAt: {
      type: Number,
      default: () => Date.now()
    }
  },
  {
    timestamps: true
  }
);
var Project = mongoose5.models.Project || mongoose5.model("Project", ProjectSchema);

// models/Application.ts
import mongoose6, { Schema as Schema5 } from "mongoose";
var ApplicationSchema = new Schema5(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    projectId: {
      type: String,
      required: true,
      index: true
    },
    builderId: {
      type: String,
      required: true,
      index: true
    },
    builderName: {
      type: String,
      required: true
    },
    builderAvatar: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },
    message: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Number,
      default: () => Date.now()
    },
    updatedAt: {
      type: Number,
      default: () => Date.now()
    },
    respondedAt: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);
var Application = mongoose6.models.Application || mongoose6.model("Application", ApplicationSchema);

// models/Investment.ts
import mongoose7, { Schema as Schema6 } from "mongoose";
var InvestmentProjectSchema = new Schema6(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    techStack: { type: [String], default: [] },
    targetFunding: { type: Number, default: 0 },
    raisedFunding: { type: Number, default: 0 },
    expectedROI: { type: Number, default: 0 },
    equityOffered: { type: Number, default: 0 },
    projectManagerId: { type: String, required: true },
    projectManagerName: { type: String, required: true },
    projectManagerAvatar: { type: String, default: "" },
    status: {
      type: String,
      enum: ["funding", "active", "completed"],
      default: "funding"
    },
    deckUrl: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
    tags: { type: [String], default: [] },
    fundingDeadline: { type: Number },
    minInvestment: { type: Number, default: 1e3 },
    sector: { type: String, default: "SaaS/AI" }
  },
  { timestamps: true }
);
var InvestmentProject = mongoose7.models.InvestmentProject || mongoose7.model(
  "InvestmentProject",
  InvestmentProjectSchema
);
var InvestmentAgreementSchema = new Schema6(
  {
    id: { type: String, required: true, unique: true, index: true },
    investorId: { type: String, required: true, index: true },
    projectId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    agreedReturnPercentage: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending_signature", "signed", "funded"],
      default: "pending_signature"
    },
    createdAt: { type: Number, default: () => Date.now() },
    signedAt: { type: Number },
    fundedAt: { type: Number },
    equityPercentage: { type: Number, default: 0 },
    terms: { type: String, default: "" }
  },
  { timestamps: true }
);
var InvestmentAgreement = mongoose7.models.InvestmentAgreement || mongoose7.model(
  "InvestmentAgreement",
  InvestmentAgreementSchema
);
var InvestorInquirySchema = new Schema6(
  {
    id: { type: String, required: true, unique: true, index: true },
    senderId: { type: String, required: true, index: true },
    senderName: { type: String, required: true },
    receiverId: { type: String, required: true, index: true },
    projectId: { type: String, required: true, index: true },
    content: { type: String, required: true },
    createdAt: { type: Number, default: () => Date.now() },
    read: { type: Boolean, default: false },
    attachments: { type: [String], default: [] }
  },
  { timestamps: true }
);
var InvestorInquiry = mongoose7.models.InvestorInquiry || mongoose7.model(
  "InvestorInquiry",
  InvestorInquirySchema
);

// ../src/data/seed.ts
var seedBuilders = [
  {
    userId: "user_001",
    role: "builder",
    fullName: "Emeka Okafor",
    username: "emeka_dev",
    avatarUrl: "/avatars/builder1.jpg",
    email: "emeka@nova.dev",
    skills: ["React", "TypeScript", "Tailwind", "Next.js", "GraphQL"],
    experienceLevel: "advanced",
    bio: "Senior frontend engineer specializing in React ecosystems and design systems. Built scalable UIs for fintech and healthtech startups across Africa. Passionate about clean code and accessible interfaces.",
    portfolioLinks: ["https://github.com/emekaokafor", "https://emeka.dev"],
    availabilityStatus: "available",
    hoursPerWeek: 40,
    reputationScore: 96,
    completedProjects: 12,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-04-20T08:30:00Z"
  },
  {
    userId: "user_002",
    role: "builder",
    fullName: "Amara Diallo",
    username: "amara_backend",
    avatarUrl: "/avatars/builder2.jpg",
    email: "amara@nova.dev",
    skills: ["Node.js", "Python", "MongoDB", "PostgreSQL", "AWS", "Docker"],
    experienceLevel: "advanced",
    bio: "Backend architect with expertise in distributed systems and cloud infrastructure. Passionate about building resilient APIs and microservices that scale.",
    portfolioLinks: ["https://github.com/amaradiallo"],
    availabilityStatus: "available",
    hoursPerWeek: 35,
    reputationScore: 88,
    completedProjects: 9,
    createdAt: "2024-02-10T14:00:00Z",
    updatedAt: "2025-04-18T12:00:00Z"
  },
  {
    userId: "user_003",
    role: "builder",
    fullName: "Raj Patel",
    username: "raj_fullstack",
    avatarUrl: "/avatars/builder3.jpg",
    email: "raj@nova.dev",
    skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript", "Redis"],
    experienceLevel: "intermediate",
    bio: "Full-stack developer who loves building end-to-end products. Strong in MERN stack with a growing interest in system design and architecture.",
    portfolioLinks: ["https://github.com/rajpatel", "https://rajpatel.io"],
    availabilityStatus: "available",
    hoursPerWeek: 30,
    reputationScore: 72,
    completedProjects: 5,
    createdAt: "2024-03-05T09:00:00Z",
    updatedAt: "2025-04-15T16:00:00Z"
  },
  {
    userId: "user_004",
    role: "builder",
    fullName: "Zara Mensah",
    username: "zara_design",
    avatarUrl: "/avatars/builder4.jpg",
    email: "zara@nova.dev",
    skills: [
      "Figma",
      "Adobe XD",
      "Prototyping",
      "User Research",
      "Design Systems",
      "UI Design"
    ],
    experienceLevel: "intermediate",
    bio: "Product designer focused on creating intuitive digital experiences. Combines research-driven insights with pixel-perfect execution for African markets.",
    portfolioLinks: ["https://zaramensah.design", "https://dribbble.com/zara"],
    availabilityStatus: "available",
    hoursPerWeek: 25,
    reputationScore: 85,
    completedProjects: 7,
    createdAt: "2024-01-20T11:00:00Z",
    updatedAt: "2025-04-19T10:00:00Z"
  },
  {
    userId: "user_005",
    role: "builder",
    fullName: "Liam Eriksson",
    username: "liam_devops",
    avatarUrl: "/avatars/builder5.jpg",
    email: "liam@nova.dev",
    skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux"],
    experienceLevel: "advanced",
    bio: "DevOps engineer with a track record of reducing deployment times by 80%. Expert in infrastructure as code and cloud-native architectures.",
    portfolioLinks: ["https://github.com/liameriksson"],
    availabilityStatus: "available",
    hoursPerWeek: 40,
    reputationScore: 98,
    completedProjects: 15,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2025-04-21T09:00:00Z"
  },
  {
    userId: "user_006",
    role: "builder",
    fullName: "Mei Lin Chen",
    username: "mei_mobile",
    avatarUrl: "/avatars/builder6.jpg",
    email: "mei@nova.dev",
    skills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
    experienceLevel: "intermediate",
    bio: "Mobile developer building cross-platform apps that feel native. Obsessed with performance optimization and smooth animations.",
    portfolioLinks: ["https://github.com/meilinchen", "https://meilin.app"],
    availabilityStatus: "busy",
    hoursPerWeek: 15,
    reputationScore: 78,
    completedProjects: 6,
    createdAt: "2024-04-01T13:00:00Z",
    updatedAt: "2025-04-10T14:00:00Z"
  },
  {
    userId: "user_007",
    role: "builder",
    fullName: "Tunde Bakare",
    username: "tunde_python",
    avatarUrl: "/avatars/builder1.jpg",
    email: "tunde@nova.dev",
    skills: ["Python", "Django", "PostgreSQL", "Redis", "Celery", "AWS"],
    experienceLevel: "intermediate",
    bio: "Python backend developer with a focus on data-intensive applications. Experienced in building APIs for analytics platforms.",
    portfolioLinks: ["https://github.com/tundebakare"],
    availabilityStatus: "available",
    hoursPerWeek: 30,
    reputationScore: 65,
    completedProjects: 4,
    createdAt: "2024-05-12T10:00:00Z",
    updatedAt: "2025-04-05T11:00:00Z"
  },
  {
    userId: "user_008",
    role: "builder",
    fullName: "Ngozi Adeyemi",
    username: "ngozi_frontend",
    avatarUrl: "/avatars/builder2.jpg",
    email: "ngozi@nova.dev",
    skills: ["Vue.js", "JavaScript", "CSS", "HTML", "Sass"],
    experienceLevel: "beginner",
    bio: "Up-and-coming frontend developer eager to contribute to meaningful projects. Quick learner with a keen eye for detail and design.",
    portfolioLinks: ["https://github.com/ngoziadeyemi"],
    availabilityStatus: "available",
    hoursPerWeek: 20,
    reputationScore: 35,
    completedProjects: 2,
    createdAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-04-22T08:00:00Z"
  },
  {
    userId: "user_009",
    role: "builder",
    fullName: "Kofi Asante",
    username: "kofi_fullstack",
    avatarUrl: "/avatars/builder3.jpg",
    email: "kofi@nova.dev",
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "GraphQL", "AWS"],
    experienceLevel: "advanced",
    bio: "Full-stack engineer with a passion for building products that solve real African problems. Currently wrapping up a major project.",
    portfolioLinks: ["https://github.com/kofiasante", "https://kofi.dev"],
    availabilityStatus: "busy",
    hoursPerWeek: 10,
    reputationScore: 92,
    completedProjects: 11,
    createdAt: "2024-02-01T08:00:00Z",
    updatedAt: "2025-04-12T15:00:00Z"
  },
  {
    userId: "user_010",
    role: "builder",
    fullName: "Aisha Mohammed",
    username: "aisha_data",
    avatarUrl: "/avatars/builder4.jpg",
    email: "aisha@nova.dev",
    skills: ["Python", "SQL", "TensorFlow", "Pandas", "NumPy", "Spark"],
    experienceLevel: "intermediate",
    bio: "Data engineer and ML practitioner. Builds pipelines that turn raw data into actionable insights for business decision-making.",
    portfolioLinks: ["https://github.com/aishamohammed"],
    availabilityStatus: "available",
    hoursPerWeek: 35,
    reputationScore: 80,
    completedProjects: 5,
    createdAt: "2024-03-20T11:00:00Z",
    updatedAt: "2025-04-16T09:00:00Z"
  },
  {
    userId: "user_011",
    role: "builder",
    fullName: "James Osei",
    username: "james_react",
    avatarUrl: "/avatars/builder5.jpg",
    email: "james@nova.dev",
    skills: ["React", "Next.js", "TypeScript", "Tailwind", "Figma"],
    experienceLevel: "intermediate",
    bio: "Frontend developer with a design background. Bridges the gap between design and engineering with clean, maintainable code.",
    portfolioLinks: ["https://github.com/jamesosei", "https://jamesosei.com"],
    availabilityStatus: "available",
    hoursPerWeek: 30,
    reputationScore: 70,
    completedProjects: 6,
    createdAt: "2024-04-10T10:00:00Z",
    updatedAt: "2025-04-17T12:00:00Z"
  },
  {
    userId: "user_012",
    role: "builder",
    fullName: "Fatima Ibrahim",
    username: "fatima_java",
    avatarUrl: "/avatars/builder6.jpg",
    email: "fatima@nova.dev",
    skills: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Kafka",
      "Docker",
      "Kubernetes"
    ],
    experienceLevel: "advanced",
    bio: "Senior Java backend engineer specializing in Enterprise-grade systems. Expert in event-driven architectures and message queues.",
    portfolioLinks: ["https://github.com/fatimaibrahim"],
    availabilityStatus: "available",
    hoursPerWeek: 40,
    reputationScore: 94,
    completedProjects: 13,
    createdAt: "2024-01-05T09:00:00Z",
    updatedAt: "2025-04-20T10:00:00Z"
  },
  {
    userId: "user_013",
    role: "builder",
    fullName: "David Okonkwo",
    username: "david_flutter",
    avatarUrl: "/avatars/builder1.jpg",
    email: "david@nova.dev",
    skills: ["Flutter", "Dart", "Firebase", "REST API", "Git"],
    experienceLevel: "beginner",
    bio: "Mobile development enthusiast building cross-platform apps with Flutter. Looking for opportunities to grow and contribute.",
    portfolioLinks: ["https://github.com/davidokonkwo"],
    availabilityStatus: "available",
    hoursPerWeek: 25,
    reputationScore: 28,
    completedProjects: 1,
    createdAt: "2025-02-01T08:00:00Z",
    updatedAt: "2025-04-23T09:00:00Z"
  },
  {
    userId: "user_014",
    role: "builder",
    fullName: "Sarah Kimani",
    username: "sarah_ux",
    avatarUrl: "/avatars/builder2.jpg",
    email: "sarah@nova.dev",
    skills: [
      "Figma",
      "Sketch",
      "Prototyping",
      "Usability Testing",
      "Design Systems"
    ],
    experienceLevel: "advanced",
    bio: "Lead product designer with experience shaping products used by millions. Advocates for inclusive and accessible design practices.",
    portfolioLinks: ["https://sarahkimani.design", "https://behance.net/sarah"],
    availabilityStatus: "available",
    hoursPerWeek: 30,
    reputationScore: 91,
    completedProjects: 10,
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2025-04-19T11:00:00Z"
  },
  {
    userId: "user_015",
    role: "builder",
    fullName: "Oluwaseun Adeleke",
    username: "seun_cloud",
    avatarUrl: "/avatars/builder3.jpg",
    email: "seun@nova.dev",
    skills: ["AWS", "Terraform", "Docker", "Jenkins", "Python", "Bash"],
    experienceLevel: "intermediate",
    bio: "Cloud infrastructure engineer automating everything that moves. Builds CI/CD pipelines that teams actually enjoy using.",
    portfolioLinks: ["https://github.com/seunadeleke"],
    availabilityStatus: "available",
    hoursPerWeek: 35,
    reputationScore: 68,
    completedProjects: 5,
    createdAt: "2024-06-01T09:00:00Z",
    updatedAt: "2025-04-14T10:00:00Z"
  },
  {
    userId: "user_016",
    role: "builder",
    fullName: "Hope Chikere",
    username: "hope_edtech",
    avatarUrl: "/avatars/builder4.jpg",
    email: "hope@nova.dev",
    skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
    experienceLevel: "intermediate",
    bio: "Full-stack developer passionate about edtech. Believes technology should democratize access to quality education for all.",
    portfolioLinks: ["https://github.com/hopechikere"],
    availabilityStatus: "available",
    hoursPerWeek: 30,
    reputationScore: 62,
    completedProjects: 4,
    createdAt: "2024-07-15T11:00:00Z",
    updatedAt: "2025-04-13T09:00:00Z"
  },
  {
    userId: "user_017",
    role: "builder",
    fullName: "Michael Nwosu",
    username: "michael_angular",
    avatarUrl: "/avatars/builder5.jpg",
    email: "michael@nova.dev",
    skills: ["Angular", "TypeScript", "RxJS", "Sass", "Jest"],
    experienceLevel: "advanced",
    bio: "Angular specialist with deep expertise in reactive programming. Builds complex Enterprise overviews and data visualization tools.",
    portfolioLinks: ["https://github.com/michaelnwosu"],
    availabilityStatus: "available",
    hoursPerWeek: 40,
    reputationScore: 87,
    completedProjects: 8,
    createdAt: "2024-03-10T08:00:00Z",
    updatedAt: "2025-04-18T12:00:00Z"
  },
  {
    userId: "user_018",
    role: "builder",
    fullName: "Blessing Eze",
    username: "blessing_php",
    avatarUrl: "/avatars/builder6.jpg",
    email: "blessing@nova.dev",
    skills: ["PHP", "Laravel", "MySQL", "Redis", "Docker"],
    experienceLevel: "intermediate",
    bio: "PHP backend developer who ships reliable APIs. Experienced in e-commerce platforms and payment gateway integrations.",
    portfolioLinks: ["https://github.com/blessingeze"],
    availabilityStatus: "available",
    hoursPerWeek: 30,
    reputationScore: 58,
    completedProjects: 5,
    createdAt: "2024-08-01T10:00:00Z",
    updatedAt: "2025-04-11T09:00:00Z"
  },
  {
    userId: "user_019",
    role: "builder",
    fullName: "Daniel Mensah",
    username: "daniel_ml",
    avatarUrl: "/avatars/builder1.jpg",
    email: "daniel@nova.dev",
    skills: ["Python", "SQL", "Tableau", "Machine Learning", "Statistics"],
    experienceLevel: "beginner",
    bio: "Aspiring data scientist with strong statistical foundations. Works on predictive models for agricultural optimization.",
    portfolioLinks: ["https://github.com/danielmensah"],
    availabilityStatus: "available",
    hoursPerWeek: 20,
    reputationScore: 22,
    completedProjects: 2,
    createdAt: "2025-03-01T09:00:00Z",
    updatedAt: "2025-04-24T08:00:00Z"
  },
  {
    userId: "user_020",
    role: "builder",
    fullName: "Priya Sharma",
    username: "priya_polyglot",
    avatarUrl: "/avatars/builder2.jpg",
    email: "priya@nova.dev",
    skills: ["React", "Python", "Django", "PostgreSQL", "AWS", "Docker"],
    experienceLevel: "advanced",
    bio: "Polyglot full-stack engineer who architects systems from database to UI. Mentors junior developers in her community.",
    portfolioLinks: ["https://github.com/priyasharma", "https://priya.dev"],
    availabilityStatus: "busy",
    hoursPerWeek: 12,
    reputationScore: 90,
    completedProjects: 14,
    createdAt: "2024-01-25T08:00:00Z",
    updatedAt: "2025-04-08T15:00:00Z"
  }
];
var seedCompanies = [
  {
    userId: "comp_001",
    role: "company",
    fullName: "Chinedu Obi",
    username: "chinedu_fintech",
    avatarUrl: "/avatars/builder1.jpg",
    email: "chinedu@paywave.ng",
    companyName: "PayWave Technologies",
    industry: "Fintech",
    companySize: "1-10",
    website: "https://paywave.ng",
    bio: "Building the future of payments in Africa. Instant transfers, bill payments, and savings for the unbanked.",
    postedProjects: 3,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2025-04-20T10:00:00Z"
  },
  {
    userId: "comp_002",
    role: "company",
    fullName: "Dr. Amina Bello",
    username: "amina_health",
    avatarUrl: "/avatars/builder2.jpg",
    email: "amina@healthfirst.ng",
    companyName: "HealthFirst NG",
    industry: "HealthTech",
    companySize: "11-50",
    website: "https://healthfirst.ng",
    bio: "Digital health solutions for clinics and hospitals across Nigeria. Patient management, EHR, and telemedicine.",
    postedProjects: 2,
    createdAt: "2024-02-15T09:00:00Z",
    updatedAt: "2025-04-18T12:00:00Z"
  },
  {
    userId: "comp_003",
    role: "company",
    fullName: "Grace Okafor",
    username: "grace_edu",
    avatarUrl: "/avatars/builder4.jpg",
    email: "grace@edulift.ng",
    companyName: "EduLift Africa",
    industry: "EdTech",
    companySize: "11-50",
    website: "https://edulift.ng",
    bio: "Interactive learning platform making quality education accessible to every African secondary school student.",
    postedProjects: 2,
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2025-04-19T11:00:00Z"
  },
  {
    userId: "comp_004",
    role: "company",
    fullName: "Ibrahim Suleiman",
    username: "ibrahim_agri",
    avatarUrl: "/avatars/builder5.jpg",
    email: "ibrahim@agrichain.ng",
    companyName: "AgriChain Solutions",
    industry: "AgriTech",
    companySize: "1-10",
    website: "https://agrichain.ng",
    bio: "Blockchain-powered supply chain connecting smallholder farmers directly to exporters and retailers.",
    postedProjects: 1,
    createdAt: "2024-04-10T08:00:00Z",
    updatedAt: "2025-04-15T09:00:00Z"
  },
  {
    userId: "comp_005",
    role: "company",
    fullName: "Tomide Arowolo",
    username: "tomide_saas",
    avatarUrl: "/avatars/builder3.jpg",
    email: "tomide@datadash.ng",
    companyName: "DataDash Analytics",
    industry: "SaaS",
    companySize: "11-50",
    website: "https://datadash.ng",
    bio: "Real-time business intelligence overview with customizable widgets, data visualization, and automated reporting.",
    postedProjects: 2,
    createdAt: "2024-05-20T11:00:00Z",
    updatedAt: "2025-04-21T10:00:00Z"
  }
];
var seedProjects = [
  {
    id: "project_001",
    title: "Build Fintech MVP",
    description: "A mobile-first fintech platform enabling instant transfers, bill payments, and savings goals for unbanked populations in West Africa.",
    requiredSkills: ["React", "Node.js", "MongoDB"],
    rolesNeeded: ["frontend", "backend", "ui/ux"],
    experienceLevelRequired: "intermediate",
    teamSize: 5,
    status: "open",
    coverImage: "/projects/project1.jpg",
    founderId: "comp_001",
    founderName: "Chinedu Obi",
    createdAt: Date.now() - 864e5 * 2,
    updatedAt: Date.now() - 864e5 * 2,
    category: "Fintech",
    budget: "$5,000 - $10,000",
    duration: "2-3 months"
  },
  {
    id: "project_002",
    title: "HealthTech Patient Portal",
    description: "A secure patient management system for clinics featuring appointment booking, electronic health records, and telemedicine integration.",
    requiredSkills: ["React", "TypeScript", "PostgreSQL", "Node.js"],
    rolesNeeded: ["frontend", "backend", "ui/ux"],
    experienceLevelRequired: "advanced",
    teamSize: 4,
    status: "open",
    coverImage: "/projects/project2.jpg",
    founderId: "comp_002",
    founderName: "Dr. Amina Bello",
    createdAt: Date.now() - 864e5 * 5,
    updatedAt: Date.now() - 864e5 * 5,
    category: "HealthTech",
    budget: "$8,000 - $15,000",
    duration: "3-4 months"
  },
  {
    id: "project_003",
    title: "E-Learning Platform",
    description: "Interactive learning platform with video courses, quizzes, progress tracking, and certification for African secondary school students.",
    requiredSkills: ["React", "Python", "MongoDB", "AWS"],
    rolesNeeded: ["frontend", "backend", "ui/ux"],
    experienceLevelRequired: "intermediate",
    teamSize: 6,
    status: "open",
    coverImage: "/projects/project3.jpg",
    founderId: "comp_003",
    founderName: "Grace Okafor",
    createdAt: Date.now() - 864e5 * 3,
    updatedAt: Date.now() - 864e5 * 3,
    category: "EdTech",
    budget: "$10,000 - $20,000",
    duration: "4-6 months"
  },
  {
    id: "project_004",
    title: "AgriTech Supply Chain",
    description: "Blockchain-powered supply chain tracking system connecting smallholder farmers directly to exporters and retailers.",
    requiredSkills: ["Node.js", "Python", "Docker", "Kubernetes"],
    rolesNeeded: ["backend", "devops"],
    experienceLevelRequired: "advanced",
    teamSize: 3,
    status: "open",
    coverImage: "/projects/project4.jpg",
    founderId: "comp_004",
    founderName: "Ibrahim Suleiman",
    createdAt: Date.now() - 864e5 * 7,
    updatedAt: Date.now() - 864e5 * 7,
    category: "AgriTech",
    budget: "$15,000 - $25,000",
    duration: "4-5 months"
  },
  {
    id: "project_005",
    title: "SaaS Analytics Overview",
    description: "Real-time business intelligence overview with customizable widgets, data visualization, and automated reporting features.",
    requiredSkills: ["React", "TypeScript", "PostgreSQL", "Docker"],
    rolesNeeded: ["frontend", "backend", "data"],
    experienceLevelRequired: "intermediate",
    teamSize: 4,
    status: "open",
    coverImage: "/projects/project5.jpg",
    founderId: "comp_005",
    founderName: "Tomide Arowolo",
    createdAt: Date.now() - 864e5 * 1,
    updatedAt: Date.now() - 864e5 * 1,
    category: "SaaS",
    budget: "$8,000 - $12,000",
    duration: "2-3 months"
  },
  {
    id: "project_006",
    title: "Social Commerce App",
    description: "Mobile commerce platform combining social networking with shopping, featuring live selling and influencer storefronts.",
    requiredSkills: ["React Native", "Node.js", "MongoDB", "Firebase"],
    rolesNeeded: ["mobile", "backend", "ui/ux"],
    experienceLevelRequired: "intermediate",
    teamSize: 5,
    status: "open",
    coverImage: "/projects/project6.jpg",
    founderId: "comp_001",
    founderName: "Chinedu Obi",
    createdAt: Date.now() - 864e5 * 4,
    updatedAt: Date.now() - 864e5 * 4,
    category: "Social",
    budget: "$12,000 - $18,000",
    duration: "3-4 months"
  },
  {
    id: "project_007",
    title: "Logistics Tracking System",
    description: "End-to-end logistics management platform with GPS tracking, route optimization, and delivery confirmation.",
    requiredSkills: ["React", "Node.js", "PostgreSQL", "AWS"],
    rolesNeeded: ["frontend", "backend", "devops"],
    experienceLevelRequired: "advanced",
    teamSize: 4,
    status: "open",
    coverImage: "/projects/project1.jpg",
    founderId: "comp_005",
    founderName: "Tomide Arowolo",
    createdAt: Date.now() - 864e5 * 6,
    updatedAt: Date.now() - 864e5 * 6,
    category: "Logistics",
    budget: "$15,000 - $25,000",
    duration: "4-5 months"
  },
  {
    id: "project_008",
    title: "PropTech Rental Platform",
    description: "Digital rental marketplace with virtual tours, tenant screening, automated rent collection, and maintenance request tracking.",
    requiredSkills: ["React", "Python", "PostgreSQL", "Docker"],
    rolesNeeded: ["frontend", "backend", "ui/ux"],
    experienceLevelRequired: "intermediate",
    teamSize: 4,
    status: "open",
    coverImage: "/projects/project2.jpg",
    founderId: "comp_002",
    founderName: "Dr. Amina Bello",
    createdAt: Date.now() - 864e5 * 8,
    updatedAt: Date.now() - 864e5 * 8,
    category: "PropTech",
    budget: "$10,000 - $18,000",
    duration: "3-4 months"
  }
];
var seedApplications = [
  {
    id: "app_001",
    projectId: "project_001",
    builderId: "user_001",
    builderName: "Emeka Okafor",
    builderAvatar: "/avatars/builder1.jpg",
    status: "pending",
    message: "I have extensive experience building fintech UIs. Would love to contribute to this project.",
    createdAt: Date.now() - 864e5 * 1,
    updatedAt: Date.now() - 864e5 * 1
  },
  {
    id: "app_002",
    projectId: "project_001",
    builderId: "user_003",
    builderName: "Raj Patel",
    builderAvatar: "/avatars/builder3.jpg",
    status: "pending",
    message: "Full-stack MERN developer with fintech background. Ready to start immediately.",
    createdAt: Date.now() - 864e5 * 0.5,
    updatedAt: Date.now() - 864e5 * 0.5
  },
  {
    id: "app_003",
    projectId: "project_002",
    builderId: "user_002",
    builderName: "Amara Diallo",
    builderAvatar: "/avatars/builder2.jpg",
    status: "accepted",
    message: "Backend architect with healthtech experience. Built systems for 3 hospital networks.",
    createdAt: Date.now() - 864e5 * 3,
    updatedAt: Date.now() - 864e5 * 3
  },
  {
    id: "app_004",
    projectId: "project_003",
    builderId: "user_016",
    builderName: "Hope Chikere",
    builderAvatar: "/avatars/builder4.jpg",
    status: "pending",
    message: "Passionate about edtech. Built a learning management system for a local school.",
    createdAt: Date.now() - 864e5 * 2,
    updatedAt: Date.now() - 864e5 * 2
  },
  {
    id: "app_005",
    projectId: "project_005",
    builderId: "user_010",
    builderName: "Aisha Mohammed",
    builderAvatar: "/avatars/builder4.jpg",
    status: "pending",
    message: "Data engineer specializing in analytics overviews. Perfect fit for this project.",
    createdAt: Date.now() - 864e5 * 1,
    updatedAt: Date.now() - 864e5 * 1
  }
];

// ../src/data/investor-seed.ts
var seedInvestmentProjects = [
  {
    id: "inv_proj_001",
    title: "AfroChat - AI-Powered Community Platform",
    description: "Building the largest AI-powered social platform for African creators and entrepreneurs. Connect, collaborate, and monetize your talent across the continent.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "OpenAI API"],
    targetFunding: 2e6,
    raisedFunding: 75e4,
    expectedROI: 35,
    equityOffered: 8,
    projectManagerId: "company_001",
    projectManagerName: "Chioma Obi",
    projectManagerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chioma",
    status: "funding",
    deckUrl: "https://docs.google.com/presentation/d/...",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    companyWebsite: "https://afrochatter.io",
    sector: "SaaS/AI",
    tags: ["AI", "Social", "Africa", "Community", "Creator Economy"],
    minInvestment: 5e4,
    fundingDeadline: Date.now() + 90 * 24 * 60 * 60 * 1e3,
    // 90 days
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1e3
    // 30 days ago
  },
  {
    id: "inv_proj_002",
    title: "FinFlow - Smart Financial Management",
    description: "A fintech solution empowering SMEs across Africa with AI-driven expense tracking, invoicing, and cash flow optimization. Trusted by 10,000+ businesses.",
    techStack: ["React", "Node.js", "Python", "MongoDB", "Stripe API"],
    targetFunding: 5e6,
    raisedFunding: 32e5,
    expectedROI: 42,
    equityOffered: 12,
    projectManagerId: "company_002",
    projectManagerName: "Kwame Asante",
    projectManagerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kwame",
    status: "active",
    deckUrl: "https://docs.google.com/presentation/d/...",
    coverImage: "https://images.unsplash.com/photo-1554224311-beee415c15c7?w=500&h=300&fit=crop",
    companyWebsite: "https://finflow.io",
    sector: "Fintech",
    tags: ["Fintech", "SME", "Finance", "Africa"],
    minInvestment: 1e5,
    fundingDeadline: Date.now() + 60 * 24 * 60 * 60 * 1e3,
    // 60 days
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1e3
    // 45 days ago
  },
  {
    id: "inv_proj_003",
    title: "EduVerse - Decentralized Learning Platform",
    description: "Blockchain-based education platform offering micro-credentials and skill-based learning. Connecting learners with global opportunities and employers.",
    techStack: ["Solidity", "React", "Hardhat", "Web3.js", "IPFS"],
    targetFunding: 15e5,
    raisedFunding: 45e4,
    expectedROI: 55,
    equityOffered: 6,
    projectManagerId: "company_003",
    projectManagerName: "Adeline Okoro",
    projectManagerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=adeline",
    status: "funding",
    deckUrl: "https://docs.google.com/presentation/d/...",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    companyWebsite: "https://eduverse.io",
    sector: "EdTech",
    tags: ["Web3", "Education", "Blockchain", "Credentials"],
    minInvestment: 25e3,
    fundingDeadline: Date.now() + 120 * 24 * 60 * 60 * 1e3,
    // 120 days
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1e3
    // 15 days ago
  },
  {
    id: "inv_proj_004",
    title: "HealthSync - Medical Records Platform",
    description: "HIPAA-compliant digital health records platform connecting patients, doctors, and laboratories. Streamlining healthcare delivery across remote areas.",
    techStack: ["React", "PostgreSQL", "Node.js", "Docker", "AWS", "GraphQL"],
    targetFunding: 3e6,
    raisedFunding: 11e5,
    expectedROI: 38,
    equityOffered: 10,
    projectManagerId: "company_004",
    projectManagerName: "Dr. Miriam Mensah",
    projectManagerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=miriam",
    status: "active",
    deckUrl: "https://docs.google.com/presentation/d/...",
    coverImage: "https://images.unsplash.com/photo-1576091160550-112173f7f477?w=500&h=300&fit=crop",
    companyWebsite: "https://healthsync.io",
    sector: "HealthTech",
    tags: ["Healthcare", "Medical Records", "Africa", "Telemedicine"],
    minInvestment: 5e4,
    fundingDeadline: Date.now() + 75 * 24 * 60 * 60 * 1e3,
    // 75 days
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1e3
    // 60 days ago
  },
  {
    id: "inv_proj_005",
    title: "AgroDrive - Agricultural Tech Platform",
    description: "IoT and data-driven platform helping farmers optimize crop yields, manage weather patterns, and access premium markets.",
    techStack: ["Python", "React", "TensorFlow", "PostgreSQL", "AWS"],
    targetFunding: 25e5,
    raisedFunding: 8e5,
    expectedROI: 48,
    equityOffered: 9,
    projectManagerId: "company_005",
    projectManagerName: "Jacob Mwangi",
    projectManagerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jacob",
    status: "funding",
    deckUrl: "https://docs.google.com/presentation/d/...",
    coverImage: "https://images.unsplash.com/photo-1574143611937-0df059b5ef3e?w=500&h=300&fit=crop",
    companyWebsite: "https://agrodrive.io",
    sector: "AgriTech",
    tags: ["Agriculture", "IoT", "Sustainability", "Climate"],
    minInvestment: 5e4,
    fundingDeadline: Date.now() + 100 * 24 * 60 * 60 * 1e3,
    // 100 days
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1e3
    // 20 days ago
  }
];
var seedInvestmentAgreements = [
  {
    id: "agree_001",
    investorId: "investor_001",
    projectId: "inv_proj_002",
    amount: 25e4,
    agreedReturnPercentage: 42,
    status: "signed",
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1e3,
    signedAt: Date.now() - 8 * 24 * 60 * 60 * 1e3,
    fundedAt: Date.now() - 5 * 24 * 60 * 60 * 1e3,
    equityPercentage: 1.5
  },
  {
    id: "agree_002",
    investorId: "investor_002",
    projectId: "inv_proj_001",
    amount: 15e4,
    agreedReturnPercentage: 35,
    status: "pending_signature",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1e3,
    equityPercentage: 0.75
  }
];
var seedInvestorInquiries = [
  {
    id: "inq_001",
    senderId: "investor_001",
    senderName: "Amina Hassan",
    receiverId: "company_001",
    projectId: "inv_proj_001",
    content: "Hi Chioma! Interested in AfroChat. Can you elaborate on your go-to-market strategy for West Africa?",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1e3,
    read: true
  },
  {
    id: "inq_002",
    senderId: "company_001",
    senderName: "Chioma Obi",
    receiverId: "investor_001",
    projectId: "inv_proj_001",
    content: "Absolutely! We have partnerships with major telecom providers and are targeting 5M users in Q3. Detailed breakdown in the deck.",
    createdAt: Date.now() - 1.5 * 24 * 60 * 60 * 1e3,
    read: true
  },
  {
    id: "inq_003",
    senderId: "investor_002",
    senderName: "Kofi Mensah",
    receiverId: "company_002",
    projectId: "inv_proj_002",
    content: "What are your current MRR and churn rates? Also interested in the cap table.",
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1e3,
    read: false
  }
];

// seedDatabase.ts
async function seedDatabaseIfEmpty() {
  try {
    const adminUser = await User.findOne({ email: "novafuturegrid@gmail.com" });
    if (!adminUser) {
      console.log("[MongoDB] Seeding admin user novafuturegrid@gmail.com...");
      await User.create({
        email: "novafuturegrid@gmail.com",
        hash: "0b56f52c06cef94b5d6683e8ab607ad6abf90c627cb6fa68c3e85a740e86156b",
        name: "Nova Overseer Admin",
        phone: "+1-800-NOVA-ADM",
        registeredRole: "admin",
        verifiedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    const builderCount = await Builder.countDocuments();
    if (builderCount === 0) {
      console.log("[MongoDB] Seeding builders...");
      await Builder.insertMany(seedBuilders);
    }
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      console.log("[MongoDB] Seeding companies...");
      await Company.insertMany(seedCompanies);
    }
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log("[MongoDB] Seeding projects...");
      await Project.insertMany(seedProjects);
    }
    const applicationCount = await Application.countDocuments();
    if (applicationCount === 0) {
      console.log("[MongoDB] Seeding applications...");
      await Application.insertMany(seedApplications);
    }
    const invProjCount = await InvestmentProject.countDocuments();
    if (invProjCount === 0) {
      console.log("[MongoDB] Seeding investment projects...");
      await InvestmentProject.insertMany(seedInvestmentProjects);
    }
    const invAgrCount = await InvestmentAgreement.countDocuments();
    if (invAgrCount === 0) {
      console.log("[MongoDB] Seeding investment agreements...");
      await InvestmentAgreement.insertMany(seedInvestmentAgreements);
    }
    const invInqCount = await InvestorInquiry.countDocuments();
    if (invInqCount === 0) {
      console.log("[MongoDB] Seeding investor inquiries...");
      await InvestorInquiry.insertMany(seedInvestorInquiries);
    }
    console.log("[MongoDB] Seed verification complete.");
  } catch (err) {
    console.warn("[MongoDB] Auto-seeding skipped or encountered error:", err.message);
  }
}

// routes/auth.ts
import { Router } from "express";
var router = Router();
router.post("/register", async (req, res) => {
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
    const safeRegisteredRole = registeredRole === "admin" ? "builder" : registeredRole || "builder";
    const newUser = await User.create({
      email: emailLower,
      hash,
      name,
      phone: phone || "",
      registeredRole: safeRegisteredRole,
      verifiedAt: (/* @__PURE__ */ new Date()).toISOString()
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
        postedProjects: 0
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
        completedProjects: 0
      });
    }
    return res.status(201).json({
      success: true,
      user: {
        email: newUser.email,
        name: newUser.name,
        registeredRole: newUser.registeredRole,
        phone: newUser.phone,
        verifiedAt: newUser.verifiedAt
      },
      userId
    });
  } catch (err) {
    console.error("Error in /api/auth/register:", err);
    return res.status(500).json({ error: err.message || "Failed to register user" });
  }
});
router.post("/login", async (req, res) => {
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
    const builder = await Builder.findOne({ email: emailLower });
    const company = await Company.findOne({ email: emailLower });
    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        registeredRole: user.registeredRole,
        phone: user.phone,
        verifiedAt: user.verifiedAt
      },
      profile: builder || company || null
    });
  } catch (err) {
    console.error("Error in /api/auth/login:", err);
    return res.status(500).json({ error: err.message || "Failed to log in" });
  }
});
router.get("/user/:email", async (req, res) => {
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
      verifiedAt: user.verifiedAt
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.put("/reset-password", async (req, res) => {
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
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
var auth_default = router;

// routes/projects.ts
import { Router as Router2 } from "express";
var router2 = Router2();
router2.get("/", async (_req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    return res.status(500).json({ error: err.message });
  }
});
router2.post("/", async (req, res) => {
  try {
    const projectData = req.body;
    if (!projectData.id) {
      projectData.id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    const project = await Project.create(projectData);
    return res.status(201).json(project);
  } catch (err) {
    console.error("Error creating project:", err);
    return res.status(500).json({ error: err.message });
  }
});
router2.put("/:id", async (req, res) => {
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
  } catch (err) {
    console.error("Error updating project:", err);
    return res.status(500).json({ error: err.message });
  }
});
router2.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.status(200).json({ success: true, id });
  } catch (err) {
    console.error("Error deleting project:", err);
    return res.status(500).json({ error: err.message });
  }
});
var projects_default = router2;

// routes/profiles.ts
import { Router as Router3 } from "express";
var router3 = Router3();
router3.get("/builders", async (_req, res) => {
  try {
    const builders = await Builder.find().sort({ reputationScore: -1 });
    return res.status(200).json(builders);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router3.put("/builders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updated = await Builder.findOneAndUpdate(
      { userId },
      { ...req.body, updatedAt: (/* @__PURE__ */ new Date()).toISOString() },
      { new: true, upsert: true }
    );
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router3.get("/companies", async (_req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    return res.status(200).json(companies);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router3.put("/companies/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updated = await Company.findOneAndUpdate(
      { userId },
      { ...req.body, updatedAt: (/* @__PURE__ */ new Date()).toISOString() },
      { new: true, upsert: true }
    );
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
var profiles_default = router3;

// routes/applications.ts
import { Router as Router4 } from "express";
var router4 = Router4();
router4.get("/", async (_req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    return res.status(200).json(applications);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router4.post("/", async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    const app2 = await Application.create(data);
    return res.status(201).json(app2);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router4.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Application.findOneAndUpdate(
      { id },
      {
        status,
        updatedAt: Date.now(),
        respondedAt: Date.now()
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Application not found" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
var applications_default = router4;

// routes/investments.ts
import { Router as Router5 } from "express";
var router5 = Router5();
router5.get("/projects", async (_req, res) => {
  try {
    const projects = await InvestmentProject.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router5.get("/agreements", async (req, res) => {
  try {
    const { investorId } = req.query;
    const filter = investorId ? { investorId: String(investorId) } : {};
    const agreements = await InvestmentAgreement.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(agreements);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router5.post("/agreements", async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `agr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    const agreement = await InvestmentAgreement.create(data);
    return res.status(201).json(agreement);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router5.get("/inquiries", async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = projectId ? { projectId: String(projectId) } : {};
    const inquiries = await InvestorInquiry.find(filter).sort({ createdAt: 1 });
    return res.status(200).json(inquiries);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router5.post("/inquiries", async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    const inquiry = await InvestorInquiry.create(data);
    return res.status(201).json(inquiry);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
var investments_default = router5;

// routes/teams.ts
import { Router as Router6 } from "express";

// models/Team.ts
import mongoose8, { Schema as Schema7 } from "mongoose";
var TeamRoomSchema = new Schema7(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    leaderId: { type: String, required: true },
    inviteCode: { type: String, required: true, unique: true },
    memberIds: { type: [String], default: [] },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "public"
    }
  },
  { timestamps: true }
);
var TeamRoom = mongoose8.models.TeamRoom || mongoose8.model("TeamRoom", TeamRoomSchema);
var TeamMessageSchema = new Schema7(
  {
    id: { type: String, required: true, unique: true, index: true },
    roomId: { type: String, required: true, index: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
    pinned: { type: Boolean, default: false },
    edited: { type: Boolean, default: false }
  },
  { timestamps: true }
);
var TeamMessage = mongoose8.models.TeamMessage || mongoose8.model("TeamMessage", TeamMessageSchema);

// routes/teams.ts
var router6 = Router6();
router6.get("/rooms", async (_req, res) => {
  try {
    const rooms = await TeamRoom.find().sort({ createdAt: -1 });
    return res.status(200).json(rooms);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router6.post("/rooms", async (req, res) => {
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
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router6.get("/messages", async (req, res) => {
  try {
    const { roomId } = req.query;
    const filter = roomId ? { roomId: String(roomId) } : {};
    const messages = await TeamMessage.find(filter).sort({ createdAt: 1 });
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router6.post("/messages", async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    const message = await TeamMessage.create(data);
    return res.status(201).json(message);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
var teams_default = router6;

// index.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path4.dirname(__filename2);
var app = express();
app.use(cors());
app.use(express.json());
var PORT = process.env.PORT || 4001;
connectToDatabase().then(async () => {
  console.log("[Server] Database connected successfully. Running auto-seed check...");
  await seedDatabaseIfEmpty();
}).catch((err) => {
  console.warn(
    `[Server] MongoDB connection not established at startup (${err.message}). Application will retry on incoming API requests.`
  );
});
app.get("/api/db-status", async (_req, res) => {
  const status = getDbStatus();
  let counts = {};
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
        teamMessages
      ] = await Promise.all([
        User.countDocuments(),
        Builder.countDocuments(),
        Company.countDocuments(),
        Project.countDocuments(),
        Application.countDocuments(),
        InvestmentProject.countDocuments(),
        InvestmentAgreement.countDocuments(),
        TeamRoom.countDocuments(),
        TeamMessage.countDocuments()
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
        teamMessages
      };
    } catch (e) {
      console.warn("Could not retrieve collection counts:", e.message);
    }
  }
  return res.status(200).json({
    ...status,
    collections: counts
  });
});
app.post("/api/seed", async (_req, res) => {
  try {
    await seedDatabaseIfEmpty();
    return res.status(200).json({ success: true, message: "Database seeded successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.use("/api/auth", auth_default);
app.use("/api/projects", projects_default);
app.use("/api/profiles", profiles_default);
app.use("/api/applications", applications_default);
app.use("/api/investor", investments_default);
app.use("/api/team", teams_default);
app.post("/api/send-code", async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error("Error in /api/send-code handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/verify-code", async (req, res) => {
  try {
    await handler2(req, res);
  } catch (error) {
    console.error("Error in /api/verify-code handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/debug-code", (req, res) => {
  const allowLocalEmail = process.env.ALLOW_LOCAL_EMAIL === "1" || process.env.ALLOW_LOCAL_EMAIL?.toLowerCase() === "true";
  if (!allowLocalEmail) {
    return res.status(403).json({ error: "debug endpoint disabled" });
  }
  const email = (req.query.email || "").toString().toLowerCase().trim();
  if (!email) return res.status(400).json({ error: "email required" });
  return res.status(200).json({
    message: "Stateless OTP tokens are enabled. Look at your server console/terminal log to find the generated code."
  });
});
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}
var index_default = app;
export {
  index_default as default
};
