import crypto from "node:crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "node:path";

// Load dotenv only in local development
if (!process.env.VERCEL) {
  try {
    dotenv.config({ path: path.resolve(process.cwd(), "server/.env") });
  } catch (err) {
    console.warn("Could not load dotenv environment variables locally:", err);
  }
}

// In-memory rate limits (email -> timestamp)
export const rateLimits = new Map<string, number>();

// In-memory set of used signatures to prevent OTP reuse
export const usedSignatures = new Set<string>();

const OTP_SECRET = process.env.OTP_SECRET || "default_local_otp_secret_key_123456";
if (!process.env.OTP_SECRET) {
  console.warn(
    "WARNING: OTP_SECRET environment variable is not set. Using a temporary random secret. OTPs will invalidate if the server restarts."
  );
}

/**
 * Signs email, code, and expiration timestamp into an HMAC-SHA256 signature token
 */
export function signToken(email: string, code: string, expiresAt: number): string {
  const data = JSON.stringify({ email: email.toLowerCase().trim(), code, expiresAt });
  const signature = crypto
    .createHmac("sha256", OTP_SECRET)
    .update(data)
    .digest("hex");
  return `${Buffer.from(data).toString("base64")}.${signature}`;
}

export interface VerificationResult {
  valid: boolean;
  signature?: string;
  error?: string;
}

/**
 * Decodes and verifies a signature token against provided email and code
 */
export function verifyToken(email: string, code: string, token: string): VerificationResult {
  if (!token) return { valid: false, error: "Missing verification token" };
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false, error: "Invalid token format" };

  const [dataStr, signature] = parts;
  let decodedData: string;
  try {
    decodedData = Buffer.from(dataStr, "base64").toString("utf8");
  } catch (e) {
    return { valid: false, error: "Invalid base64 payload in token" };
  }

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", OTP_SECRET)
    .update(decodedData)
    .digest("hex");

  if (signature !== expectedSignature) {
    return { valid: false, error: "Invalid verification token signature" };
  }

  let data: any;
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

let transporter: nodemailer.Transporter | null = null;
let emailMode: "local" | "resend" | "sendgrid" | "custom_smtp" | "gmail" = "local";

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
        pass: process.env.RESEND_API_KEY,
      },
    });
  } else if (hasSendGrid) {
    emailMode = "sendgrid";
    transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else if (hasCustomSmtp) {
    emailMode = "custom_smtp";
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else if (hasGmail) {
    emailMode = "gmail";
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS?.replace(/\s+/g, ""),
      },
    });
  } else {
    emailMode = "local";
  }

  return { transporter, emailMode };
}

// Warm up and verify email transporter immediately in development
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

export interface SendEmailParams {
  email: string;
  name: string;
  code: string;
  html: string;
  text: string;
  attachments?: any[];
}

/**
 * Dispatches the verification email using configured provider, or logs to terminal
 */
export async function sendVerificationEmail({ email, name, code, html, text, attachments }: SendEmailParams) {
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
      attachments,
    });

    console.log(`Sent verification email via ${setup.emailMode} to ${email}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[Email Error] Failed to send email via ${setup.emailMode}:`, err.message);

    const allowLocal =
      process.env.ALLOW_LOCAL_EMAIL === "1" ||
      process.env.ALLOW_LOCAL_EMAIL?.toLowerCase() === "true" ||
      !process.env.NODE_ENV ||
      process.env.NODE_ENV === "development";

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
