import { Router, type IRouter } from "express";
import { loadSite, saveSite, resetSite } from "../lib/storage";
import { requireAdmin } from "../lib/auth";

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

export default router;
