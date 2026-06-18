import { Router, type IRouter } from "express";
import { loadSite, saveSite, resetSite } from "../lib/storage";
import { requireAdmin } from "../lib/auth";
import { db } from "@workspace/db";
import { subscribers } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/content", async (_req, res) => {
  const data = await loadSite();
  res.json(data);
});

router.put("/admin/content", requireAdmin, async (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    res.status(400).json({ error: "Body must be an object" });
    return;
  }
  await saveSite(req.body);
  res.json({ success: true });
});

router.post("/admin/content/reset", requireAdmin, async (_req, res) => {
  const data = await resetSite();
  res.json({ success: true, data });
});

router.get("/admin/backup", requireAdmin, async (_req, res) => {
  const siteData = await loadSite();
  const allSubscribers = await db
    .select({ email: subscribers.email, subscribedAt: subscribers.subscribedAt })
    .from(subscribers);
  const backup = {
    exportedAt: new Date().toISOString(),
    siteConfig: siteData,
    subscribers: allSubscribers,
  };
  res
    .setHeader(
      "Content-Disposition",
      `attachment; filename="wirfoncloud-backup-${Date.now()}.json"`,
    )
    .setHeader("Content-Type", "application/json")
    .json(backup);
});

export default router;
