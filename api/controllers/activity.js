import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createActivity = async (req, res) => {
	const {
		subject,
		activityType,
		priority,
		status,
		description,
		regarding,
		duration,
		startDate,
		dueDate,
		ownerId,
	} = req.body;

	try {
		const createActivity = await prisma.activity.create({
			data: {
				subject: subject,
				activityType: activityType,
				priority: priority,
				status: status,
				description: description,
				regarding: regarding,
				duration: duration,
				startDate: startDate,
				dueDate: dueDate,
				ownerId: ownerId,
			},
		});
		res.status(201).json(createActivity);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getActivitites = async (req, res, next) => {
	try {
		const allActivities = await prisma.activity.findMany({
			orderBy: {
				updatedAt: "desc",
			},
			include: {
				owner: true,
			},
		});

		res.status(200).json(allActivities);
	} catch (error) {
		next(error);
	}
};

export const getActivity = async (req, res, next) => {
	try {
		const getActivity = await prisma.activity.findUnique({
			where: {
				id: String(req.params.id),
			},
			include: {
				owner: true,
			},
		});

		res.status(200).json(getActivity);
	} catch (error) {
		next(error);
	}
};

export const deleteActivity = async (req, res) => {
	try {
		const deleteActivity = await prisma.activity.delete({
			where: {
				id: String(req.params.id),
			},
		});
		res.status(200).json(deleteActivity);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const updateActivity = async (req, res) => {
	const {
		subject,
		activityType,
		priority,
		status,
		description,
		regarding,
		startDate,
		dueDate,
		owner,
		ownerId,
	} = req.body;

	try {
		const updateActivity = await prisma.activity.update({
			where: {
				id: String(req.params.id),
			},
			data: {
				subject: subject,
				activityType: activityType,
				priority: priority,
				status: status,
				description: description,
				regarding: regarding,
				startDate: startDate,
				dueDate: dueDate,
				owner: owner,
				ownerId: ownerId,
			},
		});
		res.status(201).json(updateActivity);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
