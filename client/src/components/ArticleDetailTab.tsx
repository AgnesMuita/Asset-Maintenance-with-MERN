import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
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
import {
	articleStages,
	articleStatus,
	publishSubject,
	visibilities,
} from "@/utils/consts";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon, LucideSave } from "lucide-react";
import { Calendar } from "./ui/calendar";
import React from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate, useParams } from "react-router-dom";
import { client } from "@/services/axiosClient";
import { toast } from "./ui/use-toast";

const knowledgeArticleFormSchema = z.object({
	title: z.string({
		required_error: "Case title is required.",
	}),
	keywords: z.string().optional(),
	description: z.string({
		required_error: "Article description is required.",
	}),
	content: z.string({
		required_error: "Article cannot be submitted without content",
	}),
	media: z.string().optional(),
	visibility: z.string().optional(),
	statusReason: z.string().optional(),
	stage: z.string().optional(),
	language: z.string().optional(),
	majorVNo: z.number().optional(),
	publishSubject: z.string({
		required_error: "Publish subject is required.",
	}),
	publishOn: z.string().optional(),
	expirationDate: z.date().optional(),
	owner: z.string().optional(),
	createdBy: z.string().optional(),
	createdOn: z.string().optional(),
	modifiedBy: z.string().optional(),
	modifiedOn: z.string().optional(),
});

type KnowledgeArticleFormValues = z.infer<typeof knowledgeArticleFormSchema>;

const ArticleDetailTab = ({
	article,
}: {
	article: IKnowledgeArticleProps | undefined;
}) => {
	const [datePickerOpen, setDatePickerOpen] = React.useState(false);
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const navigate = useNavigate();
	const { id } = useParams();
	const arrKeywords: string[] = [];

	//convert publish date it ISO
	const publishDate = new Date();
	const isoPublishDate = publishDate?.toISOString();

	//get current logged-in user
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

	const form = useForm<KnowledgeArticleFormValues>({
		resolver: zodResolver(knowledgeArticleFormSchema),
		mode: "onChange",
		defaultValues: {
			title: article?.title,
			description: article?.description,
			keywords: article?.keywords[0]?.text,
			content: article?.content,
			visibility: article?.visibility,
			statusReason: article?.status,
			stage: article?.stage,
			owner: article?.owner?.fullName,
			language: article?.language,
			majorVNo: article?.majorVNo,
			publishSubject: article?.publishSubject,
			publishOn: article?.publishedOn ?? "",
			expirationDate: article?.expirationDate,
			createdBy: article?.owner?.fullName,
			createdOn: article && format(article.createdAt, "dd/MM/yyyy p"),
			modifiedBy: article?.modifier?.fullName,
			modifiedOn: article && format(article.modifiedAt, "dd/MM/yyyy p"),
		},
	});

	async function onSubmit(data: KnowledgeArticleFormValues) {
		if (isLoggedIn) {
			arrKeywords.push(data.keywords ?? "");

			try {
				await client.patch(
					`http://localhost:8800/api/v1/karticles/${id}`,
					{
						title: data.title,
						keywords: arrKeywords,
						description: data.description,
						content: data.content,
						status: data.statusReason,
						visibility: data.visibility,
						stage: data.stage,
						language: data.language,
						majorVNo: data.majorVNo,
						publishSubject: data.publishSubject,
						publishDate: isoPublishDate,
						expirationDate: data.expirationDate?.toISOString(),
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
			} catch (err) {
				console.error(err);
			}
		} else {
			navigate("/signin");
		}
	}

	React.useEffect(() => {
		if (isLoggedIn) {
			if (article) {
				form.reset({
					title: article.title,
					description: article.description,
					keywords: article.keywords[0]?.text,
					content: article.content,
					visibility: article.visibility,
					statusReason: article.status,
					stage: article.stage,
					owner: article.owner?.fullName,
					language: article.language,
					majorVNo: article.majorVNo,
					publishSubject: article.publishSubject,
					publishOn: article.publishedOn ?? "",
					expirationDate: article.expirationDate,
					createdBy: article.owner?.fullName,
					createdOn: format(article.createdAt, "dd/MM/yyyy p"),
					modifiedBy: article.modifier?.fullName,
					modifiedOn: format(article.modifiedAt, "dd/MM/yyyy p"),
				});
			}
		} else {
			navigate("/signin");
		}
	}, [article, form, isLoggedIn, navigate]);

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
							<div className="grid lg:grid-cols-3 gap-4">
								<Card className="h-max">
									<CardHeader>
										<CardTitle>General</CardTitle>
										<Separator />
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="visibility"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Visibility
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															article.visibility
														}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	className="placeholder:text-muted-foreground"
																	placeholder="Select visbility..."
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{visibilities &&
																visibilities.map(
																	(
																		item,
																		idx
																	) => (
																		<SelectItem
																			value={
																				item
																			}
																			key={
																				idx
																			}
																		>
																			{
																				item
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
											name="statusReason"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Status Reason
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															article.status
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
															{articleStatus &&
																articleStatus.map(
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
											name="owner"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Owner</FormLabel>
													<FormControl>
														<Input
															placeholder="Article Owner"
															{...field}
															defaultValue={
																article.owner
																	?.fullName
															}
															disabled
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="language"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Language
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Article Language"
															{...field}
															defaultValue={
																article.language
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="stage"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Article Stage
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															field.value
														}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	className="placeholder:text-muted-foreground"
																	placeholder="Select stage..."
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{articleStages &&
																articleStages.map(
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
											name="majorVNo"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Major Version No
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Article Version"
															{...field}
															defaultValue={
																article.majorVNo
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>

								<Card className="h-max">
									<CardHeader>
										<CardTitle>Publish Settings</CardTitle>
										<Separator />
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="publishSubject"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Publish Subject
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															article.publishSubject
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
															{publishSubject &&
																publishSubject.map(
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
											name="publishOn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Published On
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Publish Date"
															{...field}
															defaultValue={
																article.publishedOn &&
																format(
																	article.publishedOn,
																	"PPP"
																)
															}
															disabled
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="expirationDate"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>
														Expiration Date
													</FormLabel>
													<Popover
														open={datePickerOpen}
														onOpenChange={
															setDatePickerOpen
														}
													>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant={
																		"outline"
																	}
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
																			Pick
																			expiration
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
																selected={
																	field.value
																}
																onSelect={
																	field.onChange
																}
																onDayClick={() => {
																	setDatePickerOpen(
																		false
																	);
																}}
																disabled={(
																	date
																) =>
																	date <
																	new Date()
																}
																initialFocus
															/>
														</PopoverContent>
													</Popover>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>

								<Card className="h-max">
									<CardHeader>
										<CardTitle>Admin</CardTitle>
										<Separator />
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="createdBy"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Created By
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Created By"
															{...field}
															defaultValue={
																article.owner
																	?.fullName
															}
															disabled
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="createdOn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Created On
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Created On"
															{...field}
															defaultValue={
																article.createdAt &&
																format(
																	article.createdAt,
																	"dd/MM/yyyy p"
																)
															}
															disabled
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="modifiedBy"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Modifier
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Modifier"
															{...field}
															defaultValue={
																article.modifier
																	?.fullName
															}
															disabled
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="modifiedOn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Modified On
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Modified On"
															{...field}
															defaultValue={
																article.modifiedAt &&
																format(
																	article.modifiedAt,
																	"dd/MM/yyyy p"
																)
															}
															disabled
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
					<div className="flex justify-end">
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

export default ArticleDetailTab;
