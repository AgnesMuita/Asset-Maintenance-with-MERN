import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
	ArchiveRestoreIcon,
	ArchiveXIcon,
	ArrowLeftIcon,
	BadgeCheckIcon,
	BadgeXIcon,
	KeyRoundIcon,
	Trash2Icon,
	TrashIcon,
} from "lucide-react";
import User from "@/components/User";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NewUser from "@/components/NewUser";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate, useParams } from "react-router-dom";
import { client } from "@/services/axiosClient";
import { makeFallBack } from "@/utils/make.fallback";
import { toast } from "@/components/ui/use-toast";
import { generatePassword } from "@/utils/password.generator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import AssetAllocation from "@/components/AssetAllocation";

const activateFormSchema = z.object({
	active: z.string({
		required_error: "Asset status is required.",
	}),
});

const deactivateFormSchema = z.object({
	active: z.string({
		required_error: "Asset Status is required.",
	}),
});

const resetFormSchema = z.object({
	password: z.string({
		required_error: "Password value is required.",
	}),
});

type ActivateFormValues = z.infer<typeof activateFormSchema>;
type DeactivateFormValues = z.infer<typeof deactivateFormSchema>;
type ResetFormValues = z.infer<typeof resetFormSchema>;

const UserDetails: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [user, setUser] = React.useState<IUserProps>();
	const { id } = useParams();
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	// convert trash data to ISO
	const trashDate = new Date();
	const deletedAt = trashDate?.toISOString();

	const [autoPassword, setAutoPassword] = React.useState(true);

	let genPassword = "";

	if (autoPassword) {
		genPassword = generatePassword({ length: 12 });
	}

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

	const resetForm = useForm<ResetFormValues>({
		resolver: zodResolver(resetFormSchema),
		mode: "onChange",
		defaultValues: {
			password: genPassword && genPassword,
		},
	});

	async function onActivateSubmit(activateFormData: ActivateFormValues) {
		try {
			await client.patch(`http://localhost:8800/api/v1/users/${id}`, {
				active: true,
			});
			toast({
				title: "User Activation",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(activateFormData, null, 2)}
						</code>
					</pre>
				),
			});
			handleRefresh();
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
			await client.patch(`http://localhost:8800/api/v1/users/${id}`, {
				active: false,
			});
			toast({
				title: "User Deactivation",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(deactivateFormData, null, 2)}
						</code>
					</pre>
				),
			});
			handleRefresh();
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

	async function onResetSubmit(resetFormData: ResetFormValues) {
		try {
			const res = await client.patch(
				`http://localhost:8800/api/v1/users/${id}`,
				{
					password: resetFormData.password,
				}
			);

			if (res.status == 200) {
				navigator.clipboard.writeText(resetFormData.password);
				toast({
					title: "Password Reset",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
							<code className="text-white text-wrap">
								{JSON.stringify(resetFormData, null, 2)}
							</code>
							Password has been copied to the clipboard!
						</pre>
					),
				});
			}
			handleRefresh();
		} catch (err) {
			console.error(err);
		}
	}

	const handleRefresh = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					`http://localhost:8800/api/v1/users/${id}`
				);
				setUser(res.data);
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

	const handleDelete = async () => {
		try {
			const res = await client.delete(
				`http://localhost:8800/api/v1/users/${id}`
			);

			if (res.status === 200) {
				handleRefresh();
				toast({
					title: "User Deletion",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
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

	const handleTrash = async () => {
		if (isLoggedIn) {
			try {
				await client.patch(`http://localhost:8800/api/v1/users/${id}`, {
					deletedAt: deletedAt,
				});
				await client.post(`http://localhost:8800/api/v1/trash`, {
					userId: id,
					trashedById: currentUser.id,
				});

				handleRefresh();

				toast({
					title: "User trash.",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
							<code className="text-white text-wrap">
								User trashed successfully
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
	};

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchUser = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/users/${id}`
					);

					if (res.status == 200) {
						setUser(res.data);
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
			fetchUser();
		}
	}, [isLoggedIn, id]);

	return (
		<div className="p-2 border-l w-full">
			<div className="w-full h-[7rem] flex flex-col space-y-4">
				{user && (
					<div className="flex justify-between">
						<div className="flex items-center gap-x-4">
							<Button variant="ghost" size="icon">
								<ArrowLeftIcon
									onClick={() => navigate(-1)}
									className="cursor-pointer"
								/>
							</Button>
							<Avatar>
								<AvatarImage
									src={
										user.avatar ??
										"https://github.com/shadcn.png"
									}
								/>
								<AvatarFallback>
									{makeFallBack(
										user.firstName,
										user.lastName
									)}
								</AvatarFallback>
							</Avatar>
							<div>
								<h1 className="flex items-center gap-x-1 font-bold text-2xl tracking-tight">
									{user.fullName}
									{user.active ? (
										<BadgeCheckIcon
											size={20}
											fill="#0F6CBD"
											color="white"
										/>
									) : (
										<BadgeXIcon
											size={20}
											fill="#F05757"
											color="white"
										/>
									)}
								</h1>
								<p className="font-medium text-sm text-gray-400">
									User
								</p>
							</div>
						</div>
						<div className="flex divide-x gap-x-4">
							<div className="px-5">
								<p className="font-semibold text-sm">
									{user.jobTitle}
								</p>
								<p className="text-xs">Job Title</p>
							</div>
							<div className="px-5">
								<p className="font-semibold text-sm">
									{user.phone}
								</p>
								<p className="text-xs">Business Phone</p>
							</div>
							<div className="px-5">
								<p className="font-semibold text-sm">
									{user.email}
								</p>
								<p className="text-xs">Email</p>
							</div>
						</div>
					</div>
				)}

				<div className="flex gap-x-2 ml-auto">
					<Sheet>
						<SheetTrigger>
							<Button variant="outline">
								New <PlusIcon className="ml-2 h-4 w-4" />
							</Button>
						</SheetTrigger>
						<SheetContent className="w-[60rem] sm:max-w-none">
							<SheetHeader className="mb-4">
								<SheetTitle>Create New User</SheetTitle>
								<SheetDescription>
									Create a user, Ensure all the details are
									correct before submitting it.
								</SheetDescription>
							</SheetHeader>
							<NewUser />
						</SheetContent>
					</Sheet>
					<Button variant="outline" onClick={handleRefresh}>
						Refresh <ReloadIcon className="ml-2 h-4 w-4" />
					</Button>

					{/* Reset Password Form Dialog */}
					<AlertDialog>
						<AlertDialogTrigger>
							<Button variant="outline">
								Reset Password{" "}
								<KeyRoundIcon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<Form {...resetForm}>
								<form
									onSubmit={resetForm.handleSubmit(
										onResetSubmit
									)}
									className="space-y-4"
								>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Reset User Password
										</AlertDialogTitle>
										<AlertDialogDescription>
											Reset the selected user password:{" "}
											<span className="font-bold text-foreground">
												{user?.fullName}
											</span>
										</AlertDialogDescription>
									</AlertDialogHeader>
									<div className="space-y-4">
										<div className="flex items-center space-x-2">
											<Checkbox
												id="passwordgen"
												checked={autoPassword}
												onCheckedChange={() =>
													setAutoPassword(
														!autoPassword
													)
												}
											/>
											<label
												htmlFor="passwordgen"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Automatically create a password
											</label>
										</div>
										<FormField
											control={resetForm.control}
											name="password"
											render={({ field }) => (
												<FormItem
													className={
														autoPassword
															? "hidden"
															: "grid"
													}
												>
													<FormLabel>
														Password
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Password"
															{...field}
															defaultValue={
																genPassword
															}
														/>
													</FormControl>
													<FormDescription>
														Passwords must be
														between 8 and 256
														characters and use a
														combination of at least
														three of the following:
														uppercase letters,
														lowercase letters,
														numbers and symbols.
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

					{/* Activate Form Dialog */}
					<AlertDialog>
						<AlertDialogTrigger>
							<Button variant="outline">
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
											This action cannot be undone. This
											will permanently mark the case as
											resolved.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<div>
										<FormField
											control={activateForm.control}
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
														This is the status of
														the asset. Whether it's
														active or inactive'.
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
						<AlertDialogTrigger>
							<Button variant="outline">
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
											This action cannot be undone. This
											will permanently mark the user as
											resolved.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<div>
										<FormField
											control={deactivateForm.control}
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
														This is the status of
														the user. Whether it's
														active or inactive'.
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

					{/* Delete user dialog */}
					<AlertDialog>
						<AlertDialogTrigger>
							<Button variant="outline">
								Move to Trash{" "}
								<TrashIcon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Trashing this item doesn't delete it
									permanently. It moves it to trash and it can
									be recovered within 30 days from date of
									deletion.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleTrash}>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					{/* Delete user dialog */}
					<AlertDialog>
						<AlertDialogTrigger>
							<Button variant="destructive">
								Delete <Trash2Icon className="ml-2 h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete this user and remove the
									data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleDelete}>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>

				<Tabs defaultValue="summary">
					<TabsList className="mb-2">
						<TabsTrigger value="summary">Summary</TabsTrigger>
						<TabsTrigger value="asset-allocation">
							Asset Allocation
						</TabsTrigger>
					</TabsList>
					<Separator />
					<TabsContent value="summary">
						<User user={user} />
					</TabsContent>
					<TabsContent value="asset-allocation">
						<AssetAllocation user={user} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default UserDetails;
