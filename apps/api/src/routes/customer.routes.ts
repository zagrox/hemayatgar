import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import {
  listCustomersHandler,
  getCustomerHandler,
  createCustomerHandler,
  updateCustomerHandler,
  deleteCustomerHandler,
  addInteractionHandler,
} from "../controllers/customer.controller";

const router = Router();

router.use(authenticate, authorize("customers.manage"));

router.get("/", listCustomersHandler);
router.get("/:id", getCustomerHandler);
router.post("/", createCustomerHandler);
router.patch("/:id", updateCustomerHandler);
router.delete("/:id", deleteCustomerHandler);
router.post("/:id/interactions", addInteractionHandler);

export default router;
