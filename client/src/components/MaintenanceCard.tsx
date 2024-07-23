import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	CalendarRange,
	ChevronLeft,
	ChevronRight,
	Copy,
	MoreVertical,
	NotebookTabsIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "@/components/ui/pagination";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addDays, format } from "date-fns";
import React from "react";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { toast } from "./ui/use-toast";
import prettyBytes from "pretty-bytes";

const MaintenanceCard = ({ log }: { log: IMaintenanceLogProps }) => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [media, setMedia] = React.useState<IMediaProps[]>([]);

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchMedia = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/media/logMedia/${log.id}`
					);
					setMedia(res.data);
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

			fetchMedia();
		}
	}, [isLoggedIn, log.id]);

	return (
		<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
			<CardHeader className="flex 2xl:flex-row items-start bg-muted/50">
				<div className="grid gap-0.5">
					<CardTitle className="group 2xl:flex items-center gap-2 text-lg">
						<span>Maitenance {log.id}</span>
						<Button
							size="icon"
							variant="outline"
							className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<Copy className="h-3 w-3" />
							<span className="sr-only">Copy Maintenance ID</span>
						</Button>
					</CardTitle>
					<CardDescription>
						Date: {format(log.createdAt, "MMMM dd, yyyy")}
					</CardDescription>
				</div>
				<div className="2xl:ml-auto flex items-center gap-1">
					<Button size="sm" variant="outline" className="h-8 gap-1">
						<NotebookTabsIcon className="h-3.5 w-3.5" />
						<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
							Export Log
						</span>
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size="icon"
								variant="outline"
								className="h-8 w-8"
							>
								<MoreVertical className="h-3.5 w-3.5" />
								<span className="sr-only">More</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>Send Email</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			<ScrollArea className="h-[calc(100vh-20.5rem)]">
				<CardContent className="p-6 text-sm">
					<div className="grid gap-3">
						<div className="font-semibold">Maintenance Details</div>
						<ul className="grid gap-3">
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">
									Log Title
								</span>
								<span>{log.title}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">
									Performed By
								</span>
								<span>{log.performedBy.fullName}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">
									Related Asset
								</span>
								<span>{log.asset.name}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">
									User
								</span>
								<span>
									{log.asset.user?.fullName ??
										"No assigned user"}
								</span>
							</li>
						</ul>
					</div>
					<Separator className="my-4" />
					<div className="grid grid-cols-1 gap-4">
						<div className="grid gap-3">
							<div className="font-semibold">Description</div>
							<address className="grid gap-0.5 not-italic text-muted-foreground">
								<span
									dangerouslySetInnerHTML={{
										__html: log.description,
									}}
								></span>
							</address>
						</div>
						<div className="grid gap-3">
							<div className="font-semibold">Remarks</div>
							<address className="grid gap-0.5 not-italic text-muted-foreground">
								<span
									dangerouslySetInnerHTML={{
										__html: log.remarks,
									}}
								></span>
							</address>
						</div>
					</div>
					<Separator className="my-4" />
					<div className="grid gap-3">
						<div className="font-semibold">Attachments</div>
						<dl className="grid gap-3">
							{media &&
								media.map((file) => (
									<div className="flex items-center justify-between">
										<Dialog>
											<DialogTrigger>
												<dt className="text-muted-foreground underline underline-offset-4 decoration-dotted hover:decoration-blue-600">
													{file.fileMeta[0]
														?.fileName ??
														"No Attachments"}
												</dt>
											</DialogTrigger>
											<DialogContent>
												<img
													src={file.data}
													alt="article media"
												/>
											</DialogContent>
										</Dialog>
										<dd>
											{prettyBytes(
												file.fileMeta[0]?.size ?? 0
											)}
										</dd>
									</div>
								))}
						</dl>
					</div>
					<Separator className="my-4" />
					<div className="grid gap-3">
						<div className="font-semibold">Log Information</div>
						<dl className="grid gap-3">
							<div className="flex items-center justify-between">
								<dt className="flex items-center gap-2 text-muted-foreground">
									<CalendarRange className="h-4 w-4" />
									{log.title}
								</dt>
								<dd>
									Next Maintenance:{" "}
									{format(
										addDays(log.createdAt, 90),
										"MMMM dd, yyyy"
									)}
								</dd>
							</div>
						</dl>
					</div>
				</CardContent>
			</ScrollArea>
			<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div className="text-xs text-muted-foreground">
					Updated{" "}
					<time dateTime="2023-11-23">
						{format(log.createdAt, "MMMM dd, yyyy")}
					</time>
				</div>
				<Pagination className="ml-auto mr-0 w-auto">
					<PaginationContent>
						<PaginationItem>
							<Button
								size="icon"
								variant="outline"
								className="h-6 w-6"
							>
								<ChevronLeft className="h-3.5 w-3.5" />
								<span className="sr-only">
									Previous Application
								</span>
							</Button>
						</PaginationItem>
						<PaginationItem>
							<Button
								size="icon"
								variant="outline"
								className="h-6 w-6"
							>
								<ChevronRight className="h-3.5 w-3.5" />
								<span className="sr-only">
									Next Application
								</span>
							</Button>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</CardFooter>
		</Card>
	);
};

export default MaintenanceCard;
