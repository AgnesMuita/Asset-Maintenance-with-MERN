import React from "react";
import { Separator } from "./ui/separator";
import { Nav } from "./shared/Nav";
import {
  BookOpen,
  Bug,
  CalendarDays,
  Construction,
  LayoutDashboard,
  Mails,
  Megaphone,
  Newspaper,
  Package2,
  Settings,
  TrashIcon,
  Users2,
} from "lucide-react";
import { AccountSwitcher } from "./shared/AccountSwitcher";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface NavProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
}

const Navbar = ({ accounts }: NavProps) => {
  const location = useLocation();
  const url = location.pathname.split("/")[1];
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const cases = JSON.parse(localStorage.getItem("cases") || "{}");
  const articles = JSON.parse(localStorage.getItem("articles") || "{}");
  const assets = JSON.parse(localStorage.getItem("assets") || "{}");
  const events = JSON.parse(localStorage.getItem("events") || "{}");
  const news = JSON.parse(localStorage.getItem("news") || "{}");
  const logs = JSON.parse(localStorage.getItem("logs") || "{}");
  const announcements = JSON.parse(localStorage.getItem("announcements") || "{}");
  const documents = JSON.parse(localStorage.getItem("documents") || "{}");
  const users = JSON.parse(localStorage.getItem("users") || "{}");

  return (
    <div className="flex flex-col justify-between w-[14rem] 2xl:w-[18rem] shrink-0 h-[calc(100vh-3.95rem)] px-2 print:hidden">
      <div>
        <div className={cn("flex h-[52px] items-center justify-center")}>
          <AccountSwitcher accounts={accounts} />
        </div>
        <Separator />
        <Nav
          links={[
            {
              title: "Dashboard",
              href: "",
              icon: LayoutDashboard,
              variant: url === "" ? "default" : "ghost",
            },
            {
              title: "Cases",
              label: cases.toString(),
              href: "cases",
              icon: Bug,
              variant: url === "cases" ? "default" : "ghost",
            },
            {
              title: "Knowledge Articles",
              label: articles.toString(),
              href: "knowledgearticles",
              icon: Newspaper,
              variant: url === "knowledgearticles" ? "default" : "ghost",
            },
            {
              title: "Assets",
              label: assets.toString(),
              href: "assets",
              icon: Package2,
              variant: url === "assets" ? "default" : "ghost",
              visibility:
                currentUser.role === "TECHNICIAN" ||
                  currentUser.role === "ADMIN" ||
                  currentUser.role === "SUPER_ADMIN" ||
                  currentUser.role === "DEVELOPER" ? "flex" : "hidden"
            },
            {
              title: "Maintenance",
              label: logs.toString(),
              href: "maintenance",
              icon: Construction,
              variant: url === "maintenance" ? "default" : "ghost",
              visibility:
                currentUser.role === "TECHNICIAN" ||
                  currentUser.role === "ADMIN" ||
                  currentUser.role === "SUPER_ADMIN" ||
                  currentUser.role === "DEVELOPER" ? "flex" : "hidden"
            },
            {
              title: "Announcements",
              label: announcements.toString(),
              href: "announcements",
              icon: Megaphone,
              variant: url === "announcements" ? "default" : "ghost",
            },
            {
              title: "Documents",
              label: documents.toString(),
              href: "documents",
              icon: BookOpen,
              variant: url === "documents" ? "default" : "ghost",
            },
            {
              title: "Events",
              label: events.toString(),
              href: "events",
              icon: CalendarDays,
              variant: url === "events" ? "default" : "ghost",
            },
            {
              title: "News",
              label: news.toString(),
              href: "news",
              icon: Mails,
              variant: url === "news" ? "default" : "ghost",
            },
          ]}
        />
      </div>
      <div>
        <Separator />
        <Nav
          links={[
            {
              title: "Users",
              label: users.toString(),
              href: "users",
              icon: Users2,
              variant: url === "users" ? "default" : "ghost",
              visibility:
                currentUser.role === "TECHNICIAN" ||
                  currentUser.role === "ADMIN" ||
                  currentUser.role === "SUPER_ADMIN" ||
                  currentUser.role === "DEVELOPER" ? "flex" : "hidden"
            },
            {
              title: "Trash",
              href: "trash",
              icon: TrashIcon,
              variant: url === "trash" ? "default" : "ghost",
            },
            {
              title: "Settings",
              href: "settings",
              icon: Settings,
              variant: url === "settings" ? "default" : "ghost",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Navbar;
