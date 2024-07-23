import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { client } from "@/services/axiosClient";
import { useAuthStore } from "@/stores/auth.store";
import { DotsHorizontalIcon, ReloadIcon } from "@radix-ui/react-icons";
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
	ArrowLeftIcon,
	Trash2Icon,
	TrashIcon,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { format } from "date-fns";
import EmptyPlaceholder from "@/components/shared/EmptyPlaceholder";
import Loader from "@/components/shared/Loader";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CaseNoBadge from "@/components/shared/CaseNoBadge";
import RoleBadge from "@/components/shared/RoleBadge";
import { Badge } from "@/components/ui/badge";
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

const columns: ColumnDef<ITrashProps>[] = [
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
		accessorKey: "deletedItem",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column} title="Deleted Item" />
			);
		},
		cell: ({ row }) => (
			<div className="">
				{row.original.trashedArticle && (
					<div className="flex items-center gap-x-2">
						<p className="truncate">
							{row.original.trashedArticle.title}
						</p>{" "}
						<Badge className="bg-amber-600 bg-opacity-20 text-amber-600 border border-amber-600 dark:text-amber-300 hover:bg-opacity-20 hover:bg-amber-600 rounded-full py-0">
							{row.original.trashedArticle.articlePublicNo}
						</Badge>
						<Badge variant="outline" className="rounded-full py-0">
							Article
						</Badge>
					</div>
				)}
				{row.original.trashedAsset && (
					<div className="flex items-center gap-x-2">
						<p className="truncate">
							{row.original.trashedAsset.name}
						</p>{" "}
						<Badge className="bg-rose-600 bg-opacity-20 text-rose-600 border-rose-600 dark:text-rose-300 hover:bg-opacity-20 hover:bg-rose-600 rounded-full py-0">
							{row.original.trashedAsset.tag}
						</Badge>
						<Badge variant="outline" className="rounded-full py-0">
							Asset
						</Badge>
					</div>
				)}
				{row.original.trashedCase && (
					<div className="flex items-center gap-x-2">
						<p className="truncate">
							{row.original.trashedCase.caseTitle}
						</p>{" "}
						<CaseNoBadge
							caseNumber={row.original.trashedCase.caseNumber}
						/>
						<Badge variant="outline" className="rounded-full py-0">
							Case
						</Badge>
					</div>
				)}
				{row.original.trashedUser && (
					<div className="flex items-center gap-x-2">
						<p className="truncate">
							{row.original.trashedUser.fullName}
						</p>{" "}
						<RoleBadge role={row.original.trashedUser.role} />
						<Badge variant="outline" className="rounded-full py-0">
							User
						</Badge>
					</div>
				)}
			</div>
		),
	},
	{
		accessorKey: "trashedBy",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Trashed By" />;
		},
		cell: ({ row }) => (
			<div className="max-w-[200px]">
				<p>{row.original.trashedBy?.fullName}</p>
			</div>
		),
	},
	{
		accessorKey: "trashedOn",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Trashed On" />;
		},
		cell: ({ row }) => (
			<div className="max-w-[200px]">
				<p>
					{row.original.createdAt &&
						format(row.original.createdAt, "MMMM dd, yyyy, p")}
				</p>
			</div>
		),
	},
	{
		accessorKey: "permanentDelete",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column} title="Auto Delete On" />
			);
		},
		cell: ({ row }) => (
			<div className="max-w-[200px]">
				<p>
					{row.original.createdAt &&
						format(row.original.createdAt, "MMMM dd, yyyy, p")}
				</p>
			</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const item = row.original;

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
								navigator.clipboard.writeText(item.id)
							}
						>
							Copy Item ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<ArchiveRestoreIcon className="mr-2 h-4 w-4" />{" "}
							Restore
						</DropdownMenuItem>
						<DropdownMenuItem className="bg-red-500">
							<Trash2Icon className="mr-2 h-4 w-4" /> Delete
							Forever
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

const Trash: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const [data, setData] = React.useState<ITrashProps[]>([]);
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const isRowSelected = Object.keys(rowSelection).length;
	const currRowId = Object.keys(rowSelection).shift();

	const handleRefresh = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					"http://localhost:8800/api/v1/trash"
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

	const handleDeleteForever = async () => {
		try {
			if (isRowSelected > 1) {
				const selIds = Object.keys(rowSelection);

				const res = await client.delete(
					`http://localhost:8800/api/v1/trash`,
					{
						data: {
							ids: selIds,
						},
					}
				);
				if (res.status === 200) {
					handleRefresh();

					toast({
						title: "Trash Items Deletion",
						description: (
							<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
								<code className="text-white text-wrap">
									Trash Deleted Successfully!
								</code>
							</pre>
						),
					});
				}
			} else {
				const res = await client.delete(
					`http://localhost:8800/api/v1/trash/${currRowId}`
				);

				if (res.status === 200) {
					handleRefresh();

					toast({
						title: "Trash Item Deletion",
						description: (
							<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
								<code className="text-white text-wrap">
									Trash Deleted Successfully!
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
			title: "Trash Items deletion",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
					<code className="text-white text-wrap">
						Trash deleted successfully
					</code>
				</pre>
			),
		});
	};

	const handleEmptyTrash = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.delete(
					`http://localhost:8800/api/v1/trash/empty`
				);
				if (res.status === 200) {
					handleRefresh();

					toast({
						title: "Empty Trash",
						description: (
							<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
								<code className="text-white text-wrap">
									Trash Emptied Successfully!
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
			const fetchTrash = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/trash`
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
			fetchTrash();
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
							Trash
						</h2>
						<p className="text-muted-foreground">
							Items you have deleted over the last 30 days.
						</p>
					</div>
				</div>
				<div className="flex items-center gap-x-2 ml-auto">
					<Button
						variant="outline"
						className=""
						onClick={handleRefresh}
					>
						Refresh <ReloadIcon className="ml-2 h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className=""
						disabled={isRowSelected != 1}
					>
						Restore <ArchiveRestoreIcon className="ml-2 h-4 w-4" />
					</Button>

					{/* Empty Trash dialog */}
					<AlertDialog>
						<AlertDialogTrigger>
							<Button
								variant="destructive"
								className=""
								disabled={data.length === 0}
							>
								Empty Trash{" "}
								<TrashIcon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete all items in the trash
									and remove the data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleEmptyTrash}>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					{/* Delete forever dialog */}
					<AlertDialog>
						<AlertDialogTrigger disabled={isRowSelected < 1}>
							<Button
								variant="destructive"
								className=""
								disabled={isRowSelected < 1}
							>
								Delete Forever{" "}
								<Trash2Icon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete these item(s) and remove
									the data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDeleteForever}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
			<Separator className="my-6" />
			<ScrollArea className="h-[calc(100vh-14.7rem)]">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
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
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
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
	);
};

export default Trash;
