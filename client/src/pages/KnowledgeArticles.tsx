/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import {
	DotsHorizontalIcon,
	MixerHorizontalIcon,
	ReloadIcon,
} from "@radix-ui/react-icons";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ArrowLeftIcon,
	BookKeyIcon,
	BookPlusIcon,
	CalendarIcon,
	CheckIcon,
	GlobeIcon,
	NotepadTextDashedIcon,
	PlusIcon,
	Share2Icon,
	Trash2Icon,
	TrashIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { client } from "@/services/axiosClient";
import { useAuthStore } from "@/stores/auth.store";
import { format } from "date-fns";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import NewArticle from "@/components/NewArticle";
import Loader from "@/components/shared/Loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { publishSubject } from "@/utils/consts";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { ArticleTableToolbar } from "@/components/shared/ArticleTableToolbar";
import EmptyPlaceholder from "@/components/shared/EmptyPlaceholder";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";

const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

const approveFormSchema = z.object({
	approval: z.string({
		required_error: "Approval status is required",
	}),
});

const publishFormSchema = z.object({
	publishSubject: z.string({
		required_error: "publish subject is required.",
	}),
	publishOn: z.string({
		required_error: "Publish Date is required.",
	}),
	expirationDate: z.date().optional(),
});

type ApproveFormValues = z.infer<typeof approveFormSchema>;
type PublishFormValues = z.infer<typeof publishFormSchema>;

const columns: ColumnDef<IKnowledgeArticleProps>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) =>
					table.toggleAllPageRowsSelected(!!value)
				}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "articlePublicNo",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Public No" />;
		},
		cell: ({ row }) => (
			<div className="capitalize">
				<Link
					to={`/knowledgearticles/article-details/${row.original.id}`}
					className="hover:underline text-blue-500"
				>
					{row.getValue("articlePublicNo")}
				</Link>
			</div>
		),
	},
	{
		accessorKey: "title",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Title" />;
		},
		cell: ({ row }) => (
			<div className="capitalize">
				<Link
					to={`/knowledgearticles/article-details/${row.original.id}`}
					className="hover:underline text-blue-500"
				>
					{row.getValue("title")}
				</Link>
			</div>
		),
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Status" />;
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("status")}</div>
		),
	},
	{
		accessorKey: "stage",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Stage" />;
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("stage")}</div>
		),
	},
	{
		accessorKey: "majorVNo",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader
					column={column}
					title="Major Version No."
				/>
			);
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("majorVNo")}</div>
		),
	},
	{
		accessorKey: "views",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Views" />;
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("views")}</div>
		),
	},
	{
		accessorKey: "modifiedAt",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column} title="Modified On" />
			);
		},
		cell: ({ row }) => (
			<div className="capitalize">
				{format(row.getValue("modifiedAt"), "dd/MM/yyyy p")}
			</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const article = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<DotsHorizontalIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-[160px] space-y-1"
					>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(article.id)
							}
						>
							Copy Article No
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className={
								currentUser.role === "TECHNICIAN" ||
								currentUser.role === "ADMIN" ||
								currentUser.role === "SUPER_ADMIN" ||
								currentUser.role === "DEVELOPER"
									? "flex"
									: "hidden"
							}
						>
							<BookKeyIcon className="mr-2 h-4 w-4" /> Mark
							Internal
						</DropdownMenuItem>
						<DropdownMenuItem
							className={
								currentUser.role === "TECHNICIAN" ||
								currentUser.role === "ADMIN" ||
								currentUser.role === "SUPER_ADMIN" ||
								currentUser.role === "DEVELOPER"
									? "flex"
									: "hidden"
							}
						>
							<GlobeIcon className="mr-2 h-4 w-4" /> Mark External
						</DropdownMenuItem>
						<DropdownMenuItem
							className={
								currentUser.role === "TECHNICIAN" ||
								currentUser.role === "ADMIN" ||
								currentUser.role === "SUPER_ADMIN" ||
								currentUser.role === "DEVELOPER"
									? "flex"
									: "hidden"
							}
						>
							<NotepadTextDashedIcon className="mr-2 h-4 w-4" />{" "}
							Revert To Draft
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Share2Icon className="mr-2 h-4 w-4" /> Share
						</DropdownMenuItem>
						<DropdownMenuItem className="bg-red-500">
							<Trash2Icon className="mr-2 h-4 w-4" /> Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

