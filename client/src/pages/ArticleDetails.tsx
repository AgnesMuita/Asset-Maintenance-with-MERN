import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaretSortIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
	ArrowLeftIcon,
	BookPlusIcon,
	CalendarIcon,
	CheckIcon,
	FileSymlink,
	NotepadTextDashedIcon,
	Trash2Icon,
	TrashIcon,
} from "lucide-react";
import Article from "@/components/Article";
import ArticleDetailTab from "@/components/ArticleDetailTab";
import NewArticle from "@/components/NewArticle";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate, useParams } from "react-router-dom";
import { client } from "@/services/axiosClient";
import { format } from "date-fns";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "@/components/ui/use-toast";
import { publishSubject } from "@/utils/consts";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReadArticle from "@/components/ReadArticle";

const approveFormSchema = z.object({
	approval: z.string({
		required_error: "Approval status is required",
	}),
});

const relateFormSchema = z.object({
	relatedArticleId: z.string({
		required_error: "Related asset is required",
	}),
});

const publishFormSchema = z.object({
	publishSubject: z.string({
		required_error: "Publish subject is required.",
	}),
	publishOn: z.string({
		required_error: "Publish Date is required.",
	}),
	expirationDate: z.date().optional(),
});

type ApproveFormValues = z.infer<typeof approveFormSchema>;
type PublishFormValues = z.infer<typeof publishFormSchema>;
type RelateFormValues = z.infer<typeof relateFormSchema>;

