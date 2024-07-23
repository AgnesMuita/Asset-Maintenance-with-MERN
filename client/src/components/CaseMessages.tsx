import React from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import MessageList from "./MessageList";
import CaseStats from "./CaseStats";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate } from "react-router-dom";
import { toast } from "./ui/use-toast";
import { client } from "@/services/axiosClient";
import { useMessage } from "@/context/message-provider";

const CaseMessages = ({ data }: { data: ICaseProps | undefined }) => {
	const navigate = useNavigate();
	const [conversation, setConversation] =
		React.useState<IConversationProps>();
	const { newMessage } = useMessage();

	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const id = data?.conversation?.id;

	React.useEffect(() => {
		if (isLoggedIn) {
			try {
				const getConversation = async () => {
					const res = await client.get(
						`http://localhost:8800/api/v1/conversation/${id}`
					);
					setConversation(res.data);
				};

				getConversation();
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
	}, [newMessage, isLoggedIn, navigate, id]);

	return (
		<ResizablePanelGroup
			direction="horizontal"
			className="h-full max-h-[820px] items-stretch"
		>
			<ResizablePanel
				minSize={25}
				maxSize={40}
				defaultSize={20}
				className="h-full pr-2"
			>
				<CaseStats data={data} />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel className="h-full">
				<MessageList conversation={conversation} caseI={data} />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};

export default CaseMessages;
