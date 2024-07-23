import express from "express";
import { isAuthenticated } from "../src/middlewares.js";
import {
	createEvent,
	deleteEvent,
	getEvents,
	getEvent,
	updateEvent,
} from "../controllers/event.js";

const router = express.Router();

router.post("/", isAuthenticated, createEvent);
router.get("/:id", isAuthenticated, getEvent);
router.get("/", isAuthenticated, getEvents);
router.delete("/:id", isAuthenticated, deleteEvent);
router.patch("/:id", isAuthenticated, updateEvent);

export default router;
