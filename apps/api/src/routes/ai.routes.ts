import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { upload } from "../config/upload";
import { aiChatHandler, aiStatusHandler } from "../controllers/ai.controller";

const router = Router();

router.use(authenticate, authorize("ai.manage"));

router.get("/status", aiStatusHandler);
router.post("/chat", upload.single("image"), aiChatHandler);

export default router;
