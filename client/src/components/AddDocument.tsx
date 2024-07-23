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
import { toast } from "./ui/use-toast";
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
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { client } from "@/services/axiosClient";
import { DEPARTMENTS, docCategories, docTypes } from "@/utils/consts";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

interface IFileMeta {
	fileName: string;
	size: number;
	mimeType: string;
}

const documentFormSchema = z.object({
	docType: z.string({
		required_error: "Please select document type.",
	}),
	docCategory: z.string({
		required_error: "Please select document category.",
	}),
	department: z.string({
		required_error: "Document department is required.",
	}),
	document: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

const AddDocument: React.FunctionComponent = () => {
	const [fileMeta, setFileMeta] = React.useState<IFileMeta[]>([
		{
			fileName: "",
			size: 0,
			mimeType: "",
		},
	]);
	const [fileData, setFileData] = React.useState<string[]>([]);
	const [filePreviews, setFilePreviews] = React.useState<string[]>([]);
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

	const form = useForm<DocumentFormValues>({
		resolver: zodResolver(documentFormSchema),
		mode: "onChange",
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;

		if (files) {
			const previews: string[] = [];
			const buffers: string[] = [];
			const metas: IFileMeta[] = [];

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const reader = new FileReader();

				reader.onload = () => {
					buffers.push(reader.result as string);
					previews.push(reader.result as string);
					metas.push({
						fileName: file.name,
						size: file.size,
						mimeType: file.type,
					});
					setFileMeta(metas);

					if (previews.length === files.length) {
						setFilePreviews(previews);
						setFileData(buffers);
					}
				};

				reader.readAsDataURL(file);
			}
		}
	};

	async function onSubmit(data: DocumentFormValues) {
		if (isLoggedIn) {
			try {
				fileData && fileData.length > 1
					? await client.post(
							"http://localhost:8800/api/v1/documents/mulDoc",
							{
								fileMeta: fileMeta,
								buffer: fileData,
								docType: data.docType,
								docCategory: data.docCategory,
								department: data.department,
								userId: currentUser.id,
								modifierId: currentUser.id,
							}
					  )
					: await client.post(
							"http://localhost:8800/api/v1/documents",
							{
								buffer: fileData[0],
								fileMeta: fileMeta,
								docType: data.docType,
								docCategory: data.docCategory,
								department: data.department,
								userId: currentUser.id,
								modifierId: currentUser.id,
							}
					  );
				toast({
					title: "Add Documents",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
							<code className="text-white text-wrap">
								Document added successfully!
							</code>
						</pre>
					),
				});
				form.reset({
					docType: "",
					docCategory: "",
					department: "",
				});
				setFileData([]);
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
			<ScrollArea className="h-[calc(100vh-6rem)]">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="gap-4"
					>
						<Card>
							<CardHeader className="">
								<CardTitle>Add Document</CardTitle>
								<Separator />
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-3 gap-4">
									<FormField
										control={form.control}
										name="docType"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Document Type
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																className="placeholder:text-muted-foreground"
																placeholder="Select type..."
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{docTypes &&
															docTypes.map(
																(item, idx) => (
																	<SelectItem
																		value={
																			item.value
																		}
																		key={
																			idx
																		}
																	>
																		{
																			item.value
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
										name="docCategory"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Document Category
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																className="placeholder:text-muted-foreground"
																placeholder="Select category..."
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{docCategories &&
															docCategories.map(
																(item, idx) => (
																	<SelectItem
																		value={
																			item.value
																		}
																		key={
																			idx
																		}
																	>
																		{
																			item.value
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
										name="department"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Document Department
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
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
																(item, idx) => (
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
												<FormDescription>
													Select the department the
													document belongs to. If the
													document is global select
													global.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="document"
									render={() => (
										<FormItem>
											<FormLabel>Add Document</FormLabel>
											<FormControl>
												<Input
													type="file"
													accept="*"
													multiple
													onChange={handleFileChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Separator />
								{filePreviews &&
									filePreviews.map((_, idx) => (
										<div
											className="flex items-center gap-x-4"
											key={idx}
										>
											<p className="text-sm text-muted-foreground">
												{fileMeta[idx].fileName}
											</p>
											<p className="text-sm text-muted-foreground">
												File size:{" "}
												{(
													fileMeta[idx].size / 1000000
												).toFixed(3)}{" "}
												MB
											</p>
										</div>
									))}
								{filePreviews.length === 0 && (
									<p className="text-sm">No Uploads yet.</p>
								)}
							</CardContent>
						</Card>
						<Button className="my-4" type="submit">
							Add New
						</Button>
					</form>
				</Form>
			</ScrollArea>
		</div>
	);
};

export default AddDocument;
