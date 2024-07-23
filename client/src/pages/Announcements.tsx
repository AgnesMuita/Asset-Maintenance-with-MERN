/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import { Separator } from "@/components/ui/separator";
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
	ArchiveRestoreIcon,
	ArchiveXIcon,
	ArrowLeftIcon,
	PlusIcon,
	Share2Icon,
	Trash2Icon,
} from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { format } from "date-fns";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { useNavigate } from "react-router-dom";
import NewAnnouncement from "@/components/NewAnnouncement";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AnnouncementDetails from "@/components/AnnouncementDetails";
import Loader from "@/components/shared/Loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
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
import EmptyPlaceholder from "@/components/shared/EmptyPlaceholder";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { AnnouncementTableToolbar } from "@/components/shared/AnnouncementTableToolbar";
import PriorityBadge from "@/components/shared/PriorityBadge";

const activateFormSchema = z.object({
	active: z.string({
		required_error: "Article status is required.",
	}),
});

const deactivateFormSchema = z.object({
	active: z.string({
		required_error: "Article Status is required.",
	}),
});

type ActivateFormValues = z.infer<typeof activateFormSchema>;
type DeactivateFormValues = z.infer<typeof deactivateFormSchema>;

const columns: ColumnDef<IAnnouncementProps>[] = [
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
		accessorKey: "updatedAt",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Date" />;
		},
		cell: ({ row }) => (
			<div className="max-w-[400px]">
				<p>{format(row.getValue("updatedAt"), "MMMM dd, yyyy")}</p>
				<p className="text-muted-foreground">
					{format(row.getValue("updatedAt"), "KK:mm aaa")}
				</p>
			</div>
		),
	},
	{
		accessorKey: "title",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Title" />;
		},
		cell: ({ row }) => (
			<Dialog>
				<DialogTrigger>
					<div className="capitalize truncate max-w-[400px] hover:underline text-blue-500 cursor-pointer">
						{row.getValue("title")}
					</div>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[50rem]">
					<AnnouncementDetails id={row.original.id} />
				</DialogContent>
			</Dialog>
		),
	},
	{
		accessorKey: "announcement",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column} title="Announcement" />
			);
		},
		cell: ({ row }) => (
			<Dialog>
				<DialogTrigger>
					<div
						className="capitalize text-left truncate line-clamp-2 min-w-[500px] max-w-[600px] hover:underline text-blue-500 cursor-pointer"
						dangerouslySetInnerHTML={{
							__html: row.getValue("announcement"),
						}}
					></div>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[50rem]">
					<AnnouncementDetails id={row.original.id} />
				</DialogContent>
			</Dialog>
		),
	},
	{
		accessorKey: "severity",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Severity" />;
		},
		cell: ({ row }) => (
			<div className="capitalize">
				<PriorityBadge priority={row.getValue("severity")} />
			</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const announcement = row.original;

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
								navigator.clipboard.writeText(
									announcement.title
								)
							}
						>
							Copy Announcement Title
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<ArchiveRestoreIcon className="mr-2 h-4 w-4" />{" "}
							Activate
						</DropdownMenuItem>
						<DropdownMenuItem>
							<ArchiveXIcon className="mr-2 h-4 w-4" /> Deactivate
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