const ArticleDetails: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [article, setArticle] = React.useState<IKnowledgeArticleProps>();
	const [articles, setArticles] = React.useState<IKnowledgeArticleProps[]>();
	const [open, setOpen] = React.useState(false);
	const [openRelate, setOpenRelate] = React.useState(false);
	const [datePickerOpen, setDatePickerOpen] = React.useState(false);
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

	//get current logged-in user
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	//convert publish date it ISO
	const publishDate = new Date();
	const isoPublishDate = publishDate?.toISOString();

	// convert trash data to ISO
	const trashDate = new Date();
	const deletedAt = trashDate?.toISOString();

	const approveForm = useForm<ApproveFormValues>({
		resolver: zodResolver(approveFormSchema),
		mode: "onChange",
		defaultValues: {
			approval: "Approve",
		},
	});

	const publishForm = useForm<PublishFormValues>({
		resolver: zodResolver(publishFormSchema),
		mode: "onChange",
		defaultValues: {
			publishOn: isoPublishDate,
		},
	});

	const relateForm = useForm<RelateFormValues>({
		resolver: zodResolver(publishFormSchema),
		mode: "onChange",
		defaultValues: {
			relatedArticleId: article?.relatedArticle?.id,
		},
	});

	async function onApproveSubmit(approveFormData: ApproveFormValues) {
		try {
			await client.patch(`http://localhost:8800/api/v1/karticles/${id}`, {
				approved: true,
				modifierId: currentUser.id,
			});
			toast({
				title: "You submitted your article with following values:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(approveFormData, null, 2)}
						</code>
					</pre>
				),
			});
			handleRefresh();
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
	}

	async function onPublishSubmit(publishFormData: PublishFormValues) {
		try {
			await client.patch(`http://localhost:8800/api/v1/karticles/${id}`, {
				published: true,
				draft: false,
				status: "Published",
				stage: "Published",
				publishSubject: publishFormData.publishSubject,
				publishedOn: isoPublishDate,
				expirationDate: publishFormData.expirationDate?.toISOString(),
				modifierId: currentUser.id,
			});
			toast({
				title: "You submitted your article with following values:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(publishFormData, null, 2)}
						</code>
					</pre>
				),
			});
			handleRefresh();
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
	}

	async function onRelateSubmit(relateFormData: RelateFormValues) {
		try {
			await client.patch(`http://localhost:8800/api/v1/karticles/${id}`, {
				relatedArticleId: relateFormData.relatedArticleId,
			});
			toast({
				title: "You submitted your article with following values:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(relateFormData, null, 2)}
						</code>
					</pre>
				),
			});
			handleRefresh();
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
	}

	const handleRefresh = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					`http://localhost:8800/api/v1/karticles/${id}`
				);
				setArticle(res.data);
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
	};

	const handleDelete = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.delete(
					`http://localhost:8800/api/v1/karticles/${id}`
				);

				if (res.status === 200) {
					handleRefresh();
					toast({
						title: "You deleted the article with following values:",
						description: (
							<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
								<code className="text-white text-wrap">
									{JSON.stringify(res.data, null, 2)}
								</code>
							</pre>
						),
					});
					navigate(-1);
				}
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
		}
	};

	const handleTrash = async () => {
		if (isLoggedIn) {
			try {
				await client.patch(
					`http://localhost:8800/api/v1/karticles/${id}`,
					{
						deletedAt: deletedAt,
					}
				);

				handleRefresh();

				toast({
					title: "Knowledge article trash.",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
							<code className="text-white text-wrap">
								"Knowledge Article trashed successfully"
							</code>
						</pre>
					),
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
		}
	};

	const handleRevertToDraft = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.patch(
					`http://localhost:8800/api/v1/karticles/${id}`,
					{
						published: false,
						draft: true,
						status: "Draft",
						stage: "Review",
					}
				);

				if (res.status === 200) {
					handleRefresh();
					toast({
						title: "You updated the article with following values:",
						description: (
							<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
								<code className="text-white text-wrap">
									{JSON.stringify(res.data, null, 2)}
								</code>
							</pre>
						),
					});
					navigate(-1);
				}
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
		}
	};

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchArticle = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/karticles/${id}`
					);
					setArticle(res.data);
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

			const fetchArticles = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/karticles/`
					);
					setArticles(res.data);
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

			fetchArticle();
			fetchArticles();
		}
	}, [isLoggedIn, id]);

	return (
		<div className="p-2 border-l w-full">
			<div className="w-full h-[7rem] flex flex-col space-y-4">
				{article && (
					<div className="flex justify-between">
						<div className="flex items-start gap-x-4">
							<Button variant="ghost" size="icon">
								<ArrowLeftIcon
									onClick={() => navigate(-1)}
									className="cursor-pointer"
								/>
							</Button>
							<HoverCard>
								<HoverCardTrigger>
									<div>
										<h1 className="font-bold text-2xl tracking-tight line-clamp-1 w-[35rem]">
											{article.title}
										</h1>
										<p className="font-medium text-sm text-gray-400">
											Knowledge Article
										</p>
									</div>
								</HoverCardTrigger>
								<HoverCardContent
									className="flex flex-col w-[40rem]"
									align="start"
								>
									<h1 className="font-semibold text-lg tracking-tight">
										{article.title}
									</h1>
									<p className="text-sm text-muted-foreground">
										{article.description}
									</p>
								</HoverCardContent>
							</HoverCard>
						</div>

						<div className="flex divide-x gap-x-4">
							<div className="px-5">
								<p className="font-semibold text-sm">
									{article.articlePublicNo}
								</p>
								<p className="text-xs">Article Number</p>
							</div>
							<div className="px-5">
								<p className="font-semibold text-sm">
									{article.language}
								</p>
								<p className="text-xs">Language</p>
							</div>
							<div className="px-5">
								<p className="font-semibold text-sm">
									{format(article.createdAt, "dd/MM/yyyy p")}
								</p>
								<p className="text-xs">Created On</p>
							</div>
							<div className="px-5">
								<p className="font-semibold text-sm">
									{article.status}
								</p>
								<p className="text-xs">Status Reason</p>
							</div>
						</div>
					</div>
				)}

				<div className="flex gap-x-2 ml-auto">
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger>
							<Button
								variant="outline"
								className={
									currentUser.role === "TECHNICIAN" ||
									currentUser.role === "ADMIN" ||
									currentUser.role === "SUPER_ADMIN" ||
									currentUser.role === "DEVELOPER"
										? "flex"
										: "hidden"
								}
							>
								New <PlusIcon className="ml-2 h-4 w-4" />
							</Button>
						</SheetTrigger>
						<SheetContent className="w-[60rem] sm:max-w-none">
							<SheetHeader className="mb-4">
								<SheetTitle>
									Create New Knowledge Article
								</SheetTitle>
								<SheetDescription>
									Create a Knowledge Article, Ensure you
									describe the solution clearly and provide
									images if you have to.
								</SheetDescription>
							</SheetHeader>
							<NewArticle />
						</SheetContent>
					</Sheet>

					<Button variant="outline" onClick={handleRefresh}>
						Refresh <ReloadIcon className="ml-2 h-4 w-4" />
					</Button>

					{/* approval form */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={
								article?.approved ||
								article?.stage !== "Approval"
							}
							className={
								currentUser.role === "TECHNICIAN" ||
								currentUser.role === "ADMIN" ||
								currentUser.role === "SUPER_ADMIN" ||
								currentUser.role === "DEVELOPER"
									? "flex"
									: "hidden"
							}
						>
							<Button
								variant="outline"
								disabled={
									article?.approved ||
									article?.stage !== "Approval"
								}
							>
								Approve <CheckIcon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<Form {...approveForm}>
								<form
									onSubmit={approveForm.handleSubmit(
										onApproveSubmit
									)}
									className="space-y-4"
									id="approveForm"
								>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This
											will permanently mark the case as
											approved.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<FormField
										control={approveForm.control}
										name="approval"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Approval Status
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Approval status"
														{...field}
														defaultValue="Approve"
														disabled
													/>
												</FormControl>
												<FormDescription>
													After choosing continue the
													article will be marked as
													approved.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<AlertDialogFooter>
										<AlertDialogCancel>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											type="submit"
											form="approveForm"
										>
											Continue
										</AlertDialogAction>
									</AlertDialogFooter>
								</form>
							</Form>
						</AlertDialogContent>
					</AlertDialog>

					{/* Revert to draft dialog */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={!article?.published}
							className={
								currentUser.role === "TECHNICIAN" ||
								currentUser.role === "ADMIN" ||
								currentUser.role === "SUPER_ADMIN" ||
								currentUser.role === "DEVELOPER"
									? "flex"
									: "hidden"
							}
						>
							<Button
								variant="outline"
								disabled={!article?.published}
							>
								Revert to Draft
								<NotepadTextDashedIcon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. You will have
									to republish the article again to make it
									available.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleRevertToDraft}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					{/* Publish Form */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={!article?.approved}
							className={
								currentUser.role === "TECHNICIAN" ||
								currentUser.role === "ADMIN" ||
								currentUser.role === "SUPER_ADMIN" ||
								currentUser.role === "DEVELOPER"
									? "flex"
									: "hidden"
							}
						>
							<Button
								variant="outline"
								disabled={!article?.approved}
							>
								Publish{" "}
								<BookPlusIcon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<Form {...publishForm}>
								<form
									onSubmit={publishForm.handleSubmit(
										onPublishSubmit
									)}
									className="space-y-4"
									id="publishForm"
								>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											Publish this article. You can revert
											it to draft later. Reverting to
											draft will remove it from the
											Knowledge article list.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<FormField
										control={publishForm.control}
										name="publishSubject"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Publish Subject
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																className="placeholder:text-muted-foreground"
																placeholder="Select publish subject..."
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{publishSubject &&
															publishSubject.map(
																(item, idx) => (
																	<SelectItem
																		value={
																			item.value
																		}
																		key={
																			idx
																		}
																	>
																		{
																			item.label
																		}
																	</SelectItem>
																)
															)}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={publishForm.control}
										name="publishOn"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Publish Date
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Publish Date"
														{...field}
														defaultValue={format(
															isoPublishDate,
															"dd/MM/yyyy p"
														)}
														disabled
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={publishForm.control}
										name="expirationDate"
										render={({ field }) => (
											<FormItem className="flex flex-col">
												<FormLabel>
													Expiration Date
												</FormLabel>
												<Popover
													open={datePickerOpen}
													onOpenChange={
														setDatePickerOpen
													}
												>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant={
																	"outline"
																}
																className={cn(
																	"pl-3 text-left font-normal",
																	!field.value &&
																		"text-muted-foreground"
																)}
															>
																{field.value ? (
																	format(
																		field.value,
																		"PPP"
																	)
																) : (
																	<span>
																		Pick
																		expiration
																		date
																	</span>
																)}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent
														className="w-auto p-0"
														align="start"
													>
														<Calendar
															mode="single"
															selected={
																field.value
															}
															onSelect={
																field.onChange
															}
															onDayClick={() => {
																setDatePickerOpen(
																	false
																);
															}}
															disabled={(date) =>
																date <
																new Date()
															}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												<FormDescription>
													Add an expiration date if
													the article is for a limited
													period. This is optional.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<AlertDialogFooter>
										<AlertDialogCancel>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											type="submit"
											form="publishForm"
										>
											Continue
										</AlertDialogAction>
									</AlertDialogFooter>
								</form>
							</Form>
						</AlertDialogContent>
					</AlertDialog>

					{/* Relate article dialog */}
					<AlertDialog>
						<AlertDialogTrigger
							className={
								currentUser.role === "TECHNICIAN" ||
								currentUser.role === "ADMIN" ||
								currentUser.role === "SUPER_ADMIN" ||
								currentUser.role === "DEVELOPER"
									? "flex"
									: "hidden"
							}
						>
							<Button variant="outline">
								Relate <FileSymlink className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Relate this article to another one.
								</AlertDialogTitle>
								<AlertDialogDescription>
									Create a relation between this article and
									another one.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<Form {...relateForm}>
								<form
									onSubmit={relateForm.handleSubmit(
										onRelateSubmit
									)}
									id="relateForm"
								>
									<FormField
										control={relateForm.control}
										name="relatedArticleId"
										render={({ field }) => (
											<FormItem className="flex flex-col mb-4">
												<FormLabel>
													Relate Article
												</FormLabel>
												<Popover
													onOpenChange={setOpenRelate}
													open={openRelate}
												>
													<FormControl>
														<PopoverTrigger asChild>
															<Button
																variant="outline"
																role="combobox"
																aria-expanded={
																	openRelate
																}
																className={cn(
																	"justify-between",
																	!field.value &&
																		"w-full text-muted-foreground"
																)}
															>
																{field.value
																	? articles?.find(
																			(
																				article
																			) =>
																				article.id ===
																				field.value
																	  )?.title
																	: "Select article..."}
																<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
															</Button>
														</PopoverTrigger>
													</FormControl>
													<PopoverContent
														align="start"
														className="w-full"
													>
														<Command>
															<CommandInput
																placeholder="Search article..."
																className="h-9"
															/>
															<ScrollArea className="h-[20rem]">
																<CommandEmpty>
																	No article
																	found.
																</CommandEmpty>
																<CommandGroup>
																	{articles?.map(
																		(
																			article
																		) => (
																			<CommandItem
																				key={
																					article.id
																				}
																				value={
																					article?.title
																				}
																				onSelect={() => {
																					relateForm.setValue(
																						"relatedArticleId",
																						article.id
																					);
																					setOpenRelate(
																						false
																					);
																				}}
																			>
																				{
																					article.title
																				}
																				<CheckIcon
																					className={cn(
																						"ml-auto h-4 w-4",
																						field.value ===
																							article.id
																							? "opacity-100"
																							: "opacity-0"
																					)}
																				/>
																			</CommandItem>
																		)
																	)}
																</CommandGroup>
															</ScrollArea>
														</Command>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</FormItem>
										)}
									/>
									<AlertDialogFooter>
										<AlertDialogCancel>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											type="submit"
											form="relateForm"
										>
											Continue
										</AlertDialogAction>
									</AlertDialogFooter>
								</form>
							</Form>
						</AlertDialogContent>
					</AlertDialog>

					{/* Trash article dialog */}
					<AlertDialog>
						<AlertDialogTrigger
							className={
								currentUser.role === "TECHNICIAN" ||
								currentUser.role === "ADMIN" ||
								currentUser.role === "SUPER_ADMIN" ||
								currentUser.role === "DEVELOPER"
									? "flex"
									: "hidden"
							}
						>
							<Button variant="outline">
								Move to Trash{" "}
								<TrashIcon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Trashing this item doesn't delete it
									permanently. It moves it to trash and it can
									be recovered within 30 days from date of
									deletion.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleTrash}>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					{/* Delete article dialog */}
					<AlertDialog>
						<AlertDialogTrigger
							className={
								currentUser.role === "TECHNICIAN" ||
								currentUser.role === "ADMIN" ||
								currentUser.role === "SUPER_ADMIN" ||
								currentUser.role === "DEVELOPER"
									? "flex"
									: "hidden"
							}
						>
							<Button variant="destructive">
								Delete <Trash2Icon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete this atcl and remove the
									data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleDelete}>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>

				<Tabs
					defaultValue={
						currentUser.role === "TECHNICIAN" ||
						currentUser.role === "ADMIN" ||
						currentUser.role === "SUPER_ADMIN" ||
						currentUser.role === "DEVELOPER"
							? "content"
							: "read"
					}
				>
					<TabsList className="mb-2">
						<TabsTrigger
							value="content"
							className={
								currentUser.role === "TECHNICIAN" ||
								currentUser.role === "ADMIN" ||
								currentUser.role === "SUPER_ADMIN" ||
								currentUser.role === "DEVELOPER"
									? "flex"
									: "hidden"
							}
						>
							Content
						</TabsTrigger>
						<TabsTrigger
							value="summary"
							className={
								currentUser.role === "TECHNICIAN" ||
								currentUser.role === "ADMIN" ||
								currentUser.role === "SUPER_ADMIN" ||
								currentUser.role === "DEVELOPER"
									? "flex"
									: "hidden"
							}
						>
							Summary
						</TabsTrigger>
						<TabsTrigger
							value="read"
							className={
								article?.stage === "published" &&
								article.status === "published"
									? "flex"
									: "hidden"
							}
						>
							Read
						</TabsTrigger>
					</TabsList>
					<Separator />
					<TabsContent value="content">
						<Article article={article} />
					</TabsContent>
					<TabsContent value="summary">
						<ArticleDetailTab article={article} />
					</TabsContent>
					<TabsContent value="read">
						<ReadArticle article={article} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default ArticleDetails;
