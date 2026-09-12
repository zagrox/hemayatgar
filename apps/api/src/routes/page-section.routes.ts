import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import {
  listSectionsHandler,
  createSectionHandler,
  updateSectionHandler,
  deleteSectionHandler,
  reorderSectionsHandler,
} from "../controllers/page-section.controller";

const router = Router();

router.use(authenticate, authorize("pages.manage"));

router.get("/:pageSlug", listSectionsHandler);
router.post("/", createSectionHandler);
router.patch("/reorder", reorderSectionsHandler);
router.patch("/:id", updateSectionHandler);
router.delete("/:id", deleteSectionHandler);

export default router;
