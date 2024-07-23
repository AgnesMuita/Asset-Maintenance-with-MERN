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
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	ArchiveRestoreIcon,
	ArchiveXIcon,
	ArrowLeftIcon,
	ArrowRightFromLineIcon,
	BadgeCheckIcon,
	BadgeXIcon,
	ImportIcon,
	KeyRoundIcon,
	PlusIcon,
	Trash2Icon,
	TrashIcon,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import NewUser from "@/components/NewUser";
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
import { toast } from "@/components/ui/use-toast";
import { generatePassword } from "@/utils/password.generator";
import { UserTableToolbar } from "@/components/shared/UserTableToolbar";
import { Badge } from "@/components/ui/badge";
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
import { handleExportToExcel } from "@/utils/exportToExcel";
import { saveAs } from "file-saver";

const activateFormSchema = z.object({
	active: z.string({
		required_error: "User status is required.",
	}),
});

const deactivateFormSchema = z.object({
	active: z.string({
		required_error: "User Status is required.",
	}),
});

const resetFormSchema = z.object({
	password: z.string({
		required_error: "Password value is required.",
	}),
});

type ActivateFormValues = z.infer<typeof activateFormSchema>;
type DeactivateFormValues = z.infer<typeof deactivateFormSchema>;
type ResetFormValues = z.infer<typeof resetFormSchema>;

