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
import { ArrowLeftIcon, PlusIcon, SearchIcon } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import NewEvent from "@/components/NewEvent";
import { EventCard } from "@/components/EventCard";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmptyPlaceholder from "@/components/shared/EmptyPlaceholder";
import { toast } from "@/components/ui/use-toast";

const Events: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [events, setEvents] = React.useState<IEventProps[]>([]);
	const [searchQuery, setSearchQuery] = React.useState("");
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};
	const filteredItems = events.filter((event) =>
		event.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleRefresh = async () => {
		if (isLoggedIn) {
			try {
				const res = await client.get(
					"http://localhost:8800/api/v1/cases"
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
		} else {
			navigate("/signin");
		}
	};

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchAnnouncements = async () => {
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

			fetchAnnouncements();
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
							Events
						</h2>
						<p className="text-muted-foreground">
							View organization-wide Events and updates
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
								New Event
								<PlusIcon className="ml-2 h-4 w-4" />
							</Button>
						</SheetTrigger>
						<SheetContent className="w-[60rem] sm:max-w-none">
							<SheetHeader className="mb-4">
								<SheetTitle>Create a New Event</SheetTitle>
								<SheetDescription>
									Create an Event, Ensure all the details are
									correct before submitting it.
								</SheetDescription>
							</SheetHeader>
							<NewEvent />
						</SheetContent>
					</Sheet>
					<Button
						variant="outline"
						className=""
						onClick={handleRefresh}
					>
						Refresh <ReloadIcon className="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
			<div className="mt-4 ml-12">
				<div className="relative">
					<SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search events..."
						value={searchQuery}
						onChange={handleFilter}
						className="max-w-sm pl-8"
					/>
				</div>
			</div>
			<Separator className="my-6" />
			<ScrollArea className="h-[calc(100vh-14.7rem)]">
				<div className="grid grid-cols-3 2xl:grid-cols-4 gap-10 px-5">
					{filteredItems.length ? (
						filteredItems?.map((eventI) => (
							<EventCard eventI={eventI} key={eventI.id} />
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

export default Events;
