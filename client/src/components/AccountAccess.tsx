import React from "react";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";
import { Textarea } from "./ui/textarea";
// import { Resend } from 'resend'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "./ui/use-toast";
import { Input } from "./ui/input";
// import AccessAccount from '@/emails/AccessAccount'
import { client } from "@/services/axiosClient";

// const resend = new Resend(process.env.REACT_APP_RESEND_KEY)

const accountFormSchema = z.object({
	email: z.string({
		required_error: "Email is required.",
	}),
	problem: z.string({
		required_error: "Problem Description is required.",
	}),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const AccountAccess: React.FunctionComponent = () => {
	const [sender, setSender] = React.useState<IUserProps>();
	const [userEmail, setUserEmail] = React.useState("");

	const accountForm = useForm<AccountFormValues>({
		resolver: zodResolver(accountFormSchema),
		mode: "onChange",
	});

	async function onAccountSubmit(accountFormData: AccountFormValues) {
		try {
			const res = await client.get(
				`http://localhost:8800/api/v1/users/email/${userEmail}`
			);

			if (res.status === 200) {
				setSender(res.data);
			}

			if (sender) {
	
			}

			setUserEmail(accountFormData.email);

			toast({
				title: "You submitted your form with following values:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(accountFormData, null, 2)}
						</code>
					</pre>
				),
			});

			accountForm.reset({
				email: "",
				problem: "",
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
			<Form {...accountForm}>
				<form
					onSubmit={accountForm.handleSubmit(onAccountSubmit)}
					id="accountForm"
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className="font-semibold text-xl tracking-tight">
								Account Help
							</AlertDialogTitle>
							<AlertDialogDescription className="space-y-4">
								<FormField
									control={accountForm.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Your email</FormLabel>
											<FormControl>
												<Input
													placeholder="m@example.com"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={accountForm.control}
									name="problem"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Please describe your problem
											</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe your issue..."
													{...field}
													rows={10}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction type="submit" form="accountForm">
								Send
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</form>
			</Form>
		</div>
	);
};

export default AccountAccess;
