import express from "express";
import { isAuthenticated } from "../src/middlewares.js";
import {
	createNewsArticle,
	deleteNews,
	getNews,
	getNewsArticle,
	updateNews,
} from "../controllers/news.js";

const router = express.Router();

router.post("/", isAuthenticated, createNewsArticle);
router.get("/:id", isAuthenticated, getNewsArticle);
router.get("/", isAuthenticated, getNews);
router.delete("/:id", isAuthenticated, deleteNews);
router.patch("/:id", isAuthenticated, updateNews);

export default router;
