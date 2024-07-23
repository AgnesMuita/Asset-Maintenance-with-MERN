/* eslint-disable no-mixed-spaces-and-tabs */
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	ArrowLeftIcon,
	CopyIcon,
	DownloadIcon,
	Share2Icon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, Trash2Icon } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
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
import React from "react";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { format } from "date-fns";
import {
	DotsHorizontalIcon,
	MixerHorizontalIcon,
	ReloadIcon,
} from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loader from "@/components/shared/Loader";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import AddDocument from "@/components/AddDocument";
import EmptyPlaceholder from "@/components/shared/EmptyPlaceholder";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import ViewDocument from "@/components/ViewDocument";
import { saveAs } from "file-saver";
import { Label } from "@/components/ui/label";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { Icon } from "@fluentui/react/lib/Icon";
import {
	getFileTypeIconProps,
	initializeFileTypeIcons,
} from "@fluentui/react-file-type-icons";
import { FileTypeIconMap } from "@/utils/fileIconMap";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import prettyBytes from "pretty-bytes";
import { Badge } from "@/components/ui/badge";

initializeFileTypeIcons(undefined);

const columns: ColumnDef<IDocumentProps>[] = [
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
		accessorKey: "filename",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Name" />;
		},
		cell: ({ row }) => (
			<div className="min-w-[300px] flex items-center gap-x-2">
				<Dialog>
					<DialogTrigger className="flex items-center gap-x-4">
						{FileTypeIconMap["accdb"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "accdb",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["archive"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "7z",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["audio"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "mp3",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["calendar"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "ics",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["classifier"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "classifier",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["clipchamp"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "clipchamp",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["code"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "asm",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["contact"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "vcf",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["csv"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "csv",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["designer"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "desig",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["docx"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "docx",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["dotx"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "dotx",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["email"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "msg",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["exe"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "exe",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["font"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "ttf",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["html"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "html",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["ipynb"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "ipynb",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["link"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "link",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["loop"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "loop",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["officescript"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "officescript",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["mcworld"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "mcworld",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["mctemplate"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "mctemplate",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["model"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "blend",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["mpp"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "mpp",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["mpt"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "mpt",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["officescript"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "osts",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["one"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "one",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["onetoc"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "onetoc",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["pdf"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "pdf",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["photo"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "jpg",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["potx"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "potx",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["powerbi"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "pbix",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["ppsx"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "ppsx",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["pptx"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "pptx",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["presentation"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "odp",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["pub"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "pub",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["rtf"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "rtf",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["spo"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "aspx",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["spreadsheet"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "gsheet",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["sysfile"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "bin",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["txt"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "txt",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["vector"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "ai",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["video"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "mp4",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["vsdx"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "vsdx",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["vssx"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "vssx",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["vstx"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "vstx",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["whiteboard"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "wbtx",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["xlsx"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "xlsx",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["xltx"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "xltx",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["xml"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "xml",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["xsn"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "xsn",
									size: 24,
								})}
							/>
						)}
						{FileTypeIconMap["zip"].extensions?.includes(
							row.original.fileMeta[0].fileName.split(".")[1]
						) && (
							<Icon
								{...getFileTypeIconProps({
									extension: "zip",
									size: 24,
								})}
							/>
						)}
						<p className="hover:underline hover:text-blue-500">
							{row.original.fileMeta[0].fileName.split(".")[0]}
						</p>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[50rem] pt-10">
						<ViewDocument id={row.original.id} page="documents" />
					</DialogContent>
				</Dialog>
				<Badge
					className={
						row.original.department === "GLOBAL"
							? "bg-green-600 bg-opacity-20 border border-green-600 text-green-600 dark:text-green-300 hover:bg-green-500 hover:bg-opacity-20 rounded-full py-0"
							: row.original.department === "ADMINISTRATION"
							? "bg-blue-600 bg-opacity-20 border border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-500 hover:bg-opacity-20 rounded-full py-0"
							: row.original.department === "PLANT"
							? "bg-cyan-600 bg-opacity-20 border border-cyan-600 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500 hover:bg-opacity-20 rounded-full py-0"
							: row.original.department === "LOGISTICS"
							? "bg-pink-600 bg-opacity-20 border border-pink-600 text-pink-600 dark:text-pink-300 hover:bg-pink-500 hover:bg-opacity-20 rounded-full py-0"
							: row.original.department === "SALES"
							? "bg-yellow-600 bg-opacity-20 border border-yellow-600 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-500 hover:bg-opacity-20 rounded-full py-0"
							: row.original.department === "PERSONAL"
							? "bg-purple-600 bg-opacity-20 border border-purple-600 text-purple-600 dark:text-purple-300 hover:bg-purple-500 hover:bg-opacity-20 rounded-full py-0"
							: "bg-foreground"
					}
				>
					{row.original.department.toLocaleLowerCase()}
				</Badge>
			</div>
		),
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Modified" />;
		},
		cell: ({ row }) => (
			<div className="max-w-[200px]">
				<p>{format(row.getValue("updatedAt"), "MMMM dd, yyyy")}</p>
			</div>
		),
	},
	{
		accessorKey: "modifier",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column} title="Modified By" />
			);
		},
		cell: ({ row }) => (
			<div className="max-w-[200px]">
				<p>{row.original.modifiedBy?.fullName}</p>
			</div>
		),
	},
	{
		accessorKey: "fileSize",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="File Size" />;
		},
		cell: ({ row }) => (
			<div className="max-w-[100px]">
				<p>{prettyBytes(row.original.fileMeta[0].size)}</p>
			</div>
		),
	},
	{
		accessorKey: "docType",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column} title="Document Type" />
			);
		},
		cell: ({ row }) => (
			<div className="max-w-[100px]">
				<p>{row.getValue("docType")}</p>
			</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const document = row.original;

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
									document.fileMeta[0].fileName
								)
							}
						>
							Copy Document Name
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<DownloadIcon className="mr-2 h-4 w-4" /> Download
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

const Documents = () => {
	const navigate = useNavigate();
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [data, setData] = React.useState([]);
	const [docUrl, setDocUrl] = React.useState("");
	const [toolTipVis, setToolTipVis] = React.useState(false);
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

	const isRowSelected = Object.keys(rowSelection).length;
	const currRowId = Object.keys(rowSelection).shift();

	const handleDownload = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					`http://localhost:8800/api/v1/documents/${currRowId}`
				);
				const resDown = await client.get(
					`http://localhost:8800/api/v1/documents/download/${currRowId}`
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

				toast({
					title: "Document Download",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
							<code className="text-white text-wrap">
								Document downloaded successfully!
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
		} else {
			navigate("/signin");
		}
	};

	const handleCreateLink = async () => {
		const downloadUrl = `http://localhost:8800/api/v1/documents/download/url/${currRowId}`;
		setDocUrl(downloadUrl);
	};

	const handleCopyLink = () => {
		navigator.clipboard
			.writeText(docUrl)
			.then(() => {
				setToolTipVis(true);
				setTimeout(() => {
					setToolTipVis(false);
				}, 2000);
			})
			.catch((error) => {
				toast({
					title: "Encountered an error!",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
							<code className="text-white text-wrap">
								{`Could not copy text - ${error}`}
							</code>
						</pre>
					),
				});
			});
	};

	const handleRefresh = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					"http://localhost:8800/api/v1/documents"
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

				await client.delete(`http://localhost:8800/api/v1/documents`, {
					data: {
						ids: selIds,
					},
				});
			} else {
				await client.delete(
					`http://localhost:8800/api/v1/documents/${currRowId}`
				);
			}

			handleRefresh();

			toast({
				title: "Document deletion",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
						<code className="text-white text-wrap">
							{isRowSelected > 1
								? "Documents deleted successfully"
								: "Document deleted successfully"}
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

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchDocuments = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/documents?department=${currentUser.department}&userId=${currentUser.id}`
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

			fetchDocuments();
		} else {
			navigate("/signin");
		}
	}, [isLoggedIn, navigate, currentUser.id, currentUser.department]);

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
							Document Repository
						</h2>
						<p className="text-muted-foreground">
							View and upload policies, application forms, SOPs,
							and other organizational documents.
						</p>
					</div>
				</div>
				<div className="flex items-center gap-x-2 ml-auto">
					<Sheet>
						<SheetTrigger>
							<Button variant="outline">
								Add Document
								<PlusIcon className="ml-2 h-4 w-4" />
							</Button>
						</SheetTrigger>
						<SheetContent className="w-[60rem] sm:max-w-none">
							<SheetHeader className="mb-4">
								<SheetTitle>Add New Document</SheetTitle>
								<SheetDescription>
									Add a new document, Ensure all the details
									are correct before submitting it.
								</SheetDescription>
							</SheetHeader>
							<AddDocument />
						</SheetContent>
					</Sheet>
					<Button variant="outline" onClick={handleRefresh}>
						Refresh <ReloadIcon className="ml-2 h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						disabled={isRowSelected !== 1}
						onClick={handleDownload}
					>
						Download <DownloadIcon className="ml-2 h-4 w-4" />
					</Button>

					<Dialog>
						<DialogTrigger
							disabled={isRowSelected !== 1}
							onClick={handleCreateLink}
						>
							<Button
								variant="outline"
								disabled={isRowSelected !== 1}
							>
								Share <Share2Icon className="ml-2 h-4 w-4" />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>
									Share the selected document
								</DialogTitle>
								<DialogDescription>
									This will copy a downloadable document URL.
								</DialogDescription>
							</DialogHeader>
							<Label>Document URL</Label>
							<div className="flex items-center">
								<Input
									id="doc-url"
									defaultValue={docUrl}
									value={docUrl}
									className="rounded-r-none relative"
								/>
								<Label
									className="z-50 absolute top-[5rem] right-[1rem] border rounded-md px-3 py-1.5 bg-primary text-primary-foreground text-xs overflow-hidden animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
									hidden={!toolTipVis}
								>
									Copied!
								</Label>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<Button
												variant="outline"
												size="icon"
												className="rounded-l-none border-l-0"
												onClick={handleCopyLink}
											>
												<CopyIcon className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Copy</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</DialogContent>
					</Dialog>

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
			<Separator className="my-6" />
			<div className="w-full">
				<div className="flex justify-between items-center py-4">
					<Input
						placeholder="Type document name..."
						value={
							(table
								.getColumn("filename")
								?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table
								.getColumn("filename")
								?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
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

export default Documents;
