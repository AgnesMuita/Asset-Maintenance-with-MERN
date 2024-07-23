import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//create a queue
export const createQueue = async (req, res) => {
	const {
		name,
		title,
		type,
		description,
		status,
		resolved,
		technician,
		owner,
		asset,
		caseT,
	} = req.body;

	try {
		const createQueue = await prisma.queue.create({
			data: {
				name: name,
				title: title,
				type: type,
				description: description,
				status: status,
				resolved: resolved,
				technician: technician,
				owner: owner,
				ownerId: owner.id,
				asset: asset,
				assetId: asset.id,
				case: caseT,
				caseId: caseT.id,
			},
		});

		res.status(200).json(createQueue);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

// update a queue
export const updateQueue = async (req, res) => {
	const {
		name,
		title,
		type,
		description,
		status,
		resolved,
		technician,
		owner,
		asset,
		caseT,
	} = req.body;

	try {
		const updateQueue = await prisma.queue.update({
			where: {
				id: String(req.params.id),
			},
			data: {
				name: name,
				title: title,
				type: type,
				description: description,
				status: status,
				resolved: resolved,
				technician: technician,
				owner: owner,
				ownerId: owner.id,
				asset: asset,
				assetId: asset.id,
				case: caseT,
				caseId: caseT.id,
			},
		});

		res.status(200).json(updateQueue);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

// get a single queue
export const getQueue = async (req, res, next) => {
	try {
		const getQueue = await prisma.queue.findUnique({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(getQueue);
	} catch (error) {
		next(error);
	}
};

// get all queue
export const getQueues = async (req, res) => {
	try {
		const allQueues = await prisma.queue.findMany({
			orderBy: {
				updatedAt: "desc",
			},
		});

		res.status(200).json(allQueues);
	} catch (error) {}
};

// delete a queue
export const deleteQueue = async (req, res) => {
	try {
		const deleteQueue = await prisma.queue.delete({
			where: {
				id: String(req.params.id),
			},
		});

		res.status(200).json(deleteQueue);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
