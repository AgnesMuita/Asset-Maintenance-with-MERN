import { Prisma, PrismaClient } from "@prisma/client";
import { generateUniqueCaseNumber } from "../src/utils/generateUniqueCaseNumber.js";
// import { sendNotificationToClients } from "../src/utils/sendfCM.js";
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

//create a case
export const addCase = async (req, res) => {
	const {
		caseTitle,
		subject,
		priority,
		software,
		hardware,
		description,
		caseStatus,
		ownerId,
		assetId,
	} = req.body;

	try {
		const createCase = await prisma.case.create({
			data: {
				caseNumber: generateUniqueCaseNumber(),
				caseTitle: caseTitle,
				subject: subject,
				priority: priority,
				hardware: hardware,
				software: software,
				Description: description,
				status: caseStatus,
				ownerId: ownerId,
				assetId: assetId,
			},
		});

		// await prisma.itemCount.upsert({
		// 	where: {
		// 		fixed: true,
		// 	},
		// 	update: {
		// 		cases: {
		// 			increment: 1,
		// 		},
		// 	},
		// 	create: {
		// 		cases: 1,
		// 	},
		// });

		// sendNotificationToClients(createCase);

		res.status(201).json(createCase);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

// get a single case
export const getCase = async (req, res) => {
	try {
		const getSingleCase = await prisma.case.findUnique({
			where: {
				id: String(req.params.id),
			},
			include: {
				owner: true,
				asset: true,
				conversation: true,
			},
		});
		res.status(200).json(getSingleCase);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

// Get user cases
export const getUserCases = async (req, res) => {
	try {
		const userCases = await prisma.case.findMany({
			where: {
				ownerId: String(req.params.id),
			},
			include: {
				owner: true,
				asset: true,
				conversation: true,
			},
			orderBy: {
				updatedAt: "desc",
			},
		});
		res.status(200).json(userCases);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

// get all cases
export const getCases = async (req, res) => {
	const { status, currStatus } = req.query;

	try {
		let whereClause = {};

		// Construct the where clause dynamically based on query parameters
		if (status) {
			whereClause.status = status;
		}

		if (currStatus) {
			whereClause.currStatus = currStatus;
		}
		const allCases = await prisma.case.findMany({
			where: whereClause,
			include: {
				owner: true,
				asset: true,
				conversation: true,
			},
			orderBy: {
				updatedAt: "desc",
			},
		});
		res.status(200).json(allCases);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

// update a case
export const updateCase = async (req, res) => {
	const {
		caseTitle,
		subject,
		priority,
		hardware,
		software,
		origin,
		description,
		caseStatus,
		assetId,
		resolved,
		cancelled,
		resolType,
		resolution,
		currStatus,
		technician,
		deletedAt,
	} = req.body;

	try {
		const updateCase = await prisma.case.update({
			where: {
				id: String(req.params.id),
			},
			data: {
				caseTitle: caseTitle,
				subject: subject,
				priority: priority,
				hardware: hardware,
				software: software,
				origin: origin,
				resolved: resolved,
				cancelled: cancelled,
				Description: description,
				status: caseStatus,
				currStatus: currStatus,
				assetId: assetId,
				resolType: resolType,
				resolution: resolution,
				technician: technician,
				assetId: assetId,
				deletedAt: deletedAt,
			},
			include: {
				asset: true,
				owner: true,
			},
		});
		res.status(200).json(updateCase);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

// delete a case
export const deleteCase = async (req, res) => {
	try {
		const deleteCase = await prisma.case.delete({
			where: {
				id: String(req.params.id),
			},
		});
		res.status(200).json(deleteCase);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

// delete a case
export const deleteCases = async (req, res) => {
	const { ids } = req.body;

	try {
		const deleteCases = await prisma.case.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		res.status(200).json(deleteCases);
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2025"
		) {
			res.status(400).json("Record not found");
		}
		{
			res.status(400).json({ msg: error.message });
		}
	}
};

export const deleteExpiredCases = async (req, res) => {
	try {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const expiredCases = await prisma.case.findMany({
			where: {
				deletedAt: {
					lt: thirtyDaysAgo,
				},
			},
		});

		for (const caseI of expiredCases) {
			// Permanently delete the case record
			await prisma.case.delete({
				where: { id: caseI.id },
			});
		}

		res.status(200).json(expiredCases);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

// Schedule the task to run daily using node-cron
cron.schedule("*/1 * * * *", deleteExpiredCases);
