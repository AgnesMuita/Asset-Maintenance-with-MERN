import express from "express";
import {
	createAsset,
	createHistory,
	createMulAssets,
	deleteAsset,
	deleteManyAssets,
	getAsset,
	getAssets,
	updateAsset,
} from "../controllers/asset.js";
import { isAuthenticated } from "../src/middlewares.js";

const router = express.Router();

router.post("/", isAuthenticated, createAsset);
router.post("/mulAssets", isAuthenticated, createMulAssets);
router.post("/history", isAuthenticated, createHistory);
router.get("/:id", isAuthenticated, getAsset);
router.get("/", isAuthenticated, getAssets);
router.patch("/:id", isAuthenticated, updateAsset);
router.delete("/:id", isAuthenticated, deleteAsset);
router.delete("/", isAuthenticated, deleteManyAssets);

export default router;
