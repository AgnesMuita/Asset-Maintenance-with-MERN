import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import cron from "node-cron";

const prisma = new PrismaClient().$extends({
	result: {
		user: {
			fullName: {
				needs: { firstName: true, lastName: true },
				compute(user) {
					return `${user.firstName} ${user.lastName}`;
				},
			},
		},
	},
});

export const getSingleUser = async (req, res) => {
	try {
		const { userId } = req.payload;

		const getUser = await prisma.user.findUnique({
			where: {
				id: String(userId),
			},
			include: {
				assets: true,
				cases: true,
				history: {
					include: {
						user: true,
						asset: true,
					},
					orderBy: {
						issuedAt: "desc",
					},
				},
			},
		});

		delete getUser.password;

		res.status(200).json(getUser);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getUserById = async (req, res) => {
	try {
		const getUser = await prisma.user.findUnique({
			where: {
				id: String(req.params.id),
			},
			include: {
				assets: true,
				cases: true,
				history: {
					include: {
						user: true,
						asset: true,
					},
					orderBy: {
						issuedAt: "desc",
					},
				},
			},
		});

		delete getUser.password;

		res.status(200).json(getUser);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getUserByEmail = async (req, res) => {
	try {
		const getUser = await prisma.user.findUnique({
			where: {
				email: String(req.params.email),
			},
			include: {
				assets: true,
				cases: true,
				history: {
					include: {
						user: true,
						asset: true,
					},
					orderBy: {
						issuedAt: "desc",
					},
				},
			},
		});

		delete getUser.password;

		res.status(200).json(getUser);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getAllUsers = async (req, res) => {
	try {
		const allUsers = await prisma.user.findMany({
			orderBy: {
				updatedAt: "desc",
			},
		});

		const { password, ...users } = allUsers;

		res.status(200).json(users);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const deleteUser = await prisma.user.delete({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(deleteUser);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

// update User
export const updateUser = async (req, res) => {
	const {
		firstName,
		lastName,
		password,
		email,
		phone,
		department,
		jobTitle,
		contactMethod,
		active,
		role,
		assetId,
		deletedAt,
	} = req.body;

	const salt = bcrypt.genSaltSync(12);
	const hash = password && bcrypt.hashSync(password, salt);

	try {
		const updateUser = await prisma.user.update({
			where: {
				id: String(req.params.id),
			},
			data: {
				firstName: firstName,
				lastName: lastName,
				password: hash,
				email: email,
				phone: phone,
				department: department,
				jobTitle: jobTitle,
				contactMethod: contactMethod,
				active: active,
				role: role,
				assets: assetId,
				deletedAt: deletedAt,
			},
		});

		res.status(200).json(updateUser);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteExpiredUsers = async (req, res) => {
	try {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const expiredUsers = await prisma.user.findMany({
			where: {
				deletedAt: {
					lt: thirtyDaysAgo,
				},
			},
		});

		for (const user of expiredUsers) {
			// Permanently delete the user record
			await prisma.user.delete({
				where: { id: user.id },
			});
		}

		res.status(200).json(expiredUsers);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

// Schedule the task to run daily using node-cron
cron.schedule("*/1 * * * *", deleteExpiredUsers);
