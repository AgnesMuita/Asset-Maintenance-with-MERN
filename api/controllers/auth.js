import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { generateTokens } from "../src/utils/jwt.js";
import {
	addRefreshTokenToWhiteList,
	deleteRefreshToken,
	findRefreshTokenById,
	revokeTokens,
} from "./token.js";
import { hashToken } from "../src/utils/hashToken.js";
import { createCustomAvatar } from "../src/utils/createCustomAvatar.js";

const prisma = new PrismaClient();

export const register = async (req, res) => {
	const {
		firstName,
		lastName,
		password,
		email,
		phone,
		department,
		jobTitle,
		contactMethod,
		role,
		assetId,
		createdById,
	} = req.body;

	const salt = bcrypt.genSaltSync(12);
	const hash = bcrypt.hashSync(password, salt);

	try {
		const createUser = await prisma.user.create({
			data: {
				firstName: firstName,
				lastName: lastName,
				password: hash,
				email: email,
				avatar: createCustomAvatar(),
				phone: phone,
				department: department,
				jobTitle: jobTitle,
				contactMethod: contactMethod,
				role: role,
				assets: assetId,
				createdById: createdById,
			},
			include: {
				assets: true,
			},
		});

		const jti = uuidv4();
		const { accessToken, refreshToken } = generateTokens(createUser, jti);
		await addRefreshTokenToWhiteList({
			jti,
			refreshToken,
			userId: createUser.id,
		});

		// await prisma.itemCount.upsert({
		// 	where: {
		// 		fixed: true,
		// 	},
		// 	update: {
		// 		users: {
		// 			increment: 1,
		// 		},
		// 	},
		// 	create: {
		// 		users: 1,
		// 	},
		// });

		res.status(201).json({ createUser, accessToken, refreshToken });
	} catch (error) {
		res.status(400).json({ msg: error.message });
		res.status(409).json({ msg: error.message });
	}
};

export const createMulUsers = async (req, res) => {
	try {
		const { data, createdById } = req.body;

		const salt = bcrypt.genSaltSync(12);

		const userData = data.map((user) => ({
			firstName: user.firstName,
			lastName: user.lastName,
			password: bcrypt.hashSync(user.password, salt),
			email: user.email,
			avatar: createCustomAvatar(),
			phone: user.phone,
			department: user.department,
			jobTitle: user.jobTitle,
			contactMethod: user.contactMethod,
			role: user.role,
			createdById: createdById,
		}));

		const createMulUsers = await prisma.user.createMany({
			data: userData,
		});

		res.status(201).json(createMulUsers);
	} catch (error) {
		res.status(400).json({ msg: error.message });
		res.status(409).json({ msg: error.message });
	}
};

// Login subroutine
export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json("You must provide an email and password.");
		}

		const getUser = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!getUser) {
			return res.status(404).json("User not found!");
		}

		const isPasswordAccept = bcrypt.compareSync(password, getUser.password);
		if (!isPasswordAccept)
			return res.status(403).json("Email or password not valid!");

		const jti = uuidv4();

		const { accessToken, refreshToken } = generateTokens(getUser, jti);
		await addRefreshTokenToWhiteList({
			jti,
			refreshToken,
			userId: getUser.id,
		});

		res.status(200).json({ accessToken, refreshToken });
	} catch (error) {
		next(error);
	}
};

export const logout = (req, res) => {};

export const refreshTokenR = async (req, res, next) => {
	try {
		const { refreshToken } = req.body;

		if (!refreshToken) {
			res.status(400).json("Missing refresh token.");
		}
		const payload = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);
		const savedRefreshToken = await findRefreshTokenById(payload.jti);

		if (!savedRefreshToken || savedRefreshToken.revoked === true) {
			res.status(401).json("Unauthorized");
		}

		const hashedToken = hashToken(refreshToken);
		if (hashedToken !== savedRefreshToken.hashedToken) {
			res.status(401).json("Unauthorized");
		}

		const user = prisma.user.findUnique({
			where: {
				id: payload.userId,
			},
		});
		if (!user) {
			res.status(401).json("Unauthorized");
		}

		await deleteRefreshToken(savedRefreshToken.id);
		const jti = uuidv4();
		const { accessToken, refreshToken: newRefreshToken } = generateTokens(
			user,
			jti
		);
		await addRefreshTokenToWhiteList({
			jti,
			refreshToken: newRefreshToken,
			userId: user.id,
		});

		res.status(200).json({ accessToken, refreshToken: newRefreshToken });
	} catch (error) {
		next(error);
	}
};

export const revokeRefreshTokensR = async (req, res, next) => {
	try {
		const { userId } = req.body;

		await revokeTokens(userId);

		res.status(200).json({
			message: `Tokens revoked for user with id #${userId}`,
		});
	} catch (error) {
		next(error);
	}
};
