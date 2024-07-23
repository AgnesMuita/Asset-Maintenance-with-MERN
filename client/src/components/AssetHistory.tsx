import { Card } from "./ui/card";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { DownloadIcon, EyeIcon } from "lucide-react";
import { client } from "@/services/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { saveAs } from "file-saver";
import ViewDocument from "./ViewDocument";
import { toast } from "./ui/use-toast";
import AssetConditionBadge from "./shared/AssetConditionBadge";
import AssetStatusBadge from "./shared/AssetStatusBadge";

const AssetHistory = ({ asset }: { asset: IAssetProps | undefined }) => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

	const handleDownload = async (id: string) => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					`http://localhost:8800/api/v1/allocationforms/${id}`
				);
				const resDown = await client.get(
					`http://localhost:8800/api/v1/allocationforms/download/${id}`
				);

				const dataURI = resDown.data.data;

				const byteNumbers = atob(dataURI.split(",")[1]);
				const arrayBuffer = new ArrayBuffer(byteNumbers.length);
				const uintArray = new Uint8Array(arrayBuffer);

				for (let i = 0; i < byteNumbers.length; i++) {
					uintArray[i] = byteNumbers.charCodeAt(i);
				}

				const blob = new Blob([arrayBuffer], {
					type: "application/pdf",
				});
				saveAs(
					blob,
					res.data.fileMeta[0]?.Title ??
						"Allocation Form" +
							"-" +
							format(new Date(), "yyyyMMddHHmmssSSS")
				);
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

	const handleViewDocument = (id: string) => {
		return <ViewDocument id={id} page="allocationforms" />;
	};

	return (
		<div className="grid lg:grid-cols-1 gap-4">
			<Card className="">
				<ScrollArea className="h-[calc(100vh-16rem)]">
					<Table className="px-4">
						<TableCaption>Asset Issuance History</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>Issued On</TableHead>
								<TableHead>User</TableHead>
								<TableHead>Location</TableHead>
								<TableHead>Asset Condition</TableHead>
								<TableHead>Asset Status</TableHead>
								<TableHead>Alloc Form</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{asset?.history.map((hist) => (
								<TableRow>
									<TableCell>
										{hist.issuedAt &&
											format(
												hist.issuedAt,
												"dd/MM/yyy p"
											)}
									</TableCell>
									<TableCell>
										{hist?.user?.fullName}
									</TableCell>
									<TableCell>{hist?.assetLocation}</TableCell>
									<TableCell>
										<AssetConditionBadge
											condition={hist?.assetCondtion}
										/>
									</TableCell>
									<TableCell>
										<AssetStatusBadge
											assetStatus={hist?.assetStatus}
										/>
									</TableCell>
									{hist.allocationForm &&
										asset.category === "Computer" && (
											<TableCell className="flex items-center py-2">
												<Button
													size="sm"
													variant="secondary"
													className="rounded-r-none"
													onClick={() =>
														handleDownload(
															hist.allocationForm
																.id
														)
													}
												>
													<DownloadIcon className="mr-2 h-4 w-4" />
													Allocation Form
												</Button>
												<Button
													variant="secondary"
													size="sm"
													className="rounded-l-none border-l border-l-muted-foreground"
													onClick={() =>
														handleViewDocument(
															hist.allocationForm
																.id
														)
													}
												>
													<EyeIcon className="w-4 h-4" />
												</Button>
											</TableCell>
										)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ScrollArea>
			</Card>
		</div>
	);
};

export default AssetHistory;
