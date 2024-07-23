import { PrismaClient } from "@prisma/client";
import { fileTypeFromBuffer } from "file-type";

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

export const createDocument = async (req, res) => {
	try {
		const { buffer, fileMeta, docType, docCategory, department, userId } =
			req.body;

		const createDocument = await prisma.document.create({
			data: {
				data: buffer,
				fileMeta: fileMeta,
				docType: docType,
				docCategory: docCategory,
				department: department,
				userId: userId,
				modifierId: userId,
			},
		});

		// await prisma.itemCount.upsert({
		// 	where: {
		// 		fixed: true,
		// 	},
		// 	update: {
		// 		documents: {
		// 			increment: 1,
		// 		},
		// 	},
		// 	create: {
		// 		documents: 1,
		// 	},
		// });
		res.status(201).json(createDocument);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const createMulDocuments = async (req, res) => {
	try {
		const { buffer, fileMeta, docType, docCategory, department, userId } =
			req.body;

		const fileData = buffer.map((buff) => ({
			data: buff,
			fileMeta: fileMeta,
			docType: docType,
			docCategory: docCategory,
			department: department,
			userId: userId,
			modifierId: userId,
		}));

		const createMulDocuments = await prisma.document.createMany({
			data: fileData,
		});

		// await prisma.itemCount.upsert({
		// 	update: {
		// 		documents: {
		// 			increment: createMulDocuments.length,
		// 		},
		// 	},
		// 	create: {
		// 		documents: createMulDocuments.length,
		// 	},
		// });
		res.status(201).json(createMulDocuments);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getDocuments = async (req, res, next) => {
	const { department, userId } = req.query;

	try {
		const getDocuments = await prisma.document.findMany({
			orderBy: {
				updatedAt: "desc",
			},
			include: {
				createdBy: true,
				modifiedBy: true,
			},
		});

		// Filter documents
		const filteredDocuments = getDocuments.filter((document) => {
			if (document.department === "PERSONAL") {
				return document.userId === userId;
			} else if (document.department === "GLOBAL") {
				return true;
			} else {
				return document.department === department;
			}
		});

		res.status(200).json(filteredDocuments);
	} catch (error) {
		next(error);
	}
};

export const getDocument = async (req, res, next) => {
	try {
		const getDocument = await prisma.document.findUnique({
			where: {
				id: String(req.params.id),
			},
			include: {
				createdBy: true,
				modifiedBy: true,
			},
		});

		res.status(200).json(getDocument);
	} catch (error) {
		next(error);
	}
};

export const getDownloadDocument = async (req, res, next) => {
	try {
		const getDownloadDocument = await prisma.document.findUnique({
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
		const getUrlDownload = await prisma.document.findUnique({
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
			`attachment; filename="${getUrlDownload.fileMeta[0].fileName}"`
		);
		res.setHeader("Content-Type", getUrlDownload.fileMeta[0].mimeType);

		res.send(decodeBuffer);
	} catch (error) {
		res.status(500).json({ msg: "Internal server error" });
	}
};

export const getViewDocument = async (req, res) => {
	try {
		const getViewDoc = await prisma.document.findUnique({
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

export const updateDocument = async (req, res) => {
	try {
		const { docType, docCategory, department, modifierId } = req.body;

		const updateDocument = await prisma.document.update({
			where: {
				id: String(req.params.id),
			},
			data: {
				docType: docType,
				docCategory: docCategory,
				department: department,
				modifierId: modifierId,
			},
		});
		res.status(201).json(updateDocument);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteDocument = async (req, res) => {
	try {
		const deleteDocument = await prisma.document.delete({
			where: {
				id: String(req.params.id),
			},
		});
		res.status(200).json(deleteDocument);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const deleteManyDocs = async (req, res) => {
	const { ids } = req.body;

	try {
		const deleteManyDocs = await prisma.document.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		res.status(200).json(deleteManyDocs);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};
