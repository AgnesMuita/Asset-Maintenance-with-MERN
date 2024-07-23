import { useAuthStore } from "@/stores/auth.store";
import { SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";

import React from "react";
import { client } from "@/services/axiosClient";
import { Separator } from "./ui/separator";
import { format } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "./ui/use-toast";
import MaintenanceCard from "./MaintenanceCard";

const MaintenanceDetails = (props: { id: string }) => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [log, setLog] = React.useState<IMaintenanceLogProps>();

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchLog = async () => {
				try {
					const res = await client.get(
						`http://localhost:8800/api/v1/maintenance/${props.id}`
					);
					setLog(res.data);
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
			fetchLog();
		}
	}, [isLoggedIn, props.id]);

	return (
		<>
			{log && (
				<>
					<SheetHeader>
						<SheetTitle className="capitalize">
							{log.title}
						</SheetTitle>
						<SheetDescription className="space-y-1">
							<div className="flex items-center gap-x-4">
								<p>{format(log.createdAt, "dd/MM/yyyy p")}</p>
								<p>{log.asset?.name ?? "No Related Asset"}</p>
							</div>
							<p>
								Maintenance Performed By:{" "}
								{log.performedBy?.fullName}
							</p>
						</SheetDescription>
					</SheetHeader>
					<Separator className="my-4" />
					<ScrollArea className="h-[calc(100vh-9rem)] px-4">
						<div className=" space-y-4">
							<MaintenanceCard log={log} />
						</div>
					</ScrollArea>
				</>
			)}
		</>
	);
};

export default MaintenanceDetails;
