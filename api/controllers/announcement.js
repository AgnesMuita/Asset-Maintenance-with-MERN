import { PrismaClient } from "@prisma/client";
import { io } from "../index.js";

const prisma = new PrismaClient();

export const createAnnouncement = async (req, res) => {
	const { title, tags, announcement, severity, userId } = req.body;

	try {
		const createAnnouncement = await prisma.announcement.create({
			data: {
				title: title,
				tags: tags,
				announcement: announcement,
				severity: severity,
				userId: userId,
			},
		});

		// await prisma.itemCount.upsert({
		// 	where: {
		// 		fixed: true,
		// 	},
		// 	update: {
		// 		announcements: {
		// 			increment: 1,
		// 		},
		// 	},
		// 	create: {
		// 		announcements: 1,
		// 	},
		// });

		io.emit("newAnnouncement", createAnnouncement);

		res.status(201).json(createAnnouncement);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getAnnouncements = async (req, res, next) => {
	try {
		const getAnnouncements = await prisma.announcement.findMany({
			orderBy: {
				updatedAt: "desc",
			},
			include: {
				createdBy: true,
			},
		});

		res.status(200).json(getAnnouncements);
	} catch (error) {
		next(error);
	}
};

export const getAnnouncement = async (req, res, next) => {
	try {
		const getAnnouncement = await prisma.announcement.findUnique({
			where: {
				id: String(req.params.id),
			},
			include: {
				createdBy: true,
			},
		});

		res.status(200).json(getAnnouncement);
	} catch (error) {
		next(error);
	}
};

export const updateAnnouncement = async (req, res) => {
	const { title, tags, active, announcement, severity, userId } = req.body;

	try {
		const updateAnnouncement = await prisma.announcement.update({
			where: {
				id: String(req.params.id),
			},
			data: {
				title: title,
				tags: tags,
				active: active,
				announcement: announcement,
				severity: severity,
				userId: userId,
			},
		});
		res.status(201).json(updateAnnouncement);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteAnnouncement = async (req, res) => {
	try {
		const deleteAnnouncement = await prisma.announcement.delete({
			where: {
				id: String(req.params.id),
			},
		});
		res.status(200).json(deleteAnnouncement);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteManyAnnouncements = async (req, res) => {
	const { ids } = req.body;

	try {
		const deleteAnnouncements = await prisma.announcement.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		res.status(200).json(deleteAnnouncements);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
