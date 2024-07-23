import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createNewsArticle = async (req, res) => {
	const { title, description, tags, userId } = req.body;

	try {
		const createNewsArticle = await prisma.news.create({
			data: {
				title: title,
				description: description,
				tags: tags,
				userId: userId,
			},
		});

		// await prisma.itemCount.upsert({
		// 	where: {
		// 		fixed: true,
		// 	},
		// 	update: {
		// 		news: {
		// 			increment: 1,
		// 		},
		// 	},
		// 	create: {
		// 		news: 1,
		// 	},
		// });

		res.status(201).json(createNewsArticle);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getNews = async (req, res, next) => {
	try {
		const allNews = await prisma.news.findMany({
			orderBy: {
				updatedAt: "desc",
			},
			include: {
				createdBy: true,
			},
		});

		res.status(200).json(allNews);
	} catch (error) {
		next(error);
	}
};

export const getNewsArticle = async (req, res, next) => {
	try {
		const getNewsArticle = await prisma.news.findUnique({
			where: {
				id: String(req.params.id),
			},
			include: {
				createdBy: true,
			},
		});

		res.status(200).json(getNewsArticle);
	} catch (error) {
		next(error);
	}
};

export const deleteNews = async (req, res) => {
	try {
		const deleteNews = await prisma.news.delete({
			where: {
				id: String(req.params.id),
			},
		});
		res.status(200).json(deleteNews);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const updateNews = async (req, res) => {
	const { title, description, tags, userId } = req.body;

	try {
		const updateNewsArticle = await prisma.news.update({
			where: {
				id: String(req.params.id),
			},
			data: {
				title: title,
				description: description,
				tags: tags,
				userId: userId,
			},
		});
		res.status(201).json(updateNewsArticle);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
