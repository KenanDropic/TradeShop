import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productsController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(authenticate, authorize("admin"), createProduct);
router
  .route("/:id")
  .get(getProduct)
  .delete(authenticate, authorize("admin"), deleteProduct)
  .put(authenticate, authorize("admin"), updateProduct);

export default router;
