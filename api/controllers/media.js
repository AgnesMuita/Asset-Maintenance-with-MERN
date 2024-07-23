import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createArticleMedia = async (req, res) => {
	const { imageBuffer, fileMeta, parent, articleId, createdById } = req.body;

	try {
		const saveImage = await prisma.media.create({
			data: {
				data: imageBuffer,
				fileMeta: fileMeta,
				parent: parent,
				article: { connect: { id: articleId } },
				createdBy: { connect: { id: createdById } },
			},
		});
		res.status(201).json(saveImage);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const createCaseMedia = async (req, res) => {
	const { imageBuffer, fileMeta, parent, caseId, createdById } = req.body;

	try {
		const saveImage = await prisma.media.create({
			data: {
				data: imageBuffer,
				fileMeta: fileMeta,
				parent: parent,
				case: { connect: { id: caseId } },
				createdBy: { connect: { id: createdById } },
			},
		});
		res.status(201).json(saveImage);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const createLogMedia = async (req, res) => {
	const { imageBuffer, fileMeta, parent, logId, createdById } = req.body;

	try {
		const saveImage = await prisma.media.create({
			data: {
				data: imageBuffer,
				fileMeta: fileMeta,
				parent: parent,
				log: { connect: { id: logId } },
				createdBy: { connect: { id: createdById } },
			},
		});
		res.status(201).json(saveImage);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const createArticleMulMedia = async (req, res) => {
	const { imageBuffer, fileMeta, parent, articleId, createdById } = req.body;

	const mediaData = imageBuffer.map((buffer) => ({
		data: buffer,
		fileMeta: fileMeta,
		parent: parent,
		articleId: articleId,
		createdById: createdById,
	}));

	try {
		const saveImages = await prisma.media.createMany({
			data: mediaData,
		});

		res.status(201).json(saveImages);
	} catch (error) {
		console.log(error);
		res.status(400).json({ msg: error.message });
	}
};

export const createCaseMulMedia = async (req, res) => {
	const { imageBuffer, fileMeta, parent, caseId, createdById } = req.body;

	const mediaData = imageBuffer.map((buffer) => ({
		data: buffer,
		fileMeta: fileMeta,
		parent: parent,
		caseId: caseId,
		createdById: createdById,
	}));

	try {
		const saveImages = await prisma.media.createMany({
			data: mediaData,
		});

		res.status(201).json(saveImages);
	} catch (error) {
		console.log(error);
		res.status(400).json({ msg: error.message });
	}
};

export const createLogMulMedia = async (req, res) => {
	const { imageBuffer, fileMeta, parent, logId, createdById } = req.body;

	const mediaData = imageBuffer.map((buffer) => ({
		data: buffer,
		fileMeta: fileMeta,
		parent: parent,
		caseId: logId,
		createdById: createdById,
	}));

	try {
		const saveImages = await prisma.media.createMany({
			data: mediaData,
		});

		res.status(201).json(saveImages);
	} catch (error) {
		console.log(error);
		res.status(400).json({ msg: error.message });
	}
};

export const getArticleMedia = async (req, res) => {
	try {
		const getSavedMedia = await prisma.media.findMany({
			where: {
				articleId: String(req.params.id),
			},
			include: {
				article: true,
				createdBy: true,
				case: true,
			},
		});
		res.status(200).json(getSavedMedia);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getCaseMedia = async (req, res) => {
	try {
		const getSavedMedia = await prisma.media.findMany({
			where: {
				caseId: String(req.params.id),
			},
			include: {
				article: true,
				createdBy: true,
				case: true,
			},
		});
		res.status(200).json(getSavedMedia);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getLogMedia = async (req, res) => {
	try {
		const getSavedMedia = await prisma.media.findMany({
			where: {
				logId: String(req.params.id),
			},
			include: {
				article: true,
				createdBy: true,
				case: true,
				log: true,
			},
		});
		res.status(200).json(getSavedMedia);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getUserMedia = async (req, res) => {
	try {
		const getSavedMedia = await prisma.media.findMany({
			where: {
				createdBy: String(req.params.id),
			},
			include: {
				article: true,
				createdBy: true,
				case: true,
			},
		});
		res.status(200).json(getSavedMedia);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteMedia = async (req, res) => {
	try {
		const deleteMedia = await prisma.media.delete({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(deleteMedia);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
