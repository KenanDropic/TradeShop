import express from "express";
import {
  registerUser,
  loginUser,
  getLoggedUser,
  updateUser,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router
  .route("/profile")
  .get(authenticate, getLoggedUser)
  .put(authenticate, updateUser);

export default router;
