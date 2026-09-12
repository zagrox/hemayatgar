import { Router } from "express";
import { loginHandler, meHandler, logoutHandler, forgotPasswordHandler, resetPasswordHandler } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authenticate";
import { publicRequestRateLimiter } from "../middlewares/rate-limit";

const router = Router();

router.post("/login", loginHandler);
router.get("/me", authenticate, meHandler);
router.post("/logout", authenticate, logoutHandler);
router.post("/forgot-password", publicRequestRateLimiter, forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);

export default router;
