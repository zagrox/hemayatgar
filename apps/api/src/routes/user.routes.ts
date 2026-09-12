import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import {
  listUsersHandler,
  createUserHandler,
  updateUserHandler,
  listRolesHandler,
} from "../controllers/user.controller";

const router = Router();

router.use(authenticate, authorize("users.manage"));

router.get("/", listUsersHandler);
router.post("/", createUserHandler);
router.patch("/:id", updateUserHandler);
router.get("/roles/list", listRolesHandler);

export default router;
