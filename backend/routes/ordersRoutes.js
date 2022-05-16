import express from "express";
import {
  createOrder,
  getOrder,
  getUserOrders,
  updateOrder,
} from "../controllers/ordersController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });
//mergeParams znači da dozvoljava parametre iz drugih ruta. Specifično,u ovom slučaju to je ruta bootcamps/:bootcampId/courses

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, getUserOrders);
router.route("/:id").get(authenticate, getOrder).put(authenticate, updateOrder);

export default router;
