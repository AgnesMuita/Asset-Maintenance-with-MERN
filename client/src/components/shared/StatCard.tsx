import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bug, CalendarDaysIcon, Construction, Mails, Newspaper, Package2 } from "lucide-react";

const StatCard: React.FunctionComponent = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const cases = JSON.parse(localStorage.getItem("cases") || "{}");
  const articles = JSON.parse(localStorage.getItem("articles") || "{}");
  const assets = JSON.parse(localStorage.getItem("assets") || "{}");
  const events = JSON.parse(localStorage.getItem("events") || "{}");
  const news = JSON.parse(localStorage.getItem("news") || "{}");
  const logs = JSON.parse(localStorage.getItem("logs") || "{}");

  const statContent = [
    {
      title: "Total Cases",
      icon: Bug,
      value: cases,
      percentage: "+20.1",
      visibility:
        currentUser.role === "TECHNICIAN" ||
          currentUser.role === "ADMIN" ||
          currentUser.role === "SUPER_ADMIN" ||
          currentUser.role === "DEVELOPER" ? "flex" : "hidden"
    },
    {
      title: "Total Articles",
      icon: Newspaper,
      value: articles,
      percentage: "-7.34",
      visibility:
        currentUser.role === "TECHNICIAN" ||
          currentUser.role === "ADMIN" ||
          currentUser.role === "SUPER_ADMIN" ||
          currentUser.role === "DEVELOPER" ? "flex" : "hidden"
    },
    {
      title: "Total Assets",
      icon: Package2,
      value: assets,
      percentage: "+0.002",
      visibility:
        currentUser.role === "TECHNICIAN" ||
          currentUser.role === "ADMIN" ||
          currentUser.role === "SUPER_ADMIN" ||
          currentUser.role === "DEVELOPER" ? "flex" : "hidden"
    },
    {
      title: "Total Maintenance Logs",
      icon: Construction,
      value: logs,
      percentage: "+89.20",
      visibility:
        currentUser.role === "TECHNICIAN" ||
          currentUser.role === "ADMIN" ||
          currentUser.role === "SUPER_ADMIN" ||
          currentUser.role === "DEVELOPER" ? "flex" : "hidden"
    },
    {
      title: "Total News",
      icon: CalendarDaysIcon,
      value: news,
      percentage: "+89.20",
      visibility:
        currentUser.role === "TECHNICIAN" ||
          currentUser.role === "ADMIN" ||
          currentUser.role === "SUPER_ADMIN" ||
          currentUser.role === "DEVELOPER" ? "hidden" : "flex"
    },
    {
      title: "Total Events",
      icon: Mails,
      value: events,
      percentage: "+89.20",
      visibility:
        currentUser.role === "TECHNICIAN" ||
          currentUser.role === "ADMIN" ||
          currentUser.role === "SUPER_ADMIN" ||
          currentUser.role === "DEVELOPER" ? "hidden" : "flex"
    },
  ];

  return (
    <>
      {statContent.map((stat, idx) => (
        <Card key={idx} className={stat.visibility === "flex" ? "block" : "hidden"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="ml-2 h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.percentage}% from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default StatCard;
