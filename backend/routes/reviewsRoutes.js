import express from "express";
import {
  createReview,
  deleteReview,
} from "../controllers/reviewsController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

router.route("/").post(authenticate, createReview);
router.route("/:id").delete(authenticate, deleteReview);

export default router;
