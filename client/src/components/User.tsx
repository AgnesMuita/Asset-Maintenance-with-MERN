import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
	ClockIcon,
	FlagTriangleRightIcon,
	HourglassIcon,
	LucideSave,
	MapPinIcon,
	TagIcon,
	TicketIcon,
} from "lucide-react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
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
import { format } from "date-fns";
import { Link, useParams } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CONTACT_METHOD, DEPARTMENTS, ROLES } from "@/utils/consts";
import { Button } from "./ui/button";
import { client } from "@/services/axiosClient";
import { toast } from "./ui/use-toast";
import CreateRelatedAsset from "./CreateRelatedAsset";
import CaseNoBadge from "./shared/CaseNoBadge";
import PriorityBadge from "./shared/PriorityBadge";

const userFormSchema = z.object({
	firstName: z.string({
		required_error: "First Name is required.",
	}),
	lastName: z.string({
		required_error: "Last Name is required.",
	}),
	email: z.string({
		required_error: "Email is required.",
	}),
	phone: z.string({
		required_error: "Phone Number is required.",
	}),
	jobTitle: z.string({
		required_error: "Job Title is required.",
	}),
	department: z.string({
		required_error: "Department is required.",
	}),
	contactMethod: z.string({
		required_error: "Contact Method is required.",
	}),
	role: z.string({
		required_error: "Role is required.",
	}),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const User = ({ user }: { user: IUserProps | undefined }) => {
	const { id } = useParams();

	const userForm = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		mode: "onChange",
		defaultValues: {
			firstName: user?.firstName,
			lastName: user?.lastName,
			email: user?.email,
			phone: user?.phone,
			jobTitle: user?.jobTitle,
			department: user?.department,
			contactMethod: user?.contactMethod,
			role: user?.role,
		},
	});

	async function onUserSubmit(userFormData: UserFormValues) {
		try {
			await client.patch(`http://localhost:8800/api/v1/users/${id}`, {
				active: true,
			});
			toast({
				title: "User Creation",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(userFormData, null, 2)}
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

	return (
		<div>
			{user && (
				<>
					<Form {...userForm}>
						<form
							onSubmit={userForm.handleSubmit(onUserSubmit)}
							id="userForm"
							className="grid lg:grid-cols-3 gap-4"
						>
							<Card className="h-max">
								<CardHeader>
									<CardTitle>General Information</CardTitle>
									<Separator />
								</CardHeader>
								<ScrollArea className="h-[calc(100vh-23rem)]">
									<CardContent className="space-y-4">
										<FormField
											control={userForm.control}
											name="firstName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														First Name
													</FormLabel>
													<FormControl>
														<Input
															placeholder="First Name"
															{...field}
															defaultValue={
																user.firstName
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={userForm.control}
											name="lastName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Last Name
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Last Name"
															{...field}
															defaultValue={
																user.lastName
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={userForm.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															type="email"
															placeholder="Email"
															{...field}
															defaultValue={
																user.email
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={userForm.control}
											name="phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Phone Number
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Phone Number"
															{...field}
															defaultValue={
																user.phone
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={userForm.control}
											name="jobTitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Job Title
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Job Title"
															{...field}
															defaultValue={
																user.jobTitle
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={userForm.control}
											name="department"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Department
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															user.department
														}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	className="placeholder:text-muted-foreground"
																	placeholder="Select department..."
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{DEPARTMENTS &&
																DEPARTMENTS.map(
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
																			disabled={
																				item.label ===
																					"Global" ||
																				item.label ===
																					"Personal"
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
											control={userForm.control}
											name="contactMethod"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Contact Method
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															user.contactMethod
														}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	className="placeholder:text-muted-foreground"
																	placeholder="Select contact method..."
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{CONTACT_METHOD &&
																CONTACT_METHOD.map(
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
											control={userForm.control}
											name="role"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Role</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={user.role}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	className="placeholder:text-muted-foreground"
																	placeholder="Select user role..."
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{ROLES &&
																ROLES.map(
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
									</CardContent>
								</ScrollArea>
							</Card>

							<Card className="h-max">
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<div>
											Related Assets
											<span className="ml-2 lowercase">
												({user?.assets.length}{" "}
												{user?.assets &&
												user?.assets.length > 1
													? "Assets"
													: "Asset"}
												)
											</span>
										</div>

										{/* Asset assign Form */}
										<CreateRelatedAsset id={id} />
									</CardTitle>
									<Separator />
								</CardHeader>
								<ScrollArea className="h-[calc(100vh-23rem)]">
									<CardContent className="space-y-4">
										{user?.assets &&
											user.assets.map((asset) => (
												<Card
													className="py-0 hover:bg-gray-50 hover:dark:bg-gray-900 group transition-colors duration-150 ease-in-out"
													key={asset.id}
												>
													<Link
														to={`/assets/asset-details/${asset.id}`}
													>
														<CardHeader className="py-4">
															<CardTitle>
																{asset.name}
															</CardTitle>
														</CardHeader>
														<CardContent className="pb-2 space-y-4">
															<div className="flex items-center gap-x-10">
																<p className="flex items-center gap-x-2">
																	<TagIcon
																		size={
																			16
																		}
																	/>
																	<Badge variant="default">
																		{
																			asset.tag
																		}
																	</Badge>
																</p>
																<p className="flex items-center gap-x-2">
																	<MapPinIcon
																		size={
																			16
																		}
																	/>
																	<Badge variant="outline">
																		{
																			asset.location
																		}
																	</Badge>
																</p>
															</div>
															<p className="flex items-center gap-x-2 text-xs font-medium">
																<ClockIcon
																	size={16}
																/>
																{format(
																	asset.createdAt,
																	"dd/MM/yyyy p"
																)}
															</p>
														</CardContent>
													</Link>
												</Card>
											))}
									</CardContent>
								</ScrollArea>
							</Card>

							<div className="space-y-4">
								<Card className="h-max">
									<CardHeader>
										<CardTitle>
											Related Cases
											<span className="ml-2 lowercase">
												({user?.cases.length}{" "}
												{user?.cases &&
												user?.cases.length > 1
													? "Cases"
													: "Case"}
												)
											</span>
										</CardTitle>
										<Separator />
									</CardHeader>
									<ScrollArea className="h-[calc(100vh-23rem)]">
										<CardContent className="space-y-4">
											{user?.cases &&
												user.cases.map((caseI) => (
													<Card
														className="py-0 hover:bg-gray-50 hover:dark:bg-gray-900 group transition-colors duration-150 ease-in-out"
														key={caseI.id}
													>
														<Link
															to={`/cases/case-details/${caseI.id}`}
														>
															<CardHeader className="py-4">
																<CardTitle>
																	{
																		caseI.caseTitle
																	}
																</CardTitle>
															</CardHeader>
															<CardContent className="pb-2 space-y-4">
																<p className="flex items-center gap-x-2">
																	<TicketIcon
																		size={
																			16
																		}
																	/>
																	<CaseNoBadge
																		caseNumber={
																			caseI.caseNumber
																		}
																	/>
																</p>
																<div className="flex items-center gap-x-5">
																	<p className="flex items-center gap-x-2">
																		<HourglassIcon
																			size={
																				16
																			}
																		/>
																		<Badge className="rounded-full py-0">
																			{
																				caseI.status
																			}
																		</Badge>
																	</p>
																	<p className="flex items-center gap-x-2">
																		<FlagTriangleRightIcon
																			size={
																				16
																			}
																		/>
																		<PriorityBadge
																			priority={
																				caseI.priority
																			}
																		/>
																	</p>
																</div>
																<p className="flex items-center gap-x-2 text-xs font-medium">
																	<ClockIcon
																		size={
																			16
																		}
																	/>
																	{format(
																		caseI.createdAt,
																		"dd/MM/yyyy p"
																	)}
																</p>
															</CardContent>
														</Link>
													</Card>
												))}
										</CardContent>
									</ScrollArea>
								</Card>

								{/* Save/update asset dialog */}
								<div className="flex justify-end items-end">
									<AlertDialog>
										<AlertDialogTrigger>
											<Button type="button">
												Save{" "}
												<LucideSave className="ml-2 h-4 w-4" />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Are you absolutely sure?
												</AlertDialogTitle>
												<AlertDialogDescription>
													This action cannot be
													undone. Updating this asset
													means changing the previous
													content and cannot be gotten
													back.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>
													Cancel
												</AlertDialogCancel>
												<AlertDialogAction
													type="submit"
													form="userForm"
												>
													Continue
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						</form>
					</Form>
				</>
			)}
		</div>
	);
};

export default User;
