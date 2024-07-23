import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createEvent = async (req, res) => {
	const { title, tags, description, eventDate, userId } = req.body;

	try {
		const createEvent = await prisma.event.create({
			data: {
				title: title,
				tags: tags,
				eventDate: eventDate,
				description: description,
				userId: userId,
			},
		});

		// await prisma.itemCount.upsert({
		// 	where: {
		// 		fixed: true,
		// 	},
		// 	update: {
		// 		events: {
		// 			increment: 1,
		// 		},
		// 	},
		// 	create: {
		// 		events: 1,
		// 	},
		// });

		res.status(201).json(createEvent);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getEvents = async (req, res, next) => {
	try {
		const getEvents = await prisma.event.findMany({
			orderBy: {
				updatedAt: "desc",
			},
			include: {
				createdBy: true,
			},
		});

		res.status(200).json(getEvents);
	} catch (error) {
		next(error);
	}
};

export const getEvent = async (req, res, next) => {
	try {
		const getEvent = await prisma.event.findUnique({
			where: {
				id: String(req.params.id),
			},
			include: {
				createdBy: true,
			},
		});

		res.status(200).json(getEvent);
	} catch (error) {
		next(error);
	}
};

export const deleteEvent = async (req, res) => {
	try {
		const deleteEvent = await prisma.event.delete({
			where: {
				id: String(req.params.id),
			},
		});
		res.status(200).json(deleteEvent);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const updateEvent = async (req, res) => {
	const { title, tags, eventDate, description, userId } = req.body;

	try {
		const updateEvent = await prisma.event.update({
			where: {
				id: String(req.params.id),
			},
			data: {
				title: title,
				tags: tags,
				eventDate: eventDate,
				description: description,
				userId: userId,
			},
		});
		res.status(201).json(updateEvent);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
