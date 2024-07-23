import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import StatCard from "./shared/StatCard";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import OverviewChart from "./shared/OverviewChart";
import RecentCases from "./shared/RecentCases";
import { Button } from "./ui/button";
import { ArrowLeftIcon, DotIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { client } from "@/services/axiosClient";
import { useAuthStore } from "@/stores/auth.store";
import { ScrollArea } from "./ui/scroll-area";
import ImportantAnnouncements from "./ImportantAnnouncements";
import { useAnnouncement } from "@/context/announcement-provider";
import { toast } from "./ui/use-toast";

const Dashboard: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
	const { newAnnouncement } = useAnnouncement();

	const [cases, setCases] = React.useState([]);
	const [articles, setArticles] = React.useState([]);
	const [assets, setAssets] = React.useState([]);
	const [events, setEvents] = React.useState([]);
	const [news, setNews] = React.useState([]);
	const [logs, setLogs] = React.useState([]);
	const [documents, setDocuments] = React.useState([]);
	const [announcements, setAnnouncements] = React.useState<
		IAnnouncementProps[]
	>([]);
	const [users, setUsers] = React.useState([]);

	localStorage.setItem("cases", JSON.stringify(cases.length));
	localStorage.setItem("articles", JSON.stringify(articles.length));
	localStorage.setItem("assets", JSON.stringify(assets.length));
	localStorage.setItem("events", JSON.stringify(events.length));
	localStorage.setItem("news", JSON.stringify(news.length));
	localStorage.setItem("logs", JSON.stringify(logs.length));
	localStorage.setItem("announcements", JSON.stringify(announcements.length));
	localStorage.setItem("documents", JSON.stringify(documents.length));
	localStorage.setItem("users", JSON.stringify(users.length));

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

				const fetchMaintenanceLogs = async () => {
					try {
						const res = await client.get(
							`http://localhost:8800/api/v1/maintenance`
						);

						setLogs(res.data);
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

				const fetchUsers = async () => {
					try {
						const res = await client.get(
							`http://localhost:8800/api/v1/users`
						);

						setUsers(Object.values(res.data));
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
				fetchAssets();
				fetchMaintenanceLogs();
				fetchUsers();
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

				const fetchUserMaintenanceLogs = async () => {
					try {
						const res = await client.get(
							`http://localhost:8800/api/v1/maintenance/user/${currentUser.id}`
						);
						setLogs(res.data);
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
				fetchUserMaintenanceLogs();
			}

			const fetchArticles = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/karticles`
					);

					setArticles(res.data);
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

			const fetchEvents = async () => {
				try {
					const res = await client.get(
						"http://localhost:8800/api/v1/events"
					);

					setEvents(res.data);
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

			const fetchNews = async () => {
				try {
					const res = await client.get(
						"http://localhost:8800/api/v1/news"
					);

					setNews(res.data);
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

			const fetchAnnouncements = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/announcements`
					);

					setAnnouncements(res.data);
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

			const fetchDocuments = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/documents?department=${currentUser.department}&userId=${currentUser.id}`
					);

					setDocuments(res.data);
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

			fetchNews();
			fetchEvents();
			fetchArticles();
			fetchDocuments();
			fetchAnnouncements();
		}
	}, [isLoggedIn, currentUser.id, currentUser.role, currentUser.department]);

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-x-4">
				<Button variant="ghost" size="icon">
					<ArrowLeftIcon
						onClick={() => navigate(-1)}
						className="cursor-pointer"
					/>
				</Button>
				<h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
			</div>
			<ScrollArea className="h-[calc(100vh-11rem)]">
				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="analytics" disabled>
							Analytics
						</TabsTrigger>
						<TabsTrigger value="reports" disabled>
							Reports
						</TabsTrigger>
						<TabsTrigger value="notifications" className="relative">
							Important Announcements
							{newAnnouncement && (
								<DotIcon
									className="w-6 h-6 absolute -top-1 -right-1 animate-pulse"
									color="red"
								/>
							)}
						</TabsTrigger>
					</TabsList>
					<TabsContent value="overview" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<StatCard />
						</div>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
							<Card className="col-span-4">
								<CardHeader>
									<CardTitle>
										Overview - Cases created per month{" "}
										{new Date().getFullYear()}
									</CardTitle>
								</CardHeader>
								<CardContent className="pl-2">
									<OverviewChart />
								</CardContent>
							</Card>
							<Card className="col-span-3">
								<CardHeader>
									<CardTitle>Recent Cases</CardTitle>
									{currentUser.role === "TECHNICIAN" ||
									currentUser.role === "ADMIN" ||
									currentUser.role === "SUPER_ADMIN" ||
									currentUser.role === "DEVELOPER" ? (
										<CardDescription>
											You closed 265 cases this month.
										</CardDescription>
									) : (
										<CardDescription>
											You created {cases.length} cases
											this month.
										</CardDescription>
									)}
								</CardHeader>
								<CardContent>
									<RecentCases />
								</CardContent>
							</Card>
						</div>
					</TabsContent>
					<TabsContent value="notifications">
						<ImportantAnnouncements />
					</TabsContent>
				</Tabs>
			</ScrollArea>
		</div>
	);
};

export default Dashboard;
