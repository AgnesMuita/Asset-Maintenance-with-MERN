import { client } from "@/services/axiosClient";
import { useAuthStore } from "@/stores/auth.store";
import React from "react";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { ArchiveRestoreIcon, ArchiveXIcon, Trash2 } from "lucide-react";
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
} from "./ui/alert-dialog";
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
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

const activateFormSchema = z.object({
	active: z.string({
		required_error: "Article status is required.",
	}),
});

const deactivateFormSchema = z.object({
	active: z.string({
		required_error: "Article Status is required.",
	}),
});

type ActivateFormValues = z.infer<typeof activateFormSchema>;
type DeactivateFormValues = z.infer<typeof deactivateFormSchema>;

const EventDetails = (props: { id: string }) => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [event, setEvent] = React.useState<IEventProps>();
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	const activateForm = useForm<ActivateFormValues>({
		resolver: zodResolver(activateFormSchema),
		mode: "onChange",
		defaultValues: {
			active: "Activate",
		},
	});

	const deactivateForm = useForm<DeactivateFormValues>({
		resolver: zodResolver(deactivateFormSchema),
		mode: "onChange",
		defaultValues: {
			active: "Deactivate",
		},
	});

	async function onActivateSubmit(activateFormData: ActivateFormValues) {
		try {
			await client.patch(
				`http://localhost:8800/api/v1/events/${props.id}`,
				{
					active: true,
				}
			);
			toast({
				title: "Event Activation",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(activateFormData, null, 2)}
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

	async function onDeactivateSubmit(
		deactivateFormData: DeactivateFormValues
	) {
		try {
			await client.patch(
				`http://localhost:8800/api/v1/events/${props.id}`,
				{
					active: false,
				}
			);
			toast({
				title: "Event Deactivation",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(deactivateFormData, null, 2)}
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

	const handleDelete = async () => {
		try {
			const res = await client.delete(
				`http://localhost:8800/api/v1/events/${props.id}`
			);

			if (res.status === 200) {
				toast({
					title: "Event Deletion",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
							<code className="text-white text-wrap">
								{JSON.stringify(res.data, null, 2)}
							</code>
						</pre>
					),
				});
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
	};

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchEvent = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/events/${props.id}`
					);
					setEvent(res.data);
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
			fetchEvent();
		}
	}, [isLoggedIn, props.id]);

	return (
		<>
			{event && (
				<>
					<DialogHeader>
						<DialogTitle className="capitalize flex items-center justify-between pt-5">
							{event.title}
							<div className="flex items-center gap-x-2">
								{/* Activate Form Dialog */}
								<AlertDialog>
									<AlertDialogTrigger
										disabled={event.active}
										className={
											currentUser.role === "TECHNICIAN" ||
											currentUser.role === "ADMIN" ||
											currentUser.role ===
												"SUPER_ADMIN" ||
											currentUser.role === "DEVELOPER"
												? "flex"
												: "hidden"
										}
									>
										<Button
											variant="outline"
											disabled={event.active}
										>
											Activate{" "}
											<ArchiveRestoreIcon className="ml-2 h-4 w-4" />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<Form {...activateForm}>
											<form
												onSubmit={activateForm.handleSubmit(
													onActivateSubmit
												)}
												className="space-y-4"
											>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you absolutely sure?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be
														undone. This will mark
														the event as active and
														make it visible to
														everyone.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<div>
													<FormField
														control={
															activateForm.control
														}
														name="active"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Active
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Is Active"
																		{...field}
																		defaultValue="Activate"
																		disabled
																	/>
																</FormControl>
																<FormDescription>
																	This is the
																	status of
																	the event.
																	Whether it's
																	active or
																	inactive.
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
												<AlertDialogFooter>
													<AlertDialogCancel>
														Cancel
													</AlertDialogCancel>
													<AlertDialogAction type="submit">
														Continue
													</AlertDialogAction>
												</AlertDialogFooter>
											</form>
										</Form>
									</AlertDialogContent>
								</AlertDialog>

								{/* Deactivate Form Dialog */}
								<AlertDialog>
									<AlertDialogTrigger
										disabled={!event.active}
										className={
											currentUser.role === "TECHNICIAN" ||
											currentUser.role === "ADMIN" ||
											currentUser.role ===
												"SUPER_ADMIN" ||
											currentUser.role === "DEVELOPER"
												? "flex"
												: "hidden"
										}
									>
										<Button
											variant="outline"
											disabled={!event.active}
										>
											Deactivate{" "}
											<ArchiveXIcon className="ml-2 h-4 w-4" />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<Form {...deactivateForm}>
											<form
												onSubmit={deactivateForm.handleSubmit(
													onDeactivateSubmit
												)}
												className="space-y-4"
											>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you absolutely sure?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be
														undone. This will
														deactivate this event
														and it won't be visible
														to anyone.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<div>
													<FormField
														control={
															deactivateForm.control
														}
														name="active"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Deactivate
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Is Active"
																		{...field}
																		defaultValue="Deactivate"
																		disabled
																	/>
																</FormControl>
																<FormDescription>
																	This is the
																	status of
																	the event.
																	Whether it's
																	active or
																	inactive'.
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
												<AlertDialogFooter>
													<AlertDialogCancel>
														Cancel
													</AlertDialogCancel>
													<AlertDialogAction type="submit">
														Continue
													</AlertDialogAction>
												</AlertDialogFooter>
											</form>
										</Form>
									</AlertDialogContent>
								</AlertDialog>

								<AlertDialog>
									<AlertDialogTrigger
										className={
											currentUser.role === "TECHNICIAN" ||
											currentUser.role === "ADMIN" ||
											currentUser.role ===
												"SUPER_ADMIN" ||
											currentUser.role === "DEVELOPER"
												? "flex"
												: "hidden"
										}
									>
										<Button variant="destructive">
											Delete{" "}
											<Trash2 className="ml-2 h-4 w-4" />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone.
												This will permanently delete
												this event and remove the data
												from our servers.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={handleDelete}
											>
												Continue
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</DialogTitle>
						<DialogDescription>
							<div className="flex items-center gap-x-4">
								<p>Departmental Event</p>
								<p className="text-xs text-muted-foreground">
									{format(event.eventDate, "MMM dd yyyy")}
								</p>
							</div>
							<div className="flex items-center gap-x-4 mt-2">
								<Badge variant="default">Badge</Badge>
								<Badge variant="outline">Badge</Badge>
								<Badge variant="outline">Badge</Badge>
							</div>
						</DialogDescription>
					</DialogHeader>
					<ScrollArea className="h-[calc(100vh-12rem)] px-4">
						<div
							dangerouslySetInnerHTML={{
								__html: event.description,
							}}
						></div>
					</ScrollArea>
				</>
			)}
		</>
	);
};

export default EventDetails;
