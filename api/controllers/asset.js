import { PrismaClient } from "@prisma/client";
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

export const getAssets = async (req, res, next) => {
	try {
		const allAssets = await prisma.asset.findMany({
			orderBy: {
				updatedAt: "desc",
			},
			include: {
				user: true,
				cases: true,
				queues: true,
				history: {
					include: {
						user: true,
						issuedBy: true,
						asset: true,
						allocationForm: true,
					},
					orderBy: {
						issuedAt: "desc",
					},
				},
				allocationForms: {
					include: {
						createdBy: true,
						modifiedBy: true,
						relatedAsset: true,
						history: true,
					},
					orderBy: {
						createdAt: "desc",
					},
				},
			},
		});

		res.status(200).json(allAssets);
	} catch (error) {
		next(error);
	}
};

export const getAsset = async (req, res, next) => {
	try {
		const getAsset = await prisma.asset.findUnique({
			where: {
				id: String(req.params.id),
			},
			include: {
				user: true,
				cases: true,
				queues: true,
				history: {
					include: {
						user: true,
						issuedBy: true,
						asset: true,
						allocationForm: true,
					},
					orderBy: {
						issuedAt: "desc",
					},
				},
				allocationForms: {
					include: {
						createdBy: true,
						modifiedBy: true,
						relatedAsset: true,
						history: true,
					},
					orderBy: {
						createdAt: "desc",
					},
				},
				maintenance: true,
			},
		});

		res.status(200).json(getAsset);
	} catch (error) {
		next(error);
	}
};

export const createAsset = async (req, res) => {
	const {
		tag,
		name,
		deviceName,
		color,
		category,
		manufacturer,
		model,
		serialNo,
		location,
		accessories,
		batterySNo,
		adaptorRatings,
		department,
		condition,
		assetStatus,
		specification,
		conditionalNotes,
		userId,
		createdById: createdById,
	} = req.body;

	try {
		const createAsset = await prisma.asset.create({
			data: {
				tag: tag,
				name: name,
				deviceName: deviceName,
				color: color,
				category: category,
				manufacturer: manufacturer,
				model: model,
				serialNo: serialNo,
				location: location,
				accessories: accessories,
				batterySNo: batterySNo,
				adaptorRatings: adaptorRatings,
				department: department,
				condition: condition,
				assetStatus: assetStatus,
				specification: specification,
				conditionalNotes: conditionalNotes,
				userId: userId,
				createdById: createdById,
			},
		});

		// await prisma.itemCount.upsert({
		// 	where: {
		// 		fixed: true,
		// 	},
		// 	update: {
		// 		assets: {
		// 			increment: 1,
		// 		},
		// 	},
		// 	create: {
		// 		assets: 1,
		// 	},
		// });

		res.status(201).json(createAsset);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const createMulAssets = async (req, res) => {
	try {
		const { data, userId, createdById } = req.body;

		const assetData = data.map((asset) => ({
			tag: asset.tag,
			name: asset.name,
			deviceName: asset.deviceName,
			color: asset.color,
			category: asset.category,
			manufacturer: asset.manufacturer,
			model: asset.model,
			serialNo: asset.serialNo,
			location: asset.location,
			accessories: asset.accessories,
			batterySNo: asset.batterySNo,
			adaptorRatings: String(asset.adaptorRatings),
			department: asset.department,
			condition: asset.condition,
			assetStatus: asset.assetStatus,
			specification: asset.specification,
			conditionalNotes: asset.conditionalNotes,
			userId: userId,
			createdById: createdById,
		}));

		const createMulAssets = await prisma.asset.createMany({
			data: assetData,
		});

		res.status(201).json(createMulAssets);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const updateAsset = async (req, res) => {
	const {
		tag,
		name,
		deviceName,
		color,
		active,
		category,
		manufacturer,
		model,
		serialNo,
		location,
		accessories,
		batterySNo,
		adaptorRatings,
		department,
		condition,
		assetStatus,
		specification,
		conditionalNotes,
		userId,
		deletedAt,
	} = req.body;

	try {
		const updateAsset = await prisma.asset.update({
			where: {
				id: String(req.params.id),
			},
			data: {
				tag: tag,
				name: name,
				deviceName: deviceName,
				color: color,
				active: active,
				category: category,
				manufacturer: manufacturer,
				model: model,
				serialNo: serialNo,
				location: location,
				accessories: accessories,
				batterySNo: batterySNo,
				adaptorRatings: adaptorRatings,
				department: department,
				condition: condition,
				assetStatus: assetStatus,
				specification: specification,
				conditionalNotes: conditionalNotes,
				userId: userId,
				deletedAt: deletedAt,
			},
		});

		res.status(200).json(updateAsset);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteAsset = async (req, res, next) => {
	try {
		const deleteAsset = await prisma.asset.delete({
			where: {
				id: String(req.params.id),
			},
		});
		res.status(200).json(deleteAsset);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteManyAssets = async (req, res) => {
	const { ids } = req.body;

	try {
		const deleteManyAssets = await prisma.asset.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		res.status(200).json(deleteManyAssets);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const createHistory = async (req, res) => {
	const {
		userId,
		issuedById,
		assetId,
		assetLocation,
		assetConditionalNotes,
		assetCondtion,
		assetStatus,
	} = req.body;

	try {
		const createHistory = await prisma.assetHistory.create({
			data: {
				assetLocation: assetLocation,
				assetConditionalNotes: assetConditionalNotes,
				assetCondtion: assetCondtion,
				assetStatus: assetStatus,
				asset: {
					connect: {
						id: assetId,
					},
				},
				user: {
					connect: {
						id: userId,
					},
				},
				issuedBy: {
					connect: {
						id: issuedById,
					},
				},
			},
		});

		res.status(201).json(createHistory);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteExpiredAssets = async (req, res) => {
	try {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const expiredAssets = await prisma.asset.findMany({
			where: {
				deletedAt: {
					lt: thirtyDaysAgo,
				},
			},
		});

		for (const asset of expiredAssets) {
			// Permanently delete the asset record
			await prisma.asset.delete({
				where: { id: asset.id },
			});
		}

		res.status(200).json(expiredAssets);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

// Schedule the task to run daily using node-cron
cron.schedule("*/1 * * * *", deleteExpiredAssets);
