import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
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
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { toast } from "./ui/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "@/utils/consts";
import { Tag, TagInput } from "./ui/tag-input";

const newsFormSchema = z.object({
	newsTitle: z.string({
		required_error: "News Title is required.",
	}),
	tags: z.array(
		z.object({
			id: z.string(),
			text: z.string(),
		})
	),
	description: z.string({
		required_error: "News description is required.",
	}),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

const NewNews: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");
	const [tags, setTags] = React.useState<Tag[]>([]);

	const form = useForm<NewsFormValues>({
		resolver: zodResolver(newsFormSchema),
		mode: "onChange",
	});

	async function onSubmit(data: NewsFormValues) {
		if (isLoggedIn) {
			try {
				await client.post(`http://localhost:8800/api/v1/news/`, {
					title: data.newsTitle,
					tags: data.tags,
					description: data.description,
					userId: currentUser.id,
				});
				toast({
					title: "News Article Creation",
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

	return (
		<div className="grid grid-cols-1 gap-4">
			<ScrollArea className="h-[calc(100vh-8rem)] w-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<Card>
							<CardHeader className="">
								<CardTitle>New Article</CardTitle>
								<Separator />
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="newsTitle"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Article Title</FormLabel>
											<FormControl>
												<Input
													placeholder="Title"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="tags"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Article Tags</FormLabel>
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
												Add tags related to this news
												article; comma separated e.g
												event, party etc.
											</FormDescription>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Article Description
											</FormLabel>
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
						<Button className="my-4" type="submit">
							Create New
						</Button>
					</form>
				</Form>
			</ScrollArea>
		</div>
	);
};

export default NewNews;
