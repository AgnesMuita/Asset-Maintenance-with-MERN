import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "@/utils/consts";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate, useParams } from "react-router-dom";
import { client } from "@/services/axiosClient";
import { toast } from "./ui/use-toast";
import { LucideSave, Trash2Icon, UploadCloudIcon } from "lucide-react";
import React from "react";
import { Label } from "./ui/label";
import { Tag, TagInput } from "./ui/tag-input";

const knowledgeArticleFormSchema = z.object({
	title: z.string({
		required_error: "Case title is required.",
	}),
	keywords: z.array(
		z.object({
			id: z.string(),
			text: z.string(),
		})
	),
	description: z.string({
		required_error: "Article description is required.",
	}),
	content: z.string({
		required_error: "Article cannot be submitted without content",
	}),
	media: z.array(z.string()).optional(),
});

type KnowledgeArticleFormValues = z.infer<typeof knowledgeArticleFormSchema>;

const Article = ({
	article,
}: {
	article: IKnowledgeArticleProps | undefined;
}) => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const navigate = useNavigate();
	const { id } = useParams();
	const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
	const [imageData, setImageData] = React.useState<string[]>([]);
	const [media, setMedia] = React.useState<IMediaProps[]>([]);
	const [tags, setTags] = React.useState<Tag[]>([]);

	//get current logged-in user
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

	const form = useForm<KnowledgeArticleFormValues>({
		resolver: zodResolver(knowledgeArticleFormSchema),
		mode: "onChange",
		defaultValues: article && {
			title: article.title,
			description: article.description,
			keywords: article.keywords,
			content: article.content,
		},
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
					`http://localhost:8800/api/v1/media/articleMedia/${id}`
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
			imageData.length > 1 &&
				(await client.post(
					`http://localhost:8800/api/v1/media/articleMulMedia`,
					{
						parent: "article",
						articleId: id,
						imageBuffer: imageData,
						createdById: currentUser.id,
					}
				));
			imageData.length === 1 &&
				(await client.post(
					`http://localhost:8800/api/v1/media/articleMedia`,
					{
						parent: "article",
						articleId: id,
						imageBuffer: imageData[0],
						createdById: currentUser.id,
					}
				));
			toast({
				title: "Image(s) upload",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-600 p-4">
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

	async function onSubmit(data: KnowledgeArticleFormValues) {
		if (isLoggedIn) {
			try {
				await client.patch(
					`http://localhost:8800/api/v1/karticles/${id}`,
					{
						title: data.title,
						keywords: data.keywords,
						description: data.description,
						content: data.content,
						modifierId: currentUser.id,
					}
				);
				toast({
					title: "Article Update",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
							<code className="text-white text-wrap">
								{JSON.stringify(data, null, 2)}
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
	}

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchMedia = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/media/articleMedia/${id}`
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

			if (article) {
				form.reset({
					title: article.title,
					description: article.description,
					keywords: article.keywords,
					content: article.content,
				});
			}

			fetchMedia();
		}
	}, [isLoggedIn, id, article, form]);

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4"
					id="articleForm"
				>
					<ScrollArea className="h-[calc(100vh-18.7rem)]">
						{article && (
							<div className="space-y-4">
								<Card>
									<CardHeader>
										<CardTitle>Article Content</CardTitle>
									</CardHeader>
									<CardContent className="grid lg:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input
															placeholder="Article Title"
															{...field}
															defaultValue={
																article.title
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Description
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Description"
															{...field}
															defaultValue={
																article.description
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="keywords"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Keywords
													</FormLabel>
													<FormControl>
														<TagInput
															{...field}
															placeholder="Enter article keywords"
															tags={tags}
															setTags={(
																newTags
															) => {
																setTags(
																	newTags
																);
																form.setValue(
																	"keywords",
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
														Add keywords related to
														this article; comma
														separated e.g event,
														party etc.
													</FormDescription>
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>

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
													imagePreviews.length === 0
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
												media.map(({ data }, idx) => (
													<div className="relative group">
														<img
															key={idx}
															src={data}
															alt={`Image ${idx}`}
															className="max-w-[200px] max-h-[200px]"
														/>
														<div className="absolute top-0 left-0 hidden bg-black bg-opacity-60 h-10 w-full group-hover:flex items-center justify-end px-4">
															<Button
																size="icon"
																variant="destructive"
																type="button"
															>
																<Trash2Icon className="h-4 w-4" />
															</Button>
														</div>
													</div>
												))}
										</div>
										{imagePreviews.length === 0 &&
											media.length === 0 && (
												<p className="text-sm">
													No Uploads yet.
												</p>
											)}
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>
											Article Description
										</CardTitle>
									</CardHeader>
									<CardContent>
										<FormField
											control={form.control}
											name="content"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Content
													</FormLabel>
													<FormControl>
														<ReactQuill
															theme="snow"
															modules={modules}
															formats={formats}
															defaultValue={
																article.content
															}
															placeholder="Write content here..."
															className="placeholder:dark:text-muted-foreground"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>
							</div>
						)}
					</ScrollArea>

					{/* Save/update article dialog */}
					<div className="w-full flex justify-end">
						<AlertDialog>
							<AlertDialogTrigger>
								<Button type="button">
									Save <LucideSave className="ml-2 h-4 w-4" />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Are you absolutely sure?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. Updating
										this article means changing the previous
										content and cannot be gotten back.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										type="submit"
										form="articleForm"
									>
										Continue
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</form>
			</Form>
		</>
	);
};

export default Article;
