import { client } from "@/services/axiosClient";
import { useAuthStore } from "@/stores/auth.store";
import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { toast } from "../ui/use-toast";

interface ICountPerMonth {
	month: string;
	count: number;
}

const OverviewChart = () => {
	const [data, setData] = React.useState<ICaseProps[]>([]);
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

	const processData = (): ICountPerMonth[] => {
		const currentYear = new Date().getFullYear();
		const caseCountPerMonth: { [key: string]: number } = {};

		const caseDataCY = data.filter(
			(caseI) => new Date(caseI.createdAt).getFullYear() === currentYear
		);

		// Initialize count for each month of the year
		for (let i = 0; i < 12; i++) {
			const month = new Date(currentYear, i).toLocaleString("default", {
				month: "short",
			});
			caseCountPerMonth[month] = 0;
		}

		caseDataCY.forEach((caseI) => {
			const createdAtMonth = new Date(caseI.createdAt).toLocaleString(
				"default",
				{ month: "short" }
			);
			caseCountPerMonth[createdAtMonth]++;
		});

		return Object.entries(caseCountPerMonth).map(([month, count]) => ({
			month,
			count,
		}));
	};

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
						setData(res.data);
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
						setData(res.data);
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
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={processData()}>
				<XAxis
					dataKey="month"
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<Bar
					dataKey="count"
					fill="currentColor"
					radius={[4, 4, 0, 0]}
					className="fill-primary"
				/>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default OverviewChart;
