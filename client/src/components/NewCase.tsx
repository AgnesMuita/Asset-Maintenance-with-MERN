import React from "react";
import { Input } from "./ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

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
} from "./ui/form";
import {
	caseSubjects,
	caseTemplates,
	hardwares,
	priorities,
	softwares,
} from "@/utils/consts";
import { toast } from "./ui/use-toast";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "./ui/command";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

const caseFormSchema = z.object({
	template: z.string({
		required_error: "Select template to continue",
	}),
	caseTitle: z.string({
		required_error: "Case Title is required.",
	}),
	subject: z.string({
		required_error: "Please enter a subject.",
	}),
	severity: z.string({
		required_error: "Please select case severity.",
	}),
	hardware: z.string(),
	software: z.string(),
	asset: z.string().optional(),
	description: z.string({
		required_error: "Case description is required.",
	}),
	media: z.array(z.string()).optional(),
});

type CaseFormValues = z.infer<typeof caseFormSchema>;

const NewCase: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [assets, setAssets] = React.useState<IAssetProps[]>();
	const [open, setOpen] = React.useState(false);
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");
	const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
	const [imageData, setImageData] = React.useState<string[]>([]);
	const [selectedTemplate, setSelectedTemplate] = React.useState("");

	const form = useForm<CaseFormValues>({
		resolver: zodResolver(caseFormSchema),
		mode: "onChange",
	});

	async function onSubmit(data: CaseFormValues) {
		try {
			const res = await client.post(
				`http://localhost:8800/api/v1/cases`,
				{
					caseTitle: data.caseTitle,
					subject: data.subject,
					priority: data.severity,
					software: data.software,
					hardware: data.hardware,
					description: data.description,
					ownerId: currentUser.id,
					assetId: data.asset,
				}
			);

			imageData.length > 1 &&
				(await client.post(
					`http://localhost:8800/api/v1/media/caseMulMedia`,
					{
						parent: "case",
						caseId: res.data.id,
						imageBuffer: imageData,
						createdById: currentUser.id,
					}
				));
			imageData.length === 1 &&
				(await client.post(
					`http://localhost:8800/api/v1/media/caseMedia`,
					{
						parent: "case",
						caseId: res.data.id,
						imageBuffer: imageData[0],
						createdById: currentUser.id,
					}
				));

			toast({
				title: "You submitted your case with following values:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(data, null, 2)}
						</code>
					</pre>
				),
			});
			form.reset({
				caseTitle: "",
				subject: "",
				severity: "",
				asset: "",
				description: "",
			});
			handleRefresh();
		} catch (err) {
			console.error(err);
		}
	}

	const handleRefresh = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					"http://localhost:8800/api/v1/cases"
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
		} else {
			navigate("/signin");
		}
	};

	// Function to handle image selection
	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const previews: string[] = [];
			const buffers: string[] = [];
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const reader = new FileReader();
				reader.onload = async () => {
					const dataUri = reader.result as string;
					buffers.push(dataUri);
					previews.push(dataUri);
					if (previews.length === files.length) {
						setImagePreviews(previews);
						setImageData(buffers);
					}
				};
				reader.readAsDataURL(file);
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

			fetchAssets();
		}
	}, [isLoggedIn]);

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="gap-4">
					<Card>
						<ScrollArea className="h-[calc(100vh-10rem)]">
							<CardHeader>
								<CardTitle>General Information</CardTitle>
								<Separator />
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="template"
									render={() => (
										<FormItem>
											<FormLabel>
												Select Template
											</FormLabel>
											<Select
												onValueChange={(value) =>
													setSelectedTemplate(value)
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
													{caseTemplates &&
														caseTemplates.map(
															(item, idx) => (
																<SelectItem
																	value={
																		item.value
																	}
																	key={idx}
																>
																	{item.value}
																</SelectItem>
															)
														)}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="grid grid-cols-2 gap-4">
									{selectedTemplate === "Hardware" && (
										<FormField
											control={form.control}
											name="hardware"
											rules={{
												required:
													"Affected hardware is required!",
											}}
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Select Affected Hardware
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
																	placeholder="Select affected hardware..."
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{hardwares &&
																hardwares.map(
																	(
																		item,
																		idx
																	) => (
																		<SelectItem
																			value={
																				item.value
																			}
																			key={
																				idx
																			}
																		>
																			{
																				item.value
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
									)}
									{selectedTemplate === "Software" && (
										<FormField
											control={form.control}
											name="software"
											rules={{
												required:
													"Affected Software is required!",
											}}
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Select Affected Software
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
																	placeholder="Select affected software..."
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{softwares &&
																softwares.map(
																	(
																		item,
																		idx
																	) => (
																		<SelectItem
																			value={
																				item.value
																			}
																			key={
																				idx
																			}
																		>
																			{
																				item.value
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
									)}
									<FormField
										control={form.control}
										name="subject"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Case Subject
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
																placeholder="Select subject..."
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{caseSubjects &&
															caseSubjects.map(
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
																			item.value
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
								<FormField
									control={form.control}
									name="caseTitle"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Case Title</FormLabel>
											<FormControl>
												<Input
													placeholder="Title"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Give your case and concise and
												definitive title.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="grid grid-cols-2 gap-4 items-end">
									<FormField
										control={form.control}
										name="severity"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Severity</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																className="placeholder:text-muted-foreground"
																placeholder="Select severity..."
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
																			item.value
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
										name="asset"
										render={({ field }) => (
											<FormItem className="flex flex-col">
												<FormLabel>
													Related Asset (Optional)
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
													<PopoverContent
														align="start"
														className="w-[25rem]"
													>
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
																					form.setValue(
																						"asset",
																						asset.id
																					);
																					setOpen(
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
												{/* <FormDescription>
                          If there is no asset associated with this case/incident,
                          leave blank.
                        </FormDescription> */}
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Description"
													{...field}
													rows={6}
												/>
											</FormControl>
											<FormDescription>
												This is the description of your
												issue or incident. Make sure you
												give it is detailed and describe
												it clearly.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Card>
									<CardHeader>
										<div className="flex items-end gap-x-4">
											<FormField
												control={form.control}
												name="media"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Attach Images
														</FormLabel>
														<FormControl>
															<Input
																type="file"
																accept="image/*"
																{...field}
																multiple
																onChange={
																	handleImageChange
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<Button variant="outline">
												Refresh
											</Button>
										</div>
									</CardHeader>
									<Separator />
									<CardContent className="py-4 flex gap-4 flex-wrap">
										{imagePreviews &&
											imagePreviews.map(
												(preview, index) => (
													<img
														key={index}
														src={preview}
														alt={`Preview ${index}`}
														className="max-w-[200px] max-h-[200px]"
													/>
												)
											)}
										{imagePreviews.length === 0 && (
											<p className="text-sm">
												No Uploads yet.
											</p>
										)}
									</CardContent>
								</Card>
							</CardContent>
						</ScrollArea>
					</Card>
					<Button className="my-4" type="submit">
						Create New
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default NewCase;
