import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// cases
export const countAllCases = async (req, res) => {
	try {
		const countAllCases = await prisma.case.count();

		res.status(200).json(countAllCases);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

export const countUserCases = async (req, res) => {
	try {
		const countUserCases = await prisma.case.count({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(countUserCases);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

// Articles
export const countAllArticles = async (req, res) => {
	try {
		const countAllArticles = await prisma.knowledgeArticle.count();

		res.status(200).json(countAllArticles);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

export const countUserArticles = async (req, res) => {
	try {
		const countUserArticles = await prisma.knowledgeArticle.count({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(countUserArticles);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

// Assets
export const countAllAssets = async (req, res) => {
	try {
		const countAllAssets = await prisma.asset.count();

		res.status(200).json(countAllAssets);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

export const countUserAssets = async (req, res) => {
	try {
		const countUserAssets = await prisma.asset.count({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(countUserAssets);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

// Documents
export const countAllDocuments = async (req, res) => {
	try {
		const countAllDocuments = await prisma.document.count();

		res.status(200).json(countAllDocuments);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

export const countUserDocuments = async (req, res) => {
	try {
		const countUserDocuments = await prisma.document.count({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(countUserDocuments);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

// Announcements
export const countAllAnnouncements = async (req, res) => {
	try {
		const countAllAnnouncements = await prisma.announcement.count();

		res.status(200).json(countAllAnnouncements);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

export const countUserAnnouncements = async (req, res) => {
	try {
		const countUserAnnouncements = await prisma.announcement.count({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(countUserAnnouncements);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

// News
export const countAllNews = async (req, res) => {
	try {
		const countAllNews = await prisma.news.count();

		res.status(200).json(countAllNews);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

export const countUserNews = async (req, res) => {
	try {
		const countUserNews = await prisma.news.count({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(countUserNews);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

// Events
export const countAllEvents = async (req, res) => {
	try {
		const countAllEvents = await prisma.event.count();

		res.status(200).json(countAllEvents);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

export const countUserEvents = async (req, res) => {
	try {
		const countUserEvents = await prisma.event.count({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(countUserEvents);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

// Maintenance Logs
export const countAllLogs = async (req, res) => {
	try {
		const countAllLogs = await prisma.maintenance.count();

		res.status(200).json(countAllLogs);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

export const countUserLogs = async (req, res) => {
	try {
		const countUserLogs = await prisma.maintenance.count({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(countUserLogs);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

// Users
export const countAllUsers = async (req, res) => {
	try {
		const countAllUsers = await prisma.user.count();

		res.status(200).json(countAllUsers);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};

export const countUserUsers = async (req, res) => {
	try {
		const countUserUsers = await prisma.user.count({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(countUserUsers);
	} catch (error) {
		res.status(400).json({ msg: error.messsage });
	}
};
