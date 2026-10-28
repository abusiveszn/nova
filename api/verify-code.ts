import { verifyToken, usedSignatures } from "./_utils";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, code, token } = req.body || {};

  if (!email || !code || !token) {
    return res.status(400).json({ error: "Missing required fields (email, code, token)" });
  }

  // Verify the token
  const verification = verifyToken(email, code, token);

  if (!verification.valid) {
    return res.status(400).json({ error: verification.error });
  }

  // Prevent OTP reuse
  const signature = verification.signature!;
  if (usedSignatures.has(signature)) {
    return res.status(400).json({ error: "Verification code has already been used" });
  }

  // Mark the signature as used
  usedSignatures.add(signature);

  // Clean up signature after 10 minutes (longer than 5m expiry window is completely safe)
  setTimeout(() => {
    usedSignatures.delete(signature);
  }, 10 * 60 * 1000);

  return res.status(200).json({ ok: true });
}
