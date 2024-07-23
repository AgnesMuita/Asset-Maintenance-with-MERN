/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
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
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { toast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Tag, TagInput } from "./ui/tag-input";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, logType, modules } from "@/utils/consts";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "./ui/command";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";

const logFormSchema = z.object({
	title: z.string({
		required_error: "Log Title is required.",
	}),
	tags: z.array(
		z.object({
			id: z.string(),
			text: z.string(),
		})
	),
	assetId: z.string({
		required_error: "Asset is required.",
	}),
	description: z.string({
		required_error: "Log cannot be submitted without description",
	}),
	remarks: z.string({
		required_error: "Log cannot be submitted without remarks",
	}),
	media: z.array(z.string()).optional(),
});

type LogFormValues = z.infer<typeof logFormSchema>;

const NewLog = () => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");
	const [tags, setTags] = React.useState<Tag[]>([]);
	const [assets, setAssets] = React.useState<IAssetProps[]>();
	const [open, setOpen] = React.useState(false);
	const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
	const [imageData, setImageData] = React.useState<string[]>([]);
	const [fileMeta, setFileMeta] = React.useState<IFileMeta[]>([
		{
			fileName: "",
			size: 0,
			mimeType: "",
		},
	]);

	const form = useForm<LogFormValues>({
		resolver: zodResolver(logFormSchema),
		mode: "onChange",
	});

	async function onLogSubmit(data: LogFormValues) {
		try {
			const res = await client.post(
				`http://localhost:8800/api/v1/maintenance`,
				{
					title: data.title,
					tags: data.tags,
					remarks: data.remarks,
					description: data.description,
					userId: currentUser.id,
					assetId: data.assetId,
				}
			);

			imageData.length > 1 &&
				(await client.post(
					`http://localhost:8800/api/v1/media/logMulMedia`,
					{
						parent: "log",
						logId: res.data.id,
						imageBuffer: imageData,
						fileMeta: fileMeta,
						createdById: currentUser.id,
					}
				));
			imageData.length === 1 &&
				(await client.post(
					`http://localhost:8800/api/v1/media/logMedia`,
					{
						parent: "log",
						logId: res.data.id,
						imageBuffer: imageData[0],
						fileMeta: fileMeta,
						createdById: currentUser.id,
					}
				));

			toast({
				title: "Maintenance Log Creation",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(data, null, 2)}
						</code>
					</pre>
				),
			});

			// handleRefresh();

			form.reset({
				title: "",
				description: "",
				remarks: "",
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

	// Function to handle image selection
	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const previews: string[] = [];
			const buffers: string[] = [];
			const metas: IFileMeta[] = [];

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const reader = new FileReader();

				reader.onload = async () => {
					const dataUri = reader.result as string;
					buffers.push(dataUri);
					previews.push(dataUri);

					metas.push({
						fileName: file.name,
						size: file.size,
						mimeType: file.type,
					});
					setFileMeta(metas);

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
		} else {
			navigate("/signin");
		}
	}, [isLoggedIn, navigate]);

	return (
		<div className="grid grid-cols-1 gap-4">
			<ScrollArea className="h-[calc(100vh-8rem)]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onLogSubmit)}>
						<Card>
							<CardHeader className="">
								<CardTitle>New Log</CardTitle>
								<Separator />
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Log Title</FormLabel>
											<Select
												onValueChange={field.onChange}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue
															className="placeholder:text-muted-foreground"
															placeholder="Select Log Title..."
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{logType &&
														logType.map(
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
									control={form.control}
									name="tags"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tags</FormLabel>
											<FormControl>
												<TagInput
													{...field}
													placeholder="Enter article keywords"
													tags={tags}
													setTags={(newTags) => {
														setTags(newTags);
														form.setValue(
															"tags",
															newTags as [
																Tag,
																...Tag[]
															]
														);
													}}
												/>
											</FormControl>
											<FormMessage />
											<FormDescription>
												Add tags related to this
												article; comma separated e.g
												routine, quarterly etc.
											</FormDescription>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="assetId"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>Related Asset</FormLabel>
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
													className="w-full"
												>
													<Command>
														<CommandInput
															placeholder="Search asset..."
															className="h-9"
														/>
														<ScrollArea className="h-[20rem]">
															<CommandEmpty>
																No asset found.
															</CommandEmpty>
															<CommandGroup>
																{assets?.map(
																	(asset) => (
																		<CommandItem
																			key={
																				asset.id
																			}
																			value={
																				asset?.name
																			}
																			onSelect={() => {
																				form.setValue(
																					"assetId",
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
											<FormDescription>
												Choose the asset associated with
												this log. Add it first if it is
												not here.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<ReactQuill
													theme="snow"
													modules={modules}
													formats={formats}
													placeholder="Write content here..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="remarks"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Comments</FormLabel>
											<FormControl>
												<ReactQuill
													theme="snow"
													modules={modules}
													formats={formats}
													placeholder="Write content here..."
													{...field}
												/>
											</FormControl>
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
						</Card>
						<Button className="my-4" type="submit">
							Create New
						</Button>
					</form>
				</Form>
			</ScrollArea>
		</div>
	);
};

export default NewLog;
