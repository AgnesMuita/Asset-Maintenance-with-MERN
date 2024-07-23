import express from "express";
import { isAuthenticated } from "../src/middlewares.js";
import {
	createQueue,
	deleteQueue,
	getQueue,
	getQueues,
	updateQueue,
} from "../controllers/queue.js";

const router = express.Router();

router.post("/", isAuthenticated, createQueue);
router.get("/:id", isAuthenticated, getQueue);
router.get("/", isAuthenticated, getQueues);
router.delete("/:id", isAuthenticated, deleteQueue);
router.patch("/:id", isAuthenticated, updateQueue);

export default router;
