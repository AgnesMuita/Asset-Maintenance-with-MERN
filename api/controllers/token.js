import { PrismaClient } from "@prisma/client";
import { hashToken } from "../src/utils/hashToken.js";

const prisma = new PrismaClient();

// used when a refresh token is created
export const addRefreshTokenToWhiteList = ({ jti, refreshToken, userId }) => {
	return prisma.token.create({
		data: {
			id: jti,
			hashedToken: hashToken(refreshToken),
			userId,
		},
	});
};

// check if token sent by cleint is in the database
export const findRefreshTokenById = (id) => {
	return prisma.token.findUnique({
		where: {
			id,
		},
	});
};

// soft delete tokens after usage
export const deleteRefreshToken = (id) => {
	return prisma.token.update({
		where: {
			id,
		},
		data: {
			revoked: true,
		},
	});
};

export const revokeTokens = (userId) => {
	return prisma.token.updateMany({
		where: {
			userId,
		},
		data: {
			revoked: true,
		},
	});
};
