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
import { client } from "@/services/axiosClient";
import { toast } from "./ui/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "@/utils/consts";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate } from "react-router-dom";
import { Tag, TagInput } from "./ui/tag-input";

const eventFormSchema = z.object({
	eventTitle: z.string({
		required_error: "Event Title is required.",
	}),
	tags: z.array(
		z.object({
			id: z.string(),
			text: z.string(),
		})
	),
	eventDate: z.date({
		required_error: "Please select event date.",
	}),
	description: z.string({
		required_error: "Event description is required.",
	}),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const NewEvent: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");
	const [datePickerOpen, setDatePickerOpen] = React.useState(false);
	const [tags, setTags] = React.useState<Tag[]>([]);

	const form = useForm<EventFormValues>({
		resolver: zodResolver(eventFormSchema),
		mode: "onChange",
	});

	async function onSubmit(data: EventFormValues) {
		if (isLoggedIn) {
			try {
				await client.post(`http://localhost:8800/api/v1/events/`, {
					title: data.eventTitle,
					tags: data.tags,
					eventDate: data.eventDate.toISOString(),
					description: data.description,
					userId: currentUser.id,
				});
				toast({
					title: "Event Creation",
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
			<ScrollArea className="h-[calc(100vh-8rem)]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<Card>
							<CardHeader className="">
								<CardTitle>New Event</CardTitle>
								<Separator />
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="eventTitle"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Event Title</FormLabel>
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
											<FormLabel>Event Tags</FormLabel>
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
												Add tags related to this event;
												comma separated e.g event, party
												etc.
											</FormDescription>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="eventDate"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>Event Date</FormLabel>
											<Popover
												open={datePickerOpen}
												onOpenChange={setDatePickerOpen}
											>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"pl-3 text-left font-normal",
																!field.value &&
																	"text-muted-foreground"
															)}
														>
															{field.value ? (
																format(
																	field.value,
																	"PPP"
																)
															) : (
																<span>
																	Pick event
																	date
																</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent
													className="w-auto p-0"
													align="start"
												>
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={
															field.onChange
														}
														onDayClick={() => {
															setDatePickerOpen(
																false
															);
														}}
														disabled={(date) =>
															date < new Date()
														}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
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
												Event Description
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

export default NewEvent;
