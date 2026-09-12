import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import {
  listArticlesHandler,
  getArticleHandler,
  createArticleHandler,
  updateArticleHandler,
  deleteArticleHandler,
  listArticleCategoriesHandler,
  createArticleCategoryHandler,
} from "../controllers/article.controller";

const router = Router();

router.use(authenticate, authorize("articles.manage"));

router.get("/", listArticlesHandler);
router.get("/categories", listArticleCategoriesHandler);
router.post("/categories", createArticleCategoryHandler);
router.get("/:slug", getArticleHandler);
router.post("/", createArticleHandler);
router.patch("/:id", updateArticleHandler);
router.delete("/:id", deleteArticleHandler);

export default router;
