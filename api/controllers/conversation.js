import { PrismaClient } from "@prisma/client";
import { io } from "../index.js";

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

export const createConversation = async (req, res) => {
	const { content, userId, caseId, conversationId } = req.body;

	try {
		let createMessage;
		if (conversationId) {
			// if conversation ID is provided, check if conversation exists
			const existingConversation = await prisma.conversation.findUnique({
				where: {
					id: conversationId,
				},
			});

			if (existingConversation) {
				// if conversation exists add message to it
				createMessage = await prisma.message.create({
					data: {
						content: content,
						senderId: userId,
						conversationId: conversationId,
					},
				});
			} else {
				// If conversation doesn't exist throw new error
				throw new Error("Conversation does not exists.");
			}
		} else {
			// If conversation ID is not provided create a new conversation and add the message to it
			const newConversation = await prisma.conversation.create({
				data: {
					messages: {
						create: {
							content: content,
							senderId: userId,
						},
					},
					creatorId: userId,
					caseId: caseId,
				},
				include: {
					messages: true,
					case: true,
				},
			});

			createMessage = newConversation.messages[0];
		}

		// broadcast the new message to connected clients
		io.emit("newMessage", createMessage);

		res.status(201).json(createMessage);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
};

export const getConversation = async (req, res, next) => {
	try {
		const getConversation = await prisma.conversation.findUnique({
			where: {
				id: req.params.id,
			},
			include: {
				messages: {
					include: {
						sender: true,
						converstation: {
							include: {
								creator: true,
								case: true,
							},
						},
					},
				},
				creator: true,
				case: true,
			},
		});

		res.status(200).json(getConversation);
	} catch (error) {
		next(error);
	}
};
