import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import {
  listSliderHandler,
  createSliderHandler,
  updateSliderHandler,
  deleteSliderHandler,
} from "../controllers/slider.controller";

const router = Router();

router.use(authenticate, authorize("slider.manage"));

router.get("/", listSliderHandler);
router.post("/", createSliderHandler);
router.patch("/:id", updateSliderHandler);
router.delete("/:id", deleteSliderHandler);

export default router;
