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

export const getNResults = async (req, res) => {
	const q = req.query.q;
	const filter = req.query.filter;

	if (filter === "none") {
		try {
			const searchCases = await prisma.case.findMany({
				where: {
					OR: [
						{
							caseTitle: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							caseNumber: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							subject: {
								contains: q,
								mode: "insensitive",
							},
						},
					],
				},
				include: {
					owner: true,
				},
				orderBy: {
					updatedAt: "desc",
				},
			});

			const searchArticles = await prisma.knowledgeArticle.findMany({
				where: {
					OR: [
						{
							title: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							description: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							content: {
								contains: q,
								mode: "insensitive",
							},
						},
					],
				},
				include: {
					owner: true,
				},
				orderBy: {
					modifiedAt: "desc",
				},
			});

			const searchActivities = await prisma.activity.findMany({
				where: {
					OR: [
						{
							subject: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							description: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							regarding: {
								contains: q,
								mode: "insensitive",
							},
						},
					],
				},
				include: {
					owner: true,
				},
				orderBy: {
					updatedAt: "desc",
				},
			});

			const searchAssets = await prisma.asset.findMany({
				where: {
					OR: [
						{
							product: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							location: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							name: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							category: {
								contains: q,
								mode: "insensitive",
							},
						},
					],
				},
				include: {
					user: true,
				},
				orderBy: {
					updatedAt: "desc",
				},
			});

			res
				.status(200)
				.json({ searchCases, searchArticles, searchActivities, searchAssets });
		} catch (error) {
			res.status(500).json({ msg: error.message });
		}
	}
};

export const getCases = async (req, res) => {
	const q = req.query.q;
	const filter = req.query.filter;

	console.log(filter);

	if (filter === "case") {
		try {
			const searchCases = await prisma.case.findMany({
				where: {
					OR: [
						{
							caseTitle: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							caseNumber: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							subject: {
								contains: q,
								mode: "insensitive",
							},
						},
					],
				},
				include: {
					owner: true,
				},
				orderBy: {
					updatedAt: "desc",
				},
			});
			res.status(200).json(searchCases);
		} catch (error) {
			res.status(500).json({ msg: error.message });
		}
	}
};

export const getKarticles = async (req, res) => {
	const q = req.query.q;
	const filter = req.query.filter;

	if (filter === "kArticle") {
		try {
			const searchArticles = await prisma.knowledgeArticle.findMany({
				where: {
					OR: [
						{
							title: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							description: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							content: {
								contains: q,
								mode: "insensitive",
							},
						},
					],
				},
				include: {
					owner: true,
				},
				orderBy: {
					modifiedAt: "desc",
				},
			});
			res.status(200).json(searchArticles);
		} catch (error) {
			res.status(500).json({ msg: error.message });
		}
	}
};

export const getActivities = async (req, res) => {
	const q = req.query.q;
	const filter = req.query.filter;

	if (filter === "activity") {
		try {
			const searchActivities = await prisma.activity.findMany({
				where: {
					OR: [
						{
							subject: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							description: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							regarding: {
								contains: q,
								mode: "insensitive",
							},
						},
					],
				},
				include: {
					owner: true,
				},
				orderBy: {
					updatedAt: "desc",
				},
			});
			res.status(200).json(searchActivities);
		} catch (error) {
			res.status(500).json({ msg: error.message });
		}
	}
};

export const getAssets = async (req, res) => {
	const q = req.query.q;
	const filter = req.query.filter;

	if (filter === "asset") {
		try {
			const searchAssets = await prisma.asset.findMany({
				where: {
					OR: [
						{
							product: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							location: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							name: {
								contains: q,
								mode: "insensitive",
							},
						},
						{
							category: {
								contains: q,
								mode: "insensitive",
							},
						},
					],
				},
				include: {
					user: true,
				},
				orderBy: {
					updatedAt: "desc",
				},
			});
			res.status(200).json(searchAssets);
		} catch (error) {
			res.status(500).json({ msg: error.message });
		}
	}
};
