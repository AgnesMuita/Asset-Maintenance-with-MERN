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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { toast } from "./ui/use-toast";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "./ui/command";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CONTACT_METHOD, DEPARTMENTS, ROLES } from "@/utils/consts";
import { Checkbox } from "./ui/checkbox";
import { generatePassword } from "@/utils/password.generator";

const userFormSchema = z.object({
	firstName: z.string({
		required_error: "First Name is required.",
	}),
	lastName: z.string({
		required_error: "Last Name is required",
	}),
	email: z.string({
		required_error: "An email is required",
	}),
	phoneNumber: z.string({
		required_error: "Phone Number is required",
	}),
	password: z.string({
		required_error: "A password must be provided.",
	}),
	jobTitle: z.string({
		required_error: "Job Title is requried.",
	}),
	department: z.string({
		required_error: "Please select a department.",
	}),
	role: z.string({
		required_error: "Please select user role.",
	}),
	contactMethod: z.string().optional(),
	asset: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const NewUser: React.FunctionComponent = () => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [assets, setAssets] = React.useState<IAssetProps[]>();
	const [open, setOpen] = React.useState(false);
	const [autoPassword, setAutoPassword] = React.useState(true);

	let genPassword = "";

	if (autoPassword) {
		genPassword = generatePassword({ length: 12 });
	}

	const form = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		mode: "onChange",
		defaultValues: {
			password: genPassword && genPassword,
		},
	});

	async function onSubmit(data: UserFormValues) {
		try {
			const res = await client.post(
				"http://localhost:8800/api/v1/auth/register",
				{
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
					password: data.password,
					phone: data.phoneNumber,
					jobTitle: data.jobTitle,
					department: data.department,
					contactMethod: data.contactMethod,
					role: data.role,
					assetId: data.asset,
				}
			);

			if (res.status == 201) {
				navigator.clipboard.writeText(data.password);
				form.reset({
					firstName: "",
					lastName: "",
					email: "",
					password: "",
					phoneNumber: "",
					jobTitle: "",
					department: "",
					contactMethod: "",
					role: "",
				});
				toast({
					title: "User Creation",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
							<code className="text-white text-wrap">
								{JSON.stringify(data, null, 2)}
							</code>
							Password has been copied to the clipboard!
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
	}

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchAssets = async () => {
				try {
					const res = await client.get(
						"http://localhost:8800/api/v1/assets"
					);
					setAssets(res.data);
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

			fetchAssets();
		}
	}, [isLoggedIn]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="gap-4">
				<div className="grid lg:grid-cols-2 gap-4">
					<Card className="h-max">
						<CardHeader>
							<CardTitle>General Information</CardTitle>
							<Separator />
						</CardHeader>
						<ScrollArea className="h-[calc(100vh-15rem)]">
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input
													placeholder="First Name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input
													placeholder="Last Name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="Email"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phoneNumber"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone Number</FormLabel>
											<FormControl>
												<Input
													placeholder="Phone Number"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="jobTitle"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Job Title</FormLabel>
											<FormControl>
												<Input
													placeholder="Job Title"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="department"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Department</FormLabel>
											<Select
												onValueChange={field.onChange}
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
															(item, idx) => (
																<SelectItem
																	value={
																		item.value
																	}
																	key={idx}
																	disabled={
																		item.label ===
																			"Global" ||
																		item.label ===
																			"Personal"
																	}
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
									name="contactMethod"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Contact Method
											</FormLabel>
											<Select
												onValueChange={field.onChange}
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
															(item, idx) => (
																<SelectItem
																	value={item}
																	key={idx}
																>
																	{item}
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
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Role</FormLabel>
											<Select
												onValueChange={field.onChange}
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
								<div className="flex items-center space-x-2">
									<Checkbox
										id="passwordgen"
										checked={autoPassword}
										onCheckedChange={() =>
											setAutoPassword(!autoPassword)
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
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem
											className={
												autoPassword ? "hidden" : "grid"
											}
										>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													placeholder="Password"
													{...field}
													defaultValue={genPassword}
												/>
											</FormControl>
											<FormDescription>
												Passwords must be between 8 and
												256 characters and use a
												combination of at least three of
												the following: uppercase
												letters, lowercase letters,
												numbers and symbols.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</ScrollArea>
					</Card>

					<Card className="h-max">
						<CardHeader>
							<CardTitle>Related Assets</CardTitle>
							<Separator />
						</CardHeader>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="asset"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>
											Assign this user an asset
										</FormLabel>
										<Popover
											onOpenChange={setOpen}
											open={open}
										>
											<FormControl>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														role="combobox"
														aria-expanded={open}
														className={cn(
															"justify-between truncate",
															!field.value &&
																"text-muted-foreground"
														)}
													>
														{field.value
															? assets?.find(
																	(asset) =>
																		asset.id ===
																		field.value
															  )?.name
															: "Select asset..."}
														<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</PopoverTrigger>
											</FormControl>
											<PopoverContent align="start">
												<Command>
													<CommandInput
														placeholder="Search asset..."
														className="h-9"
													/>
													<ScrollArea className="h-[20rem]">
														<CommandEmpty>
															No asset found.
														</CommandEmpty>
														<CommandGroup>
															{assets?.map(
																(asset) => (
																	<CommandItem
																		key={
																			asset.id
																		}
																		value={
																			asset?.name
																		}
																		onSelect={() => {
																			form.setValue(
																				"asset",
																				asset.id
																			);
																			setOpen(
																				false
																			);
																		}}
																	>
																		{
																			asset.name
																		}
																		<CheckIcon
																			className={cn(
																				"ml-auto h-4 w-4",
																				field.value ===
																					asset.id
																					? "opacity-100"
																					: "opacity-0"
																			)}
																		/>
																	</CommandItem>
																)
															)}
														</CommandGroup>
													</ScrollArea>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>
				</div>
				<Button className="my-4" type="submit">
					Create New
				</Button>
			</form>
		</Form>
	);
};

export default NewUser;
