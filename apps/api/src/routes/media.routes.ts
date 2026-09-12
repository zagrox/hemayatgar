import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { upload } from "../config/upload";
import { listMediaHandler, uploadMediaHandler, deleteMediaHandler } from "../controllers/media.controller";

const router = Router();

router.use(authenticate, authorize("media.manage"));

router.get("/", listMediaHandler);
router.post("/upload", upload.single("file"), uploadMediaHandler);
router.delete("/:id", deleteMediaHandler);

export default router;
