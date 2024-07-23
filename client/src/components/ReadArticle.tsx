import { format } from "date-fns";
import { Badge } from "./ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { toast } from "./ui/use-toast";

const ReadArticle = ({
	article,
}: {
	article: IKnowledgeArticleProps | undefined;
}) => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentDate = new Date();

	const currentMonth = currentDate.getMonth();
	const numberOfMonthDays = new Date(
		currentDate.getFullYear(),
		currentMonth + 1,
		0
	).getDate();

	const generateSessionId = () => {
		return uuidv4();
	};

	const setSessionCookie = (sessionId: string, expiryInMinutes: number) => {
		const expirationDate = new Date();

		expirationDate.setTime(
			expirationDate.getTime() + expiryInMinutes * 60 * 1000
		);
		document.cookie = `sessionId=${sessionId}; expires=${expirationDate.toUTCString()}; path=/knowledgearticles`;
	};

	React.useEffect(() => {
		if (isLoggedIn) {
			const calculateMinutes = numberOfMonthDays * 24 * 60 * 12;

			// generate new session id
			const newSessionId = generateSessionId();
			setSessionCookie(newSessionId, calculateMinutes);
		}
	}, [isLoggedIn, numberOfMonthDays]);

	React.useEffect(() => {
		const incrementViewCount = async () => {
			try {
				await client.post(
					`http://localhost:8800/api/v1/karticles/views/${article?.id}`
				);
			} catch (error) {
				toast({
					title: "Encountered an error!",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
							<code className="text-white text-wrap">
								{`Error incrementing view count - ${error}`}
							</code>
						</pre>
					),
				});
			}
		};
		incrementViewCount();
	}, [article?.id]);

	return (
		<Card>
			<ScrollArea className="h-[calc(100vh-15rem)]">
				<CardHeader>
					<CardTitle className="font-semibold text-2xl">
						{article?.title}
					</CardTitle>
					<CardDescription>{article?.description}</CardDescription>
					<div className="flex items-end justify-between pt-4">
						<div className="flex items-center gap-2">
							<Badge className="bg-blue-600 bg-opacity-20 border border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:bg-opacity-20 rounded-full py-0">
								{article?.visibility}
							</Badge>
							<Badge className="rounded-full py-0">
								{article?.language}
							</Badge>
							<Badge
								variant="outline"
								className="bg-slate-600 bg-opacity-20 border border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-600 hover:bg-opacity-20 rounded-full py-0"
							>
								V {article?.majorVNo}
							</Badge>
							<Badge
								variant="secondary"
								className={
									article?.status === "Published"
										? "bg-green-600 bg-opacity-20 border border-green-600 text-green-600 dark:text-green-300 hover:bg-green-500 hover:bg-opacity-20 rounded-full py-0"
										: article?.status === "Draft"
										? "bg-cyan-600 bg-opacity-20 border border-cyan-600 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500 hover:bg-opacity-20 rounded-full py-0"
										: article?.status === "Needs Review"
										? "bg-pink-600 bg-opacity-20 border border-pink-600 text-pink-600 dark:text-pink-300 hover:bg-pink-500 hover:bg-opacity-20 rounded-full py-0"
										: article?.status === "Updating"
										? "bg-yellow-600 bg-opacity-20 border border-yellow-600 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-500 hover:bg-opacity-20 rounded-full py-0"
										: article?.status === "In Review"
										? "bg-orange-600 bg-opacity-20 border border-orange-600 text-orange-600 dark:text-orange-300 hover:bg-orange-500 hover:bg-opacity-20 rounded-full py-0"
										: article?.status === "Proposed"
										? "bg-purple-600 bg-opacity-20 border border-purple-600 text-purple-600 dark:text-purple-300 hover:bg-purple-500 hover:bg-opacity-20 rounded-full py-0"
										: "bg-foreground"
								}
							>
								{article?.status}
							</Badge>
						</div>
						<div className="flex items-end gap-8">
							<div className="flex flex-col items-start justify-center gap-y-2">
								<Label className="font-semibold">
									{article?.publishedOn
										? format(
												article.publishedOn,
												"dd/MM/yyyy p"
										  )
										: "-"}
								</Label>
								<Label className="text-muted-foreground text-xs">
									Published On
								</Label>
							</div>
							<div className="flex flex-col items-start justify-center gap-y-2">
								<Label className="font-semibold">
									{article?.modifiedAt
										? format(
												article.modifiedAt,
												"dd/MM/yyyy p"
										  )
										: "-"}
								</Label>
								<Label className="text-muted-foreground text-xs">
									Modified On
								</Label>
							</div>
							<div className="flex flex-col items-start justify-center gap-y-2">
								<Label className="font-semibold">
									{article?.expirationDate
										? format(
												article.expirationDate,
												"dd/MM/yyyy p"
										  )
										: "-"}
								</Label>
								<Label className="text-muted-foreground text-xs">
									Expiration Date
								</Label>
							</div>
							<div className="flex flex-col items-start justify-center gap-y-2">
								<Label className="font-semibold">
									{article?.owner?.fullName ?? "-"}
								</Label>
								<Label className="text-muted-foreground text-xs">
									Created By
								</Label>
							</div>
						</div>
					</div>
				</CardHeader>
				<Separator />
				<CardContent>
					<div className="pt-4 flex itens-center gap-x-2">
						<Label className="font-semibold">Keywords: </Label>
						<div className="flex items-center gap-x-2">
							{article?.keywords ? (
								article.keywords.map((keyword, idx) => (
									<Label key={idx} className="text-xs">
										{keyword.text}
									</Label>
								))
							) : (
								<Label>-</Label>
							)}
						</div>
					</div>
					<div className="py-2 flex flex-col gap-y-4">
						<Label className="font-semibold text-lg">
							Article Images
						</Label>
						{article?.media.length && article.media.length >= 1 ? (
							<Carousel className="w-full xl:max-w-4xl 2xl:max-w-7xl ml-10">
								<CarouselContent className="ml-1">
									{article?.media &&
										article?.media.map((image, idx) => (
											<CarouselItem
												className="md:basis-1/2 xl:basis-1/3 2xl:basis-1/4 pl-4"
												key={idx}
											>
												<img
													src={image.data}
													alt={`Image ${idx}`}
													className=""
												/>
											</CarouselItem>
										))}
								</CarouselContent>
								<CarouselPrevious />
								<CarouselNext />
							</Carousel>
						) : (
							<Label>No Images Uploaded.</Label>
						)}
					</div>
					<div className="pt-4 space-y-4">
						<Label className="font-semibold text-lg">
							Article Content
						</Label>
						{article?.content && (
							<div
								dangerouslySetInnerHTML={{
									__html: article.content,
								}}
							></div>
						)}
					</div>
				</CardContent>
			</ScrollArea>
		</Card>
	);
};

export default ReadArticle;
