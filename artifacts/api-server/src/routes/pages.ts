import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/contact", (req, res) => {
  req.log.info({ body: req.body }, "contact form submission");
  res.json({ success: true, message: "Thank you, we will be in touch shortly." });
});

router.post("/subscribe", (req, res) => {
  req.log.info({ body: req.body }, "newsletter subscription");
  res.json({ success: true, message: "Thank you for subscribing! We'll be in touch." });
});

export default router;
