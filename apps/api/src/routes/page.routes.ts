import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import {
  listPagesHandler,
  getPageHandler,
  createPageHandler,
  updatePageHandler,
  deletePageHandler,
} from "../controllers/page.controller";

const router = Router();

router.use(authenticate, authorize("pages.manage"));

router.get("/", listPagesHandler);
router.get("/:slug", getPageHandler);
router.post("/", createPageHandler);
router.patch("/:id", updatePageHandler);
router.delete("/:id", deletePageHandler);

export default router;
