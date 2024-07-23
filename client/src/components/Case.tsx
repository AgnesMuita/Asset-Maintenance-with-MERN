import React from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
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
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { priorities, statuses } from "@/utils/consts";
import { client } from "@/services/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { LucideSave } from "lucide-react";
import { toast } from "./ui/use-toast";

const caseFormSchema = z.object({
	caseTitle: z.string({
		required_error: "Case Title is required.",
	}),
	subject: z.string({
		required_error: "Subject is required.",
	}),
	priority: z.string({
		required_error: "Priority is required.",
	}),
	status: z.string({
		required_error: "Asset Status is required.",
	}),
	Description: z.string({
		required_error: "Description is required.",
	}),
	technician: z.string({
		required_error: "Technician is required.",
	}),
	relatedAsset: z.string().optional(),
	origin: z.string().optional(),
	solvedBy: z.string().optional(),
	createdBy: z.string().optional(),
	createdOn: z.string().optional(),
});

type CaseFormValues = z.infer<typeof caseFormSchema>;

const Case = ({
	caseI,
	id,
}: {
	caseI: ICaseProps | undefined;
	id: string | undefined;
}) => {
	const [open, setOpen] = React.useState(false);
	const [openAssets, setOpenAssets] = React.useState(false);
	const [users, setUsers] = React.useState<IUserProps[]>([]);
	const [assets, setAssets] = React.useState<IAssetProps[]>([]);
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

	const caseForm = useForm<CaseFormValues>({
		resolver: zodResolver(caseFormSchema),
		mode: "onChange",
		defaultValues: {
			caseTitle: caseI?.caseTitle,
			subject: caseI?.subject,
			priority: caseI?.priority,
			status: caseI?.status,
			Description: caseI?.Description,
			technician: caseI?.technician ?? "",
			origin: caseI?.origin,
			createdBy: caseI?.owner?.fullName,
			createdOn: caseI && format(caseI.createdAt, "dd/MM/yyyy p"),
			solvedBy: caseI?.technician ?? "",
			relatedAsset: caseI?.asset?.name,
		},
	});

	async function onCaseSubmit(caseFormData: CaseFormValues) {
		try {
			const res = await client.patch(
				`http://localhost:8800/api/v1/cases/${id}`,
				{
					caseTitle: caseFormData.caseTitle,
					subject: caseFormData.subject,
					priority: caseFormData.priority,
					caseStatus: caseFormData.status,
					Description: caseFormData.Description,
					technician: caseFormData.technician,
					assetId: caseFormData.relatedAsset,
				}
			);

			if (res.status === 200) {
				toast({
					title: "Case Update",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
							<code className="text-white text-wrap">
								{JSON.stringify(caseFormData, null, 2)}
							</code>
						</pre>
					),
				});
			} else {
				console.log(res.data);
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

	React.useEffect(() => {
		if (isLoggedIn) {
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

			const fetchAssets = async () => {
				try {
					const res = await client.get(
						"http://localhost:8800/api/v1/assets"
					);
					setAssets(res.data);
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

			if (caseI) {
				caseForm.reset({
					caseTitle: caseI.caseTitle,
					subject: caseI.subject,
					priority: caseI.priority,
					status: caseI.status,
					Description: caseI.Description,
					technician: caseI.technician ?? "",
					origin: caseI.origin,
					createdBy: caseI.owner?.fullName,
					createdOn: format(caseI.createdAt, "dd/MM/yyyy p"),
					solvedBy: caseI.technician ?? "",
					relatedAsset: caseI.asset?.name,
				});
			}

			fetchUsers();
			fetchAssets();
		} else {
			navigate("/signin");
		}
	}, [isLoggedIn, navigate, caseI, caseForm]);

	return (
		<>
			{caseI && (
				<Form {...caseForm}>
					<form
						onSubmit={caseForm.handleSubmit(onCaseSubmit)}
						className="grid lg:grid-cols-3 gap-4"
						id="caseForm"
					>
						<Card className="">
							<CardHeader>
								<CardTitle>General Information</CardTitle>
								<Separator />
							</CardHeader>
							<ScrollArea className="h-[calc(100vh-24.5rem)]">
								<CardContent className="space-y-5">
									<FormField
										control={caseForm.control}
										name="caseTitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Case Title
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Case Title"
														{...field}
														defaultValue={
															caseI.caseTitle
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={caseForm.control}
										name="subject"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subject</FormLabel>
												<FormControl>
													<Input
														placeholder="Subject"
														{...field}
														defaultValue={
															caseI.subject
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={caseForm.control}
										name="priority"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Severity</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={
														caseI.priority
													}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																className="placeholder:text-muted-foreground"
																placeholder="Select priority..."
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{priorities &&
															priorities.map(
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
										control={caseForm.control}
										name="Description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Description
												</FormLabel>
												<FormControl>
													<Textarea
														rows={8}
														placeholder="Description"
														{...field}
														defaultValue={
															caseI.Description
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={caseForm.control}
										name="relatedAsset"
										render={({ field }) => (
											<FormItem className="flex flex-col">
												<FormLabel>
													Related Asset
												</FormLabel>
												<Popover
													onOpenChange={setOpenAssets}
													open={openAssets}
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
																	"justify-between truncate",
																	!field.value &&
																		"text-muted-foreground"
																)}
															>
																{field.value
																	? assets?.find(
																			(
																				asset
																			) =>
																				asset.id ===
																				field.value
																	  )?.name
																	: "Select asset..."}
																<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
															</Button>
														</PopoverTrigger>
													</FormControl>
													<PopoverContent align="start">
														<Command>
															<CommandInput
																placeholder="Search asset..."
																className="h-9"
															/>
															<ScrollArea className="h-[20rem]">
																<CommandEmpty>
																	No asset
																	found.
																</CommandEmpty>
																<CommandGroup>
																	{assets?.map(
																		(
																			asset
																		) => (
																			<CommandItem
																				key={
																					asset.id
																				}
																				value={
																					asset?.name
																				}
																				onSelect={() => {
																					caseForm.setValue(
																						"relatedAsset",
																						asset.id
																					);
																					setOpenAssets(
																						false
																					);
																				}}
																			>
																				{
																					asset.name
																				}
																				<CheckIcon
																					className={cn(
																						"ml-auto h-4 w-4",
																						field.value ===
																							asset.id
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
									<FormField
										control={caseForm.control}
										name="createdOn"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Created On
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Created On"
														{...field}
														disabled
														defaultValue={format(
															caseI.createdAt,
															"dd/MM/yyyy p"
														)}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={caseForm.control}
										name="origin"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Origin</FormLabel>
												<FormControl>
													<Input
														placeholder="Origin"
														{...field}
														disabled
														defaultValue={
															caseI.origin
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</ScrollArea>
						</Card>

						{/* Admin section */}
						<Card className="h-max">
							<CardHeader className="">
								<CardTitle>Admin</CardTitle>
								<Separator />
							</CardHeader>
							<CardContent className="space-y-5">
								<FormField
									control={caseForm.control}
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Case Status</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={caseI.status}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue
															className="placeholder:text-muted-foreground"
															placeholder="Select status..."
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{statuses &&
														statuses.map(
															(item, idx) => (
																<SelectItem
																	value={
																		item.value
																	}
																	key={idx}
																>
																	{item.label}
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
									control={caseForm.control}
									name="solvedBy"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Solved By</FormLabel>
											<FormControl>
												<Input
													placeholder="Solved By"
													{...field}
													disabled
													defaultValue={
														caseI.technician
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={caseForm.control}
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
													<PopoverTrigger asChild>
														<Button
															variant="outline"
															role="combobox"
															aria-expanded={open}
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
																  )?.fullName
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
															placeholder="Search user..."
															className="h-9"
														/>
														<ScrollArea className="h-[20rem] w-full">
															<CommandEmpty>
																No user found.
															</CommandEmpty>
															<CommandGroup>
																{users?.map(
																	(user) => (
																		<CommandItem
																			key={
																				user.id
																			}
																			value={
																				user?.id
																			}
																			onSelect={() => {
																				caseForm.setValue(
																					"technician",
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
								<FormField
									control={caseForm.control}
									name="createdBy"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Created By</FormLabel>
											<FormControl>
												<Input
													placeholder="Created By"
													{...field}
													disabled
													defaultValue={
														caseI?.owner?.fullName
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						<Card className="h-[calc(100vh-20rem)]">
							<CardHeader>
								<CardTitle>Other Details</CardTitle>
								<Separator />
							</CardHeader>
							<ScrollArea className="h-[calc(100vh-24.5rem)]">
								<CardContent className="flex flex-col gap-y-2">
									<p className="font-semibold">
										Final Status
									</p>
									<p className="border p-2 rounded-md">
										{caseI.resolType ?? "Not resolved"}
									</p>
									<p className="font-semibold">Resolution</p>
									<p className="border p-2 rounded-md">
										{caseI.resolution ?? "Not resolved"}
									</p>
								</CardContent>
							</ScrollArea>
						</Card>

						{/* Save/update case dialog */}
						<div className="col-span-3 ml-auto">
							<AlertDialog>
								<AlertDialogTrigger>
									<Button type="button">
										Save{" "}
										<LucideSave className="ml-2 h-4 w-4" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone.
											Updating this case means changing
											the previous content and cannot be
											gotten back.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											type="submit"
											form="caseForm"
										>
											Continue
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</form>
				</Form>
			)}
		</>
	);
};

export default Case;
