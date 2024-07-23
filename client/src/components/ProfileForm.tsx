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
} from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import React from "react";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { makeFallBack } from "@/utils/make.fallback";
import { PencilLineIcon } from "lucide-react";
import { Button } from "./ui/button";

const profileFormSchema = z.object({
	fullName: z.string(),
	email: z.string().email(),
	phone: z.string(),
	jobTitle: z.string(),
	department: z.string(),
	role: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
	const [user, setUser] = React.useState<IUserProps>();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		mode: "onChange",
		defaultValues: {
			fullName: user?.fullName,
			email: user?.email,
			phone: user?.phone,
			jobTitle: user?.jobTitle,
			department: user?.department,
			role: user?.role,
		},
	});

	function onSubmit(data: ProfileFormValues) {
		toast({
			title: "You submitted the following values:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
					<code className="text-white">
						{JSON.stringify(data, null, 2)}
					</code>
				</pre>
			),
		});
	}

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchUser = async () => {
				try {
					const res = await client.get(
						"http://localhost:8800/api/v1/users/profile"
					);
					setUser(res.data);
				} catch (error) {
					toast({
						title: "Encountered an error!",
						description: (
							<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
								<code className="text-white">
									{`Error - ${error}`}
								</code>
							</pre>
						),
					});
				}
			};

			fetchUser();
		}
	}, [isLoggedIn]);

	return (
		<Form {...form}>
			{user && (
				<ScrollArea className="h-[calc(100vh-17.1rem)]">
					<div className="flex justify-center py-4 relative group">
						<Avatar className="h-40 w-40">
							<AvatarImage
								src={
									user.avatar ??
									"https://github.com/shadcn.png"
								}
								alt="@shadcn"
							/>
							<AvatarFallback>
								{makeFallBack(user.firstName, user.lastName)}
							</AvatarFallback>
						</Avatar>
						<Button
							size="icon"
							className="absolute right-[16rem] bottom-[2rem] rounded-full hidden group-hover:flex"
						>
							<PencilLineIcon className="" />
						</Button>
					</div>

					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Full Name"
											{...field}
											disabled
											defaultValue={user.fullName}
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
									<Input
										placeholder="Email"
										{...field}
										disabled
										defaultValue={user.email}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<Input
										placeholder="Phone Number"
										{...field}
										disabled
										defaultValue={user.phone}
									/>
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
									<Input
										placeholder="Job Title"
										{...field}
										disabled
										defaultValue={user.jobTitle}
									/>
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
									<Input
										placeholder="Department"
										{...field}
										disabled
										defaultValue={user.department}
									/>
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
									<Input
										placeholder="Role"
										{...field}
										disabled
										defaultValue={user.role}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</ScrollArea>
			)}
		</Form>
	);
}
