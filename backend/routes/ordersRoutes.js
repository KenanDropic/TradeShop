import express from "express";
import {
  createOrder,
  getOrder,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/ordersController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });
//mergeParams znači da dozvoljava parametre iz drugih ruta. Specifično,u ovom slučaju to je ruta bootcamps/:bootcampId/courses

router.route("/").post(authenticate, createOrder).get(authenticate, getOrders);
router
  .route("/:id")
  .get(authenticate, getOrder)
  .put(authenticate, updateOrderToPaid);
router
  .route("/:id/delivered")
  .put(authenticate, authorize("admin"), updateOrderToDelivered);

export default router;
