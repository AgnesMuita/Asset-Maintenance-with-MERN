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
		knowledgeArticle: {
			articlePublicNo: {
				needs: { articlePNumber: true },
				compute(knowledgeArticle) {
					return `KA-${knowledgeArticle.articlePNumber
						.toString()
						.padStart(4, "0")}`;
				},
			},
		},
	},
});

export const addToTrash = async (req, res) => {
	const { articleId, caseId, assetId, userId, trashedById } = req.body;

	try {
		let addToTrash;
		if (caseId) {
			addToTrash = await prisma.trash.create({
				data: {
					trashedById: trashedById,
					trashedCaseId: caseId,
				},
			});
		} else if (articleId) {
			addToTrash = await prisma.trash.create({
				data: {
					trashedById: trashedById,
					trashedArticleId: articleId,
				},
			});
		} else if (assetId) {
			addToTrash = await prisma.trash.create({
				data: {
					trashedById: trashedById,
					trashedAssetId: assetId,
				},
			});
		} else if (userId) {
			addToTrash = await prisma.trash.create({
				data: {
					trashedById: trashedById,
					trashedUserId: userId,
				},
			});
		} else {
			res.status(400).json({ msg: "Item to add not found" });
		}

		res.status(201).json(addToTrash);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getSingleTrash = async (req, res) => {
	try {
		const singleTrash = await prisma.trash.findUnique({
			where: {
				id: String(req.params.id),
			},
			include: {
				trashedArticle: true,
				trashedAsset: true,
				trashedBy: true,
				trashedCase: true,
				trashedUser: true,
			},
		});

		res.status(200).json(singleTrash);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getTrash = async (req, res) => {
	try {
		const allTrash = await prisma.trash.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				trashedArticle: true,
				trashedAsset: true,
				trashedBy: true,
				trashedCase: true,
				trashedUser: true,
			},
		});

		res.status(200).json(allTrash);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteTrash = async (req, res) => {
	try {
		const deleteTrash = await prisma.trash.delete({
			where: {
				id: String(req.params.id),
			},
		});
		res.status(200).json(deleteTrash);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const emptyTrash = async (req, res) => {
	try {
		const emptyTrash = await prisma.trash.deleteMany({});
		res.status(200).json(emptyTrash);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteManyTrash = async (req, res) => {
	const { ids } = req.body;

	try {
		const deleteManyTrash = await prisma.trash.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		res.status(200).json(deleteManyTrash);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
