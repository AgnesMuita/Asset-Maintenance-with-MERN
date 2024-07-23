import express from "express";
import { isAuthenticated } from "../src/middlewares.js";
import {
	createAnnouncement,
	deleteAnnouncement,
	getAnnouncements,
	getAnnouncement,
	updateAnnouncement,
	deleteManyAnnouncements,
} from "../controllers/announcement.js";

const router = express.Router();

router.post("/", isAuthenticated, createAnnouncement);
router.get("/:id", isAuthenticated, getAnnouncement);
router.get("/", isAuthenticated, getAnnouncements);
router.patch("/:id", isAuthenticated, updateAnnouncement);
router.delete("/:id", isAuthenticated, deleteAnnouncement);
router.delete("/", isAuthenticated, deleteManyAnnouncements);

export default router;
