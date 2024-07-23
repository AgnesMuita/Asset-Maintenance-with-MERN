import { PrismaClient } from "@prisma/client";
import { fileTypeFromBuffer } from "file-type";

const prisma = new PrismaClient();

export const createAllocationForm = async (req, res) => {
	try {
		const { buffer, fileMeta, userId, relatedId, historyId } = req.body;

		const createDocument = await prisma.allocationForm.create({
			data: {
				data: buffer,
				fileMeta: fileMeta,
				userId: userId,
				relatedId: relatedId,
				historyId: historyId,
			},
		});
		res.status(201).json(createDocument);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const createMulAllocationForms = async (req, res) => {
	try {
		const { buffer, fileMeta, userId, relatedId, historyId } = req.body;

		const fileData = buffer.map((buff) => ({
			data: buff,
			fileMeta: fileMeta,
			userId: userId,
			relatedId: relatedId,
			historyId: historyId,
		}));

		const createMulDocuments = await prisma.allocationForm.createMany({
			data: fileData,
		});
		res.status(201).json(createMulDocuments);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getAllocationForms = async (req, res, next) => {
	try {
		const getDocuments = await prisma.allocationForm.findMany({
			orderBy: {
				updatedAt: "desc",
			},
			include: {
				createdBy: true,
				modifiedBy: true,
				relatedAsset: true,
				history: true,
			},
		});

		res.status(200).json(getDocuments);
	} catch (error) {
		next(error);
	}
};

export const getAllocationForm = async (req, res, next) => {
	try {
		const getDocument = await prisma.allocationForm.findUnique({
			where: {
				id: String(req.params.id),
			},
			include: {
				createdBy: true,
				modifiedBy: true,
				relatedAsset: true,
				history: true,
			},
		});

		res.status(200).json(getDocument);
	} catch (error) {
		next(error);
	}
};

export const getDownloadAllocationForm = async (req, res, next) => {
	try {
		const getDownloadDocument = await prisma.allocationForm.findUnique({
			where: {
				id: String(req.params.id),
			},
			select: {
				data: true,
			},
		});

		res.status(200).json(getDownloadDocument);
	} catch (error) {
		next(error);
	}
};

export const getUrlDownload = async (req, res) => {
	try {
		const getUrlDownload = await prisma.allocationForm.findUnique({
			where: {
				id: String(req.params.id),
			},
		});

		if (!getUrlDownload) {
			return res.status(404).json({ error: "Document not found" });
		}

		const dataUri = getUrlDownload.data;
		const base64Data = dataUri.split(",")[1];
		const decodeBuffer = Buffer.from(base64Data, "base64");

		// Set the appropriate headers to trigger download
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="${getUrlDownload.fileMeta[0].Title}"`
		);
		res.setHeader("Content-Type", "application/pdf");

		res.send(decodeBuffer);
	} catch (error) {
		res.status(500).json({ msg: "Internal server error" });
	}
};

export const getViewAllocationForm = async (req, res) => {
	try {
		const getViewDoc = await prisma.allocationForm.findUnique({
			where: {
				id: String(req.params.id),
			},
			select: {
				data: true,
			},
		});

		const arrayBuffer = Buffer.from(
			getViewDoc.data.split(",")[1],
			"base64"
		);

		const fileTypeResult = await fileTypeFromBuffer(arrayBuffer);

		if (!fileTypeResult) {
			console.error("Unable to detect file type");
			return;
		}

		const base64String = Buffer.from(arrayBuffer).toString("base64");

		res.status(200).json({
			data: base64String,
			mimeType: fileTypeResult.mime,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ msg: error.message });
	}
};

export const deleteAllocationForm = async (req, res) => {
	try {
		const deleteDocument = await prisma.allocationForm.delete({
			where: {
				id: String(req.params.id),
			},
		});
		res.status(200).json(deleteDocument);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
