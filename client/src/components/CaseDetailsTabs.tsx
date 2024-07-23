import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { format } from "date-fns";
import { ClockIcon, MapPinIcon, TagIcon, UploadCloudIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import React from "react";
import { client } from "@/services/axiosClient";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "./ui/use-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Label } from "./ui/label";
import PriorityBadge from "./shared/PriorityBadge";
import StatusBadge from "./shared/StatusBadge";

const caseMediaFormSchema = z.object({
	parent: z.string().optional(),
	media: z.array(z.string()).optional(),
});

type caseMediaFormValues = z.infer<typeof caseMediaFormSchema>;

const CaseDetailsTabs = ({ data }: { data: ICaseProps | undefined }) => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const navigate = useNavigate();
	const { id } = useParams();
	const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
	const [imageData, setImageData] = React.useState<string[]>([]);
	const [media, setMedia] = React.useState<IMediaProps[]>([]);
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	const form = useForm<caseMediaFormValues>({
		resolver: zodResolver(caseMediaFormSchema),
		mode: "onChange",
	});

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

	const handleMediaRefresh = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					`http://localhost:8800/api/v1/media/caseMedia/${id}`
				);
				setMedia(res.data);
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

	const handleImageUpload = async () => {
		try {
			imageData &&
				(imageData.length > 1
					? await client.post(
							`http://localhost:8800/api/v1/media/caseMulMedia`,
							{
								parent: "case",
								caseId: id,
								imageBuffer: imageData,
								createdById: currentUser.id,
							}
					  )
					: await client.post(
							`http://localhost:8800/api/v1/media/caseMedia`,
							{
								parent: "case",
								caseId: id,
								imageBuffer: imageData[0],
								createdById: currentUser.id,
							}
					  ));
			toast({
				title: "Image Upload",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							Image(s) Uploaded successfully.
						</code>
					</pre>
				),
			});
			imagePreviews.length = 0;
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
			const fetchMedia = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/media/caseMedia/${id}`
					);
					setMedia(res.data);
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

			fetchMedia();
		}
	}, [isLoggedIn, id]);

	return (
		<div className="grid grid-cols-2 gap-4">
			<Card>
				<CardHeader>
					<CardTitle className="font-bold text-xl">
						Case Details
					</CardTitle>
					<Separator />
				</CardHeader>
				<ScrollArea className="h-[calc(100vh-21rem)]">
					<CardContent className="space-y-4">
						<div className="flex flex-col gap-y-2">
							<div className="flex items-end justify-between">
								<p className="font-medium text-2xl">
									{data?.caseTitle}
								</p>
							</div>
							<div className="flex gap-x-4">
								<p className="text-xs text-blue-500">
									{data?.createdAt &&
										format(data?.createdAt, "dd/MM/yyyy p")}
								</p>
								<p className="text-xs text-blue-500">
									{data?.origin}
								</p>
								<p className="text-xs text-blue-500">
									Technician: {data?.technician ?? "_"}
								</p>
								<p className="text-xs text-blue-500">
									Owner: {data?.owner?.fullName ?? "_"}
								</p>
								<p className="text-xs text-blue-500">
									Solver: {data?.technician ?? "_"}
								</p>
							</div>
							<p className="text-muted-foreground font-medium text-sm">
								{data?.subject}
							</p>
						</div>
						<div className="flex items-center gap-x-4">
							<PriorityBadge priority={data?.priority} />
							<Badge
								variant="default"
								className="rounded-full py-0"
							>
								{data?.status}
							</Badge>
							<StatusBadge currStatus={data?.currStatus} />
						</div>
						<p className="text-md">{data?.Description}</p>
					</CardContent>
				</ScrollArea>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="font-bold text-xl">
						More Details
					</CardTitle>
					<Separator />
				</CardHeader>
				<ScrollArea className="h-[calc(100vh-21rem)]">
					<CardContent className="space-y-4">
						<div className=" flex flex-col gap-y-4 rounded-md border p-4">
							<div className="flex-1 space-y-1">
								<p className="text-sm font-medium leading-none">
									Case Media
								</p>
								<p className="text-sm text-muted-foreground">
									Images associated with this case
								</p>
							</div>
							<Form {...form}>
								<form>
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
												<Button
													variant="outline"
													type="button"
													onClick={handleMediaRefresh}
												>
													Refresh{" "}
													<ReloadIcon className="ml-2 h-4 w-4" />
												</Button>
												<Button
													variant="secondary"
													type="button"
													onClick={handleImageUpload}
													disabled={
														imagePreviews.length ===
														0
													}
												>
													Upload{" "}
													<UploadCloudIcon className="ml-2 h-4 w-4" />
												</Button>
											</div>
										</CardHeader>
										<Separator />
										<CardContent className="py-4 flex flex-col gap-4 flex-wrap">
											{imagePreviews.length !== 0 && (
												<Label>Image Preview</Label>
											)}
											<div className="flex gap-4 flex-wrap">
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
											</div>
											{imagePreviews.length !== 0 && (
												<Separator />
											)}
											{media.length !== 0 && (
												<Label>Uploaded Images</Label>
											)}
											<div className="flex gap-4 flex-wrap">
												{media &&
													media.map(
														({ data }, idx) => (
															<img
																key={idx}
																src={data}
																alt={`Image ${idx}`}
																className="max-w-[200px] max-h-[200px]"
															/>
														)
													)}
											</div>
											{imagePreviews.length === 0 &&
												media.length === 0 && (
													<p className="text-sm">
														No Uploads yet.
													</p>
												)}
										</CardContent>
									</Card>
								</form>
							</Form>
						</div>
						<div className=" flex items-center space-x-4 rounded-md border p-4">
							<div className="flex-1 space-y-4">
								<p className="text-sm font-medium leading-none">
									Related Asset
								</p>
								{data?.asset && (
									<Card
										className="py-0 hover:bg-gray-50 hover:dark:bg-gray-900 group transition-colors duration-150 ease-in-out"
										key={data?.asset?.id}
									>
										<Link
											to={`/datas/data-details/${data?.asset?.id}`}
										>
											<CardHeader className="py-4">
												<CardTitle>
													{data?.asset?.name}
												</CardTitle>
											</CardHeader>
											<CardContent className="pb-2 space-y-4">
												<div className="flex items-center gap-x-10">
													<p className="flex items-center gap-x-2">
														<TagIcon size={16} />
														<Badge variant="default">
															{data?.asset?.tag}
														</Badge>
													</p>
													<p className="flex items-center gap-x-2">
														<MapPinIcon size={16} />
														<Badge variant="outline">
															{
																data?.asset
																	?.location
															}
														</Badge>
													</p>
												</div>
												<p className="flex items-center gap-x-2 text-xs font-medium">
													<ClockIcon size={16} />
													{data?.asset &&
														format(
															data?.asset
																.createdAt,
															"dd/MM/yyyy p"
														)}
												</p>
											</CardContent>
										</Link>
									</Card>
								)}
							</div>
						</div>
					</CardContent>
				</ScrollArea>
			</Card>
		</div>
	);
};

export default CaseDetailsTabs;
