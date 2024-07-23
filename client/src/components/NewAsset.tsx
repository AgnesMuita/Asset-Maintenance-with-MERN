import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { toast } from "./ui/use-toast";
import {
	DEPARTMENTS,
	assetConditions,
	assetStatus,
	assetTemplates,
	categories,
	colors,
	locations,
	manufacturers,
} from "@/utils/consts";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "./ui/command";
import { CheckIcon } from "lucide-react";

const newAssetFormSchema = z.object({
	tag: z.string({
		required_error: "Case Status is required.",
	}),
	name: z.string({
		required_error: "Asset Name is required.",
	}),
	category: z.string({
		required_error: "Category is required.",
	}),
	userId: z.string().optional(),
	location: z.string({
		required_error: "Location is required.",
	}),
	color: z.string({
		required_error: "Asset Color is required.",
	}),
	manufacturer: z.string({
		required_error: "Manufacturer is required.",
	}),
	serialNo: z.string({
		required_error: "Asset serial no is required.",
	}),
	model: z.string({
		required_error: "Asset model is required.",
	}),
	condition: z.string({
		required_error: "Asset condition is required",
	}),
	department: z.string({
		required_error: "Asset Department is required",
	}),
	assetStatus: z.string({ required_error: "Asset status is required" }),
	accessories: z.string().optional(),
	batterySNo: z.string().optional(),
	adaptorRatings: z.string().optional(),
	specifications: z.string().optional(),
	conditionalNotes: z.string().optional(),
});

type newAssetFormValues = z.infer<typeof newAssetFormSchema>;

const NewAsset: React.FunctionComponent = () => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [users, setUsers] = React.useState<IUserProps[]>();
	const [open, setOpen] = React.useState(false);
	const [template, setTemplate] = React.useState("");

	const form = useForm<newAssetFormValues>({
		resolver: zodResolver(newAssetFormSchema),
		mode: "onChange",
	});

	async function onAssetSubmit(newAssetFormData: newAssetFormValues) {
		try {
			await client.post(`http://localhost:8800/api/v1/assets`, {
				tag: newAssetFormData.tag,
				name: newAssetFormData.name,
				color: newAssetFormData.color,
				category: newAssetFormData.category,
				manufacturer: newAssetFormData.manufacturer,
				model: newAssetFormData.model,
				serialNo: newAssetFormData.serialNo,
				location: newAssetFormData.location,
				condition: newAssetFormData.condition,
				accessories: newAssetFormData.accessories,
				batterySNo: newAssetFormData.batterySNo,
				adaptorRatings: newAssetFormData.adaptorRatings,
				department: newAssetFormData.department,
				assetStatus: newAssetFormData.assetStatus,
				specification: newAssetFormData.specifications,
				conditionalNotes: newAssetFormData.conditionalNotes,
				userId: newAssetFormData.userId,
			});
			toast({
				title: "Asset Creation",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white">
							{JSON.stringify(newAssetFormData, null, 2)}
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

			fetchUsers();
		}
	}, [isLoggedIn]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onAssetSubmit)} id="newAssetForm">
				<ScrollArea className="h-[calc(100vh-6.5rem)] px-4">
					<>
						<div className="grid lg:grid-cols-2 gap-4">
							<Card className="col-span-2">
								<CardHeader>
									<CardTitle>Choose Template</CardTitle>
								</CardHeader>
								<CardContent>
									<Select
										onValueChange={(value) =>
											setTemplate(value)
										}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													className="placeholder:text-muted-foreground"
													placeholder="Select template..."
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{assetTemplates &&
												assetTemplates.map(
													(item, idx) => (
														<SelectItem
															value={item.value}
															key={idx}
														>
															{item.label}
														</SelectItem>
													)
												)}
										</SelectContent>
									</Select>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>General</CardTitle>
									<Separator />
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="tag"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Tag No</FormLabel>
												<FormControl>
													<Input
														placeholder="Tag No"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Asset Name
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Asset Name"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="category"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Category</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																className="placeholder:text-muted-foreground"
																placeholder="Select category..."
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{categories &&
															categories.map(
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
										control={form.control}
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
																					form.setValue(
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
									<FormField
										control={form.control}
										name="location"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Functional Location
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
																placeholder="Select location..."
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{locations &&
															locations.map(
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
										control={form.control}
										name="color"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Color</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																className="placeholder:text-muted-foreground"
																placeholder="Select color..."
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{colors &&
															colors.map(
																(item, idx) => (
																	<SelectItem
																		value={
																			item
																		}
																		key={
																			idx
																		}
																	>
																		{item}
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
										control={form.control}
										name="manufacturer"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Manufacturer
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
																placeholder="Select manufacturer..."
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{manufacturers &&
															manufacturers.map(
																(item, idx) => (
																	<SelectItem
																		value={
																			item
																		}
																		key={
																			idx
																		}
																	>
																		{item}
																	</SelectItem>
																)
															)}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							<Card className="grid items-center gap-4 h-max">
								<CardHeader>
									<CardTitle>Other</CardTitle>
									<Separator />
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="serialNo"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Serial No</FormLabel>
												<FormControl>
													<Input
														placeholder="Serial No"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="model"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Model No</FormLabel>
												<FormControl>
													<Input
														placeholder="Model No"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="condition"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Condition</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																className="placeholder:text-muted-foreground"
																placeholder="Select condition..."
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{assetConditions &&
															assetConditions.map(
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
										control={form.control}
										name="department"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Department
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
																placeholder="Select department..."
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{DEPARTMENTS &&
															DEPARTMENTS.map(
																(item, idx) => (
																	<SelectItem
																		value={
																			item.value
																		}
																		key={
																			idx
																		}
																		disabled={
																			item.label ===
																				"Global" ||
																			item.label ===
																				"Personal"
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
										control={form.control}
										name="assetStatus"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Asset Status
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
																placeholder="Select status..."
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{assetStatus &&
															assetStatus.map(
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
								</CardContent>
							</Card>

							<Card
								className={
									template === "ICT"
										? "grid items-center gap-4 h-max"
										: "hidden"
								}
							>
								<CardHeader>
									<CardTitle>Specifications</CardTitle>
									<Separator />
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="specifications"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Specifications
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Specifications"
														{...field}
														rows={6}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="accessories"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Accessories
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Accessories"
														{...field}
														rows={4}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="batterySNo"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Battery S/No
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Battery S/No"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="adaptorRatings"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Adaptor Ratings
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Adaptor Ratings"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="conditionalNotes"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Conditional Notes
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Conditional Notes"
														{...field}
														rows={6}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</div>
						<Button
							className="my-4"
							type="submit"
							form="newAssetForm"
						>
							Create New
						</Button>
					</>
				</ScrollArea>
			</form>
		</Form>
	);
};

export default NewAsset;
