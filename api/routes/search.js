import express from "express";
import {
	getKarticles,
	getAssets,
	getCases,
	getActivities,
	getNResults,
} from "../controllers/search.js";
import { isAuthenticated } from "../src/middlewares.js";

const router = express.Router();

router.get("/qnone", isAuthenticated, getNResults);
router.get("/qcases", isAuthenticated, getCases);
router.get("/qkarticles", isAuthenticated, getKarticles);
router.get("/qactivities", isAuthenticated, getActivities);
router.get("/qassets", isAuthenticated, getAssets);

export default router;
