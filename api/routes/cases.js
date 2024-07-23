import express from "express";
import {
	addCase,
	getCase,
	getCases,
	getUserCases,
	deleteCase,
	updateCase,
	deleteCases,
} from "../controllers/case.js";
import { isAuthenticated } from "../src/middlewares.js";

const router = express.Router();

router.post("/", isAuthenticated, addCase);
router.get("/:id", isAuthenticated, getCase);
router.get("/", isAuthenticated, getCases);
router.get("/user/:id", isAuthenticated, getUserCases);
router.patch("/:id", isAuthenticated, updateCase);
router.delete("/:id", isAuthenticated, deleteCase);
router.delete("/", isAuthenticated, deleteCases);

export default router;
