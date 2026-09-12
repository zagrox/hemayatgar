import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import {
  listCategoriesHandler,
  getCategoryHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from "../controllers/insurance-category.controller";

const router = Router();

router.use(authenticate, authorize("insurance.manage"));

router.get("/", listCategoriesHandler);
router.get("/:slug", getCategoryHandler);
router.post("/", createCategoryHandler);
router.patch("/:id", updateCategoryHandler);
router.delete("/:id", deleteCategoryHandler);

export default router;
