import Case from "@/components/Case";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { client } from "@/services/axiosClient";
import { CaretSortIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
	ArrowLeftIcon,
	CheckIcon,
	FileCheck,
	FileX2,
	Trash2,
	TrashIcon,
	UserRoundPlusIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import NewCase from "@/components/NewCase";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/auth.store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cancel_Types, Resolution_Types } from "@/utils/consts";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import CaseDetailsTabs from "@/components/CaseDetailsTabs";
import CaseMessages from "@/components/CaseMessages";
import { makeFallBack } from "@/utils/make.fallback";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const CaseDetails: React.FunctionComponent = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

	const [data, setData] = useState<ICaseProps>();
	const [users, setUsers] = useState<IUserProps[]>([]);
	const [open, setOpen] = React.useState(false);

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
			await client.patch(`http://localhost:8800/api/v1/cases/${id}`, {
				resolved: true,
				resolType: resolveFormData.resolType,
				resolution: resolveFormData.resolution,
			});
			toast({
				title: "Case Resolution",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(resolveFormData, null, 2)}
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

	async function onCancelSubmit(cancelFormData: CancelFormValues) {
		try {
			await client.patch(`http://localhost:8800/api/v1/cases/${id}`, {
				cancelled: true,
				currStatus: cancelFormData.currStatus,
			});
			toast({
				title: "Case cancellation",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(cancelFormData, null, 2)}
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

	async function onAssignSubmit(assignFormData: AssignFormValues) {
		try {
			await client.patch(`http://localhost:8800/api/v1/cases/${id}`, {
				technician: assignFormData.technician,
			});
			toast({
				title: "Case assign",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(assignFormData, null, 2)}
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

	const handleRefresh = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					`http://localhost:8800/api/v1/cases/${id}`
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
			navigate("/signin");
		}
	};

	const handleDelete = async () => {
		try {
			const res = await client.delete(
				`http://localhost:8800/api/v1/cases/${id}`
			);

			if (res.status === 200) {
				navigate(-1);
				toast({
					title: "Case deletion",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
							<code className="text-white text-wrap">
								Case deleted successfully!
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
				await client.patch(`http://localhost:8800/api/v1/cases/${id}`, {
					deletedAt: deletedAt,
				});
				await client.post(`http://localhost:8800/api/v1/trash`, {
					caseId: id,
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

	useEffect(() => {
		if (isLoggedIn) {
			try {
				const getCaseById = async () => {
					const res = await client.get(
						`http://localhost:8800/api/v1/cases/${id}`
					);
					setData(res.data);
				};

				getCaseById();
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

			fetchUsers();
		} else {
			navigate("/signin");
		}
	}, [id, isLoggedIn, navigate]);

	return (
		<div className="p-2 border-l w-full">
			<div className="w-full h-[7rem] flex flex-col space-y-4">
				{data && (
					<div className="flex justify-between">
						<div className="flex items-start gap-x-4">
							<Button variant="ghost" size="icon">
								<ArrowLeftIcon
									onClick={() => navigate(-1)}
									className="cursor-pointer"
								/>
							</Button>
							<div>
								<h1 className="font-bold text-3xl tracking-tight">
									{data?.caseTitle}
								</h1>
								<p className="font-medium text-sm text-gray-400">
									Case
								</p>
							</div>
						</div>
						<div className="flex divide-x gap-x-4">
							<div className="px-5">
								<p className="font-semibold text-sm">
									{data.caseNumber}
								</p>
								<p className="text-xs">Case Number</p>
							</div>
							<div className="px-5">
								<p className="font-semibold text-sm">
									{data.origin}
								</p>
								<p className="text-xs">Origin</p>
							</div>
							<div className="px-5">
								<p className="font-semibold text-sm">
									{data.createdAt &&
										format(data.createdAt, "dd/MM/yyyy p")}
								</p>
								<p className="text-xs">Created On</p>
							</div>
							<div className="px-5 flex gap-x-4">
								<Avatar className="h-9 w-9">
									<AvatarImage
										src={data.owner?.avatar}
										alt="Avatar"
									/>
									<AvatarFallback>
										{makeFallBack(
											data.owner?.firstName,
											data.owner?.lastName
										)}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<p className="font-semibold text-sm">
										{data.owner
											? data.owner?.fullName
											: "No User"}
									</p>
									<p className="text-xs">Created By</p>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="flex gap-x-2 ml-auto">
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

					<Button variant="outline" onClick={handleRefresh}>
						Refresh <ReloadIcon className="ml-2 h-4 w-4" />
					</Button>

					{/* Resolve case Form */}
					<AlertDialog>
						<AlertDialogTrigger
							disabled={data?.resolved || data?.cancelled}
						>
							<Button
								variant="outline"
								disabled={data?.resolved || data?.cancelled}
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
									id="resolveForm"
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
							disabled={data?.cancelled || data?.resolved}
						>
							<Button
								variant="outline"
								disabled={data?.cancelled || data?.resolved}
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
									id="cancelForm"
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
						>
							<Button variant="outline">
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
									id="assignForm"
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
						>
							<Button variant="outline">
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
									id="assignForm"
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

					{/* Delete case dialog */}
					<AlertDialog>
						<AlertDialogTrigger>
							<Button variant="destructive">
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
				</div>

				<Tabs defaultValue="summary">
					<TabsList className="mb-2 relative">
						<TabsTrigger value="summary">Summary</TabsTrigger>
						<TabsTrigger value="details">Details</TabsTrigger>
						<TabsTrigger value="messages">Messages</TabsTrigger>
					</TabsList>
					<Separator />
					<TabsContent value="summary">
						<Case caseI={data} id={id} />
					</TabsContent>
					<TabsContent value="details">
						<CaseDetailsTabs data={data} />
					</TabsContent>
					<TabsContent value="messages">
						<CaseMessages data={data} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default CaseDetails;
