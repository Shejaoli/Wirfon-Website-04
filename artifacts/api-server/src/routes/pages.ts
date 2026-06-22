import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { subscribers } from "@workspace/db/schema";
import { sendContactEmail } from "../lib/mailer.js";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  req.log.info({ body: req.body }, "contact form submission");
  const { name, email, subject, message, phone } = req.body ?? {};
  try {
    const sent = await sendContactEmail({
      fromName: name || "Website visitor",
      fromEmail: email || "unknown@wirfoncloud.com",
      subject: subject || "Website contact",
      message: message || "",
      phone,
    });
    req.log.info({ sent }, "contact email dispatch");
  } catch (err) {
    req.log.warn({ err }, "failed to send contact email (SMTP not configured?)");
  }
  res.json({ success: true, message: "Thank you, we will be in touch shortly." });
});

router.post("/subscribe", async (req, res) => {
  const { email } = req.body ?? {};
  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email required" });
    return;
  }
  const normalised = email.trim().toLowerCase();
  req.log.info({ email: normalised }, "newsletter subscription");
  await db
    .insert(subscribers)
    .values({ email: normalised })
    .onConflictDoNothing();
  res.json({ success: true, message: "Thank you for subscribing! We'll be in touch." });
});

export default router;
