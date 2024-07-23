import React from "react";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "@/utils/consts";
import { useNavigate } from "react-router-dom";
import { Tag, TagInput } from "./ui/tag-input";

const knowledgeArticleFormSchema = z.object({
	title: z.string({
		required_error: "Case Title is required.",
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

const NewArticle = ({
	handleRefresh,
}: {
	handleRefresh?: () => Promise<void> | undefined;
}) => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");
	const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
	const [imageData, setImageData] = React.useState<string[]>([]);
	const [tags, setTags] = React.useState<Tag[]>([]);

	const form = useForm<KnowledgeArticleFormValues>({
		resolver: zodResolver(knowledgeArticleFormSchema),
		mode: "onChange",
	});

	async function onSubmit(data: KnowledgeArticleFormValues) {
		if (isLoggedIn) {
			try {
				const res = await client.post(
					`http://localhost:8800/api/v1/karticles/`,
					{
						title: data.title,
						keywords: data.keywords,
						media: imagePreviews,
						description: data.description,
						content: data.content,
						status: "Draft",
						stage: "Approval",
						ownerId: currentUser.id,
					}
				);

				{
					imageData.length > 1
						? await client.post(
								`http://localhost:8800/api/v1/media/articleMulMedia`,
								{
									parent: "article",
									articleId: res.data.id,
									imageBuffer: imageData,
									createdById: currentUser.id,
								}
						  )
						: await client.post(
								`http://localhost:8800/api/v1/media/articleMedia`,
								{
									parent: "article",
									articleId: res.data.id,
									imageBuffer: imageData[0],
									createdById: currentUser.id,
								}
						  );
				}

				toast({
					title: "News Creation",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
							<code className="text-white text-wrap">
								{JSON.stringify(data, null, 2)}
							</code>
						</pre>
					),
				});
				handleRefresh && handleRefresh();
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

	// Function to handle image selection
	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const previews: string[] = [];
			const buffers: string[] = [];
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const reader = new FileReader();
				reader.onload = () => {
					buffers.push(reader.result as string);
					previews.push(reader.result as string);
					if (previews.length === files.length) {
						setImagePreviews(previews);
						setImageData(buffers);
					}
				};
				reader.readAsDataURL(file);
			}
		}
	};

	return (
		<ScrollArea className="h-[calc(100vh-6.5rem)]">
			<div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<Card>
							<CardHeader>
								<CardTitle className="font-semibold text-lg tracking-tight uppercase">
									Article Content
								</CardTitle>
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
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Input
													placeholder="Description"
													{...field}
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
											<FormLabel>Keywords</FormLabel>
											<FormControl>
												<TagInput
													{...field}
													placeholder="Enter article keywords"
													tags={tags}
													setTags={(newTags) => {
														setTags(newTags);
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
												Add keywords related to this
												article; comma separated e.g
												event, party etc.
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
									<Button variant="outline">Refresh</Button>
								</div>
							</CardHeader>
							<Separator />
							<CardContent className="py-4 flex gap-4 flex-wrap">
								{imagePreviews &&
									imagePreviews.map((preview, index) => (
										<img
											key={index}
											src={preview}
											alt={`Preview ${index}`}
											className="max-w-[200px] max-h-[200px]"
										/>
									))}
								{imagePreviews.length === 0 && (
									<p className="text-sm">No Uploads yet.</p>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Article Description</CardTitle>
							</CardHeader>
							<CardContent>
								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Content</FormLabel>
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
							</CardContent>
						</Card>
						<Button type="submit">Create New</Button>
					</form>
				</Form>
			</div>
		</ScrollArea>
	);
};

export default NewArticle;
