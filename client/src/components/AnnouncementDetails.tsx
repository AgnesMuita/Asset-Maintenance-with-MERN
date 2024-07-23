import { client } from "@/services/axiosClient";
import { useAuthStore } from "@/stores/auth.store";
import React from "react";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "./ui/use-toast";

const AnnouncementDetails = (props: { id: string }) => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [announcement, setAnnouncement] =
		React.useState<IAnnouncementProps>();

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchEvent = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/announcements/${props.id}`
					);
					setAnnouncement(res.data);
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
			};
			fetchEvent();
		}
	}, [isLoggedIn, props.id]);

	return (
		<>
			{announcement && (
				<>
					<DialogHeader>
						<DialogTitle className="capitalize">
							{announcement.title}
						</DialogTitle>
						<DialogDescription>
							<div className="flex items-center gap-x-4">
								<p>Departmental Announcement</p>
								<p className="text-xs text-muted-foreground">
									{format(
										announcement.updatedAt,
										"MMM dd yyyy"
									)}
								</p>
							</div>
							<div className="flex items-center gap-x-4 mt-2">
								<Badge variant="default">Badge</Badge>
								<Badge variant="outline">Badge</Badge>
								<Badge variant="outline">Badge</Badge>
							</div>
						</DialogDescription>
					</DialogHeader>
					<ScrollArea className="h-[calc(100vh-10rem)] px-4">
						<div
							className=""
							dangerouslySetInnerHTML={{
								__html: announcement.announcement,
							}}
						></div>
					</ScrollArea>
				</>
			)}
		</>
	);
};

export default AnnouncementDetails;
