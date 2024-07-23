/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import {
	CaretSortIcon,
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
	ActivityIcon,
	ArchiveRestoreIcon,
	ArchiveXIcon,
	ArrowLeftIcon,
	ArrowRightFromLineIcon,
	CheckIcon,
	ImportIcon,
	PlusIcon,
	Share2Icon,
	ShieldOffIcon,
	Trash2Icon,
	TrashIcon,
	UserRoundPlusIcon,
} from "lucide-react";
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
import NewAsset from "@/components/NewAsset";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { format } from "date-fns";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { toast } from "@/components/ui/use-toast";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import EmptyPlaceholder from "@/components/shared/EmptyPlaceholder";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import ImportData from "@/components/ImportData";
import { saveAs } from "file-saver";
import { handleExportToExcel } from "@/utils/exportToExcel";

const activateFormSchema = z.object({
	active: z.string({
		required_error: "Asset status is required.",
	}),
});

const deactivateFormSchema = z.object({
	active: z.string({
		required_error: "Asset Status is required.",
	}),
});

const assignFormSchema = z.object({
	userId: z.string({
		required_error: "User is required.",
	}),
});

type ActivateFormValues = z.infer<typeof activateFormSchema>;
type DeactivateFormValues = z.infer<typeof deactivateFormSchema>;
type AssignFormValues = z.infer<typeof assignFormSchema>;

