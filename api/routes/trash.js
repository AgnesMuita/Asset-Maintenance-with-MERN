import express from "express";
import { isAuthenticated } from "../src/middlewares.js";
import {
	addToTrash,
	deleteManyTrash,
	deleteTrash,
	emptyTrash,
	getSingleTrash,
	getTrash,
} from "../controllers/trash.js";

const router = express.Router();

router.post("/", isAuthenticated, addToTrash);
router.get("/", isAuthenticated, getTrash);
router.get("/:id", isAuthenticated, getSingleTrash);
router.delete("/:id", isAuthenticated, deleteTrash);
router.delete("/", isAuthenticated, deleteManyTrash);
router.delete("/empty", isAuthenticated, emptyTrash);

export default router;
