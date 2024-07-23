import express from "express";
import { isAuthenticated } from "../src/middlewares.js";
import {
	createMaintenance,
	deleteMaintenance,
	deleteManyLogs,
	getMaintenance,
	getMaintenanceLogs,
	getUserMaintenances,
	updateMaintenance,
} from "../controllers/maintenance.js";

const router = express.Router();

router.post("/", isAuthenticated, createMaintenance);
router.get("/:id", isAuthenticated, getMaintenance);
router.get("/user/:id", isAuthenticated, getUserMaintenances);
router.get("/", isAuthenticated, getMaintenanceLogs);
router.patch("/:id", isAuthenticated, updateMaintenance);
router.delete("/:id", isAuthenticated, deleteMaintenance);
router.delete("/", isAuthenticated, deleteManyLogs);

export default router;
