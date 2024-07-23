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
	BarChartBig,
	CalendarIcon,
	PlusIcon,
	Share2Icon,
	Trash2Icon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { client } from "@/services/axiosClient";
import { useAuthStore } from "@/stores/auth.store";
import { addDays, format } from "date-fns";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import NewLog from "@/components/NewLog";
import MaintenanceDetails from "@/components/MaintenanceDetails";
import Loader from "@/components/shared/Loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmptyPlaceholder from "@/components/shared/EmptyPlaceholder";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
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
import { DateRange } from "react-day-picker";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { handleExportToExcel } from "@/utils/exportToExcel";

interface IExportData {
	id: string;
	title: string;
	performedBy: string;
	createdOn: string;
	description: string;
	remarks: string;
	assetTag: string;
	relatedAsset: string;
	assignedUser: string;
}

const columns: ColumnDef<IMaintenanceLogProps>[] = [
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
		accessorKey: "createdAt",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Created On" />;
		},
		cell: ({ row }) => (
			<div className="">
				{format(row.getValue("createdAt"), "dd/MM/yyyy p")}
			</div>
		),
	},
	{
		accessorKey: "title",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Title" />;
		},
		cell: ({ row }) => (
			<Sheet>
				<SheetTrigger>
					<div className="capitalize truncate max-w-[300px] cursor-pointer hover:underline text-blue-500">
						{row.getValue("title")}
					</div>
				</SheetTrigger>
				<SheetContent className="w-[60rem] sm:max-w-none">
					<MaintenanceDetails id={row.original.id} />
				</SheetContent>
			</Sheet>
		),
	},
	{
		accessorKey: "description",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column} title="Description" />
			);
		},
		cell: ({ row }) => (
			<Sheet>
				<SheetTrigger>
					<div
						className="capitalize truncate max-w-[300px] cursor-pointer hover:underline text-blue-500"
						dangerouslySetInnerHTML={{
							__html: row.getValue("description"),
						}}
					></div>
				</SheetTrigger>
				<SheetContent className="w-[60rem] sm:max-w-none">
					<MaintenanceDetails id={row.original.id} />
				</SheetContent>
			</Sheet>
		),
	},
	{
		accessorKey: "performedBy",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column} title="Performed By" />
			);
		},
		cell: ({ row }) => (
			<div className="capitalize">
				{row.original.performedBy.fullName}
			</div>
		),
	},
	{
		accessorKey: "relatedAsset",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column} title="Related Asset" />
			);
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.original.asset.name}</div>
		),
	},
	{
		accessorKey: "remarks",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Remarks" />;
		},
		cell: ({ row }) => (
			<div
				className="capitalize truncate max-w-[300px]"
				dangerouslySetInnerHTML={{ __html: row.getValue("remarks") }}
			></div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const log = row.original;

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
								navigator.clipboard.writeText(log.title)
							}
						>
							Copy maintenance title
						</DropdownMenuItem>
						<DropdownMenuSeparator />
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

const FormSchema = z.object({
	period: z.date({
		required_error: "A date of birth is required.",
	}),
});

