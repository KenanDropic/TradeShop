import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/usersController.js";
import { advRes } from "../middleware/advRes.js";
import { authenticate, authorize } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize("admin"));

// Admin only
router.route("/").get(advRes(User), getUsers);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;
