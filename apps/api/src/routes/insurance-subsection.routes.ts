import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import {
  createSubsectionHandler,
  updateSubsectionHandler,
  deleteSubsectionHandler,
} from "../controllers/insurance-subsection.controller";

const router = Router();

router.use(authenticate, authorize("insurance.manage"));

router.post("/", createSubsectionHandler);
router.patch("/:id", updateSubsectionHandler);
router.delete("/:id", deleteSubsectionHandler);

export default router;
