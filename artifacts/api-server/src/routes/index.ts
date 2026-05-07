import { Router, type IRouter } from "express";
import healthRouter from "./health";
import pagesRouter from "./pages";
import contentRouter from "./content";
import adminRouter from "./admin";
import uploadsRouter from "./uploads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(pagesRouter);
router.use(contentRouter);
router.use(adminRouter);
router.use(uploadsRouter);

export default router;
