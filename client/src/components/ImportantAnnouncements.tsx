import React from "react";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useAnnouncement } from "@/context/announcement-provider";
import { client } from "@/services/axiosClient";
import { toast } from "./ui/use-toast";

const ImportantAnnouncements = () => {
	const regex = /(<([^>]+)>)/gi;
	const { newAnnouncement } = useAnnouncement();
	const [announcements, setAnnouncements] = React.useState<
		IAnnouncementProps[]
	>([]);
	const filteredAnnouncements = announcements?.filter(
		(announcement) =>
			announcement.severity === "URGENT" && announcement.active
	);

	React.useEffect(() => {
		const fetchAnnouncements = async () => {
			try {
				const res = await client.get(
					`http://localhost:8800/api/v1/announcements`
				);

				setAnnouncements(res.data);
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

		fetchAnnouncements();
	}, [newAnnouncement, announcements]);

	return (
		<div>
			<Card className="mb-4">
				<CardHeader>
					<CardTitle className="text-red-500">
						Important Announcements ({filteredAnnouncements?.length}
						)
					</CardTitle>
				</CardHeader>
				{filteredAnnouncements && filteredAnnouncements.length >= 0 && (
					<ScrollArea className="h-[calc(100vh-20rem)]">
						<CardContent>
							{filteredAnnouncements.map((announcement) => (
								<Card
									className="mb-4 last:mb-0"
									key={announcement.id}
								>
									<CardHeader className="">
										<CardTitle className="flex items-center justify-between">
											<div className="flex flex-col items-start gap-y-3">
												<p className="text-blue-500 text-lg">
													{announcement.title}
												</p>
												<div className="flex items-center gap-x-3">
													{announcement.id ===
														newAnnouncement?.id && (
														<Badge className="bg-blue-500 text-white animate-pulse">
															New
														</Badge>
													)}
													<Badge className="bg-red-600 bg-opacity-20 border border-red-600 text-red-600 dark:text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-full py-0">
														{announcement.severity}
													</Badge>
													{announcement.tags &&
														announcement.tags.map(
															(tag) => (
																<Badge
																	className="bg-blue-600 bg-opacity-20 border border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-500 hover:bg-opacity-20 rounded-full py-0"
																	key={tag.id}
																>
																	{tag.text}
																</Badge>
															)
														)}
												</div>
											</div>
											<p className="text-xs">
												{format(
													announcement.createdAt,
													"dd/MM/yyyy p"
												)}
											</p>
										</CardTitle>
									</CardHeader>
									<Collapsible>
										<CollapsibleTrigger className="text-left px-6 mb-2 text-blue-500">
											{announcement.announcement
												.replace(regex, "")
												.substring(0, 400) + "..."}
										</CollapsibleTrigger>
										<CollapsibleContent>
											<CardContent className="text-sm">
												<div
													dangerouslySetInnerHTML={{
														__html: announcement.announcement,
													}}
												/>
											</CardContent>
										</CollapsibleContent>
									</Collapsible>
								</Card>
							))}
						</CardContent>
					</ScrollArea>
				)}
			</Card>
		</div>
	);
};

export default ImportantAnnouncements;
