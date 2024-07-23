/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect } from "react";
import {
	CaretSortIcon,
	DotsHorizontalIcon,
	MixerHorizontalIcon,
	ReloadIcon,
} from "@radix-ui/react-icons";
import {
	ColumnDef,
	ColumnFiltersState,
	RowSelectionState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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

import { client } from "@/services/axiosClient";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { CaseTableToolbar } from "@/components/shared/CaseTableToolbar";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import {
	ArrowLeftIcon,
	CheckIcon,
	FileCheck,
	FileX2,
	PlusIcon,
	Share2Icon,
	Trash2,
	TrashIcon,
	UserRoundPlusIcon,
} from "lucide-react";
import Loader from "@/components/shared/Loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Cancel_Types,
	Resolution_Types,
	priorities,
	statuses,
} from "@/utils/consts";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import NewCase from "@/components/NewCase";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/components/ui/use-toast";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import EmptyPlaceholder from "@/components/shared/EmptyPlaceholder";

const labels = [
	{
		value: "bug",
		label: "Bug",
	},
	{
		value: "feature",
		label: "Feature",
	},
	{
		value: "documentation",
		label: "Documentation",
	},
];

const resolveFormSchema = z.object({
	resolType: z.string({
		required_error: "Resolution Type is required.",
	}),
	resolution: z.string({
		required_error: "Resolution description is required.",
	}),
});

const cancelFormSchema = z.object({
	currStatus: z.string({
		required_error: "Case Status is required.",
	}),
});

const assignFormSchema = z.object({
	technician: z.string({
		required_error: "Technician is required.",
	}),
});

type ResolveFormValues = z.infer<typeof resolveFormSchema>;
type CancelFormValues = z.infer<typeof cancelFormSchema>;
type AssignFormValues = z.infer<typeof assignFormSchema>;

