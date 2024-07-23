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

export const createArticle = async (req, res) => {
	const {
		title,
		status,
		description,
		keywords,
		content,
		majorVNo,
		minorVNo,
		published,
		stage,
		publishSubject,
		reviewStatus,
		publishedOn,
		expirationDate,
		ownerId,
		modifierId,
		relatedArticleId,
	} = req.body;

	try {
		const createArticle = await prisma.knowledgeArticle.create({
			data: {
				title: title,
				status: status,
				description: description,
				keywords: keywords,
				content: content,
				stage: stage,
				majorVNo: majorVNo,
				minorVNo: minorVNo,
				published: published,
				publishedOn: publishedOn,
				publishSubject: publishSubject,
				reviewStatus: reviewStatus,
				expirationDate: expirationDate,
				modifierId: modifierId,
				ownerId: ownerId,
				relatedArticleId: relatedArticleId,
			},
		});

		// await prisma.itemCount.upsert({
		// 	where: {
		// 		fixed: true,
		// 	},
		// 	update: {
		// 		articles: {
		// 			increment: 1,
		// 		},
		// 	},
		// 	create: {
		// 		articles: 1,
		// 	},
		// });

		res.status(201).json(createArticle);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

const sessionMap = new Map();

export const incViewCount = async (req, res) => {
	const articleId = req.params.id;
	const sessionId = req.cookies.sessionId;

	try {
		// Check if session has viewed this article recently
		if (
			sessionMap.has(sessionId) &&
			sessionMap.get(sessionId).includes(articleId)
		) {
			return res
				.status(400)
				.json({ msg: "Duplicate view within a short period" });
		}

		const getArticle = await prisma.knowledgeArticle.findUnique({
			where: {
				id: String(articleId),
			},
		});

		if (!getArticle) {
			return res
				.status(404)
				.json({ msg: "Knowledge article not found!" });
		}

		// Increment view count
		await prisma.knowledgeArticle.update({
			where: {
				id: String(articleId),
			},
			data: {
				views: getArticle.views + 1,
			},
		});

		// update sessionmap to mark article as viewed in this session
		if (!sessionMap.has(sessionId)) {
			sessionMap.set(sessionId, [articleId]);
		} else {
			sessionMap.get(sessionId).push(articleId);
		}

		res.status(200).json({ msg: "View count updated successfully" });
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const getArticles = async (req, res) => {
	try {
		const allArticles = await prisma.knowledgeArticle.findMany({
			include: {
				owner: true,
				modifier: true,
				relatedArticle: true,
				media: true,
			},
			orderBy: {
				modifiedAt: "desc",
			},
		});

		res.status(200).json(allArticles);
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

export const getArticle = async (req, res) => {
	try {
		const getArticle = await prisma.knowledgeArticle.findUnique({
			where: {
				id: String(req.params.id),
			},
			include: {
				owner: true,
				modifier: true,
				relatedArticle: true,
				media: true,
			},
		});

		res.status(200).json(getArticle);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getUserArticles = async (req, res) => {
	try {
		const getUserArticles = await prisma.knowledgeArticle.findMany({
			where: {
				ownerId: String(req.params.id),
			},
			include: {
				owner: true,
				modifier: true,
				relatedArticle: true,
				media: true,
			},
		});

		res.status(200).json(getUserArticles);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const updateArticle = async (req, res) => {
	const {
		title,
		status,
		description,
		keywords,
		content,
		majorVNo,
		minorVNo,
		stage,
		approved,
		draft,
		views,
		visibility,
		published,
		publishSubject,
		reviewStatus,
		publishedOn,
		expirationDate,
		ownerId,
		modifierId,
		relatedArticleId,
		deletedAt,
	} = req.body;

	try {
		const updateArticle = await prisma.knowledgeArticle.update({
			where: {
				id: String(req.params.id),
			},
			data: {
				title: title,
				status: status,
				description: description,
				keywords: keywords,
				content: content,
				majorVNo: majorVNo,
				minorVNo: minorVNo,
				published: published,
				stage: stage,
				approved: approved,
				draft: draft,
				views: views,
				visibility: visibility,
				publishedOn: publishedOn,
				publishSubject: publishSubject,
				reviewStatus: reviewStatus,
				expirationDate: expirationDate,
				modifierId: modifierId,
				ownerId: ownerId,
				relatedArticleId: relatedArticleId,
				deletedAt: deletedAt,
			},
			include: {
				owner: true,
				modifier: true,
				relatedArticle: true,
				media: true,
			},
		});

		res.status(200).json(updateArticle);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteArticle = async (req, res) => {
	try {
		const deleteArticle = await prisma.knowledgeArticle.delete({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(deleteArticle);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteManyArticles = async (req, res) => {
	const { ids } = req.body;

	try {
		const deleteManyArticles = await prisma.knowledgeArticle.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		res.status(200).json(deleteManyArticles);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteExpiredArticles = async (req, res) => {
	try {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const expiredArticles = await prisma.knowledgeArticle.findMany({
			where: {
				deletedAt: {
					lt: thirtyDaysAgo,
				},
			},
		});

		for (const article of expiredArticles) {
			// Permanently delete the article record
			await prisma.knowledgeArticle.delete({
				where: { id: article.id },
			});
		}

		res.status(200).json(expiredArticles);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

// Schedule the task to run daily using node-cron
cron.schedule("*/1 * * * *", deleteExpiredArticles);
