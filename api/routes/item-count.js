import express from "express";
import { isAuthenticated } from "../src/middlewares.js";
import {
	countAllAnnouncements,
	countAllArticles,
	countAllAssets,
	countAllCases,
	countAllDocuments,
	countAllEvents,
	countAllLogs,
	countAllNews,
	countAllUsers,
	countUserAnnouncements,
	countUserArticles,
	countUserAssets,
	countUserCases,
	countUserDocuments,
	countUserEvents,
	countUserLogs,
	countUserNews,
	countUserUsers,
} from "../controllers/item-count.js";

const router = express.Router();

router.get("/cases", isAuthenticated, countAllCases);
router.get("/cases/:id", isAuthenticated, countUserCases);
router.get("/articles", isAuthenticated, countAllArticles);
router.get("/articles/:id", isAuthenticated, countUserArticles);
router.get("/assets", isAuthenticated, countAllAssets);
router.get("/assets/:id", isAuthenticated, countUserAssets);
router.get("/documents", isAuthenticated, countAllDocuments);
router.get("/documents/:id", isAuthenticated, countUserDocuments);
router.get("/logs", isAuthenticated, countAllLogs);
router.get("/logs/:id", isAuthenticated, countUserLogs);
router.get("/announcements", isAuthenticated, countAllAnnouncements);
router.get("/announcements/:id", isAuthenticated, countUserAnnouncements);
router.get("/news", isAuthenticated, countAllNews);
router.get("/news/:id", isAuthenticated, countUserNews);
router.get("/events", isAuthenticated, countAllEvents);
router.get("/events/:id", isAuthenticated, countUserEvents);
router.get("/users", isAuthenticated, countAllUsers);
router.get("/users/:id", isAuthenticated, countUserUsers);

export default router;