const Maintenance: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [date, setDate] = React.useState<DateRange | undefined>({
		from: new Date(),
		to: addDays(new Date(), 28),
	});
	const [data, setData] = React.useState<IMaintenanceLogProps[]>([]);
	const [exportData, setExportData] = React.useState<IExportData[]>([]);
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	const createExportData = () => {
		const exportArray = data
			.filter(
				(log) =>
					new Date(log.createdAt) >= (date?.from ?? new Date()) &&
					new Date(log.createdAt) <= (date?.to ?? new Date())
			)
			.map((log) => ({
				id: log.id,
				title: log.title,
				performedBy: log.performedBy.fullName,
				createdOn: format(log.createdAt, "MMMM dd, yyyy"),
				description: log.description,
				remarks: log.remarks,
				assetTag: log.asset.tag,
				relatedAsset: log.asset.name,
				assignedUser: log.asset.user?.fullName,
			}));

		setExportData(exportArray);

		handleExportToExcel(
			exportData,
			`Maintenance Logs-${new Date().toISOString()}`
		);
	};

	const isRowSelected = Object.keys(rowSelection).length;
	const currRowId = Object.keys(rowSelection).shift();

	function onSubmit(data: z.infer<typeof FormSchema>) {
		toast({
			title: "You submitted the following values:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">
						{JSON.stringify(data, null, 2)}
					</code>
				</pre>
			),
		});
	}

	const handleRefresh = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					"http://localhost:8800/api/v1/maintenance"
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
						"http://localhost:8800/api/v1/maintenance/",
						{
							data: {
								ids: selIds,
							},
						}
					);
				} else {
					await client.delete(
						`http://localhost:8800/api/v1/maintenance/${currRowId}`
					);
				}

				handleRefresh();
				toast({
					title: "Log deletion",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
							<code className="text-white">
								{isRowSelected > 1
									? "Logs deleted successfully"
									: "Log deleted successfully"}
							</code>
						</pre>
					),
				});
			} catch (error) {
				toast({
					title: "Encountered an error!",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
							<code className="text-white">
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
			if (
				currentUser.role === "TECHNICIAN" ||
				currentUser.role === "ADMIN" ||
				currentUser.role === "SUPER_ADMIN" ||
				currentUser.role === "DEVELOPER"
			) {
				const fetchMaintenanceLogs = async () => {
					try {
						const res = await client.get(
							`http://localhost:8800/api/v1/maintenance`
						);
						setData(res.data);
					} catch (error) {
						console.log(error);
					}
				};
				fetchMaintenanceLogs();
			} else {
				const fetchUserMaintenanceLogs = async () => {
					try {
						const res = await client.get(
							`http://localhost:8800/api/v1/maintenance/user/${currentUser.id}`
						);
						setData(res.data);
					} catch (error) {
						console.log(error);
					}
				};

				fetchUserMaintenanceLogs();
			}
		}
	}, [isLoggedIn, currentUser.id, currentUser.role]);

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
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<Button variant="ghost" size="icon">
						<ArrowLeftIcon
							onClick={() => navigate(-1)}
							className="cursor-pointer"
						/>
					</Button>
					<h1 className="font-bold text-3xl tracking-tight">
						Maintenance Logs
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
								<SheetTitle>
									Create New Maintenance Log
								</SheetTitle>
								<SheetDescription>
									Create a Maintenance Log, Ensure you
									describe the event clearly.
								</SheetDescription>
							</SheetHeader>
							<NewLog />
						</SheetContent>
					</Sheet>

					<Button variant="outline" onClick={handleRefresh}>
						Refresh <ReloadIcon className="ml-2 h-4 w-4" />
					</Button>

					{/* Generate log report dialog */}
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
								Generate Report{" "}
								<BarChartBig className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Generate Periodical Maintenance Report
								</AlertDialogTitle>
								<AlertDialogDescription>
									Select a date range to generate a list of
									log reports in that time period.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-8"
								>
									<FormField
										control={form.control}
										name="period"
										render={() => (
											<FormItem className="flex flex-col">
												<FormLabel>
													Report Period
												</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															id="date"
															variant={"outline"}
															className={cn(
																"w-[300px] justify-start text-left font-normal",
																!date &&
																	"text-muted-foreground"
															)}
														>
															<CalendarIcon className="mr-2 h-4 w-4" />
															{date?.from ? (
																date.to ? (
																	<>
																		{format(
																			date.from,
																			"LLL dd, y"
																		)}{" "}
																		-{" "}
																		{format(
																			date.to,
																			"LLL dd, y"
																		)}
																	</>
																) : (
																	format(
																		date.from,
																		"LLL dd, y"
																	)
																)
															) : (
																<span>
																	Pick a date
																</span>
															)}
														</Button>
													</PopoverTrigger>
													<PopoverContent
														className="w-auto p-0"
														align="start"
													>
														<Calendar
															initialFocus
															mode="range"
															defaultMonth={
																date?.from
															}
															selected={date}
															onSelect={setDate}
															numberOfMonths={2}
														/>
													</PopoverContent>
												</Popover>
											</FormItem>
										)}
									/>
								</form>
							</Form>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => createExportData()}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					{/* Delete log dialog */}
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
									permanently delete this log and remove the
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
				<div className="flex justify-between items-center py-4 w-full">
					<Input
						placeholder="Search maintenance logs..."
						value={
							(table
								.getColumn("description")
								?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table
								.getColumn("description")
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

export default Maintenance;
