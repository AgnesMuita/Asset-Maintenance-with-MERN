import React from "react";
import { toast } from "./ui/use-toast";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import * as XLSX from "xlsx";
import { Button } from "./ui/button";

interface ExcelRow {
	[key: string]: string | number;
}

const ImportData = () => {
	const [excelData, setExcelData] = React.useState<ExcelRow[] | null>(null);
	const [currFile, setCurrFile] = React.useState<File>();
	const navigate = useNavigate();
	const location = useLocation();
	const url = location.pathname.split("/")[1];
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			setCurrFile(file);
			const reader = new FileReader();

			reader.onload = (e) => {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: "array" });
				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];

				const jsonData = XLSX.utils.sheet_to_json(worksheet, {
					header: 2,
				});

				const typedData: ExcelRow[] = jsonData as ExcelRow[];
				setExcelData(typedData);
			};
			reader.readAsArrayBuffer(file);
		}
	};

	async function onSubmit() {
		if (isLoggedIn) {
			try {
				url === "assets" &&
					(await client.post(
						"http://localhost:8800/api/v1/assets/mulAssets",
						{
							data: excelData,
							createdById: currentUser.id,
						}
					));
				url === "users" &&
					(await client.post(
						"http://localhost:8800/api/v1/auth/mulUsers",
						{
							data: excelData,
							createdById: currentUser.id,
						}
					));
				toast({
					title: "You submitted your template with following values:",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
							<code className="text-white">
								Data Imported Successfully!
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
		} else {
			navigate("/signin");
		}
	}

	return (
		<div className="space-y-4">
			<Input type="file" accept=".xlsx" onChange={handleFileChange} />
			<Separator />
			{currFile && (
				<div className="flex items-center gap-x-4">
					<p className="text-sm text-muted-foreground">
						{currFile.name}
					</p>
					<p className="text-sm text-muted-foreground">
						File size: {(currFile.size / 1000000).toFixed(3)} MB
					</p>
				</div>
			)}
			{!currFile && <p className="text-sm">No Uploads yet.</p>}

			<Button className="w-full" onClick={onSubmit}>
				Import Data
			</Button>
		</div>
	);
};

export default ImportData;
