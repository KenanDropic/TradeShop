import express from "express";
import {
  registerUser,
  loginUser,
  getLoggedUser,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import ordersRouter from "./ordersRoutes.js";

const router = express.Router();

// re-route into another resource router. Kada se aktivira ruta /api/v1/auth/:userId/orders vrši se proslijeđivanje na order routes i tamo se handluje ta akcija
router.use("/:userId/orders", ordersRouter);

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile").get(authenticate, getLoggedUser);

export default router;