const columns: ColumnDef<IUserProps>[] = [
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
		accessorKey: "fullName",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Full Names" />;
		},
		cell: ({ row }) => (
			<div className="capitalize truncate flex items-center gap-x-2">
				<img
					src={row.original.avatar}
					alt="avatar"
					className="w-10 h-10 rounded-full"
				/>
				<Link
					to={`/users/user-details/${row.original.id}`}
					className="hover:underline text-blue-500"
				>
					{row.getValue("fullName")}
				</Link>
			</div>
		),
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Email" />;
		},
		cell: ({ row }) => (
			<div className="lowercase truncate">
				<Link
					to={`/users/user-details/${row.original.id}`}
					className="hover:underline text-blue-500"
				>
					{row.getValue("email")}
				</Link>
			</div>
		),
	},
	{
		accessorKey: "department",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Department" />;
		},
		cell: ({ row }) => (
			<div className="Capitalize">{row.getValue("department")}</div>
		),
	},
	{
		accessorKey: "jobTitle",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Job Title" />;
		},
		cell: ({ row }) => (
			<div className="Capitalize truncate max-w-[100px]">
				{row.getValue("jobTitle")}
			</div>
		),
	},
	{
		accessorKey: "phone",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Phone No" />;
		},
		cell: ({ row }) => (
			<div className="Capitalize truncate">{row.getValue("phone")}</div>
		),
	},
	{
		accessorKey: "role",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Role" />;
		},
		cell: ({ row }) => (
			<div className="Capitalize">
				<Badge
					variant="default"
					className={
						row.getValue("role") === "BASIC"
							? "bg-green-600 bg-opacity-20 border border-green-600 text-green-600 dark:text-green-300 hover:bg-green-500 hover:bg-opacity-20 rounded-full"
							: row.getValue("role") === "T1"
							? "bg-blue-600 bg-opacity-20 border border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-500 hover:bg-opacity-20 rounded-full"
							: row.getValue("role") === "T2"
							? "bg-cyan-600 bg-opacity-20 border border-cyan-600 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500 hover:bg-opacity-20 rounded-full"
							: row.getValue("role") === "TECHNICIAN"
							? "bg-pink-600 bg-opacity-20 border border-pink-600 text-pink-600 dark:text-pink-300 hover:bg-pink-500 hover:bg-opacity-20 rounded-full"
							: row.getValue("role") === "ADMIN"
							? "bg-yellow-600 bg-opacity-20 border border-yellow-600 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-500 hover:bg-opacity-20 rounded-full"
							: row.getValue("role") === "SUPER_ADMIN"
							? "bg-orange-600 bg-opacity-20 border border-orange-600 text-orange-600 dark:text-orange-300 hover:bg-orange-500 hover:bg-opacity-20 rounded-full"
							: row.getValue("role") === "DEVELOPER"
							? "bg-purple-600 bg-opacity-20 border border-purple-600 text-purple-600 dark:text-purple-300 hover:bg-purple-500 hover:bg-opacity-20 rounded-full"
							: "bg-foreground"
					}
				>
					{row.original.role.replace("_", " ")}
				</Badge>
			</div>
		),
	},
	{
		accessorKey: "active",
		header: "Active",
		cell: ({ row }) => (
			<div className="max-w-50">
				{row.original.active ? (
					<BadgeCheckIcon size={20} fill="#0F6CBD" color="white" />
				) : (
					<BadgeXIcon size={20} fill="#F05757" color="white" />
				)}
			</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const user = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<DotsHorizontalIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(user.email)
							}
						>
							Copy User Email
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Reset Password</DropdownMenuItem>
						<DropdownMenuItem>
							{row.original.active ? "Deactivate" : "Activate"}
						</DropdownMenuItem>
						<DropdownMenuItem>Share</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

const Users: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [data, setData] = React.useState<IUserProps[]>([]);
	const [currRowUser, setCurrRowUser] = React.useState<IUserProps>();
	const [autoPassword, setAutoPassword] = React.useState(true);
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	let genPassword = "";

	if (autoPassword) {
		genPassword = generatePassword({ length: 12 });
	}

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

	const resetForm = useForm<ResetFormValues>({
		resolver: zodResolver(resetFormSchema),
		mode: "onChange",
		defaultValues: {
			password: genPassword && genPassword,
		},
	});

	async function onActivateSubmit(activateFormData: ActivateFormValues) {
		try {
			await client.patch(
				`http://localhost:8800/api/v1/users/${currRowId}`,
				{
					active: true,
				}
			);
			toast({
				title: "User Activation",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
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
						<code className="text-white text-wrap">
							{`Error - ${error}`}
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
				`http://localhost:8800/api/v1/users/${currRowId}`,
				{
					active: false,
				}
			);
			toast({
				title: "User Deactivation",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white  text-wrap">
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
						<code className="text-white  text-wrap">
							{`Error - ${error}`}
						</code>
					</pre>
				),
			});
		}
	}

	async function onResetSubmit(resetFormData: ResetFormValues) {
		try {
			const res = await client.patch(
				`http://localhost:8800/api/v1/users/${currRowId}`,
				{
					password: resetFormData.password,
				}
			);

			if (res.status == 200) {
				navigator.clipboard.writeText(resetFormData.password);
				toast({
					title: "Passoword Reset",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
							<code className="text-white text-wrap">
								{JSON.stringify(resetFormData, null, 2)}
							</code>
							Password has been copied to the clipboard!
						</pre>
					),
				});
			}
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

	const handleDownload = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					`http://localhost:8800/api/v1/documents/cltt90j7h0003j9v9yqtvpn6o`
				);
				const resDown = await client.get(
					`http://localhost:8800/api/v1/documents/download/cltt90j7h0003j9v9yqtvpn6o`
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
							<code className="text-white  text-wrap">
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
					"http://localhost:8800/api/v1/users"
				);
				setData(Object.values(res.data));
			} catch (error) {
				toast({
					title: "Encountered an error!",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
							<code className="text-white  text-wrap">
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
			const res = await client.delete(
				`http://localhost:8800/api/v1/users/${currRowId}`
			);

			if (res.status === 200) {
				handleRefresh();
				toast({
					title: "User Deletion",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
							<code className="text-white  text-wrap">
								{JSON.stringify(res.data, null, 2)}
							</code>
						</pre>
					),
				});
			}
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
	};

	const handleTrash = async () => {
		if (isLoggedIn) {
			try {
				await client.patch(
					`http://localhost:8800/api/v1/users/${currRowId}`,
					{
						deletedAt: deletedAt,
					}
				);
				await client.post(`http://localhost:8800/api/v1/trash`, {
					userId: currRowId,
					trashedById: currentUser.id,
				});

				handleRefresh();

				toast({
					title: "User trash.",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
							<code className="text-white text-wrap">
								User trashed successfully
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
			const fetchUsers = async () => {
				try {
					const res = await client.get(
						"http://localhost:8800/api/v1/users"
					);
					setData(Object.values(res.data));
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

			const fetchUserById = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/users/${currRowId}`
					);
					setCurrRowUser(res.data);
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

			fetchUsers();
			fetchUserById();
		} else {
			navigate("/signin");
		}
	}, [isLoggedIn, currRowId, navigate]);

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

					<h1 className="font-bold text-3xl tracking-tight">Users</h1>
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
								<SheetTitle>Create New User</SheetTitle>
								<SheetDescription>
									Create a user, Ensure all the details are
									correct before submitting it.
								</SheetDescription>
							</SheetHeader>
							<NewUser />
						</SheetContent>
					</Sheet>
					<Button
						variant="outline"
						className=""
						onClick={handleRefresh}
					>
						Refresh <ReloadIcon className="ml-2 h-4 w-4" />
					</Button>

					{/* Reset Password Form Dialog */}
					<AlertDialog>
						<AlertDialogTrigger disabled={isRowSelected !== 1}>
							<Button
								variant="outline"
								disabled={isRowSelected !== 1}
							>
								Reset Password{" "}
								<KeyRoundIcon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<Form {...resetForm}>
								<form
									onSubmit={resetForm.handleSubmit(
										onResetSubmit
									)}
									className="space-y-4"
								>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Reset User Password
										</AlertDialogTitle>
										<AlertDialogDescription>
											Reset the selected user password:{" "}
											<span className="font-bold text-foreground">
												{currRowUser?.fullName}
											</span>
										</AlertDialogDescription>
									</AlertDialogHeader>
									<div className="space-y-4">
										<div className="flex items-center space-x-2">
											<Checkbox
												id="passwordgen"
												checked={autoPassword}
												onCheckedChange={() =>
													setAutoPassword(
														!autoPassword
													)
												}
											/>
											<label
												htmlFor="passwordgen"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Automatically create a password
											</label>
										</div>
										<FormField
											control={resetForm.control}
											name="password"
											render={({ field }) => (
												<FormItem
													className={
														autoPassword
															? "hidden"
															: "grid"
													}
												>
													<FormLabel>
														Password
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Password"
															{...field}
															defaultValue={
																genPassword
															}
														/>
													</FormControl>
													<FormDescription>
														Passwords must be
														between 8 and 256
														characters and use a
														combination of at least
														three of the following:
														uppercase letters,
														lowercase letters,
														numbers and symbols.
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

					{/* Activate Form Dialog */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={
								isRowSelected !== 1 || currRowUser?.active
							}
						>
							<Button
								variant="outline"
								disabled={
									isRowSelected !== 1 || currRowUser?.active
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
								isRowSelected !== 1 || !currRowUser?.active
							}
						>
							<Button
								variant="outline"
								disabled={
									isRowSelected !== 1 || !currRowUser?.active
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
											will permanently mark the user as
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
														the user. Whether it's
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
										Download Users Template
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

					<Button
						variant="outline"
						className=""
						onClick={() => handleExportToExcel(data, "Users")}
					>
						Export{" "}
						<ArrowRightFromLineIcon className="ml-2 h-4 w-4" />
					</Button>

					{/* Trash user dialog */}
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

					{/* Delete user dialog */}
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
									permanently delete this user and remove the
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

			{/* Users Table */}
			<div className="w-full">
				<div className="flex justify-between items-center py-4">
					<UserTableToolbar table={table} />
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

export default Users;
