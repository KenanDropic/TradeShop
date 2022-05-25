import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productsController.js";
import Product from "../models/Product.js";
import { advRes } from "../middleware/advRes.js";
import { authenticate, authorize } from "../middleware/auth.js";
import reviewsRoutes from "./reviewsRoutes.js";

const router = express.Router();

// re-route into reviewsRoutes
router.use("/:id/reviews", reviewsRoutes);

router
  .route("/")
  .get(advRes(Product), getProducts)
  .post(authenticate, authorize("admin"), createProduct);
router
  .route("/:id")
  .get(getProduct)
  .delete(authenticate, authorize("admin"), deleteProduct)
  .put(authenticate, authorize("admin"), updateProduct);

export default router;