const KnowledgeArticles: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(false);
	const [datePickerOpen, setDatePickerOpen] = React.useState(false);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [data, setData] = React.useState([]);
	const [currRowArticle, setCurrRowArticle] =
		React.useState<IKnowledgeArticleProps>();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

	//convert publish date to ISO
	const publishDate = new Date();
	const isoPublishDate = publishDate?.toISOString();

	// convert trash data to ISO
	const trashDate = new Date();
	const deletedAt = trashDate?.toISOString();

	const isRowSelected = Object.keys(rowSelection).length;
	const currRowId = Object.keys(rowSelection).shift();

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

	async function onApproveSubmit(approveFormData: ApproveFormValues) {
		try {
			await client.patch(
				`http://localhost:8800/api/v1/karticles/${currRowId}`,
				{
					approved: true,
					modifierId: currentUser.id,
				}
			);
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
			await client.patch(
				`http://localhost:8800/api/v1/karticles/${currRowId}`,
				{
					published: true,
					draft: false,
					status: "Published",
					stage: "Published",
					publishSubject: publishFormData.publishSubject,
					publishedOn: isoPublishDate,
					expirationDate:
						publishFormData.expirationDate?.toISOString(),
					modifierId: currentUser.id,
				}
			);
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

	const handleRefresh = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					"http://localhost:8800/api/v1/karticles"
				);
				setData(res.data);
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
			setRowSelection({});
		} else {
			navigate("/signin");
		}
	};

	const handleDelete = async () => {
		if (isLoggedIn) {
			try {
				if (isRowSelected > 1) {
					const selIds = Object.keys(rowSelection);

					await client.delete(
						`http://localhost:8800/api/v1/karticles`,
						{
							data: {
								ids: selIds,
							},
						}
					);
				} else {
					await client.delete(
						`http://localhost:8800/api/v1/karticles/${currRowId}`
					);
				}

				handleRefresh();

				toast({
					title: "Knowledge article deletion.",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
							<code className="text-white text-wrap">
								{isRowSelected > 1
									? "Knowledge Articles deleted successfully"
									: "Knowledge Article deleted successfully"}
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

	const handleTrash = async () => {
		if (isLoggedIn) {
			try {
				await client.patch(
					`http://localhost:8800/api/v1/karticles/${currRowId}`,
					{
						deletedAt: deletedAt,
					}
				);
				await client.post(`http://localhost:8800/api/v1/trash`, {
					articleId: currRowId,
					trashedById: currentUser.id,
				});

				handleRefresh();

				toast({
					title: "Knowledge article trash.",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
							<code className="text-white text-wrap">
								{isRowSelected > 1
									? "Knowledge Articles trashed successfully"
									: "Knowledge Article trashed successfully"}
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

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchArticles = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/karticles`
					);
					setData(res.data);
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
			fetchArticles();

			const fetchArticleById = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/karticles/${currRowId}`
					);
					setCurrRowArticle(res.data);
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

			fetchArticleById();
		}
	}, [isLoggedIn, currRowId]);

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getRowId: (row) => row.id,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		autoResetPageIndex: false,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		initialState: {
			pagination: {
				pageSize: 20,
			},
		},
	});

	return (
		<div className="p-2 border-l w-full">
			<div className="flex items-end justify-between">
				<div className="flex items-center gap-x-4">
					<Button variant="ghost" size="icon">
						<ArrowLeftIcon
							onClick={() => navigate(-1)}
							className="cursor-pointer"
						/>
					</Button>
					<h1 className="font-bold text-3xl tracking-tight">
						Knowledge Articles
					</h1>
				</div>
				<div className="flex items-center gap-x-2 ml-auto">
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
							<NewArticle handleRefresh={handleRefresh} />
						</SheetContent>
					</Sheet>
					<Button
						variant="outline"
						className=""
						onClick={handleRefresh}
					>
						Refresh <ReloadIcon className="ml-2 h-4 w-4" />
					</Button>

					{/* approval form */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={
								isRowSelected !== 1 ||
								currRowArticle?.approved ||
								currRowArticle?.stage !== "Approval"
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
									isRowSelected !== 1 ||
									currRowArticle?.approved ||
									currRowArticle?.stage !== "Approval"
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
										<AlertDialogAction type="submit">
											Continue
										</AlertDialogAction>
									</AlertDialogFooter>
								</form>
							</Form>
						</AlertDialogContent>
					</AlertDialog>

					{/* Publish Form */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={
								isRowSelected !== 1 || !currRowArticle?.approved
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
									isRowSelected !== 1 ||
									!currRowArticle?.approved
								}
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
										<AlertDialogAction type="submit">
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
							disabled={isRowSelected != 1}
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
								disabled={isRowSelected != 1}
							>
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

					{/* Delete */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={isRowSelected < 1}
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
								variant="destructive"
								disabled={isRowSelected < 1}
							>
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
									permanently delete this article and remove
									the data from our servers.
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

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								<MixerHorizontalIcon className="mr-2 h-4 w-4" />
								Column View
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>
								Toggle columns
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Cases Table */}
			<div className="w-full">
				<div className="flex justify-between items-center py-4 w-full">
					<ArticleTableToolbar table={table} />
				</div>
				<div className="rounded-md border">
					<ScrollArea className="h-[calc(100vh-15rem)]">
						<Table>
							<TableHeader className="sticky top-0 bg-secondary">
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<TableHead key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column
																	.columnDef
																	.header,
																header.getContext()
														  )}
												</TableHead>
											);
										})}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											data-state={
												row.getIsSelected() &&
												"selected"
											}
										>
											{row
												.getVisibleCells()
												.map((cell) => (
													<TableCell key={cell.id}>
														{flexRender(
															cell.column
																.columnDef.cell,
															cell.getContext()
														)}
													</TableCell>
												))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											{data.length === 0 ? (
												<EmptyPlaceholder />
											) : (
												<Loader />
											)}
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</ScrollArea>
				</div>
				<div className="py-4">
					<DataTablePagination table={table} />
				</div>
			</div>
		</div>
	);
};

export default KnowledgeArticles;
