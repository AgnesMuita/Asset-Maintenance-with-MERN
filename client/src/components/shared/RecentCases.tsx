import React from "react";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "../ui/use-toast";
import PriorityBadge from "./PriorityBadge";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const RecentCases: React.FunctionComponent = () => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

	const [cases, setCases] = React.useState<ICaseProps[]>();

	React.useEffect(() => {
		if (isLoggedIn) {
			if (
				currentUser.role === "TECHNICIAN" ||
				currentUser.role === "ADMIN" ||
				currentUser.role === "SUPER_ADMIN" ||
				currentUser.role === "DEVELOPER"
			) {
				const fetchCases = async () => {
					try {
						const res = await client.get(
							"http://localhost:8800/api/v1/cases"
						);
						setCases(res.data);
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
				fetchCases();
			} else {
				// fetch user cases
				const fetchUserCases = async () => {
					try {
						const res = await client.get(
							`http://localhost:8800/api/v1/cases/user/${currentUser.id}`
						);
						setCases(res.data);
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
				fetchUserCases();
			}
		}
	}, [isLoggedIn, currentUser.id, currentUser.role]);

	return (
		<>
			<Table>
				<TableCaption>A list of recent cases.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Case Number</TableHead>
						<TableHead>Case Title</TableHead>
						<TableHead>Priority</TableHead>
						<TableHead>Created On</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{cases &&
						cases.slice(0, 7).map((caseI, idx) => (
							<TableRow key={idx}>
								<TableCell className="text-xs truncate">
									<Link
										to={`/cases/case-details/${caseI.id}`}
										className="hover:underline text-blue-500"
									>
										{caseI.caseNumber}
									</Link>
								</TableCell>
								<TableCell className="text-xs truncate max-w-[10rem] 2xl:max-w-[15rem]">
									{caseI.caseTitle}
								</TableCell>
								<TableCell>
									<PriorityBadge priority={caseI.priority} />
								</TableCell>
								<TableCell className="text-xs text-muted-foreground">
									{format(caseI.createdAt, "dd/MM/yyyy p")}
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</>
	);
};

export default RecentCases;
