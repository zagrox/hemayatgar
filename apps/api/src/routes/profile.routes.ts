import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { updateProfileHandler, changePasswordHandler } from "../controllers/profile.controller";

const router = Router();

router.use(authenticate);

router.patch("/", updateProfileHandler);
router.post("/change-password", changePasswordHandler);

export default router;
