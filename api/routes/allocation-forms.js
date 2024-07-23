import express from "express";
import { isAuthenticated } from "../src/middlewares.js";
import {
	createAllocationForm,
	createMulAllocationForms,
	deleteAllocationForm,
	getAllocationForm,
	getAllocationForms,
	getDownloadAllocationForm,
	getUrlDownload,
	getViewAllocationForm,
} from "../controllers/allocation-form.js";

const router = express.Router();

router.post("/", isAuthenticated, createAllocationForm);
router.post("/mulDoc", isAuthenticated, createMulAllocationForms);
router.get("/:id", isAuthenticated, getAllocationForm);
router.get("/download/:id", isAuthenticated, getDownloadAllocationForm);
router.get("/download/url/:id", getUrlDownload);
router.get("/view/:id", isAuthenticated, getViewAllocationForm);
router.get("/", isAuthenticated, getAllocationForms);
router.delete("/:id", isAuthenticated, deleteAllocationForm);

export default router;
