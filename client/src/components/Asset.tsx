import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
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
	DEPARTMENTS,
	assetConditions,
	assetStatus,
	categories,
	colors,
	locations,
	manufacturers,
} from "@/utils/consts";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { client } from "@/services/axiosClient";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { LucideSave } from "lucide-react";
import React from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate } from "react-router-dom";

const assetFormSchema = z.object({
	tag: z.string({
		required_error: "Case Status is required.",
	}),
	deviceName: z.string().optional(),
	name: z.string({
		required_error: "Asset Name is required.",
	}),
	category: z.string({
		required_error: "Category is required.",
	}),
	owner: z.string().optional(),
	location: z.string({
		required_error: "Location is required.",
	}),
	color: z.string({
		required_error: "Asset Color is required.",
	}),
	manufacturer: z.string({
		required_error: "Manufacturer is required.",
	}),
	serialNo: z.string({
		required_error: "Asset serial no is required.",
	}),
	model: z.string({
		required_error: "Asset model is required.",
	}),
	condition: z.string().optional(),
	issuedBy: z.string().optional(),
	department: z.string().optional(),
	assetStatus: z.string().optional(),
	accessories: z.string().optional(),
	batterySNo: z.string().optional(),
	adaptorRatings: z.string().optional(),
	specifications: z.string().optional(),
	conditionalNotes: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

const Asset = ({
	asset,
	id,
}: {
	asset: IAssetProps | undefined;
	id: string | undefined;
}) => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const navigate = useNavigate();

	const assetForm = useForm<AssetFormValues>({
		resolver: zodResolver(assetFormSchema),
		mode: "onChange",
		defaultValues: {
			tag: asset?.tag,
			name: asset?.name,
			deviceName: asset?.deviceName,
			category: asset?.category,
			owner: asset?.user?.fullName,
			location: asset?.location,
			color: asset?.color,
			manufacturer: asset?.manufacturer,
			serialNo: asset?.serialNo,
			model: asset?.model,
			condition: asset?.condition,
			department: asset?.department,
			assetStatus: asset?.assetStatus,
			accessories: asset?.accessories,
			batterySNo: asset?.batterySNo,
			adaptorRatings: asset?.adaptorRatings,
			specifications: asset?.specification,
			conditionalNotes: asset?.conditionalNotes,
		},
	});

	async function onAssetSubmit(assetFormData: AssetFormValues) {
		try {
			await client.patch(`http://localhost:8800/api/v1/assets/${id}`, {
				tag: assetFormData.tag,
				name: assetFormData.name,
				deviceName: assetFormData.deviceName,
				color: assetFormData.color,
				category: assetFormData.category,
				condition: assetFormData.condition,
				manufacturer: assetFormData.manufacturer,
				model: assetFormData.model,
				serialNo: assetFormData.serialNo,
				location: assetFormData.location,
				accessories: assetFormData.accessories,
				batterySNo: assetFormData.batterySNo,
				adaptorRatings: assetFormData.adaptorRatings,
				department: assetFormData.department,
				assetStatus: assetFormData.assetStatus,
				specification: assetFormData.specifications,
				conditionalNotes: assetFormData.conditionalNotes,
			});
			toast({
				title: "Asset Update",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
						<code className="text-white text-wrap">
							{JSON.stringify(assetFormData, null, 2)}
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
			if (asset) {
				assetForm.reset({
					tag: asset.tag,
					name: asset.name,
					deviceName: asset.deviceName,
					category: asset.category,
					owner: asset.user?.fullName,
					location: asset.location,
					color: asset.color,
					manufacturer: asset.manufacturer,
					serialNo: asset.serialNo,
					model: asset.model,
					condition: asset.condition,
					department: asset.department,
					assetStatus: asset.assetStatus,
					accessories: asset.accessories,
					batterySNo: asset.batterySNo,
					adaptorRatings: asset.adaptorRatings,
					specifications: asset.specification,
					conditionalNotes: asset.conditionalNotes,
				});
			}
		} else {
			navigate("/signin");
		}
	}, [isLoggedIn, navigate, assetForm, asset]);

	return (
		<>
			{asset && (
				<>
					<Form {...assetForm}>
						<form
							onSubmit={assetForm.handleSubmit(onAssetSubmit)}
							id="assetForm"
							className="grid lg:grid-cols-3 gap-4"
						>
							<Card>
								<CardHeader>
									<CardTitle>General Information</CardTitle>
									<Separator />
								</CardHeader>
								<ScrollArea className="h-[calc(100vh-24.5rem)]">
									<CardContent className="space-y-4">
										<FormField
											control={assetForm.control}
											name="tag"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Tag No
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Tag No"
															{...field}
															disabled
															defaultValue={
																asset?.tag
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										{asset?.category === "Computer" && (
											<FormField
												control={assetForm.control}
												name="deviceName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Device Name
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Device Name"
																{...field}
																defaultValue={
																	asset?.deviceName
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}
										<FormField
											control={assetForm.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Asset Name
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Asset Name"
															{...field}
															defaultValue={
																asset?.name
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={assetForm.control}
											name="category"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Category
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															asset?.category
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
															{categories &&
																categories.map(
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
											control={assetForm.control}
											name="owner"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Current User
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Owner"
															{...field}
															disabled
															defaultValue={
																asset?.user
																	?.fullName
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={assetForm.control}
											name="location"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Functional Location
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															asset?.location
														}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	className="placeholder:text-muted-foreground"
																	placeholder="Select location..."
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{locations &&
																locations.map(
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
											control={assetForm.control}
											name="color"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Color</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															asset?.color
														}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	className="placeholder:text-muted-foreground"
																	placeholder="Select color..."
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{colors &&
																colors.map(
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
											control={assetForm.control}
											name="manufacturer"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Manufacturer
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															asset?.manufacturer
														}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	className="placeholder:text-muted-foreground"
																	placeholder="Select manufacturer..."
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{manufacturers &&
																manufacturers.map(
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
									</CardContent>
								</ScrollArea>
							</Card>

							<Card className="h-max">
								<CardHeader>
									<CardTitle>Other</CardTitle>
									<Separator />
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={assetForm.control}
										name="serialNo"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Serial No</FormLabel>
												<FormControl>
													<Input
														placeholder="Serial No"
														{...field}
														defaultValue={
															asset?.serialNo
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={assetForm.control}
										name="model"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Model No</FormLabel>
												<FormControl>
													<Input
														placeholder="Model No"
														{...field}
														defaultValue={
															asset?.model
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={assetForm.control}
										name="condition"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Condition</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={
														asset?.condition
													}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																className="placeholder:text-muted-foreground"
																placeholder="Select condition..."
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{assetConditions &&
															assetConditions.map(
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
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={assetForm.control}
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
														asset?.department
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
										control={assetForm.control}
										name="assetStatus"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Asset Status
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={
														asset?.assetStatus
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
														{assetStatus &&
															assetStatus.map(
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
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={assetForm.control}
										name="issuedBy"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Issued By</FormLabel>
												<FormControl>
													<Input
														placeholder="Issued By"
														{...field}
														disabled
														defaultValue={
															asset?.issuedBy
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{asset.category === "Computer" && (
								<Card className="h-[calc(100vh-20rem)]">
									<CardHeader>
										<CardTitle>Notes</CardTitle>
										<Separator />
									</CardHeader>
									<ScrollArea className="h-[calc(100vh-24.5rem)]">
										<CardContent className="space-y-4">
											<FormField
												control={assetForm.control}
												name="specifications"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Specifications
														</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Specifications"
																{...field}
																rows={6}
																defaultValue={
																	asset?.specification
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={assetForm.control}
												name="accessories"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Accessories
														</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Accessories"
																{...field}
																rows={4}
																defaultValue={
																	asset?.accessories
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={assetForm.control}
												name="batterySNo"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Battery S/No
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Battery S/No"
																{...field}
																defaultValue={
																	asset?.batterySNo
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={assetForm.control}
												name="adaptorRatings"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Adaptor Ratings
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Adaptor Ratings"
																{...field}
																defaultValue={
																	asset?.adaptorRatings
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={assetForm.control}
												name="conditionalNotes"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Conditional Notes
														</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Conditional Notes"
																{...field}
																rows={6}
																defaultValue={
																	asset?.conditionalNotes
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</CardContent>
									</ScrollArea>
								</Card>
							)}
							{/* Save/update asset dialog */}
							<AlertDialog>
								<AlertDialogTrigger
									className="ml-auto col-span-3"
									asChild
								>
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
											This action cannot be undone.
											Updating this asset means changing
											the previous content and cannot be
											gotten back.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											type="submit"
											form="assetForm"
										>
											Continue
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</form>
					</Form>
				</>
			)}
		</>
	);
};

export default Asset;
