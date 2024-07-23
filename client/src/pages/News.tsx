import React from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusIcon, SearchIcon } from "lucide-react";
import { ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import NewNews from "@/components/NewNews";
import NewsCard from "@/components/NewsCard";
import { useNavigate } from "react-router-dom";
import { client } from "@/services/axiosClient";
import { useAuthStore } from "@/stores/auth.store";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmptyPlaceholder from "@/components/shared/EmptyPlaceholder";
import { toast } from "@/components/ui/use-toast";

const News: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [news, setNews] = React.useState<INewsProps[]>([]);
	const [searchQuery, setSearchQuery] = React.useState("");
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};
	const filteredItems = news.filter((article) =>
		article.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	React.useEffect(() => {
		if (isLoggedIn) {
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

			fetchNews();
		}
	}, [isLoggedIn]);

	return (
		<div className="p-2 border-l w-full">
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-x-4">
					<Button variant="ghost" size="icon">
						<ArrowLeftIcon
							onClick={() => navigate(-1)}
							className="cursor-pointer"
						/>
					</Button>
					<div className="space-y-1">
						<h2 className="text-3xl font-bold tracking-tight">
							News
						</h2>
						<p className="text-muted-foreground">
							View organization-wide News and updates
						</p>
					</div>
				</div>
				<div className="flex items-center gap-x-2 ml-auto">
					<Sheet>
						<SheetTrigger>
							<Button
								variant="outline"
								className={
									currentUser.role === "TECHNICIAN" ||
									currentUser.role === "ADMIN" ||
									currentUser.role === "SUPER_ADMIN" ||
									currentUser.role === "DEVELOPER"
										? "flex"
										: "hidden"
								}
							>
								New Article
								<PlusIcon className="ml-2 h-4 w-4" />
							</Button>
						</SheetTrigger>
						<SheetContent className="w-[60rem] sm:max-w-none">
							<SheetHeader className="mb-4">
								<SheetTitle>Create a New Article</SheetTitle>
								<SheetDescription>
									Create a News Article, Ensure all the
									details are correct before submitting it.
								</SheetDescription>
							</SheetHeader>
							<NewNews />
						</SheetContent>
					</Sheet>
					<Button variant="outline" className="">
						Refresh <ReloadIcon className="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
			<div className="mt-4 ml-12">
				<div className="relative">
					<SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search news..."
						value={searchQuery}
						onChange={handleFilter}
						className="max-w-sm pl-8"
					/>
				</div>
			</div>
			<Separator className="my-6" />
			<ScrollArea className="h-[calc(100vh-14.7rem)]">
				<div className="grid grid-cols-2 2xl:grid-cols-3 gap-10 px-5">
					{filteredItems.length ? (
						filteredItems.map((article) => (
							<NewsCard article={article} key={article.id} />
						))
					) : filteredItems.length === 0 ? (
						<EmptyPlaceholder />
					) : (
						<Loader />
					)}
				</div>
			</ScrollArea>
		</div>
	);
};

export default News;
