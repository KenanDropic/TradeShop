import express from "express";
import { createOrder, getOrder } from "../controllers/ordersController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(authenticate, createOrder);
router.route("/:id").get(authenticate, getOrder);

export default router;
