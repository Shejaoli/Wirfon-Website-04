import { Router, type IRouter } from "express";
import { login, verify, logout, getToken } from "../lib/auth";

const router: IRouter = Router();

router.post("/admin/login", (req, res) => {
  const { email, password } = (req.body ?? {}) as { email?: unknown; password?: unknown };
  const token = login(String(email ?? ""), String(password ?? ""));
  if (!token) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  res.json({ token });
});

router.post("/admin/logout", (req, res) => {
  logout(getToken(req));
  res.json({ success: true });
});

router.get("/admin/me", (req, res) => {
  res.json({ authenticated: verify(getToken(req)) });
});

export default router;
