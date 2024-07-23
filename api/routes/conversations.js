import express from "express";
import { isAuthenticated } from "../src/middlewares.js";
import {
	createConversation,
	getConversation,
} from "../controllers/conversation.js";

const router = express.Router();

router.post("/", isAuthenticated, createConversation);
router.get("/:id", isAuthenticated, getConversation);

export default router;