const Announcements: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [currRowAnnouncement, setCurrRowAnnouncement] =
		React.useState<IAnnouncementProps>();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [data, setData] = React.useState([]);
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	const isRowSelected = Object.keys(rowSelection).length;
	const currRowId = Object.keys(rowSelection).shift();

	const activateForm = useForm<ActivateFormValues>({
		resolver: zodResolver(activateFormSchema),
		mode: "onChange",
		defaultValues: {
			active: "Activate",
		},
	});

	const deactivateForm = useForm<DeactivateFormValues>({
		resolver: zodResolver(deactivateFormSchema),
		mode: "onChange",
		defaultValues: {
			active: "Deactivate",
		},
	});

	async function onActivateSubmit(activateFormData: ActivateFormValues) {
		try {
			await client.patch(
				`http://localhost:8800/api/v1/announcements/${currRowId}`,
				{
					active: true,
				}
			);
			toast({
				title: "Announcement activated successfully!",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(activateFormData, null, 2)}
						</code>
					</pre>
				),
			});
		} catch (err) {
			toast({
				title: "Encountered an error!",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
						<code className="text-white text-wrap">
							{`Error - ${err}`}
						</code>
					</pre>
				),
			});
		}
	}

	async function onDeactivateSubmit(
		deactivateFormData: DeactivateFormValues
	) {
		try {
			await client.patch(
				`http://localhost:8800/api/v1/announcements/${currRowId}`,
				{
					active: false,
				}
			);
			toast({
				title: "Announcement deactivated successfully!",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(deactivateFormData, null, 2)}
						</code>
					</pre>
				),
			});
		} catch (err) {
			console.error(err);
		}
	}

	const handleDelete = async () => {
		if (isRowSelected > 1) {
			const selIds = Object.keys(rowSelection);

			await client.delete(`http://localhost:8800/api/v1/announcements`, {
				data: {
					ids: selIds,
				},
			});
		} else {
			await client.delete(
				`http://localhost:8800/api/v1/announcements/${currRowId}`
			);
		}

		toast({
			title: "Announcement deletion",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
					<code className="text-white text-wrap">
						{isRowSelected > 1
							? "Announcements deleted successfully"
							: "Announcement deleted successfully"}
					</code>
				</pre>
			),
		});
		handleRefresh();
	};

	const handleRefresh = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					"http://localhost:8800/api/v1/announcements"
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

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchAnnouncements = async () => {
				try {
					const res = await client.get(
						"http://localhost:8800/api/v1/announcements"
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

			const fetchAnnouncementById = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/announcements/${currRowId}`
					);
					setCurrRowAnnouncement(res.data);
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

			fetchAnnouncementById;
			fetchAnnouncements();
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
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-x-4">
					<Button variant="ghost" size="icon">
						<ArrowLeftIcon
							onClick={() => navigate(-1)}
							className="cursor-pointer"
						/>
					</Button>
					<div className="space-y-1">
						<h2 className="text-3xl font-bold tracking-tight">
							Announcements
						</h2>
						<p className="text-muted-foreground">
							View organization-wide announcements and updates
						</p>
					</div>
				</div>
				<div className="flex items-center gap-x-2 ml-auto">
					<Sheet>
						<SheetTrigger
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
								New Announcement
								<PlusIcon className="ml-2 h-4 w-4" />
							</Button>
						</SheetTrigger>
						<SheetContent className="w-[60rem] sm:max-w-none">
							<SheetHeader className="mb-4">
								<SheetTitle>Create New Announcement</SheetTitle>
								<SheetDescription>
									Create an Announcement, Ensure all the
									details are correct before submitting it.
								</SheetDescription>
							</SheetHeader>
							<NewAnnouncement />
						</SheetContent>
					</Sheet>
					<Button
						variant="outline"
						className=""
						onClick={handleRefresh}
					>
						Refresh <ReloadIcon className="ml-2 h-4 w-4" />
					</Button>

					{/* Activate Form Dialog */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={
								isRowSelected !== 1 ||
								!currRowAnnouncement?.active
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
									!currRowAnnouncement?.active
								}
							>
								Activate{" "}
								<ArchiveRestoreIcon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<Form {...activateForm}>
								<form
									onSubmit={activateForm.handleSubmit(
										onActivateSubmit
									)}
									className="space-y-4"
								>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This
											will mark the announcement as active
											and make it visible to everyone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<div>
										<FormField
											control={activateForm.control}
											name="active"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Active
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Is Active"
															{...field}
															defaultValue="Activate"
															disabled
														/>
													</FormControl>
													<FormDescription>
														This is the status of
														the announcement.
														Whether it's active or
														inactive.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
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

					{/* Deactivate Form Dialog */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={
								isRowSelected !== 1 ||
								currRowAnnouncement?.active
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
									isRowSelected < 1 ||
									isRowSelected > 1 ||
									currRowAnnouncement?.active
								}
							>
								Deactivate{" "}
								<ArchiveXIcon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<Form {...deactivateForm}>
								<form
									onSubmit={deactivateForm.handleSubmit(
										onDeactivateSubmit
									)}
									className="space-y-4"
								>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This
											will deactivate this announcement
											and it won't be visible to anyone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<div>
										<FormField
											control={deactivateForm.control}
											name="active"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Deactivate
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Is Active"
															{...field}
															defaultValue="Deactivate"
															disabled
														/>
													</FormControl>
													<FormDescription>
														This is the status of
														the announcement.
														Whether it's active or
														inactive'.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
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

					{/* Delete Article Dialog */}
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
							disabled={isRowSelected < 1}
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
									permanently delete this announcement and
									remove the data from our servers.
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
			<Separator className="mt-6" />
			<div className="w-full">
				<div className="flex justify-between items-center py-4">
					<AnnouncementTableToolbar table={table} />
				</div>
				<div className="rounded-md border">
					<ScrollArea className="h-[calc(100vh-20rem)]">
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

export default Announcements;
