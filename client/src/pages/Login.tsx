/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, useActionData, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { login } from "@/services/services";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { client } from "@/services/axiosClient";
import AccountAccess from "@/components/AccountAccess";
import ForgotPassword from "@/components/ForgotPassword";
import logo from "../assets/logo.png";

interface SigninProps {}

export const action = async ({ request }: any) => {
	try {
		const formData = await request.formData();
		const email = formData.get("email");
		const password = formData.get("password");
		const response = await login({ email, password });
		const { accessToken, refreshToken } = response.data;

		return { tokens: { accessToken, refreshToken }, error: null };
	} catch (error: any) {
		return {
			error: error?.response?.data || error.message,
			tokens: null,
		};
	}
};

const Login: React.FC<SigninProps> = () => {
	const navigate = useNavigate();
	const actionData: any = useActionData();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const login = useAuthStore((state) => state.login);

	React.useEffect(() => {
		if (actionData?.tokens) {
			login(actionData.tokens);
			navigate("/");
		}

		if (isLoggedIn) {
			const fetchUser = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/users/profile`
					);
					if (res.data) {
						localStorage.setItem(
							"currentUser",
							JSON.stringify(res.data)
						);
					} else {
						localStorage.removeItem("currentUser");
					}
				} catch (error: any) {
					console.log(error);
				}
			};
			fetchUser();
			navigate("/");
		}

		if (actionData?.error) {
			const timer = setTimeout(() => {
				actionData.error = "";
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [isLoggedIn, login, navigate, actionData]);

	return (
		<>
			<div className="grid w-full h-screen place-items-center">
				<div className="flex flex-col gap-y-10">
					{actionData?.error && (
						<Alert
							variant="destructive"
							className="min-w-[30rem] max-w-[50rem] mx-auto place-self-center"
						>
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Encountered an error!</AlertTitle>
							<AlertDescription className="font-semibold text-xl">
								{actionData?.error}
							</AlertDescription>
						</Alert>
					)}
					<Form method="post" className="mx-auto">
						<Card className="w-[450px]">
							<CardHeader>
								<img src={logo} alt="logo" className="hidden" />
								<CardTitle className="text-2xl">
									Deer LTD
								</CardTitle>
								<CardDescription className="text-xl">
									Sign In
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid w-full items-center gap-4">
									<div className="flex flex-col space-y-1.5">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											name="email"
											type="email"
											required
											placeholder="m@example.com"
										/>
									</div>
									<div className="flex flex-col space-y-1.5">
										<Label htmlFor="password">
											Password
										</Label>
										<Input
											id="password"
											name="password"
											type="password"
											required
										/>
									</div>
									<div className="flex flex-col items-start">
										<AlertDialog>
											<AlertDialogTrigger
												className="hover:underline text-sm"
												type="button"
											>
												Can't access your account?
											</AlertDialogTrigger>
											<AccountAccess />
										</AlertDialog>

										<AlertDialog>
											<AlertDialogTrigger
												className="hover:underline text-sm"
												type="button"
											>
												Forgot Password?
											</AlertDialogTrigger>
											<ForgotPassword />
										</AlertDialog>
									</div>
								</div>
							</CardContent>
							<CardFooter className="flex flex-row-reverse">
								<Button className="px-8" type="submit">
									Login
								</Button>
							</CardFooter>
						</Card>
					</Form>
				</div>
			</div>
		</>
	);
};

export default Login;
