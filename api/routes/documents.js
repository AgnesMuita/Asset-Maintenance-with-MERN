import express from "express";
import { isAuthenticated } from "../src/middlewares.js";
import {
	createDocument,
	deleteDocument,
	getDocuments,
	getDocument,
	updateDocument,
	createMulDocuments,
	getDownloadDocument,
	getViewDocument,
	getUrlDownload,
	deleteManyDocs,
} from "../controllers/document.js";

const router = express.Router();

router.post("/", isAuthenticated, createDocument);
router.post("/mulDoc", isAuthenticated, createMulDocuments);
router.get("/:id", isAuthenticated, getDocument);
router.get("/download/:id", isAuthenticated, getDownloadDocument);
router.get("/download/url/:id", getUrlDownload);
router.get("/view/:id", isAuthenticated, getViewDocument);
router.get("/", isAuthenticated, getDocuments);
router.patch("/:id", isAuthenticated, updateDocument);
router.delete("/:id", isAuthenticated, deleteDocument);
router.delete("/", isAuthenticated, deleteManyDocs);

export default router;
