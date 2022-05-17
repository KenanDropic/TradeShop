import express from "express";
import { getUsers } from "../controllers/usersController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Admin only
router.route("/").get(authenticate, authorize, getUsers);

export default router;
