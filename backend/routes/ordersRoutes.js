import express from "express";
import {
  createOrder,
  getOrder,
  updateOrder,
} from "../controllers/ordersController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(authenticate, createOrder);
router.route("/:id").get(authenticate, getOrder).put(authenticate, updateOrder);

export default router;
