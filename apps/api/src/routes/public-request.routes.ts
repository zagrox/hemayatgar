import { Router } from "express";
import { createPublicRequestHandler } from "../controllers/public-request.controller";
import { publicRequestRateLimiter } from "../middlewares/rate-limit";

const router = Router();

router.post("/", publicRequestRateLimiter, createPublicRequestHandler);

export default router;
