import express from "express";
import {
  createOrder,
  getOrder,
  updateOrder,
} from "../controllers/ordersController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(authenticate, createOrder);
router
  .route("/:id")
  .get(authenticate, getOrder)
  .put(authenticate, authorize, updateOrder);

export default router;
