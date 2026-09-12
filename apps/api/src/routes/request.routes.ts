import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import {
  listRequestsHandler,
  getRequestHandler,
  updateRequestHandler,
  addNoteHandler,
} from "../controllers/request.controller";

const router = Router();

router.use(authenticate, authorize("requests.manage"));

router.get("/", listRequestsHandler);
router.get("/:id", getRequestHandler);
router.patch("/:id", updateRequestHandler);
router.post("/:id/notes", addNoteHandler);

export default router;
