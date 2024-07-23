import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import Message from "./Message";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats_light, modules_light } from "@/utils/consts";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

import {
	MessageSquarePlusIcon,
	MessageSquareReplyIcon,
	Send,
} from "lucide-react";
import { Button } from "./ui/button";
import { useMessage } from "@/context/message-provider";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "./ui/use-toast";
import io from "socket.io-client";
import { client } from "@/services/axiosClient";
import { useNavigate } from "react-router-dom";

const messageFormSchema = z.object({
	content: z.string({
		required_error: "Message content is required",
	}),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;
const SOCKET_SERVER_URL = "http://localhost:8800";

const MessageList = ({
	conversation,
	caseI,
}: {
	conversation: IConversationProps | undefined;
	caseI: ICaseProps | undefined;
}) => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
	const [isCollapsed, setIsCollapsed] = React.useState(true);
	const { setNewMessage } = useMessage();

	const form = useForm<MessageFormValues>({
		resolver: zodResolver(messageFormSchema),
		mode: "onChange",
	});

	async function onSubmit(data: MessageFormValues) {
		if (isLoggedIn) {
			try {
				const socket = io(SOCKET_SERVER_URL);

				await client.post(`http://localhost:8800/api/v1/conversation`, {
					content: data.content,
					userId: currentUser.id,
					caseId: caseI?.id,
					conversationId: conversation?.id ?? "",
				});

				socket.emit("newMessage", data);

				toast({
					title: "Message Creation",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
							<code className="text-white text-wrap">
								Message sent successfully!
							</code>
						</pre>
					),
				});

				form.reset({
					content: "",
				});
			} catch (error) {
				toast({
					title: "Encountered an error!",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
							<code className="text-white text-wrap">
								{`Error - ${error}`}
							</code>
						</pre>
					),
				});
			}
		} else {
			navigate("/signin");
		}
	}

	React.useEffect(() => {
		const socket = io(SOCKET_SERVER_URL);

		socket.on("connect", () => {
			console.log("Connected to web server");
		});

		socket.on("newMessage", (notification: IMessageProps) => {
			setNewMessage(notification);
		});

		return () => {
			socket.disconnect();
		};
	}, [setNewMessage]);

	return (
		<div className="flex flex-col justify-between h-[calc(100vh-15rem)]">
			<h1 className="px-4 py-2 font-semibold text-xl">Conversation</h1>
			<ScrollArea
				className={
					isCollapsed
						? "h-[calc(100vh-18rem)]"
						: "h-[calc(100vh-34.5rem)]"
				}
			>
				<div className="flex flex-col gap-y-8 p-4 pt-0">
					{conversation ? (
						conversation.messages.map((message) => (
							<Message message={message} caseI={caseI} />
						))
					) : (
						<p className="text-xl font-semibold bg-slate-200 dark:bg-slate-900 text-center p-4 rounded-xl w-3/4 mx-auto mt-[5rem]">
							No messages yet.
						</p>
					)}
				</div>
			</ScrollArea>
			<Accordion
				type="single"
				collapsible
				className="py-5 px-4"
				onValueChange={() => setIsCollapsed(!isCollapsed)}
			>
				<AccordionItem value="item-1" className="border-b-0">
					<AccordionTrigger className="bg-slate-100 dark:bg-slate-900 px-4 rounded-xl">
						<span className="flex items-center gap-x-2">
							{!conversation ? (
								<MessageSquarePlusIcon size={18} />
							) : (
								<MessageSquareReplyIcon size={18} />
							)}
							<p className="text-base hover:no-underline">
								{conversation ? "Reply" : "Write"}
							</p>
						</span>
					</AccordionTrigger>
					<AccordionContent className="">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<ReactQuill
													theme="snow"
													modules={modules_light}
													formats={formats_light}
													className="h-[14rem] pt-5 pb-5 mb-8"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									className="flex items-center gap-x-2 mt-2"
									type="submit"
								>
									<Send size={16} /> Send
								</Button>
							</form>
						</Form>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default MessageList;
