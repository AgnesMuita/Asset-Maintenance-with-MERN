import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { client } from "@/services/axiosClient";
import { DarkModeToggle } from "./shared/DarkModeToggle";
import { BellIcon, MegaphoneIcon, ZapIcon } from "lucide-react";
import { makeFallBack } from "@/utils/make.fallback";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "./ui/use-toast";

const components: { title: string; href: string; description: string }[] = [
	{
		title: "Alert Dialog",
		href: "/docs/primitives/alert-dialog",
		description:
			"A modal dialog that interrupts the user with important content and expects a response.",
	},
	{
		title: "Hover Card",
		href: "/docs/primitives/hover-card",
		description:
			"For sighted users to preview content available behind a link.",
	},
	{
		title: "Progress",
		href: "/docs/primitives/progress",
		description:
			"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
	},
	{
		title: "Scroll-area",
		href: "/docs/primitives/scroll-area",
		description: "Visually or semantically separates content.",
	},
	{
		title: "Tabs",
		href: "/docs/primitives/tabs",
		description:
			"A set of layered sections of content—known as tab panels—that are displayed one at a time.",
	},
	{
		title: "Tooltip",
		href: "/docs/primitives/tooltip",
		description:
			"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
	},
];

const Header: React.FunctionComponent = () => {
	const navigate = useNavigate();
	const logout = useAuthStore((state) => state.logout);
	const [user, setUser] = useState<IUserProps>();

	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

	const handleLogout = () => {
		logout();
		navigate("/signin");
	};

	useEffect(() => {
		if (isLoggedIn) {
			const fetchUser = async () => {
				try {
					const res = await client.get(
						"http://localhost:8800/api/v1/users/profile"
					);
					setUser(res.data);
				} catch (error) {
					toast({
						title: "Encountered an error!",
						description: (
							<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
								<code className="text-white">
									{`Error - ${error}`}
								</code>
							</pre>
						),
					});
				}
			};

			fetchUser();
		}
	}, [isLoggedIn]);

	return (
		<div className="flex items-center justify-between px-2 xl:py-1 2xl:py-2 border-b print:hidden">
			<div className="flex items-center gap-x-[15rem]">
				<p className="text-2xl font-bold">Deer</p>
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuTrigger>
								Getting started
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
									<li className="row-span-3">
										<NavigationMenuLink asChild>
											<a
												className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
												href="/"
											>
												<div className="mb-2 mt-4 text-lg font-medium">
													shadcn/ui
												</div>
												<p className="text-sm leading-tight text-muted-foreground">
													Beautifully designed
													components built with Radix
													UI and Tailwind CSS.
												</p>
											</a>
										</NavigationMenuLink>
									</li>
									<ListItem href="/docs" title="Introduction">
										Re-usable components built using Radix
										UI and Tailwind CSS.
									</ListItem>
									<ListItem
										href="/docs/installation"
										title="Installation"
									>
										How to install dependencies and
										structure your app.
									</ListItem>
									<ListItem
										href="/docs/primitives/typography"
										title="Typography"
									>
										Styles for headings, paragraphs,
										lists...etc
									</ListItem>
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuTrigger>
								Components
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
									{components.map((component) => (
										<ListItem
											key={component.title}
											title={component.title}
											href={component.href}
										>
											{component.description}
										</ListItem>
									))}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link to="#">
								<NavigationMenuLink
									className={navigationMenuTriggerStyle()}
								>
									Documentation
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			{/* user Avatar */}
			{user && (
				<div className="flex items-center gap-x-2">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Button variant="ghost" size="icon">
									<ZapIcon className="h-[1.2rem] w-[1.2rem]" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Important Announcements</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Button variant="ghost" size="icon">
									<MegaphoneIcon className="h-[1.2rem] w-[1.2rem]" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Announcements</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Button variant="ghost" size="icon">
									<BellIcon className="h-[1.2rem] w-[1.2rem]" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Alerts</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<DarkModeToggle />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="relative h-8 w-8 rounded-full"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={
											user.avatar ??
											"https://github.com/shadcn.png"
										}
										alt="@shadcn"
									/>
									<AvatarFallback>
										{makeFallBack(
											user.firstName,
											user.lastName
										)}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-56"
							align="end"
							forceMount
						>
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium leading-none">
										{user.fullName}
									</p>
									<p className="text-xs leading-none text-muted-foreground">
										{user.email}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem
									onClick={() => navigate("/settings")}
								>
									Profile
									<DropdownMenuShortcut>
										⇧⌘P
									</DropdownMenuShortcut>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => navigate("/settings")}
								>
									Settings
									<DropdownMenuShortcut>
										⌘S
									</DropdownMenuShortcut>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogout}>
								Log out
								<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)}
		</div>
	);
};

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">
						{title}
					</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";

export default Header;