const columns: ColumnDef<ICaseProps>[] = [
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
		accessorKey: "caseNumber",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column} title="Case Number" />
			);
		},
		cell: ({ row }) => (
			<div>
				<Link
					to={`/cases/case-details/${row.original.id}`}
					className="hover:underline text-blue-500"
				>
					{row.getValue("caseNumber")}
				</Link>
			</div>
		),
	},
	{
		accessorKey: "caseTitle",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Case Title" />;
		},
		cell: ({ row }) => {
			const label = labels.find(
				(label) => label.value === row.original.id
			);

			return (
				<div className="flex space-x-2">
					{label && <Badge variant="outline">{label.label}</Badge>}
					<span className="max-w-[300px] truncate">
						{row.getValue("caseTitle")}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "priority",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Priority" />;
		},
		cell: ({ row }) => {
			const priority = priorities.find(
				(priority) => priority.value === row.getValue("priority")
			);

			if (!priority) {
				return null;
			}

			return (
				<div className="flex items-center">
					<Badge
						variant="default"
						className={
							priority.value === "LOW"
								? "bg-green-600 bg-opacity-20 border border-green-600 text-green-600 dark:text-green-300 hover:bg-green-500 hover:bg-opacity-20 rounded-full"
								: priority.value === "NORMAL"
								? "bg-yellow-600 bg-opacity-20 border border-yellow-600 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-500 hover:bg-opacity-20 rounded-full"
								: priority.value === "HIGH"
								? "bg-red-600 bg-opacity-20 border border-red-600 text-red-600 dark:text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-full"
								: priority.value === "URGENT"
								? "bg-pink-600 bg-opacity-20 border border-pink-600 text-pink-600 dark:text-pink-300 hover:bg-pink-500 hover:bg-opacity-20 rounded-full"
								: "bg-foreground"
						}
					>
						{priority.icon && (
							<priority.icon
								className={
									priority.value === "LOW"
										? "text-green-600 dark:text-green-300 mr-2 h-4 w-4"
										: priority.value === "NORMAL"
										? "text-yellow-600 dark:text-yellow-300 mr-2 h-4 w-4"
										: priority.value === "HIGH"
										? "text-red-600 dark:text-red-300 mr-2 h-4 w-4"
										: priority.value === "URGENT"
										? "text-pink-600 dark:text-pink-300 mr-2 h-4 w-4"
										: "text-foreground mr-2 h-4 w-4"
								}
							/>
						)}
						{priority.label}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: "origin",
		header: () => <div>Origin</div>,
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("origin")}</div>
		),
	},
	{
		accessorKey: "owner",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Owner" />;
		},
		cell: ({ row }) => (
			<div>
				<Link
					to={`/users/user-details/${row.original.owner?.id}`}
					className="hover:underline text-blue-500"
				>
					{row.original.owner?.fullName}
				</Link>
			</div>
		),
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Status" />;
		},
		cell: ({ row }) => {
			const status = statuses.find(
				(status) => status.value === row.getValue("status")
			);

			if (!status) {
				return null;
			}

			return (
				<div className="flex w-[140px] items-center">
					{status.icon && (
						<status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
					)}
					<span>{status.label}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Created On" />;
		},
		cell: ({ row }) => (
			<div>{format(row.getValue("createdAt"), "dd/MM/yyyy p")}</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const kase = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
						>
							<DotsHorizontalIcon className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-[160px] space-y-1"
					>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(
									kase.caseNumber.toString()
								)
							}
						>
							Copy Case No
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<UserRoundPlusIcon className="mr-2 h-4 w-4" />{" "}
							Assign
						</DropdownMenuItem>
						<DropdownMenuItem>
							<CheckIcon className="mr-2 h-4 w-4" /> Pick
						</DropdownMenuItem>
						<DropdownMenuItem>
							<FileCheck className="mr-2 h-4 w-4" /> Resolve Case
						</DropdownMenuItem>
						<DropdownMenuItem>
							<FileX2 className="mr-2 h-4 w-4" /> Cancel Case
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Share2Icon className="mr-2 h-4 w-4" /> Share
						</DropdownMenuItem>
						<DropdownMenuItem className="bg-red-500">
							<Trash2 className="mr-2 h-4 w-4" /> Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

const Cases: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [data, setData] = React.useState<ICaseProps[]>([]);
	const [currRowCase, setCurrRowCase] = React.useState<ICaseProps>();
	const [users, setUsers] = React.useState<IUserProps[]>();
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
		{}
	);
	const [open, setOpen] = React.useState(false);
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

	const isRowSelected = Object.keys(rowSelection).length;
	const currRowId = Object.keys(rowSelection).shift();

	// convert trash data to ISO
	const trashDate = new Date();
	const deletedAt = trashDate?.toISOString();

	const resolveForm = useForm<ResolveFormValues>({
		resolver: zodResolver(resolveFormSchema),
		mode: "onChange",
	});

	const cancelForm = useForm<CancelFormValues>({
		resolver: zodResolver(cancelFormSchema),
		mode: "onChange",
	});

	const assignForm = useForm<AssignFormValues>({
		resolver: zodResolver(assignFormSchema),
		mode: "onChange",
		defaultValues: {
			technician: currentUser.fullName,
		},
	});

	async function onResolveSubmit(resolveFormData: ResolveFormValues) {
		try {
			await client.patch(
				`http://localhost:8800/api/v1/cases/${currRowId}`,
				{
					resolved: true,
					resolType: resolveFormData.resolType,
					resolution: resolveFormData.resolution,
				}
			);
			toast({
				title: "Case resolved successfully!",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(resolveFormData, null, 2)}
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

	async function onCancelSubmit(cancelFormData: CancelFormValues) {
		try {
			await client.patch(
				`http://localhost:8800/api/v1/cases/${currRowId}`,
				{
					cancelled: true,
					currStatus: cancelFormData.currStatus,
				}
			);
			toast({
				title: "Case cancelled successfully!",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(cancelFormData, null, 2)}
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

	async function onAssignSubmit(assignFormData: AssignFormValues) {
		try {
			await client.patch(
				`http://localhost:8800/api/v1/cases/${currRowId}`,
				{
					technician: assignFormData.technician,
				}
			);
			toast({
				title: "Case assigned successfully!",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
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
			if (
				currentUser.role === "TECHNICIAN" ||
				currentUser.role === "ADMIN" ||
				currentUser.role === "SUPER_ADMIN" ||
				currentUser.role === "DEVELOPER"
			) {
				try {
					const res = await client.get(
						"http://localhost:8800/api/v1/cases"
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
			} else {
				// fetch user cases
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/cases/user/${currentUser.id}`
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

				await client.delete(`http://localhost:8800/api/v1/cases`, {
					data: {
						ids: selIds,
					},
				});
			} else {
				await client.delete(
					`http://localhost:8800/api/v1/cases/${currRowId}`
				);
			}

			handleRefresh();

			toast({
				title: "Case deletion",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
						<code className="text-white text-wrap">
							{isRowSelected > 1
								? "Cases deleted successfully"
								: "Case deleted successfully"}
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
	};

	const handleTrash = async () => {
		if (isLoggedIn) {
			try {
				await client.patch(
					`http://localhost:8800/api/v1/cases/${currRowId}`,
					{
						deletedAt: deletedAt,
					}
				);
				await client.post(`http://localhost:8800/api/v1/trash`, {
					caseId: currRowId,
					trashedById: currentUser.id,
				});

				handleRefresh();

				toast({
					title: "Case trash.",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
							<code className="text-white text-wrap">
								Case trashed successfully
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

	// fetch cases
	useEffect(() => {
		if (isLoggedIn) {
			if (
				currentUser.role === "TECHNICIAN" ||
				currentUser.role === "ADMIN" ||
				currentUser.role === "SUPER_ADMIN" ||
				currentUser.role === "DEVELOPER"
			) {
				const fetchCases = async () => {
					try {
						const res = await client.get(
							"http://localhost:8800/api/v1/cases"
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
				fetchCases();
			} else {
				// fetch user cases
				const fetchUserCases = async () => {
					try {
						const res = await client.get(
							`http://localhost:8800/api/v1/cases/user/${currentUser.id}`
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
				fetchUserCases();
			}

			const fetchCaseById = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/cases/${currRowId}`
					);
					setCurrRowCase(res.data);
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

			fetchCaseById();
			fetchUsers();
		} else {
			navigate("/signin");
		}
	}, [isLoggedIn, navigate, currRowId, currentUser.id, currentUser.role]);

	const table = useReactTable({
		data,
		columns,
		enableRowSelection: true,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
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
					<h1 className="font-bold text-3xl tracking-tight">Cases</h1>
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
								<SheetTitle>Create New Case</SheetTitle>
								<SheetDescription>
									Create a case which will automatically
									submit a ticket to IT support. Make sure you
									describe you issue clearly.
								</SheetDescription>
							</SheetHeader>
							<NewCase />
						</SheetContent>
					</Sheet>
					<Button
						variant="outline"
						className=""
						onClick={handleRefresh}
					>
						Refresh <ReloadIcon className="ml-2 h-4 w-4" />
					</Button>

					{/* Resolve case Form */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={
								isRowSelected !== 1 ||
								currRowCase?.resolved ||
								currRowCase?.cancelled
							}
						>
							<Button
								variant="outline"
								disabled={
									isRowSelected !== 1 ||
									currRowCase?.resolved ||
									currRowCase?.cancelled
								}
							>
								Resolve Case{" "}
								<FileCheck className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<Form {...resolveForm}>
								<form
									onSubmit={resolveForm.handleSubmit(
										onResolveSubmit
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
											control={resolveForm.control}
											name="resolType"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Resolution Type
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
																	placeholder="Select resolution type..."
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{Resolution_Types &&
																Resolution_Types.map(
																	(item) => (
																		<SelectItem
																			value={
																				item
																			}
																		>
																			{
																				item
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
											control={resolveForm.control}
											name="resolution"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Resolution
													</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Resolution"
															{...field}
															rows={6}
														/>
													</FormControl>
													<FormDescription>
														This is the resolution
														of the issue or
														incident. Make sure it
														is detailed and describe
														it clearly.
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

					{/* Cancel Case Form */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={
								isRowSelected !== 1 ||
								currRowCase?.cancelled ||
								currRowCase?.resolved
							}
						>
							<Button
								variant="outline"
								disabled={
									isRowSelected !== 1 ||
									currRowCase?.cancelled ||
									currRowCase?.resolved
								}
							>
								Cancel Case <FileX2 className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<Form {...cancelForm}>
								<form
									onSubmit={cancelForm.handleSubmit(
										onCancelSubmit
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
											cancelled.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<div>
										<FormField
											control={cancelForm.control}
											name="currStatus"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Cancellation Status
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
																	placeholder="Select cancellation status..."
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{Cancel_Types &&
																Cancel_Types.map(
																	(item) => (
																		<SelectItem
																			value={
																				item
																			}
																		>
																			{
																				item
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

					{/* Case assign Form */}
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
							disabled={
								isRowSelected !== 1 ||
								currRowCase?.resolved ||
								currRowCase?.cancelled
							}
						>
							<Button
								variant="outline"
								disabled={
									isRowSelected !== 1 ||
									currRowCase?.resolved ||
									currRowCase?.cancelled
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
											Assign a technician this case
										</AlertDialogTitle>
										<AlertDialogDescription>
											You can change the technician
											assigned this case later.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<div>
										<FormField
											control={assignForm.control}
											name="technician"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>
														Select Technician
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
																					user.fullName ===
																					field.value
																		  )
																				?.fullName
																		: "Select technician..."}
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
																	placeholder="Search technician..."
																	className="h-9"
																/>
																<ScrollArea className="h-[20rem] w-full">
																	<CommandEmpty>
																		No
																		technician
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
																						user?.fullName
																					}
																					onSelect={() => {
																						assignForm.setValue(
																							"technician",
																							user.fullName
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
																								user.fullName
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

					{/* Pick Case Dialog */}
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
							disabled={
								isRowSelected !== 1 ||
								currRowCase?.resolved ||
								currRowCase?.cancelled
							}
						>
							<Button
								variant="outline"
								disabled={
									isRowSelected !== 1 ||
									currRowCase?.resolved ||
									currRowCase?.cancelled
								}
							>
								Pick <CheckIcon className="ml-2 h-4 w-4" />
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
											Assign this case to yourself?
										</AlertDialogTitle>
										<AlertDialogDescription>
											You will assign this case to
											yourself. No one will be able pick
											it or assign it to a technician.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<FormField
										control={assignForm.control}
										name="technician"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Technician
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Technician"
														{...field}
														defaultValue={
															currentUser.fullName
														}
														disabled
													/>
												</FormControl>
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

					{/* Trash case dialog */}
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

					{/* Delete case dialog */}
					<AlertDialog>
						<AlertDialogTrigger disabled={isRowSelected < 1}>
							<Button
								variant="destructive"
								disabled={isRowSelected < 1}
							>
								Delete <Trash2 className="ml-2 h-4 w-4" />
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
							<Button
								variant="outline"
								size="sm"
								className="ml-auto hidden h-8 lg:flex"
							>
								<MixerHorizontalIcon className="mr-2 h-4 w-4" />
								Column View
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[150px]">
							<DropdownMenuLabel>
								Toggle columns
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{table
								.getAllColumns()
								.filter(
									(column) =>
										typeof column.accessorFn !==
											"undefined" && column.getCanHide()
								)
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
					<CaseTableToolbar table={table} />
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

export default Cases;
