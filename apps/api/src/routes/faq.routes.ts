import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { listFaqHandler, createFaqHandler, updateFaqHandler, deleteFaqHandler } from "../controllers/faq.controller";

const router = Router();

router.use(authenticate, authorize("faq.manage"));

router.get("/", listFaqHandler);
router.post("/", createFaqHandler);
router.patch("/:id", updateFaqHandler);
router.delete("/:id", deleteFaqHandler);

export default router;
