import React from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
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
import { CheckIcon, PackagePlusIcon } from "lucide-react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { client } from "@/services/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "./ui/use-toast";
import { ScrollArea } from "./ui/scroll-area";

const assignFormSchema = z.object({
	assetId: z.string({
		required_error: "Asset is required.",
	}),
});

type AssignFormValues = z.infer<typeof assignFormSchema>;

const CreateRelatedAsset = ({ id }: { id: string | undefined }) => {
	const [assets, setAssets] = React.useState<IAssetProps[]>();
	const [open, setOpen] = React.useState(false);
	const navigate = useNavigate();

	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

	const assignForm = useForm<AssignFormValues>({
		resolver: zodResolver(assignFormSchema),
		mode: "onChange",
	});

	async function onAssignSubmit(assignFormData: AssignFormValues) {
		try {
			await client.patch(`http://localhost:8800/api/v1/users/${id}`, {
				assetId: assignFormData.assetId,
			});
			toast({
				title: "You submitted your user with following values:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(assignFormData, null, 2)}
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
		} else {
			navigate("/signin");
		}
	}, [isLoggedIn, navigate]);

	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="h-4 w-4"
				>
					<PackagePlusIcon className="h-4 w-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<Form {...assignForm}>
					<form
						onSubmit={assignForm.handleSubmit(onAssignSubmit)}
						className="space-y-4"
						id="assignForm"
					>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Assign an asset to this user
							</AlertDialogTitle>
							<AlertDialogDescription>
								You can change the asset assigned to this user
								later.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<FormField
							control={assignForm.control}
							name="assetId"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Select Asset</FormLabel>
									<Popover onOpenChange={setOpen} open={open}>
										<FormControl>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													role="combobox"
													aria-expanded={open}
													className={cn(
														"justify-between truncate w-[29rem]",
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
																		assignForm.setValue(
																			"assetId",
																			asset.id
																		);
																		setOpen(
																			false
																		);
																	}}
																>
																	{asset.name}
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
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction type="submit" form="assignForm">
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default CreateRelatedAsset;
