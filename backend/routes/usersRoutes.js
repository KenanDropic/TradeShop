import express from "express";
import { deleteUser, getUsers } from "../controllers/usersController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize);

// Admin only
router.route("/").get(getUsers);
router.route("/:id").delete(deleteUser);

export default router;
