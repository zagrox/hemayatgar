import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { getSettingsHandler, updateSettingsHandler } from "../controllers/settings.controller";

const router = Router();

router.get("/", authenticate, getSettingsHandler);
router.patch("/", authenticate, authorize("settings.manage"), updateSettingsHandler);

export default router;
