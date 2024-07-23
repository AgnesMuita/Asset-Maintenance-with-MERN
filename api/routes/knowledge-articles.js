import express from "express";
import {
	createArticle,
	deleteArticle,
	deleteManyArticles,
	getArticle,
	getArticles,
	getUserArticles,
	incViewCount,
	updateArticle,
} from "../controllers/knowledge-article.js";
import { isAuthenticated } from "../src/middlewares.js";

const router = express.Router();

router.post("/", isAuthenticated, createArticle);
router.post("/views/:id", isAuthenticated, incViewCount);
router.get("/:id", isAuthenticated, getArticle);
router.get("/user/:id", isAuthenticated, getUserArticles);
router.get("/", isAuthenticated, getArticles);
router.patch("/:id", isAuthenticated, updateArticle);
router.delete("/:id", isAuthenticated, deleteArticle);
router.delete("/", isAuthenticated, deleteManyArticles);

export default router;
