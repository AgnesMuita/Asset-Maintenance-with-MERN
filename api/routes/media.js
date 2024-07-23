import express from "express";
import {
	createArticleMedia,
	createArticleMulMedia,
	createCaseMedia,
	createCaseMulMedia,
	createLogMedia,
	createLogMulMedia,
	deleteMedia,
	getArticleMedia,
	getCaseMedia,
	getLogMedia,
	getUserMedia,
} from "../controllers/media.js";
import { isAuthenticated } from "../src/middlewares.js";

const router = express.Router();

router.post("/articleMedia", isAuthenticated, createArticleMedia);
router.post("/caseMedia", isAuthenticated, createCaseMedia);
router.post("/logMedia", isAuthenticated, createLogMedia);
router.post("/articleMulMedia", isAuthenticated, createArticleMulMedia);
router.post("/caseMulMedia", isAuthenticated, createCaseMulMedia);
router.post("/logMulMedia", isAuthenticated, createLogMulMedia);
router.get("/articleMedia/:id", isAuthenticated, getArticleMedia);
router.get("/caseMedia/:id", isAuthenticated, getCaseMedia);
router.get("/logMedia/:id", isAuthenticated, getLogMedia);
router.get("/userMedia/:id", isAuthenticated, getUserMedia);
router.delete("/:id", isAuthenticated, deleteMedia);

export default router;
