import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { subscribers } from "@workspace/db/schema";

const router: IRouter = Router();

router.post("/contact", (req, res) => {
  req.log.info({ body: req.body }, "contact form submission");
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
