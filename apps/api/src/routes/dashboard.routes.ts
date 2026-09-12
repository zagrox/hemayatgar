import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { dashboardStatsHandler } from "../controllers/dashboard.controller";

const router = Router();

router.get("/stats", authenticate, dashboardStatsHandler);

export default router;
