import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export const generateAccessToken = (user) => {
	return jwt.sign({ userId: user.id }, accessTokenSecret, { expiresIn: "24h" });
};

export const generateRefreshToken = (user, jti) => {
	return jwt.sign(
		{
			userId: user.id,
			jti,
		},
		refreshTokenSecret,
		{
			expiresIn: "48h",
		}
	);
};

export const generateTokens = (user, jti) => {
	const accessToken = generateAccessToken(user);
	const refreshToken = generateRefreshToken(user, jti);

	return {
		accessToken,
		refreshToken,
	};
};
