import express from "express";
import { isAuthenticated } from "../src/middlewares.js";
import {
	createActivity,
	deleteActivity,
	getActivitites,
	getActivity,
	updateActivity,
} from "../controllers/activity.js";

const router = express.Router();

router.post("/", isAuthenticated, createActivity);
router.get("/:id", isAuthenticated, getActivity);
router.get("/", isAuthenticated, getActivitites);
router.delete("/:id", isAuthenticated, deleteActivity);
router.patch("/:id", isAuthenticated, updateActivity);

export default router;
