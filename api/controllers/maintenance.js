import { PrismaClient } from "@prisma/client";

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

export const createMaintenance = async (req, res) => {
	const { title, description, tags, remarks, userId, assetId } = req.body;

	try {
		const createMaintenance = await prisma.maintenance.create({
			data: {
				title: title,
				description: description,
				tags: tags,
				remarks: remarks,
				userId: userId,
				assetId: assetId,
			},
		});

		// await prisma.itemCount.upsert({
		// 	where: {
		// 		fixed: true,
		// 	},
		// 	update: {
		// 		logs: {
		// 			increment: 1,
		// 		},
		// 	},
		// 	create: {
		// 		logs: 1,
		// 	},
		// });

		res.status(201).json(createMaintenance);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getMaintenanceLogs = async (req, res, next) => {
	try {
		const getMaintenanceLogs = await prisma.maintenance.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				performedBy: true,
				asset: true,
			},
		});

		res.status(200).json(getMaintenanceLogs);
	} catch (error) {
		next(error);
	}
};

export const getMaintenance = async (req, res, next) => {
	try {
		const getMaintenance = await prisma.maintenance.findUnique({
			where: {
				id: String(req.params.id),
			},
			include: {
				performedBy: true,
				asset: true,
			},
		});

		res.status(200).json(getMaintenance);
	} catch (error) {
		next(error);
	}
};

export const getUserMaintenances = async (req, res, next) => {
	try {
		const getUserMaintenances = await prisma.maintenance.findMany({
			where: {
				createdById: String(req.params.id),
			},
			include: {
				performedBy: true,
				asset: true,
			},
		});

		res.status(200).json(getUserMaintenances);
	} catch (error) {
		next(error);
	}
};

export const updateMaintenance = async (req, res) => {
	const { title, description, tags, remarks, userId, assetId } = req.body;

	try {
		const updateMaintenance = await prisma.maintenance.update({
			where: {
				id: String(req.params.id),
			},
			data: {
				title: title,
				description: description,
				tags: tags,
				remarks: remarks,
				userId: userId,
				assetId: assetId,
			},
		});
		res.status(201).json(updateMaintenance);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteMaintenance = async (req, res) => {
	try {
		const deleteMaintenance = await prisma.maintenance.delete({
			where: {
				id: String(req.params.id),
			},
		});
		res.status(200).json(deleteMaintenance);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteManyLogs = async (req, res) => {
	const { ids } = req.body;

	try {
		const deleteManyLogs = await prisma.maintenance.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		res.status(200).json(deleteManyLogs);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
