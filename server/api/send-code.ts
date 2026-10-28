import { signToken, sendVerificationEmail, rateLimits } from "./_utils";
import path from "node:path";
import fs from "node:fs";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Email address is required" });
  }

  // Simple validation for email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address format" });
  }

  const emailKey = email.toLowerCase().trim();
  const now = Date.now();
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

  // Rate limiting check
  if (rateLimits.has(emailKey)) {
    const lastSent = rateLimits.get(emailKey)!;
    if (now - lastSent < RATE_LIMIT_WINDOW) {
      const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - lastSent)) / 1000);
      return res.status(429).json({
        error: `Please wait ${waitTime} seconds before requesting a new code.`,
      });
    }
  }

  // Update rate limit timestamp
  rateLimits.set(emailKey, now);

  const code = generateCode();
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes expiration

  // Sign the token statelessly
  const token = signToken(emailKey, code, expiresAt);

  const siteUrl = process.env.SITE_URL || "http://localhost:5173";
  const logoPath = path.join(process.cwd(), "public", "Picsart_26-04-10_14-37-41-214.png");
  const attachments: any[] = [];
  let logoCid: string | null = null;
  
  if (fs.existsSync(logoPath)) {
    logoCid = "logo@nova";
    attachments.push({
      filename: "Picsart_26-04-10_14-37-41-214.png",
      path: logoPath,
      cid: logoCid,
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
          <p style="margin:0 0 18px;color:#334155">Welcome to NOVA — please use the code below to complete your sign up. The code expires in 5 minutes.</p>

          <div style="text-align:center;margin:18px 0;">
            <div style="display:inline-block;background:#0f172a;color:#fff;font-weight:700;padding:14px 22px;border-radius:10px;font-size:22px;letter-spacing:4px">${code}</div>
          </div>

          <div style="text-align:center;margin-top:6px;">
            <a href="${siteUrl}/verify?email=${encodeURIComponent(emailKey)}&code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}" style="display:inline-block;background:#7c3aed;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">Verify your account</a>
          </div>

          <hr style="border:none;border-top:1px solid #eef2ff;margin:22px 0;"/>
          <p style="font-size:12px;color:#64748b;margin:0">If you didn't request this code, you can safely ignore this email.</p>
        </div>
        <div style="padding:12px 20px;background:#f8fafc;color:#94a3b8;font-size:12px;text-align:center">NOVA • Building better matching experiences</div>
      </div>
    </div>
  `;

  const text = `Hello ${name || "user"},\n\nYour NOVA verification code is ${code}. It expires in 5 minutes.\n\nVerify at: ${siteUrl}/verify?email=${encodeURIComponent(emailKey)}&code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}`;

  try {
    const result = await sendVerificationEmail({
      email: emailKey,
      name,
      code,
      html,
      text,
      attachments,
    });
    // Only expose devCode to the client if the email could NOT be sent through a real mail provider
    const isLocalAllowed = Boolean(result.local);

    return res.status(200).json({
      ok: true,
      token,
      debug: result.local,
      devCode: isLocalAllowed ? code : undefined,
    });
  } catch (error: any) {
    console.error("Error in send-code endpoint:", error);
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      error: message || "Failed to send verification code. Please check server logs.",
      details: message,
    });
  }
}
