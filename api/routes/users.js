import express from "express";
import {
	getAllUsers,
	getSingleUser,
	deleteUser,
	updateUser,
	getUserById,
	getUserByEmail,
} from "../controllers/user.js";
import { isAuthenticated } from "../src/middlewares.js";

const router = express.Router();

router.get("/profile", isAuthenticated, getSingleUser);
router.get("/:id", isAuthenticated, getUserById);
router.get("/email/:email", getUserByEmail);
router.get("/", isAuthenticated, getAllUsers);
router.delete("/:id", isAuthenticated, deleteUser);
router.patch("/:id", isAuthenticated, updateUser);

export default router;
