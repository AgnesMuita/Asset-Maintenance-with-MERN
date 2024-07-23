import express from "express";
import {
	register,
	login,
	logout,
	refreshTokenR,
	revokeRefreshTokensR,
	createMulUsers,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/mulUsers", createMulUsers);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", refreshTokenR);
router.post("/revokeRefreshTokens", revokeRefreshTokensR);

export default router;
