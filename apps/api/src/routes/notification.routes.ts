import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import {
  listNotificationsHandler,
  unreadCountHandler,
  markReadHandler,
  markAllReadHandler,
} from "../controllers/notification.controller";

const router = Router();

router.use(authenticate);

router.get("/", listNotificationsHandler);
router.get("/unread-count", unreadCountHandler);
router.post("/:id/read", markReadHandler);
router.post("/read-all", markAllReadHandler);

export default router;
