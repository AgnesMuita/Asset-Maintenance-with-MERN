import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
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
import { client } from "@/services/axiosClient";
import { toast } from "./ui/use-toast";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules, priorities } from "@/utils/consts";
import io from "socket.io-client";
import { useAnnouncement } from "@/context/announcement-provider";
import { Tag, TagInput } from "./ui/tag-input";

const announcementFormSchema = z.object({
	announcementTitle: z.string({
		required_error: "News Title is required.",
	}),
	tags: z.array(
		z.object({
			id: z.string(),
			text: z.string(),
		})
	),
	severity: z.string({
		required_error: "Announcement severity is required.",
	}),
	announcement: z.string({
		required_error: "Announcement content is required.",
	}),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;
const SOCKET_SERVER_URL = "http://localhost:8800";

const NewAnnouncement: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");
	const [tags, setTags] = React.useState<Tag[]>([]);
	const { setNewAnnouncement } = useAnnouncement();

	const form = useForm<AnnouncementFormValues>({
		resolver: zodResolver(announcementFormSchema),
		mode: "onChange",
	});

	async function onSubmit(data: AnnouncementFormValues) {
		if (isLoggedIn) {
			try {
				const socket = io(SOCKET_SERVER_URL);

				await client.post(
					`http://localhost:8800/api/v1/announcements/`,
					{
						title: data.announcementTitle,
						tags: data.tags,
						announcement: data.announcement,
						severity: data.severity,
						userId: currentUser.id,
					}
				);

				socket.emit("newAnnouncement", data);

				toast({
					title: "Announcement Creation",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
							<code className="text-white text-wrap">
								Announcement created successfully!
							</code>
						</pre>
					),
				});

				form.reset({
					announcementTitle: "",
					announcement: "",
					severity: "",
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
		const socket = io(SOCKET_SERVER_URL);

		socket.on("connect", () => {
			console.log("Connected to web server");
		});

		socket.on("newAnnouncement", (notification: IAnnouncementProps) => {
			setNewAnnouncement(notification);
		});

		return () => {
			socket.disconnect();
		};
	}, [setNewAnnouncement]);

	return (
		<div className="grid grid-cols-1 gap-4">
			<ScrollArea className="h-[calc(100vh-8rem)]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<Card>
							<CardHeader className="">
								<CardTitle>New Announcement</CardTitle>
								<Separator />
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="announcementTitle"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Announcement Title
											</FormLabel>
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
											<FormLabel>
												Announcement Tags
											</FormLabel>
											<FormControl>
												<TagInput
													{...field}
													placeholder="Enter announcement tags"
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
												announcement; comma separated
												e.g event, party etc.
											</FormDescription>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="severity"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Severity</FormLabel>
											<Select
												onValueChange={field.onChange}
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
									name="announcement"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Announcement</FormLabel>
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

export default NewAnnouncement;
