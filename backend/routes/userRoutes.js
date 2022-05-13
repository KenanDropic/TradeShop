import express from "express";
import {
  registerUser,
  loginUser,
  getLoggedUser,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile").get(authenticate, getLoggedUser);

export default router;
