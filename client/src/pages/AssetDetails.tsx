import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaretSortIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
	ArchiveRestoreIcon,
	ArchiveXIcon,
	ArrowLeftIcon,
	CheckIcon,
	DotIcon,
	DownloadIcon,
	PrinterIcon,
	Share2Icon,
	Trash2Icon,
	TrashIcon,
	UserRoundPlusIcon,
} from "lucide-react";
import Asset from "@/components/Asset";
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
import NewAsset from "@/components/NewAsset";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import CreatePDF from "@/components/shared/CreatePDF";
import AssetHistory from "@/components/AssetHistory";
import { pdfjs } from "react-pdf";

interface PDFMetadata {
	Author?: string;
	Title?: string;
	Subject?: string;
	Keywords?: string;
	Creator?: string;
	Producer?: string;
	CreationDate?: Date;
	ModDate?: Date;
	PDFFormatVersion?: string;
}

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

const AssetDetails: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [asset, setAsset] = React.useState<IAssetProps>();
	const [users, setUsers] = React.useState<IUserProps[]>();
	const [fileData, setFileData] = React.useState<string | ArrayBuffer>();
	const [metadata, setMetaData] = React.useState<PDFMetadata[]>([]);
	const [open, setOpen] = React.useState(false);
	const { id } = useParams();
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	// convert trash data to ISO
	const trashDate = new Date();
	const deletedAt = trashDate?.toISOString();

	const handleAllocationForm = () => {
		return new Promise<void>((resolve) => {
			const blob = pdf(<CreatePDF asset={asset} />).toBlob();
			const metas: PDFMetadata[] = [];
			let pdfData: string | ArrayBuffer = "";

			blob.then((pdfBlob) => {
				const reader = new FileReader();

				reader.onload = function (event) {
					if (event.target?.result) {
						const dataURI = event.target.result;
						pdfData = dataURI;
						const loadingTask = pdfjs.getDocument(dataURI);

						loadingTask.promise
							.then((pdf) => {
								pdf.getMetadata()
									.then((metadata) => {
										metas.push(metadata.info);
										setMetaData(metas);
									})
									.catch((err) => {
										toast({
											title: "Encountered an error!",
											description: (
												<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
													<code className="text-white">
														{`Error extracting metadata - ${err}`}
													</code>
												</pre>
											),
										});
									});
							})
							.catch((err) => {
								toast({
									title: "Encountered an error!",
									description: (
										<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
											<code className="text-white">
												{`Error loading PDF - ${err}`}
											</code>
										</pre>
									),
								});
							});

						setFileData(pdfData);
					} else {
						toast({
							title: "Encountered an error!",
							description: (
								<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
									<code className="text-white">
										Error reading blob
									</code>
								</pre>
							),
						});
					}
				};

				reader.onerror = () => {
					toast({
						title: "Encountered an error!",
						description: (
							<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
								<code className="text-white">
									Error occurred while reading the blob
								</code>
							</pre>
						),
					});
				};
				reader.readAsDataURL(pdfBlob);
			}).catch((error) => {
				toast({
					title: "Encountered an error!",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
							<code className="text-white">
								{`Error fetching the PDF blob - ${error}`}
							</code>
						</pre>
					),
				});
			});

			resolve();
		});
	};

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
			await client.patch(`http://localhost:8800/api/v1/assets/${id}`, {
				active: true,
			});
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
			await client.patch(`http://localhost:8800/api/v1/assets/${id}`, {
				active: false,
			});
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
			const res = await client.post(
				`http://localhost:8800/api/v1/assets/history`,
				{
					assetLocation: asset?.location,
					assetConditionalNotes: asset?.conditionalNotes,
					assetCondtion: asset?.condition,
					assetStatus: asset?.assetStatus,
					assetId: id,
					userId: assignFormData.userId,
					issuedById: currentUser.id,
				}
			);

			await client.patch(`http://localhost:8800/api/v1/assets/${id}`, {
				userId: assignFormData.userId,
				issuedBy: currentUser.fullName,
			});

			if (asset?.category === "Computer") {
				handleAllocationForm().then(() => {
					client.post(
						"http://localhost:8800/api/v1/allocationforms",
						{
							buffer: fileData,
							fileMeta: metadata,
							userId: currentUser.id,
							relatedId: asset?.id,
							historyId: res.data.id,
						}
					);
				});
			}
			toast({
				title: "Asset Assign",
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
			try {
				const res = await client.get(
					`http://localhost:8800/api/v1/assets/${id}`
				);
				setAsset(res.data);
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
		try {
			const res = await client.delete(
				`http://localhost:8800/api/v1/assets/${id}`
			);

			if (res.status === 200) {
				handleRefresh();
				toast({
					title: "Asset Deletion",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
							<code className="text-white text-wrap">
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
					`http://localhost:8800/api/v1/assets/${id}`,
					{
						deletedAt: deletedAt,
					}
				);
				await client.post(`http://localhost:8800/api/v1/trash`, {
					assetId: id,
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
			const fetchAsset = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/assets/${id}`
					);
					setAsset(res.data);
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

			fetchAsset();
			fetchUsers();
		}
	}, [isLoggedIn, id]);

	return (
		<div className="p-2 border-l w-full print:border-0">
			<div className="w-full h-[7rem] flex flex-col space-y-4">
				{asset && (
					<div className="flex justify-between print:hidden">
						<div className="flex items-start gap-x-4">
							<Button variant="ghost" size="icon">
								<ArrowLeftIcon
									onClick={() => navigate(-1)}
									className="cursor-pointer"
								/>
							</Button>
							<div>
								<h1 className="font-bold text-3xl tracking-tight">
									{asset.name}
								</h1>
								<div className="flex items-center">
									<p className="font-medium text-sm text-gray-400">
										Asset
									</p>
									<DotIcon className="w-4 h-4" />
									<p className="font-medium text-sm text-gray-400">
										{asset.category}
									</p>
								</div>
							</div>
						</div>
						<div className="flex divide-x gap-x-4">
							<div className="px-5">
								<p className="font-semibold text-sm">
									{asset.tag}
								</p>
								<p className="text-xs">Asset Tag</p>
							</div>
							<div
								className={
									asset.category === "Computer"
										? "px-5"
										: "hidden"
								}
							>
								<p className="font-semibold text-sm">
									{asset.deviceName ?? "-"}
								</p>
								<p className="text-xs">Device Name</p>
							</div>
							<div className="px-5">
								<p className="font-semibold text-sm">
									{asset.createdAt &&
										format(asset.createdAt, "dd/MM/yyyy p")}
								</p>
								<p className="text-xs">Created On</p>
							</div>
						</div>
					</div>
				)}
				<div className="flex gap-x-2 ml-auto print:hidden">
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
									Create a Asset, Ensure all the details are
									correct before submitting it.
								</SheetDescription>
							</SheetHeader>
							<NewAsset />
						</SheetContent>
					</Sheet>
					<Button variant="outline" onClick={handleRefresh}>
						Refresh <ReloadIcon className="ml-2 h-4 w-4" />
					</Button>

					{/* Activate Form Dialog */}
					<AlertDialog>
						<AlertDialogTrigger disabled={asset?.active}>
							<Button variant="outline" disabled={asset?.active}>
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
						<AlertDialogTrigger disabled={!asset?.active}>
							<Button variant="outline" disabled={!asset?.active}>
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

					{/* asset assign Form */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={
								(!asset?.deviceName &&
									asset?.category === "Computer") ||
								!asset?.active
							}
						>
							<Button
								variant="outline"
								disabled={
									(!asset?.deviceName &&
										asset?.category === "Computer") ||
									!asset?.active
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
											Assigning a user this asset will
											create a PDF with prepopulated
											fields. Ensure all details are
											correct before submitting. Download
											the PDF and sign it.
										</AlertDialogDescription>
									</AlertDialogHeader>
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
														<PopoverTrigger asChild>
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
																					user?.fullName
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

					{/* Trash asset dialog */}
					<AlertDialog>
						<AlertDialogTrigger>
							<Button variant="outline">
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
						<AlertDialogTrigger>
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
				</div>
				<Tabs defaultValue="summary">
					<TabsList className="mb-2 print:hidden">
						<TabsTrigger value="summary">Summary</TabsTrigger>
						<TabsTrigger value="locations">
							Asset Issuance and Locations
						</TabsTrigger>
						{asset?.category === "Computer" && (
							<TabsTrigger
								value="allocationForm"
								disabled={
									asset?.user?.fullName === undefined ||
									asset.category !== "Computer"
								}
							>
								Allocation Form
							</TabsTrigger>
						)}
					</TabsList>
					<Separator />
					<TabsContent value="summary">
						<Asset asset={asset} id={id} />
					</TabsContent>
					<TabsContent value="locations">
						<AssetHistory asset={asset} />
					</TabsContent>
					<TabsContent value="allocationForm">
						<div className="relative">
							<PDFViewer className="w-full h-[calc(100vh-15rem)]">
								<CreatePDF asset={asset} />
							</PDFViewer>
							<div className="absolute top-2 right-4 items-center gap-x-2 hidden print:hidden">
								<PDFDownloadLink
									document={<CreatePDF asset={asset} />}
									fileName={
										asset?.name + " " + "Allocation Form"
									}
								>
									{({ loading }) =>
										loading ? (
											<Button disabled>
												Please wait
												<ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
											</Button>
										) : (
											<Button>
												Download{" "}
												<DownloadIcon className="ml-2 h-4 w-4" />
											</Button>
										)
									}
								</PDFDownloadLink>
								<Button className="">
									Share{" "}
									<Share2Icon className="ml-2 h-4 w-4" />
								</Button>
								<Button
									size="icon"
									onClick={() => window.print()}
								>
									<PrinterIcon className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default AssetDetails;
