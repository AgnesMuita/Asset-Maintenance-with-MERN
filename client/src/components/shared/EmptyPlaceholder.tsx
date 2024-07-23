import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useLocation } from "react-router-dom";
import NewCase from "../NewCase";
import NewArticle from "../NewArticle";
import NewAsset from "../NewAsset";
import NewUser from "../NewUser";
import NewAnnouncement from "../NewAnnouncement";
import NewNews from "../NewNews";
import NewEvent from "../NewEvent";
import {
	Bug,
	CalendarDays,
	Construction,
	Mails,
	Megaphone,
	Newspaper,
	Package2,
	Podcast,
	TrashIcon,
	Users2,
} from "lucide-react";
import AddDocument from "../AddDocument";
import NewLog from "../NewLog";

const EmptyPlaceholder = () => {
	const location = useLocation();
	const url = location.pathname.split("/")[1];
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "");

	return (
		<div
			className={
				url === "events" || url === "news"
					? "col-span-3 my-auto h-[450px] shrink-0 rounded-md border border-dashed"
					: "flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed"
			}
		>
			<div className="mx-auto flex max-w-[420px] h-full flex-col items-center justify-center text-center">
				{url === "cases" ? (
					<Bug />
				) : url === "knowledgearticles" ? (
					<Newspaper />
				) : url === "assets" ? (
					<Package2 />
				) : url === "users" ? (
					<Users2 />
				) : url === "announcements" ? (
					<Megaphone />
				) : url === "maintenance" ? (
					<Construction />
				) : url === "news" ? (
					<Mails />
				) : url === "events" ? (
					<CalendarDays />
				) : url === "trash" ? (
					<TrashIcon />
				) : (
					<Podcast />
				)}

				<h3 className="mt-4 text-lg font-semibold">
					No {url} {url === "trash" ? "here!" : "added"}
				</h3>
				{currentUser.role === "TECHNICIAN" ||
				currentUser.role === "ADMIN" ||
				currentUser.role === "SUPER_ADMIN" ||
				currentUser.role === "DEVELOPER" ||
				url === "documents" ||
				url === "cases" ? (
					<p className="mb-4 mt-2 text-sm text-muted-foreground">
						{url === "trash"
							? "Deleted items will appear here for 30 days.\n Items that have been in trash for more than 30 days will be deleted automatically."
							: `You have not added any ${url}. Add one below.`}
					</p>
				) : (
					<p className="mb-4 mt-2 text-sm text-muted-foreground">
						No {url} have been created yet.
					</p>
				)}
				<Sheet>
					<SheetTrigger
						asChild
						className={
							(currentUser.role === "TECHNICIAN" ||
								currentUser.role === "ADMIN" ||
								currentUser.role === "SUPER_ADMIN" ||
								currentUser.role === "DEVELOPER" ||
								url === "documents" ||
								url === "cases") &&
							url !== "trash"
								? "flex"
								: "hidden"
						}
					>
						<Button size="sm" className="relative">
							Add {url.substring(0, url.length - 1)}
						</Button>
					</SheetTrigger>
					<SheetContent className="w-[60rem] sm:max-w-none">
						<SheetHeader className="mb-4">
							<SheetTitle>
								Add {url.substring(0, url.length - 1)}
							</SheetTitle>
							<SheetDescription>
								Create a new {url.substring(0, url.length - 1)}{" "}
								to add it the list. Confirm details before
								submitting.
							</SheetDescription>
						</SheetHeader>
						{url === "cases" ? (
							<NewCase />
						) : url === "knowledgearticles" ? (
							<NewArticle />
						) : url === "assets" ? (
							<NewAsset />
						) : url === "users" ? (
							<NewUser />
						) : url === "maintenance" ? (
							<NewLog />
						) : url === "announcements" ? (
							<NewAnnouncement />
						) : url === "news" ? (
							<NewNews />
						) : url === "events" ? (
							<NewEvent />
						) : url === "documents" ? (
							<AddDocument />
						) : null}
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
};

export default EmptyPlaceholder;