const columns: ColumnDef<IAssetProps>[] = [
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
		accessorKey: "tag",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Tag No" />;
		},
		cell: ({ row }) => (
			<div className="capitalize">
				<Link
					to={`/assets/asset-details/${row.original.id}`}
					className="hover:underline text-blue-500"
				>
					{row.getValue("tag")}
				</Link>
			</div>
		),
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Asset Name" />;
		},
		cell: ({ row }) => (
			<div className="capitalize truncate max-w-[200px]">
				<Link
					to={`/assets/asset-details/${row.original.id}`}
					className="hover:underline text-blue-500"
				>
					{row.getValue("name")}
				</Link>
			</div>
		),
	},
	{
		accessorKey: "user",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="User" />;
		},
		cell: ({ row }) => (
			<Link
				to={`/users/user-details/${row.original.user?.id}`}
				className="hover:underline text-blue-500"
			>
				{row.original.user?.fullName}
			</Link>
		),
	},
	{
		accessorKey: "location",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Location" />;
		},
		cell: ({ row }) => (
			<div className="capitalize truncate">
				{row.getValue("location")}
			</div>
		),
	},
	{
		accessorKey: "category",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Category" />;
		},
		cell: ({ row }) => (
			<div className="capitalize truncate max-w-[150px]">
				{row.getValue("category")}
			</div>
		),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Created On" />;
		},
		cell: ({ row }) => (
			<div className="capitalize">
				{format(row.getValue("createdAt"), "dd/MM/yyyy p")}
			</div>
		),
	},
	{
		accessorKey: "active",
		header: "Active",
		cell: ({ row }) => (
			<div className="max-w-50">
				{row.original.active ? (
					<ActivityIcon size={20} color="#0F6CBD" />
				) : (
					<ShieldOffIcon size={20} color="#F05757" />
				)}
			</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const asset = row.original;

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
								navigator.clipboard.writeText(asset.tag)
							}
						>
							Copy Asset Tag
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
							<UserRoundPlusIcon className="mr-2 h-4 w-4" />{" "}
							Assign
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

const Assets: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [data, setData] = React.useState<IAssetProps[]>([]);
	const [users, setUsers] = React.useState<IUserProps[]>([]);
	const [currRowAsset, setCurrRowAsset] = React.useState<IAssetProps>();
	const [open, setOpen] = React.useState(false);
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	const isRowSelected = Object.keys(rowSelection).length;
	const currRowId = Object.keys(rowSelection).shift();

	// convert trash data to ISO
	const trashDate = new Date();
	const deletedAt = trashDate?.toISOString();

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

	const assignForm = useForm<AssignFormValues>({
		resolver: zodResolver(assignFormSchema),
		mode: "onChange",
	});

	async function onActivateSubmit(activateFormData: ActivateFormValues) {
		try {
			await client.patch(
				`http://localhost:8800/api/v1/assets/${currRowId}`,
				{
					active: true,
				}
			);
			toast({
				title: "Asset Activation",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white">
							{JSON.stringify(activateFormData, null, 2)}
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
						<code className="text-white">{`Error - ${error}`}</code>
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
				`http://localhost:8800/api/v1/assets/${currRowId}`,
				{
					active: false,
				}
			);
			toast({
				title: "Asset Deactivation",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white">
							{JSON.stringify(deactivateFormData, null, 2)}
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
						<code className="text-white">{`Error - ${error}`}</code>
					</pre>
				),
			});
		}
	}

	async function onAssignSubmit(assignFormData: AssignFormValues) {
		try {
			await client.post(`http://localhost:8800/api/v1/assets/history`, {
				assetLocation: currRowAsset?.location,
				assetConditionalNotes: currRowAsset?.conditionalNotes,
				assetCondtion: currRowAsset?.condition,
				assetStatus: currRowAsset?.assetStatus,
				assetId: currRowId,
				userId: assignFormData.userId,
				issuedById: currentUser.id,
			});
			await client.patch(
				`http://localhost:8800/api/v1/assets/${currRowId}`,
				{
					userId: assignFormData.userId,
					issuedBy: currentUser.fullName,
				}
			);
			toast({
				title: "Asset Assign",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white">
							{JSON.stringify(assignFormData, null, 2)}
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
						<code className="text-white">{`Error - ${error}`}</code>
					</pre>
				),
			});
		}
	}

	const handleDownload = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					`http://localhost:8800/api/v1/documents/cltt2j5230001kakxf8i5sp4v`
				);
				const resDown = await client.get(
					`http://localhost:8800/api/v1/documents/download/cltt2j5230001kakxf8i5sp4v`
				);

				const dataURI = resDown.data.data;

				const byteNumbers = atob(dataURI.split(",")[1]);
				const arrayBuffer = new ArrayBuffer(byteNumbers.length);
				const uintArray = new Uint8Array(arrayBuffer);

				for (let i = 0; i < byteNumbers.length; i++) {
					uintArray[i] = byteNumbers.charCodeAt(i);
				}

				const blob = new Blob([arrayBuffer], {
					type: "application/octet-stream",
				});
				saveAs(blob, res.data.fileMeta[0].fileName);
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

	const handleRefresh = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					"http://localhost:8800/api/v1/assets"
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
		try {
			if (isRowSelected > 1) {
				const selIds = Object.keys(rowSelection);

				const res = await client.delete(
					`http://localhost:8800/api/v1/assets`,
					{
						data: {
							ids: selIds,
						},
					}
				);
				if (res.status === 200) {
					handleRefresh();

					toast({
						title: "Assets Deletion",
						description: (
							<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
								<code className="text-white text-wrap">
									Assets Deleted Successfully!
								</code>
							</pre>
						),
					});
				}
			} else {
				const res = await client.delete(
					`http://localhost:8800/api/v1/assets/${currRowId}`
				);

				if (res.status === 200) {
					handleRefresh();

					toast({
						title: "Asset Deletion",
						description: (
							<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
								<code className="text-white text-wrap">
									Asset Deleted Successfully!
								</code>
							</pre>
						),
					});
				}
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

		handleRefresh();
		toast({
			title: "Asset deletion",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
					<code className="text-white text-wrap">
						{isRowSelected > 1
							? "Assets deleted successfully"
							: "Asset deleted successfully"}
					</code>
				</pre>
			),
		});
	};

	const handleTrash = async () => {
		if (isLoggedIn) {
			try {
				await client.patch(
					`http://localhost:8800/api/v1/assets/${currRowId}`,
					{
						deletedAt: deletedAt,
					}
				);
				await client.post(`http://localhost:8800/api/v1/trash`, {
					assetId: currRowId,
					trashedById: currentUser.id,
				});

				handleRefresh();

				toast({
					title: "Asset trash.",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
							<code className="text-white text-wrap">
								Asset trashed successfully
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
			const fetchAssets = async () => {
				try {
					const res = await client.get(
						"http://localhost:8800/api/v1/assets"
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

			const fetchAssetById = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/assets/${currRowId}`
					);
					setCurrRowAsset(res.data);
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

			const fetchUsers = async () => {
				try {
					const res = await client.get(
						"http://localhost:8800/api/v1/users"
					);
					setUsers(Object.values(res.data));
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

			fetchAssets();
			fetchUsers();
			fetchAssetById();
		} else {
			navigate("/signin");
		}
	}, [isLoggedIn, navigate, currRowId]);

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
						Assets
					</h1>
				</div>
				<div className="flex items-center gap-x-2 ml-auto">
					<Sheet>
						<SheetTrigger>
							<Button variant="outline">
								New <PlusIcon className="ml-2 h-4 w-4" />
							</Button>
						</SheetTrigger>
						<SheetContent className="w-[60rem] sm:max-w-none">
							<SheetHeader className="mb-4">
								<SheetTitle>Create New Asset</SheetTitle>
								<SheetDescription>
									Create an Asset, Ensure all the details are
									correct before submitting it.
								</SheetDescription>
							</SheetHeader>
							<NewAsset />
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
								isRowSelected !== 1 || currRowAsset?.active
							}
						>
							<Button
								variant="outline"
								disabled={
									isRowSelected !== 1 || currRowAsset?.active
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
											will permanently mark the case as
											resolved.
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
														the asset. Whether it's
														active or inactive'.
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
								isRowSelected !== 1 || !currRowAsset?.active
							}
						>
							<Button
								variant="outline"
								disabled={
									isRowSelected !== 1 || !currRowAsset?.active
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
											will permanently mark the case as
											resolved.
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
														the asset. Whether it's
														active or inactive'.
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

					{/* Asset assign Form */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={
								isRowSelected !== 1 || !currRowAsset?.active
							}
						>
							<Button
								variant="outline"
								disabled={
									isRowSelected !== 1 || !currRowAsset?.active
								}
							>
								Assign{" "}
								<UserRoundPlusIcon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<Form {...assignForm}>
								<form
									onSubmit={assignForm.handleSubmit(
										onAssignSubmit
									)}
									className="space-y-4"
								>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Assign a user this asset
										</AlertDialogTitle>
										<AlertDialogDescription>
											You can change the user assigned
											this case later.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<div>
										<FormField
											control={assignForm.control}
											name="userId"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>
														Select User
													</FormLabel>
													<Popover
														onOpenChange={setOpen}
														open={open}
													>
														<FormControl>
															<PopoverTrigger
																asChild
															>
																<Button
																	variant="outline"
																	role="combobox"
																	aria-expanded={
																		open
																	}
																	className={cn(
																		"justify-between",
																		!field.value &&
																			"text-muted-foreground"
																	)}
																>
																	{field.value
																		? users?.find(
																				(
																					user
																				) =>
																					user.id ===
																					field.value
																		  )
																				?.fullName
																		: "Select user..."}
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
																	placeholder="Search user..."
																	className="h-9"
																/>
																<ScrollArea className="h-[20rem] w-full">
																	<CommandEmpty>
																		No user
																		found.
																	</CommandEmpty>
																	<CommandGroup>
																		{users?.map(
																			(
																				user
																			) => (
																				<CommandItem
																					key={
																						user.id
																					}
																					value={
																						user?.id
																					}
																					onSelect={() => {
																						assignForm.setValue(
																							"userId",
																							user.id
																						);
																						setOpen(
																							false
																						);
																					}}
																				>
																					{
																						user.fullName
																					}
																					<CheckIcon
																						className={cn(
																							"ml-auto h-4 w-4",
																							field.value ===
																								user.id
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

					{/* Import data */}
					<Dialog>
						<DialogTrigger>
							<Button variant="outline" className="">
								Import <ImportIcon className="ml-2 h-4 w-4" />
							</Button>
						</DialogTrigger>
						<DialogContent className="py-10">
							<DialogHeader>
								<DialogTitle className="flex items-center justify-between">
									<p>Import Data from Excel Sheet</p>
									<Button
										variant="link"
										className="text-blue-500"
										onClick={handleDownload}
									>
										Download Assets Template
									</Button>
								</DialogTitle>
								<DialogDescription>
									Make sure you are importing the data using
									the provided excel template else the data
									will not be imported.
								</DialogDescription>
							</DialogHeader>
							<ImportData />
						</DialogContent>
					</Dialog>

					{/* Export data */}
					<Button
						variant="outline"
						className=""
						onClick={() => handleExportToExcel(data, "Assets")}
					>
						Export{" "}
						<ArrowRightFromLineIcon className="ml-2 h-4 w-4" />
					</Button>

					{/* Trash asset dialog */}
					<AlertDialog>
						<AlertDialogTrigger disabled={isRowSelected != 1}>
							<Button
								variant="outline"
								disabled={isRowSelected != 1}
							>
								Trash <TrashIcon className="ml-2 h-4 w-4" />
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

					{/* Delete asset dialog */}
					<AlertDialog>
						<AlertDialogTrigger disabled={isRowSelected < 1}>
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
									permanently delete this case and remove the
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
				<div className="flex justify-between items-center py-4">
					<Input
						placeholder="Type asset tag..."
						value={
							(table
								.getColumn("tag")
								?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table
								.getColumn("tag")
								?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
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

export default Assets;
